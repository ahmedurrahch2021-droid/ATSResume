/**
 * Client-Side File Extraction
 *
 * Reads the text a real parser would see, without sending the file anywhere.
 *
 * PDF: text layer via pdf.js. A scanned PDF has no text layer, so we say so
 * rather than scanning glyph noise and reporting invented findings.
 * DOCX: mammoth for the text, JSZip for the structure a parser cares about
 * (tables, headers, footers, text boxes, images).
 *
 * Nothing here invents content: if a field is not in the file, it comes back
 * empty and the caller reports it as missing.
 */

export interface BioDataCheckResult {
  hasBioDataClutter: boolean;
  detectedFields: {
    field: string;
    foundText: string;
    recommendation: string;
  }[];
}

/**
 * Flag personal fields for a context-dependent review; this is not an ATS rejection rule.
 */
export function checkBioDataClutter(text: string): BioDataCheckResult {
  const detected: BioDataCheckResult['detectedFields'] = [];

  const patterns = [
    {
      regex: /(father(?:'s)?\s*name[:\-\s]+[^\n\r,]+)/i,
      field: "Father's Name",
      recommendation:
        'Usually unnecessary in a corporate resume. Keep only if the specific application instructions request it.',
    },
    {
      regex: /(mother(?:'s)?\s*name[:\-\s]+[^\n\r,]+)/i,
      field: "Mother's Name",
      recommendation: 'Review whether the application explicitly requires parental details.',
    },
    {
      regex: /(blood\s*group[:\-\s]+[A-Za-z0-9\+\-]+)/i,
      field: 'Blood Group',
      recommendation:
        'Remove entirely. Medical data belongs in medical records, not professional job applications.',
    },
    {
      regex: /(religion[:\-\s]+[^\n\r,]+)/i,
      field: 'Religion',
      recommendation:
        'Remove entirely. Religious affiliations are unrelated to professional competence and invite bias.',
    },
    {
      regex: /(marital\s*status[:\-\s]+[^\n\r,]+)/i,
      field: 'Marital Status',
      recommendation:
        'Remove. Marital status is considered private and irrelevant to professional competence.',
    },
    {
      regex: /(permanent\s*address[:\-\s]+[^\n\r]+)/i,
      field: 'Permanent Address',
      recommendation:
        "Consolidate into simple 'City, Country' (e.g., 'Dhaka, Bangladesh'). Exact home addresses pose privacy risks.",
    },
    {
      regex: /((?:national\s*id|nid)(?:\s*no)?[:\-\s]+[0-9\-]+)/i,
      field: 'National ID / NID',
      recommendation: 'Remove. Never share government identification numbers on unencrypted resumes.',
    },
  ];

  for (const p of patterns) {
    const match = text.match(p.regex);
    if (match) {
      detected.push({
        field: p.field,
        foundText: match[1].trim(),
        recommendation: p.recommendation,
      });
    }
  }

  return {
    hasBioDataClutter: detected.length > 0,
    detectedFields: detected,
  };
}

/**
 * Clean bio-data clutter from raw text
 */
export function purgeBioDataClutter(text: string): string {
  let cleaned = text;
  const purgeRegexes = [
    /father(?:'s)?\s*name[:\-\s]+[^\n\r,]+/gi,
    /mother(?:'s)?\s*name[:\-\s]+[^\n\r,]+/gi,
    /blood\s*group[:\-\s]+[A-Za-z0-9\+\-]+/gi,
    /religion[:\-\s]+[^\n\r,]+/gi,
    /marital\s*status[:\-\s]+[^\n\r,]+/gi,
    /(?:national\s*id|nid)(?:\s*no)?[:\-\s]+[0-9\-]+/gi,
  ];

  for (const r of purgeRegexes) {
    cleaned = cleaned.replace(r, '');
  }

  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  return cleaned;
}

export type DocumentKind = 'pdf' | 'docx' | 'text';

export interface DocumentStructure {
  /** Number of tables a parser will see. */
  tables: number;
  /** Header parts present in the DOCX package. */
  headers: number;
  /** Footer parts present in the DOCX package. */
  footers: number;
  /** Text boxes: floating text a parser may read out of order. */
  textBoxes: number;
  /** Embedded images. */
  images: number;
  /** PDF page count. */
  pages?: number;
  /** True when a PDF has no usable text layer (scanned or image-only). */
  noTextLayer: boolean;
  /** DOCX header/footer text, kept separately from the main body for review. */
  outsideText?: string;
  /** False if DOCX structure probing failed; zero counts must not imply verification. */
  inspected?: boolean;
}

export interface ExtractedDocument {
  text: string;
  fileName: string;
  size: number;
  kind: DocumentKind;
  structure: DocumentStructure;
  /** Non-fatal things the user should know about the extraction. */
  warnings: string[];
}

export type ExtractionErrorCode =
  | 'unsupported'
  | 'too-large'
  | 'no-text-layer'
  | 'empty'
  | 'failed';

export class ExtractionError extends Error {
  code: ExtractionErrorCode;

  constructor(code: ExtractionErrorCode, message: string) {
    super(message);
    this.name = 'ExtractionError';
    this.code = code;
  }
}

const MAX_BYTES = 10 * 1024 * 1024;

/** Documented parsing limit, not a universal upload/rejection threshold. */
const PORTAL_LIMIT_BYTES = 2.5 * 1024 * 1024;

export async function extractTextFromFile(file: File): Promise<ExtractedDocument> {
  if (file.size > MAX_BYTES) {
    throw new ExtractionError(
      'too-large',
      `That file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit here is 10 MB.`,
    );
  }

  const lower = file.name.toLowerCase();
  const warnings: string[] = [];

  if (file.size > PORTAL_LIMIT_BYTES) {
    warnings.push(
      `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB. Greenhouse documents a 2.5 MB parsing limit, so some portals may reject it.`,
    );
  }

  let result: ExtractedDocument;

  if (lower.endsWith('.pdf')) {
    result = await extractPdf(file);
  } else if (lower.endsWith('.docx')) {
    result = await extractDocx(file);
  } else if (lower.endsWith('.doc')) {
    throw new ExtractionError(
      'unsupported',
      'Legacy .doc files cannot be read in the browser. Save the file as .docx or PDF and try again.',
    );
  } else if (lower.endsWith('.txt') || lower.endsWith('.md') || file.type.startsWith('text/')) {
    result = await extractPlainText(file);
  } else {
    throw new ExtractionError(
      'unsupported',
      'That file type is not supported. Upload a PDF, DOCX or plain text file.',
    );
  }

  result.warnings = [...result.warnings, ...warnings];
  return result;
}

/* -------------------------------------------------------------------------- */
/* PDF                                                                         */
/* -------------------------------------------------------------------------- */

async function extractPdf(file: File): Promise<ExtractedDocument> {
  const buffer = await file.arrayBuffer();

  let pdfjs: typeof import('pdfjs-dist');
  try {
    pdfjs = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  } catch {
    throw new ExtractionError('failed', 'The PDF reader could not load. Reload the page and try again.');
  }

  let doc: Awaited<ReturnType<typeof pdfjs.getDocument>['promise']>;
  let loadingTask: ReturnType<typeof pdfjs.getDocument>;
  try {
    loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
    doc = await loadingTask.promise;
  } catch {
    throw new ExtractionError(
      'failed',
      'This PDF could not be opened. It may be password-protected or damaged.',
    );
  }

  const pageCount = doc.numPages;
  const pages: string[] = [];
  try {
    for (let i = 1; i <= pageCount; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(textItemsToLines(content.items));
    }
  } catch {
    throw new ExtractionError('failed', 'The PDF opened, but its text could not be read. Try a DOCX export or another text-based PDF.');
  } finally {
    await loadingTask.destroy();
  }

  const text = pages.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  const noTextLayer = text.replace(/\s/g, '').length < 40;

  if (noTextLayer) {
    throw new ExtractionError(
      'no-text-layer',
      'No usable text layer was read from this PDF. It may be scanned or image-only. This checker does not run OCR. Export a text-based PDF or DOCX from Word, Google Docs or your resume builder and try again.',
    );
  }

  return {
    text,
    fileName: file.name,
    size: file.size,
    kind: 'pdf',
    structure: {
      tables: 0,
      headers: 0,
      footers: 0,
      textBoxes: 0,
      images: 0,
      pages: pageCount,
      noTextLayer: false,
    },
    warnings: ['PDF text is reconstructed from positioned runs. This reader does not inspect PDF tables, headers or font size, and other parsers can produce a different reading order.'],
  };
}

/**
 * pdf.js returns positioned text runs, not lines. Group runs that share a
 * baseline so the parser sees the same reading order a human does.
 */
function textItemsToLines(items: Array<Record<string, unknown>>): string {
  type Run = { str: string; x: number; y: number; eol: boolean };
  const runs: Run[] = [];

  for (const item of items) {
    const str = typeof item.str === 'string' ? item.str : '';
    const transform = item.transform as number[] | undefined;
    if (!str || !transform) continue;
    runs.push({
      str,
      x: transform[4] ?? 0,
      y: transform[5] ?? 0,
      eol: Boolean(item.hasEOL),
    });
  }

  // Sort top-to-bottom, then left-to-right.
  runs.sort((a, b) => (Math.abs(a.y - b.y) > 2 ? b.y - a.y : a.x - b.x));

  const lines: string[] = [];
  let current: Run[] = [];

  const flush = () => {
    if (!current.length) return;
    lines.push(
      current
        .sort((a, b) => a.x - b.x)
        .map((r) => r.str)
        .join(' ')
        .replace(/\s{2,}/g, ' ')
        .trim(),
    );
    current = [];
  };

  for (const run of runs) {
    const line = current[0];
    if (line && Math.abs(run.y - line.y) > 2) flush();
    current.push(run);
    if (run.eol) flush();
  }
  flush();

  return lines.filter(Boolean).join('\n');
}

/* -------------------------------------------------------------------------- */
/* DOCX                                                                        */
/* -------------------------------------------------------------------------- */

async function extractDocx(file: File): Promise<ExtractedDocument> {
  const buffer = await file.arrayBuffer();

  let text: string;
  try {
    const mammoth = await import('mammoth/mammoth.browser.min.js');
    // RawText discards Word list numbering; HTML retains actual list items.
    const result = await (mammoth.default ?? mammoth).convertToHtml({ arrayBuffer: buffer });
    text = docxHtmlToText(String(result.value || ''));
  } catch {
    throw new ExtractionError(
      'failed',
      'This DOCX could not be opened. If it was created by an unusual tool, re-save it from Word or Google Docs.',
    );
  }

  const structure = await readDocxStructure(buffer);

  text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  if (!text) {
    throw new ExtractionError(
      'empty',
      'No text was found in this DOCX. It may contain only images of text.',
    );
  }

  return {
    text,
    fileName: file.name,
    size: file.size,
    kind: 'docx',
    structure,
    warnings: [
      ...(structure.outsideText ? ['Header/footer text is shown separately for review. The editable fields are initially read from the body.'] : []),
      ...(structure.inspected === false ? ['Text extraction succeeded, but file structure could not be inspected. Zero structure counts are not verification.'] : []),
    ],
  };
}

/** Parse in an inert document. Imported HTML is never inserted into the page. */
function docxHtmlToText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const lines: string[] = [];
  const textOf = (node: Element) => (node.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const visit = (element: Element) => {
    const tag = element.tagName.toLowerCase();
    if (tag === 'li') {
      const clone = element.cloneNode(true) as Element;
      clone.querySelectorAll('ul, ol').forEach((list) => list.remove());
      const text = textOf(clone);
      if (text) lines.push(`• ${text}`);
      Array.from(element.children).filter((child) => /^(UL|OL)$/.test(child.tagName)).forEach(visit);
    } else if (tag === 'tr') {
      const text = Array.from(element.children).map(textOf).filter(Boolean).join(' | ');
      if (text) lines.push(text);
    } else if (/^(p|h[1-6])$/.test(tag)) {
      const text = textOf(element);
      if (text) lines.push(text, '');
    } else Array.from(element.children).forEach(visit);
  };
  Array.from(document.body.children).forEach(visit);
  return lines.join('\n');
}

/**
 * A DOCX is a zip. Reading the package tells us what a parser has to cope
 * with: tables, headers, footers, floating text boxes and images.
 */
async function readDocxStructure(buffer: ArrayBuffer): Promise<DocumentStructure> {
  const structure: DocumentStructure = {
    tables: 0,
    headers: 0,
    footers: 0,
    textBoxes: 0,
    images: 0,
    noTextLayer: false,
    inspected: false,
  };

  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(buffer);

    const documentXml = await zip.file('word/document.xml')?.async('string');
    if (documentXml) {
      structure.tables = (documentXml.match(/<w:tbl\b/g) || []).length;
      structure.textBoxes = (documentXml.match(/<w:txbxContent/g) || []).length;
      // A table cell is the usual place a two-column layout hides.
      if (structure.tables > 0) {
        structure.tables = Math.max(structure.tables, 1);
      }
    }

    const outsideText: string[] = [];
    for (const path of Object.keys(zip.files)) {
      const isHeader = /^word\/header\d*\.xml$/.test(path);
      const isFooter = /^word\/footer\d*\.xml$/.test(path);
      if (isHeader) structure.headers++;
      if (isFooter) structure.footers++;
      if (isHeader || isFooter) {
        const xml = await zip.file(path)?.async('string');
        if (xml) {
          const parsed = new DOMParser().parseFromString(xml, 'application/xml');
          const paragraphs = Array.from(parsed.getElementsByTagNameNS('*', 'p')).map((paragraph) => Array.from(paragraph.getElementsByTagNameNS('*', 't')).map((node) => node.textContent ?? '').join('')).filter(Boolean);
          outsideText.push(...paragraphs);
        }
      }
      if (path.startsWith('word/media/') && !zip.files[path].dir) structure.images++;
    }
    structure.outsideText = outsideText.join('\n');
    structure.inspected = Boolean(documentXml);
  } catch {
    // Structure probing is a bonus. Text extraction already succeeded or threw.
  }

  return structure;
}

/* -------------------------------------------------------------------------- */
/* Plain text                                                                  */
/* -------------------------------------------------------------------------- */

async function extractPlainText(file: File): Promise<ExtractedDocument> {
  const text = (await file.text()).replace(/\r\n/g, '\n').trim();

  if (!text) {
    throw new ExtractionError('empty', 'That file is empty.');
  }

  return {
    text,
    fileName: file.name,
    size: file.size,
    kind: 'text',
    structure: {
      tables: 0,
      headers: 0,
      footers: 0,
      textBoxes: 0,
      images: 0,
      noTextLayer: false,
    },
    warnings: [],
  };
}
