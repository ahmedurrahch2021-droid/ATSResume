import type { ResumeData } from '../types';
import type { DocumentKind, DocumentStructure } from './fileExtractor';
import type { ParseReport } from './resumeParser';
import { isResumeData, type ResumeDocumentSettings } from './resumeDocument';

/**
 * The draft is the bridge between "check my resume" and "edit my resume".
 *
 * Uploading a file used to produce a scan that vanished on navigation: the
 * checker kept its findings in component state, the editor loaded a sample,
 * and the two never met. This stores the parsed resume, the report of what was
 * and was not read, and the file it came from, so the editor can open the same
 * document the checker just looked at.
 *
 * localStorage only. No upload, no account, no server.
 */

export interface DraftSource {
  fileName: string;
  kind: DocumentKind;
  size: number;
  pages?: number;
  structure: DocumentStructure;
  warnings: string[];
  importedAt: string;
  origin?: 'upload' | 'paste' | 'example' | 'template' | 'blank';
}

export interface ResumeDraft {
  version: 1;
  resume: ResumeData;
  report: ParseReport;
  source: DraftSource;
  /** Extracted text, kept so the editor can re-run a check without a re-upload. */
  rawText: string;
  jobDescription?: string;
  settings?: ResumeDocumentSettings;
  updatedAt?: string;
}

const STORAGE_KEY = 'atsresume:draft:v1';
const MAX_RAW_TEXT = 200_000;
// A blocked/quota-limited localStorage must not break check → edit in this tab.
let sessionDraft: ResumeDraft | null = null;
let storageWasCleared = false;

export function saveDraft(draft: Omit<ResumeDraft, 'version' | 'rawText'> & { rawText: string }): boolean {
  const payload: ResumeDraft = {
    ...draft,
    version: 1,
    rawText: draft.rawText.slice(0, MAX_RAW_TEXT),
    updatedAt: new Date().toISOString(),
  };
  sessionDraft = payload;
  storageWasCleared = false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // The in-memory copy still works until the page is closed or reloaded.
    return false;
  }
}

export function loadDraft(): ResumeDraft | null {
  if (sessionDraft) return sessionDraft;
  if (storageWasCleared) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ResumeDraft;
    if (parsed?.version !== 1 || !isResumeData(parsed.resume) || typeof parsed.rawText !== 'string') return null;
    if (!parsed.source || typeof parsed.source.fileName !== 'string' || !parsed.source.structure || !Array.isArray(parsed.source.warnings)) return null;
    if (!parsed.report || !Array.isArray(parsed.report.fields) || !parsed.report.fields.every((field) => field && typeof field.label === 'string' && typeof field.found === 'boolean')) return null;
    sessionDraft = parsed;
    return sessionDraft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  sessionDraft = null;
  storageWasCleared = true;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}

/** Fields the parser could not read, worst-first, for the editor banner. */
export function missingFields(report: ParseReport) {
  return report.fields.filter((f) => !f.found);
}
