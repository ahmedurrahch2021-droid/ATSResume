import type { ResumeLayoutId } from '../types';
import type { ResumeDocumentSettings } from '../utils/resumeDocument';

export interface ResumeLayoutDefinition {
  id: ResumeLayoutId;
  name: string;
  description: string;
  settings: ResumeDocumentSettings;
  nameSize: number;
  headingSize: number;
  headingCaps: boolean;
  headingRule: boolean;
  centredIdentity: boolean;
  educationFirst: boolean;
  sourceIds: string[];
}

/** Original document designs. The linked institutions provide guidance, not endorsement. */
export const RESUME_LAYOUTS: ResumeLayoutDefinition[] = [
  { id: 'modern', name: 'Modern Professional', description: 'Open spacing, a left-aligned identity and a restrained heading accent.', settings: { layout: 'modern', font: 'Arial', accent: '#8e533c', spacing: 'standard' }, nameSize: 24, headingSize: 11.5, headingCaps: false, headingRule: true, centredIdentity: false, educationFirst: false, sourceIds: ['mit-ats', 'imperial-cv', 'greenhouse-parse'] },
  { id: 'classic', name: 'Classic Chronological', description: 'A centred name, serif type and fine rules above a clear career history.', settings: { layout: 'classic', font: 'Georgia', accent: '#20211f', spacing: 'standard' }, nameSize: 22, headingSize: 11, headingCaps: true, headingRule: true, centredIdentity: true, educationFirst: false, sourceIds: ['harvard-bullet', 'mit-ats', 'greenhouse-parse'] },
  { id: 'compact', name: 'Compact Professional', description: 'Black type and compact spacing for relevant, longer career histories.', settings: { layout: 'compact', font: 'Calibri', accent: '#20211f', spacing: 'compact' }, nameSize: 22, headingSize: 11, headingCaps: true, headingRule: false, centredIdentity: false, educationFirst: false, sourceIds: ['mit-ats', 'imperial-cv', 'qld-resume'] },
  { id: 'graduate', name: 'Education-first Graduate', description: 'Education before work experience, with a clean sans-serif hierarchy.', settings: { layout: 'graduate', font: 'Calibri', accent: '#20211f', spacing: 'standard' }, nameSize: 22, headingSize: 11.5, headingCaps: false, headingRule: true, centredIdentity: false, educationFirst: true, sourceIds: ['harvard-bullet', 'imperial-cv', 'uk-cv'] },
];

export function resumeLayout(id?: string): ResumeLayoutDefinition {
  return RESUME_LAYOUTS.find((layout) => layout.id === id) ?? RESUME_LAYOUTS[0];
}
