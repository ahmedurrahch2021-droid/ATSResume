import type { ResumeData, ResumeTemplate } from '../types';
import { parseResumeText } from './resumeParser';
import { createEmptyResume } from './resumeDocument';

/** Only map facts actually present in the explicitly selected fictional sample. */
export function resumeFromTemplate(template: ResumeTemplate): ResumeData {
  const sample = template.sampleContent;
  const contact = parseResumeText(`${sample.name}\n${sample.contact}`).resume;
  const education = sample.education.split(/\s+\|\s+/).filter(Boolean).map((text, index) => {
    const [degree, ...institution] = text.split(/\s+·\s+/);
    return { id: `tpl-education-${index}`, degree: degree.trim(), institution: institution.join(' · ').trim(), location: '', dates: '' };
  });
  return {
    ...createEmptyResume(),
    fullName: sample.name,
    targetTitle: sample.experience[0]?.role ?? '',
    email: contact.email, phone: contact.phone, location: contact.location, linkedin: contact.linkedin, portfolio: contact.portfolio,
    summary: sample.summary,
    experience: sample.experience.map((item, index) => {
      const [company, ...location] = item.company.split(/\s+·\s+/);
      return { id: `tpl-experience-${index}`, role: item.role, company, location: location.join(' · '), dates: item.dates, bullets: [...item.bullets] };
    }),
    education,
    skills: { languages: sample.skills.join(', '), frameworks: '', toolsAndCloud: '', methodologies: '' },
    certifications: [...(sample.certifications ?? [])],
  };
}
