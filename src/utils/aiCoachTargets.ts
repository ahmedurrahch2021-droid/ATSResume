import type { ResumeData } from '../types';
import type { CoverLetterData } from '../types/coverLetter';
import type { CoachTarget } from '../types/ai';

export function resumeCoachTargets(resume: ResumeData): CoachTarget[] {
  return [
    { id: 'summary', label: 'Professional summary', text: resume.summary, sectionType: 'summary' },
    ...resume.experience.flatMap((role, roleIndex) => role.bullets.map((text, index) => ({ id: `experience:${encodeURIComponent(role.id)}:${index}`, label: `${role.role || `Role ${roleIndex + 1}`} · bullet ${index + 1}`, text, sectionType: 'bullet' as const }))),
    ...resume.projects.flatMap((project, projectIndex) => project.bullets.map((text, index) => ({ id: `project:${encodeURIComponent(project.id)}:${index}`, label: `${project.name || `Project ${projectIndex + 1}`} · bullet ${index + 1}`, text, sectionType: 'bullet' as const }))),
  ];
}

export function applyResumeCoachEdit(resume: ResumeData, id: string, expected: string, text: string): ResumeData | null {
  if (resumeCoachTargets(resume).find((target) => target.id === id)?.text !== expected) return null;
  if (id === 'summary') return { ...resume, summary: text };
  const [kind, encoded, position] = id.split(':');
  const itemId = decodeURIComponent(encoded);
  const index = Number(position);
  if (kind === 'experience') return { ...resume, experience: resume.experience.map((role) => role.id === itemId ? { ...role, bullets: role.bullets.map((bullet, at) => at === index ? text : bullet) } : role) };
  if (kind === 'project') return { ...resume, projects: resume.projects.map((project) => project.id === itemId ? { ...project, bullets: project.bullets.map((bullet, at) => at === index ? text : bullet) } : project) };
  return null;
}

export function letterCoachTargets(letter: CoverLetterData): CoachTarget[] {
  return [
    { id: 'opening', label: 'Opening paragraph', text: letter.opening, sectionType: 'cover-letter' },
    ...letter.bodyParagraphs.map((text, index) => ({ id: `body:${index}`, label: `Body paragraph ${index + 1}`, text, sectionType: 'cover-letter' as const })),
    ...letter.keyHighlights.map((text, index) => ({ id: `highlight:${index}`, label: `Key highlight ${index + 1}`, text, sectionType: 'bullet' as const })),
    { id: 'closing', label: 'Closing paragraph', text: letter.closing, sectionType: 'cover-letter' },
  ];
}

export function applyLetterCoachEdit(letter: CoverLetterData, id: string, expected: string, text: string): CoverLetterData | null {
  if (letterCoachTargets(letter).find((target) => target.id === id)?.text !== expected) return null;
  if (id === 'opening' || id === 'closing') return { ...letter, [id]: text };
  const [kind, position] = id.split(':');
  const key = kind === 'body' ? 'bodyParagraphs' : kind === 'highlight' ? 'keyHighlights' : null;
  return key ? { ...letter, [key]: letter[key].map((paragraph, index) => index === Number(position) ? text : paragraph) } : null;
}
