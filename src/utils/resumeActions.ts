import type { ResumeData } from '../types';
import type { Finding } from './resumeAudit';
import type { ParseFieldReport } from './resumeParser';

export const EDITOR_SECTIONS = [
  { id: 'contact', label: 'Contact & links', hint: 'Your name, title and how to reach you.' },
  { id: 'summary', label: 'Summary', hint: 'An optional introduction, in your own words.' },
  { id: 'experience', label: 'Experience', hint: 'What you did, where, when and with what result.' },
  { id: 'education', label: 'Education', hint: 'Qualifications and institutions, including SSC / HSC if relevant.' },
  { id: 'skills', label: 'Skills', hint: 'Name only skills you can demonstrate.' },
  { id: 'projects', label: 'Projects', hint: 'Relevant work, portfolios and links.' },
  { id: 'certifications', label: 'Certifications', hint: 'Licences, certificates and training you actually hold.' },
  { id: 'extras', label: 'Additional sections', hint: 'Languages, developer profiles and other relevant information.' },
  { id: 'design', label: 'Layout & region', hint: 'Document type, font, colour and optional photo.' },
  { id: 'source', label: 'Original text', hint: 'Compare the imported text with the fields. Nothing here is an employer parser simulation.' },
  { id: 'export', label: 'Download', hint: 'Export your revised document, then check the exported file.' },
] as const;

export type EditorSection = (typeof EDITOR_SECTIONS)[number]['id'];

export interface EditorTarget {
  section: EditorSection;
  findingId?: string;
  field?: string;
}

const RULE_SECTIONS: Record<string, EditorSection> = {
  'FMT-01': 'design', 'FMT-02': 'contact', 'FMT-03': 'source',
  'FMT-04': 'experience', 'FMT-05': 'export', 'FMT-06': 'experience',
  'FMT-07': 'experience', 'FMT-08': 'contact', 'FMT-09': 'contact', 'FMT-10': 'contact',
  'CNT-01': 'experience', 'CNT-02': 'experience', 'CNT-03': 'experience',
  'CNT-04': 'summary', 'CNT-05': 'experience', 'CNT-06': 'experience',
  'CNT-07': 'summary', 'CNT-08': 'skills',
};

export function isEditorSection(value: string | null): value is EditorSection {
  return EDITOR_SECTIONS.some((section) => section.id === value);
}

export function findingTarget(finding: Finding): EditorTarget {
  let section = RULE_SECTIONS[finding.id] ?? 'source';
  if (finding.id === 'FMT-07') {
    if (!finding.evidence.includes('Missing: Experience') && finding.evidence.includes('Missing: Education')) section = 'education';
    if (finding.evidence.includes('Missing: Skills')) section = 'skills';
  }
  return {
    section,
    findingId: finding.id,
    field: finding.id === 'FMT-08' ? 'email' : finding.id === 'FMT-09' ? 'phone' : finding.id === 'FMT-10' ? 'location' : undefined,
  };
}

export function parseFieldTarget(key: ParseFieldReport['key']): EditorTarget {
  const fields: Partial<Record<ParseFieldReport['key'], string>> = { name: 'fullName', title: 'targetTitle', email: 'email', phone: 'phone', location: 'location', linkedin: 'linkedin' };
  if (fields[key]) return { section: 'contact', field: fields[key] };
  return { section: key as EditorSection };
}

/** Only rule/section identifiers go in the URL, never resume text or contact details. */
export function editorSearch(target?: EditorTarget): string {
  if (!target) return '';
  const params = new URLSearchParams({ section: target.section });
  if (target.findingId) params.set('finding', target.findingId);
  if (target.field) params.set('field', target.field);
  return `?${params.toString()}`;
}

export function firstBulletForFinding(resume: ResumeData, findingId?: string): string | undefined {
  const bullets = resume.experience.flatMap((role) => role.bullets.map((text, index) => ({ text, id: `bullet-${role.id}-${index}` })));
  const match = bullets.find(({ text }) => {
    if (findingId === 'CNT-03') return /^(responsible for|duties included|helped (with|to)|assisted (in|with)|worked (on|with)|tasked with|participated in|involved in|in charge of)\b/i.test(text);
    if (findingId === 'CNT-05') return text.trim().split(/\s+/).length > 32;
    if (findingId === 'CNT-02') return !/\d/.test(text);
    if (findingId === 'CNT-04') return /\b(I|me|my)\b/i.test(text);
    return false;
  });
  return match?.id;
}

export interface GuidedBulletFacts { action: string; scope: string; method: string; result: string }

/** A wording scaffold, not AI. Every fragment must be supplied by the user. */
export function makeGuidedBullet(facts: GuidedBulletFacts): string {
  const action = facts.action.trim().replace(/[.;]+$/, '');
  if (!action) return '';
  const scope = facts.scope.trim().replace(/[.;]+$/, '');
  const method = facts.method.trim().replace(/[.;]+$/, '');
  const result = facts.result.trim().replace(/[.;]+$/, '');
  return `${action}${scope ? ` (${scope})` : ''}${method ? ` by ${method}` : ''}${result ? `; ${result}` : ''}.`;
}
