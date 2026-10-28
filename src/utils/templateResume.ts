import type { ResumeData, ResumeTemplate } from '../types';
import { parseResumeText } from './resumeParser';
import { createEmptyResume } from './resumeDocument';
import { resumeLayout } from '../data/resumeLayouts';
import { draftForResume, type ResumeDraft } from './resumeDraft';

/** Only map facts actually present in the explicitly selected fictional sample. */
export function resumeFromTemplate(template: ResumeTemplate): ResumeData {
  const sample = template.sampleContent;
  // The sample's contact line is explicit; credentials after a name are not a location.
  const contact = parseResumeText(sample.contact).resume;
  const phone = sample.contact.split(/\s+·\s+/).find((part) => /^[+\d ()-]+$/.test(part) && part.replace(/\D/g, '').length >= 7) ?? contact.phone;
  const education = sample.education.split(/\s+\|\s+/).filter(Boolean).map((text, index) => {
    const [degree, ...institution] = text.split(/\s+·\s+/);
    return { id: `tpl-education-${index}`, degree: degree.trim(), institution: institution.join(' · ').trim(), location: '', dates: '' };
  });
  return {
    ...createEmptyResume(),
    fullName: sample.name,
    targetTitle: sample.targetTitle ?? sample.experience[0]?.role ?? '',
    email: contact.email, phone, location: contact.location, linkedin: contact.linkedin, portfolio: contact.portfolio,
    summary: sample.summary,
    experience: sample.experience.map((item, index) => {
      const [company, ...location] = item.company.split(/\s+·\s+/);
      return { id: `tpl-experience-${index}`, role: item.role, company, location: location.join(' · '), dates: item.dates, bullets: [...item.bullets] };
    }),
    education,
    skills: { languages: sample.skills.join(', '), frameworks: '', toolsAndCloud: '', methodologies: '' },
    projects: (sample.projects ?? []).map((project, index) => ({ ...project, id: `tpl-project-${index}`, bullets: [...project.bullets] })),
    certifications: [...(sample.certifications ?? [])],
  };
}

/** Applying a design never copies the fictional sample over an existing career. */
export function draftWithTemplate(template: ResumeTemplate, mode: 'layout' | 'example', current: ResumeDraft | null = null): ResumeDraft {
  const settings = { ...resumeLayout(template.layout).settings };
  if (mode === 'example') return draftForResume(resumeFromTemplate(template), 'template', settings);
  return current ? { ...structuredClone(current), settings } : draftForResume(createEmptyResume(), 'blank', settings);
}
