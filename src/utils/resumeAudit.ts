/**
 * Resume audit
 *
 * What this does: reads the text a parser would receive and reports what is
 * actually in the document — counts, quoted examples, and structural facts
 * from the uploaded file.
 *
 * What this deliberately does not do:
 *   - no score out of 100, because no published scale exists to anchor it to
 *   - no "rejection risk", because rejection is a recruiter/ATS decision that
 *     depends on the employer's screening questions, not on the resume text
 *   - no percentile or "top 5%" claims, because we have no sample to compare to
 *
 * Every finding carries the evidence that produced it, so a user can check the
 * claim against their own file instead of trusting a number.
 */

import type { DocumentStructure } from './fileExtractor';
import { EVIDENCE, type EvidenceGrade } from '../data/evidence';
import { parseResumeText, pickPhone } from './resumeParser';

export type Severity = 'fix' | 'check' | 'pass';

export interface Finding {
  /** Stable rule id, so a user can cite it and we can test it. */
  id: string;
  title: string;
  severity: Severity;
  /** The fact in this document that triggered the rule. */
  evidence: string;
  /** What to do about it. */
  fix: string;
  /** Why the rule exists, in one sentence. */
  why?: string;
  /** Evidence register id, when the rule rests on an external source. */
  sourceId?: string;
}

export interface KeywordTerm {
  term: string;
  inResume: boolean;
  /** How many times the term appears in the resume text. */
  hits: number;
}

export interface KeywordReport {
  hasJobDescription: boolean;
  terms: KeywordTerm[];
  covered: number;
  total: number;
  /** How the numbers were produced, in plain language. */
  method: string;
}

export interface ResumeFacts {
  words: number;
  lines: number;
  bullets: number;
  bulletsWithNumbers: number;
  passiveOpeners: number;
  firstPerson: number;
  longBullets: number;
  repeatedOpeners: number;
  estimatedPages: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedin: boolean;
  hasCity: boolean;
  sectionsFound: string[];
  sectionsMissing: string[];
  quantifiedExamples: string[];
  passiveExamples: string[];
  longBulletExamples: string[];
}

export interface AuditReport {
  facts: ResumeFacts;
  format: Finding[];
  content: Finding[];
  keywords: KeywordReport;
  structure?: DocumentStructure;
}

export interface AuditInput {
  text: string;
  jobDescription?: string;
  /** Present when the user uploaded a file; absent for pasted text. */
  structure?: DocumentStructure;
  fileName?: string;
  fileSize?: number;
}

const PASSIVE_OPENERS = [
  'responsible for',
  'duties included',
  'helped with',
  'helped to',
  'assisted in',
  'assisted with',
  'worked on',
  'worked with',
  'tasked with',
  'participated in',
  'involved in',
  'in charge of',
];

const SECTION_PATTERNS: Array<{ label: string; re: RegExp; required: boolean }> = [
  { label: 'Contact block', re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, required: false },
  { label: 'Summary or profile', re: /^(professional\s+|career\s+)?(summary|profile|objective|about(?: me)?)\s*:?\s*$/im, required: false },
  { label: 'Experience', re: /^(?:(work|professional|employment|career|relevant)?\s*(experience|history)|employment|internships?)\s*:?\s*$/im, required: true },
  { label: 'Education', re: /^(education|academic (background|qualifications)|academics|qualifications)\s*:?\s*$/im, required: true },
  { label: 'Skills', re: /^(technical\s+|professional\s+|technical & professional\s+)?(skills|skills & tools|competencies|core competencies|expertise|technologies)\s*:?\s*$/im, required: true },
];

const STOPWORDS = new Set([
  'about', 'above', 'across', 'after', 'again', 'against', 'all', 'also', 'among', 'and', 'any',
  'are', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'can', 'could', 'did',
  'does', 'doing', 'during', 'each', 'either', 'else', 'every', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'here', 'how', 'into', 'its', 'itself', 'just', 'more', 'most', 'must',
  'not', 'now', 'off', 'once', 'only', 'other', 'our', 'ours', 'out', 'over', 'own', 'same',
  'she', 'should', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'under', 'until', 'very', 'was', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you',
  'your', 'yours', 'role', 'team', 'work', 'working', 'job', 'company', 'position', 'candidate',
  'apply', 'applicants', 'ability', 'able', 'including', 'include', 'includes', 'years', 'year',
  'experience', 'experienced', 'required', 'require', 'requirements', 'responsibilities',
  'qualifications', 'preferred', 'plus', 'etc', 'within', 'using', 'use', 'used', 'new',
]);

const EVIDENCE_BY_ID = new Map(EVIDENCE.map((e) => [e.id, e]));

export function evidenceGrade(sourceId: string): EvidenceGrade | undefined {
  return EVIDENCE_BY_ID.get(sourceId)?.grade;
}

export function evidenceNote(sourceId: string): string | undefined {
  const item = EVIDENCE_BY_ID.get(sourceId);
  if (!item) return undefined;
  return `Evidence ${item.grade} — ${item.publicWording}`;
}

/* -------------------------------------------------------------------------- */
/* Text measurement                                                            */
/* -------------------------------------------------------------------------- */

function normalise(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ').trim();
}

function splitLines(text: string): string[] {
  return normalise(text)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function isBulletLine(line: string): boolean {
  return /^([•▪◦‣·*\-–—]|\d+[.)])\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^([•▪◦‣·*\-–—]|\d+[.)])\s+/, '').trim();
}

export function bulletHasNumber(line: string): boolean {
  return /\d|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|fifty|hundred|thousand)\b[\s-]*(?:people|clients|customers|users|staff|projects|hours|days|weeks|months|years|accounts|invoices|suppliers|teams)/i.test(line);
}

export function hasDutyOpener(line: string): boolean {
  return PASSIVE_OPENERS.some((opener) => line.trim().toLowerCase().startsWith(opener));
}

function wordsOf(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function estimatePages(words: number): number {
  // A dense one-page resume holds roughly 450–500 words. This is an estimate
  // from word count, not a rendered page count, and the UI says so.
  return Math.max(1, Math.ceil(words / 450));
}

/* -------------------------------------------------------------------------- */
/* Keyword extraction                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Pull candidate terms from a job description.
 *
 * Method: lower-case the text, strip punctuation, drop a fixed stopword list
 * and every token shorter than three characters, then take the terms that
 * appear most often. No phrases, synonyms or semantic skill inference are used.
 *
 * This is deliberately simple and deliberately disclosed. It is a word match,
 * not a judgement about whether the candidate has the skill.
 */
export function extractJobTerms(jobDescription: string, limit = 20): string[] {
  const cleaned = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned.split(' ').filter((t) => t.length >= 3 && !STOPWORDS.has(t));
  const counts = new Map<string, number>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].replace(/^[.-]+|[.-]+$/g, '');
    if (token.length < 3) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }

  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term);

  return ranked;
}

export function buildKeywordReport(text: string, jobDescription?: string): KeywordReport {
  const jd = (jobDescription ?? '').trim();

  if (jd.length < 30) {
    return {
      hasJobDescription: false,
      terms: [],
      covered: 0,
      total: 0,
      method:
        'No job description supplied, so there is nothing to compare against. Paste the posting to see which of its frequent terms appear in your resume.',
    };
  }

  const lower = normalise(text).toLowerCase();
  const terms = extractJobTerms(jd).map((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const hits = (lower.match(new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, 'giu')) ?? []).length;
    return { term, inResume: hits > 0, hits };
  });

  return {
    hasJobDescription: true,
    terms,
    covered: terms.filter((t) => t.inResume).length,
    total: terms.length,
    method: `We took the ${terms.length} most frequent terms of three or more characters from the job description, dropped a fixed stopword list, and searched your resume text for each one. A match means the word appears, not that you have the skill. Repeating a term more often does not improve this number.`,
  };
}

/* -------------------------------------------------------------------------- */
/* Rules                                                                       */
/* -------------------------------------------------------------------------- */

export function auditResume(input: AuditInput): AuditReport {
  const text = normalise(input.text);
  const lines = splitLines(text);
  const parsed = parseResumeText(text).resume;

  const bulletLines = lines.filter(isBulletLine);
  const bulletTexts = bulletLines.map(stripBullet);
  const bulletsWithNumbers = bulletTexts.filter(bulletHasNumber);
  const passiveExamples = bulletTexts.filter(hasDutyOpener);
  const longBulletExamples = bulletTexts.filter((b) => wordsOf(b) > 32);
  const firstPersonCount = (text.match(/\b(I|my|me)\b/gi) ?? []).length;
  const estimatedPages = estimatePages(wordsOf(text));

  // Repeated opening verb: "Led the...", "Led a...", "Led migration..."
  const openers = bulletTexts
    .map((b) => b.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, ''))
    .filter((w) => w && w.length > 2);
  const openerCounts = new Map<string, number>();
  openers.forEach((w) => openerCounts.set(w, (openerCounts.get(w) ?? 0) + 1));
  const repeatedOpeners = [...openerCounts.values()].filter((n) => n > 1).length;

  const sectionsFound: string[] = [];
  const sectionsMissing: string[] = [];
  for (const section of SECTION_PATTERNS) {
    if (section.re.test(text)) sectionsFound.push(section.label);
    else if (section.required) sectionsMissing.push(section.label);
  }

  const facts: ResumeFacts = {
    words: wordsOf(text),
    lines: lines.length,
    bullets: bulletTexts.length,
    bulletsWithNumbers: bulletsWithNumbers.length,
    passiveOpeners: passiveExamples.length,
    firstPerson: firstPersonCount,
    longBullets: longBulletExamples.length,
    repeatedOpeners,
    estimatedPages,
    hasEmail: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text),
    hasPhone: Boolean(pickPhone(lines)),
    hasLinkedin: /linkedin\.com\/in\//i.test(text),
    hasCity: Boolean(parsed.location),
    sectionsFound,
    sectionsMissing,
    quantifiedExamples: bulletsWithNumbers.slice(0, 3),
    passiveExamples: passiveExamples.slice(0, 3),
    longBulletExamples: longBulletExamples.slice(0, 2),
  };

  const format: Finding[] = [];
  const content: Finding[] = [];
  const structure = input.structure;

  /* --- File-level format ------------------------------------------------- */

  if (structure) {
    if (structure.tables > 0) {
      format.push({
        id: 'FMT-01',
        title: `${structure.tables} table${structure.tables === 1 ? '' : 's'} in the document`,
        severity: 'check',
        evidence: `The .docx package contains ${structure.tables} table${structure.tables === 1 ? '' : 's'}.`,
        fix: 'Rebuild the layout as plain paragraphs. If the table is only aligning dates to the right, use a tab stop instead.',
        why: 'Tables are read cell by cell, so a two-column table can interleave your job title with the dates and the employer name.',
        sourceId: 'EV-COLUMNS',
      });
    }

    if (structure.headers > 0 || structure.footers > 0) {
      format.push({
        id: 'FMT-02',
        title: 'Header or footer parts present',
        severity: 'check',
        evidence: `${structure.headers} header part(s) and ${structure.footers} footer part(s) found in the file.`,
        fix: 'Check whether any essential details are in those parts. Move your name, contact details and experience into the body. Page numbers alone are not a career-data problem.',
        why: 'Part presence does not prove that a field was lost. Header/footer text sits outside the main body, so its handling varies by parser.',
        sourceId: 'EV-OUTSIDE-DOC',
      });
    }

    if (structure.textBoxes > 0) {
      format.push({
        id: 'FMT-03',
        title: `${structure.textBoxes} floating text box${structure.textBoxes === 1 ? '' : 'es'}`,
        severity: 'fix',
        evidence: `The document contains ${structure.textBoxes} text box${structure.textBoxes === 1 ? '' : 'es'}.`,
        fix: 'Delete the boxes and put the text in the normal flow of the page.',
        why: 'Text boxes are positioned objects; their reading order is decided by coordinates, not by the order you see.',
        sourceId: 'EV-COLUMNS',
      });
    }

    if (structure.noTextLayer === false && structure.pages && structure.pages > 3) {
      format.push({
        id: 'FMT-04',
        title: `${structure.pages} pages`,
        severity: 'check',
        evidence: `The PDF has ${structure.pages} pages.`,
        fix: 'Review relevance and the employer’s instructions. Two or three pages can be appropriate; page count alone is not an ATS failure.',
        why: 'This is a length review prompt, not a universal page limit.',
        sourceId: 'EV-SECONDS',
      });
    }

    if (input.fileSize && input.fileSize > 2.5 * 1024 * 1024) {
      format.push({
        id: 'FMT-05',
        title: 'File may exceed a portal limit',
        severity: 'check',
        evidence: `The file is ${(input.fileSize / 1024 / 1024).toFixed(1)} MB.`,
        fix: 'Export again without embedded images, or compress the PDF, and keep it under 2.5 MB.',
        why: 'Greenhouse documents a 2.5 MB parsing limit, so a heavy file can upload and still parse as empty.',
        sourceId: 'EV-25MB',
      });
    }
  }

  if (facts.words < 120) {
    format.push({
      id: 'FMT-06',
      title: 'Short document: review what was extracted',
      severity: 'check',
      evidence: `${facts.words} words read.`,
      fix: 'Check for text our reader missed before adding anything. If the document is intentionally short, this prompt may not apply. Otherwise add the relevant roles, dates and evidence.',
      why: '120 words is our review threshold, not an employer cutoff.',
    });
  }

  if (sectionsMissing.length > 0) {
    format.push({
      id: 'FMT-07',
      title: `No recognisable ${sectionsMissing.join(' or ')} heading`,
      severity: 'fix',
      evidence: `Found headings: ${sectionsFound.join(', ') || 'none'}. Missing: ${sectionsMissing.join(', ')}.`,
      fix: 'Check the original text. If the section is present under another label, move it to the matching field in the editor. Standard headings are supplied on export.',
      why: 'Our heading matcher uses a published-in-code vocabulary. Other parsers can recognise different labels.',
    });
  } else {
    format.push({
      id: 'FMT-07',
      title: 'Standard headings found',
      severity: 'pass',
      evidence: sectionsFound.join(', '),
      fix: 'Keep the headings exactly as they are when you export.',
    });
  }

  if (!facts.hasEmail) {
    format.push({
      id: 'FMT-08',
      title: 'No email address',
      severity: 'fix',
      evidence: 'No address matching name@domain.tld was found anywhere in the text.',
      fix: 'Put your email in the contact block at the top of page one, in the body — not in the header.',
    });
  } else if (!facts.hasPhone) {
    format.push({
      id: 'FMT-09',
      title: 'No phone number',
      severity: 'check',
      evidence: 'No phone number pattern was found.',
      fix: 'Add a number with its country code, for example +880 or +971.',
    });
  } else {
    format.push({
      id: 'FMT-08',
      title: 'Contact block readable',
      severity: 'pass',
      evidence: `Email${facts.hasPhone ? ', phone' : ''}${facts.hasCity ? ', city' : ''} found in the text.`,
      fix: 'Leave the contact block in the body of page one.',
    });
  }

  if (!facts.hasCity) {
    format.push({
      id: 'FMT-10',
      title: 'No city or country',
      severity: 'check',
      evidence: 'Our contact reader did not identify a "City, Country" segment.',
      fix: 'Add "Dhaka, Bangladesh" or your current city on the contact line.',
      why: 'Review the employer’s location and work-authorisation requirements. This prompt does not establish rejection risk.',
    });
  }

  /* --- Content ----------------------------------------------------------- */

  if (facts.bullets === 0) {
    content.push({
      id: 'CNT-01',
      title: 'No bullet points',
      severity: 'fix',
      evidence: `${facts.lines} lines of text, none of them bullets.`,
      fix: 'Turn each responsibility into a separate bullet, one achievement per line.',
      why: 'Dense paragraphs hide the result a recruiter is scanning for.',
    });
  } else if (facts.bulletsWithNumbers === 0) {
    content.push({
      id: 'CNT-02',
      title: 'No numbers found in the bullets',
      severity: 'check',
      evidence: `${facts.bullets} bullet${facts.bullets === 1 ? '' : 's'}, none containing a number, percentage, amount or scale.`,
      fix: 'If you know a relevant volume, time, budget or team size, add it to explain the scope. A specific qualitative result is also valid. Never invent a number to clear this prompt.',
      why: 'This rule detects digits and some spelled-out quantities. It does not verify an outcome or require every bullet to contain a metric.',
    });
  } else {
    content.push({
      id: 'CNT-02',
      title: 'Some bullets carry a number',
      severity: 'pass',
      evidence: `${facts.bulletsWithNumbers} of ${facts.bullets} bullets contain a number or scale. Example: "${facts.quantifiedExamples[0] ?? ''}"`,
      fix: 'Verify that the numbers are accurate and relevant. A date, software version or unrelated number can also match this rule.',
    });
  }

  if (facts.passiveOpeners > 0) {
    content.push({
      id: 'CNT-03',
      title: 'Duty-style opening phrases',
      severity: 'check',
      evidence: `${facts.passiveOpeners} bullet${facts.passiveOpeners === 1 ? '' : 's'} use phrasing such as "responsible for". Examples: ${facts.passiveExamples.map((p) => `"${p.slice(0, 90)}"`).join('; ')}`,
      fix: 'Name your own contribution. For example, "Responsible for monthly closing" can become "Prepared the monthly accounts". Add scope or a result only if you know it.',
      why: 'This is a writing prompt, not a grammatical verdict. Supporting or assisting work can still be genuine experience.',
    });
  } else if (facts.bullets > 0) {
    content.push({
      id: 'CNT-03',
      title: 'No passive duty phrasing',
      severity: 'pass',
      evidence: 'No "responsible for", "helped with" or "worked on" openers were found.',
      fix: 'Keep verbs specific: closed, rebuilt, negotiated, reduced.',
    });
  }

  if (facts.firstPerson > 0) {
    content.push({
      id: 'CNT-04',
      title: 'First-person pronouns',
      severity: 'check',
      evidence: `${facts.firstPerson} use${facts.firstPerson === 1 ? '' : 's'} of I, me or my.`,
      fix: 'Drop the pronoun and start with the verb. "I led the migration" becomes "Led the migration".',
      why: 'Resumes are written in implied first person; the pronoun only takes up space.',
    });
  }

  if (facts.longBullets > 0) {
    content.push({
      id: 'CNT-05',
      title: 'Bullets over our 32-word review threshold',
      severity: 'check',
      evidence: `${facts.longBullets} bullet${facts.longBullets === 1 ? '' : 's'} over 32 words. Example: "${facts.longBulletExamples[0]?.slice(0, 110) ?? ''}…"`,
      fix: 'Split each long bullet into the outcome and the method, or cut the method.',
      why: '32 words is a product heuristic, not a published ATS or recruiter cutoff. Keep longer text if it is necessary and clear.',
    });
  }

  if (facts.repeatedOpeners > 0) {
    content.push({
      id: 'CNT-06',
      title: 'Repeated opening words',
      severity: 'check',
      evidence: `${facts.repeatedOpeners} verb${facts.repeatedOpeners === 1 ? '' : 's'} start more than one bullet.`,
      fix: 'Vary the verb, but only where it is accurate. "Led", "rebuilt" and "cut" describe different acts; do not swap a true verb for a synonym.',
      why: 'Repetition can make bullets harder to distinguish. It is not automatically a defect.',
    });
  }

  const summaryBlock = parsed.summary;
  if (summaryBlock) {
    const summaryWords = wordsOf(summaryBlock);
    content.push({
      id: 'CNT-07',
      title: 'Summary length',
      severity: summaryWords > 90 ? 'check' : 'pass',
      evidence: `${summaryWords} words under the summary heading.`,
      fix:
        summaryWords > 90
          ? 'Cut to two or three sentences: what you are, the scale you have worked at, and the role you want.'
          : 'No length warning under our 90-word threshold. Review accuracy and relevance; the count does not establish quality.',
    });
  }

  const keywordReport = buildKeywordReport(text, input.jobDescription);

  if (keywordReport.hasJobDescription) {
    const missing = keywordReport.terms.filter((t) => !t.inResume).map((t) => t.term);
    if (missing.length > 0) {
      content.push({
        id: 'CNT-08',
        title: 'Job description terms absent from your resume',
        severity: 'check',
        evidence: `${missing.length} of ${keywordReport.total} terms not found: ${missing.slice(0, 8).join(', ')}.`,
        fix: 'Check each one honestly. If you have the skill, name it in the same words the posting uses. If you do not, leave it out and apply anyway.',
        why: 'A recruiter searching their database looks for the words in the posting. This is a word match, not a fit score.',
      });
    }
  }

  return { facts, format, content, keywords: keywordReport, structure };
}

/* -------------------------------------------------------------------------- */
/* Backwards compatibility                                                     */
/* -------------------------------------------------------------------------- */

/** Counts only, for callers that want a one-line summary. */
export function auditSummary(report: AuditReport) {
  const all = [...report.format, ...report.content];
  return {
    toFix: all.filter((f) => f.severity === 'fix').length,
    toCheck: all.filter((f) => f.severity === 'check').length,
    passed: all.filter((f) => f.severity === 'pass').length,
  };
}

/** Words that are lower-cased in the audit but read better with capitals. */
export const severityLabel: Record<Severity, string> = {
  fix: 'Fix',
  check: 'Check',
  pass: 'Fine',
};
