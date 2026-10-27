import type { ResumeData, TargetMarket } from '../types';

export interface ResumeDocumentSettings {
  font: 'Arial' | 'Calibri' | 'Georgia';
  accent: string;
  spacing: 'standard' | 'compact';
}

export const DEFAULT_DOCUMENT_SETTINGS: ResumeDocumentSettings = { font: 'Arial', accent: '#8e533c', spacing: 'standard' };

export interface ResumeDocumentBlock {
  id: string;
  type: 'name' | 'title' | 'contact' | 'heading' | 'role' | 'paragraph' | 'bullet' | 'photo';
  text: string;
  detail?: string;
  keepWithNext?: boolean;
}

export function createEmptyResume(): ResumeData {
  return {
    fullName: '', targetTitle: '', email: '', phone: '', location: '', linkedin: '', portfolio: '', summary: '',
    experience: [], education: [], skills: { languages: '', frameworks: '', toolsAndCloud: '', methodologies: '' },
    projects: [], certifications: [], languages: [], competitiveProgramming: [], customSections: [],
  };
}

export function hasResumeContent(resume: ResumeData): boolean {
  return Boolean(resume.fullName || resume.summary || resume.email || resume.experience.length || resume.education.length || resume.projects.length || Object.values(resume.skills).some(Boolean) || resume.certifications.length || resume.additionalInformation);
}

export function isResumeData(value: unknown): value is ResumeData {
  if (!value || typeof value !== 'object') return false;
  const data = value as ResumeData;
  const strings = ['fullName', 'targetTitle', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary'] as const;
  if (!strings.every((key) => typeof data[key] === 'string')) return false;
  const optionalStrings = ['github', 'photoUrl', 'photoShape', 'nationality', 'visaStatus', 'drivingLicense', 'remoteReadiness', 'additionalInformation'] as const;
  if (!optionalStrings.every((key) => data[key] === undefined || typeof data[key] === 'string')) return false;
  if (!data.skills || !['languages', 'frameworks', 'toolsAndCloud', 'methodologies'].every((key) => typeof data.skills[key as keyof ResumeData['skills']] === 'string')) return false;
  if (!Array.isArray(data.experience) || !data.experience.every((item) => item && (['id', 'role', 'company', 'location', 'dates'] as const).every((key) => typeof item[key] === 'string') && Array.isArray(item.bullets) && item.bullets.every((text) => typeof text === 'string'))) return false;
  if (!Array.isArray(data.education) || !data.education.every((item) => item && (['id', 'degree', 'institution', 'location', 'dates'] as const).every((key) => typeof item[key] === 'string') && (item.gpa === undefined || typeof item.gpa === 'string'))) return false;
  if (!Array.isArray(data.projects) || !data.projects.every((item) => item && (['id', 'name', 'roleOrTech'] as const).every((key) => typeof item[key] === 'string') && (item.link === undefined || typeof item.link === 'string') && Array.isArray(item.bullets) && item.bullets.every((text) => typeof text === 'string'))) return false;
  if (!Array.isArray(data.certifications) || !data.certifications.every((text) => typeof text === 'string')) return false;
  if (data.languages && (!Array.isArray(data.languages) || !data.languages.every((item) => item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.level === 'string'))) return false;
  if (data.competitiveProgramming && (!Array.isArray(data.competitiveProgramming) || !data.competitiveProgramming.every((item) => item && typeof item.id === 'string' && typeof item.platform === 'string' && typeof item.handle === 'string' && (item.rating === undefined || typeof item.rating === 'string') && (item.badgeOrRank === undefined || typeof item.badgeOrRank === 'string')))) return false;
  if (data.customSections && (!Array.isArray(data.customSections) || !data.customSections.every((section) => section && typeof section.id === 'string' && typeof section.title === 'string' && Array.isArray(section.items) && section.items.every((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.description === 'string' && (item.subtitle === undefined || typeof item.subtitle === 'string') && (item.date === undefined || typeof item.date === 'string'))))) return false;
  return true;
}

/** One body-flow document model is shared by the preview, text checks and DOCX export. */
export function getResumeDocumentBlocks(resume: ResumeData, market: TargetMarket = resume.targetMarket ?? 'global'): ResumeDocumentBlock[] {
  const blocks: ResumeDocumentBlock[] = [];
  const add = (id: string, type: ResumeDocumentBlock['type'], text: string, detail?: string, keepWithNext?: boolean) => {
    if (text.trim() || detail?.trim()) blocks.push({ id, type, text: text.trim(), detail: detail?.trim(), keepWithNext });
  };
  const heading = (id: string, text: string) => add(id, 'heading', text, undefined, true);
  const join = (values: Array<string | undefined>) => values.filter((value) => value?.trim()).join(' | ');

  add('name', 'name', resume.fullName, undefined, true);
  add('title', 'title', resume.targetTitle, undefined, true);
  add('contact', 'contact', join([resume.email, resume.phone, resume.location]), undefined, true);
  add('links', 'contact', join([...new Set([resume.linkedin, resume.portfolio, resume.github].filter(Boolean))]));
  add('work-rights', 'contact', join([resume.visaStatus, market !== 'us_uk' ? resume.nationality : undefined, resume.drivingLicense, resume.remoteReadiness]));
  if (resume.photoUrl?.startsWith('data:image/') && resume.photoShape !== 'hidden' && market !== 'us_uk') add('photo', 'photo', resume.photoUrl);
  if (resume.summary.trim()) { heading('summary-heading', 'Professional Summary'); add('summary', 'paragraph', resume.summary); }

  const experience = resume.experience.filter((role) => role.role || role.company || role.dates || role.bullets.some((text) => text.trim()));
  if (experience.length) {
    heading('experience-heading', 'Work Experience');
    experience.forEach((role) => {
      add(`role-${role.id}`, 'role', join([role.role, role.company]), join([role.dates, role.location]), true);
      role.bullets.forEach((text, index) => add(`bullet-${role.id}-${index}`, 'bullet', text));
    });
  }
  const education = resume.education.filter((item) => item.degree || item.institution || item.dates);
  if (education.length) {
    heading('education-heading', 'Education');
    education.forEach((item) => {
      add(`education-${item.id}`, 'role', join([item.degree, item.institution]), join([item.dates, item.location]), Boolean(item.gpa));
      if (item.gpa) add(`gpa-${item.id}`, 'paragraph', `GPA: ${item.gpa}`);
    });
  }
  if (Object.values(resume.skills).some((text) => text.trim())) {
    heading('skills-heading', 'Skills');
    const labels = { languages: 'Core skills', frameworks: 'Specialist tools', toolsAndCloud: 'Platforms & software', methodologies: 'Methods & standards' };
    for (const key of Object.keys(labels) as Array<keyof ResumeData['skills']>) if (resume.skills[key].trim()) add(`skills-${key}`, 'paragraph', `${labels[key]}: ${resume.skills[key]}`);
  }
  const projects = resume.projects.filter((item) => item.name || item.roleOrTech || item.bullets.some((text) => text.trim()));
  if (projects.length) {
    heading('projects-heading', 'Projects');
    projects.forEach((project) => {
      add(`project-${project.id}`, 'role', project.name, project.roleOrTech, true);
      if (project.link) add(`project-link-${project.id}`, 'contact', project.link);
      project.bullets.forEach((text, index) => add(`project-bullet-${project.id}-${index}`, 'bullet', text));
    });
  }
  if (resume.certifications.some((text) => text.trim())) {
    heading('certifications-heading', 'Certifications');
    resume.certifications.forEach((text, index) => add(`certification-${index}`, 'bullet', text));
  }
  if (resume.languages?.some((item) => item.name.trim())) {
    heading('languages-heading', 'Languages');
    resume.languages.forEach((item) => { if (item.name.trim()) add(`language-${item.id}`, 'paragraph', `${item.name}${item.level ? `: ${item.level}` : ''}`); });
  }
  if (resume.competitiveProgramming?.some((item) => item.handle.trim())) {
    heading('profiles-heading', 'Developer Profiles');
    resume.competitiveProgramming.forEach((item) => { if (item.handle.trim()) add(`profile-${item.id}`, 'paragraph', `${item.platform}: ${item.handle}${item.rating ? ` (${item.rating})` : ''}${item.badgeOrRank ? ` — ${item.badgeOrRank}` : ''}`); });
  }
  resume.customSections?.forEach((section) => {
    if (!section.title.trim() || !section.items.some((item) => item.title || item.description)) return;
    heading(`custom-heading-${section.id}`, section.title);
    section.items.forEach((item) => {
      add(`custom-${item.id}`, 'role', item.title, join([item.subtitle, item.date]), Boolean(item.description));
      add(`custom-description-${item.id}`, 'paragraph', item.description);
    });
  });
  if (resume.additionalInformation?.trim()) {
    heading('additional-heading', 'Additional Information');
    resume.additionalInformation.split('\n').forEach((text, index) => add(`additional-${index}`, 'paragraph', text));
  }
  return blocks;
}

export function documentPlainText(resume: ResumeData): string {
  return getResumeDocumentBlocks(resume)
    .filter((block) => block.type !== 'photo')
    .map((block) => `${block.type === 'heading' ? '\n' : ''}${block.type === 'bullet' ? '• ' : ''}${block.type === 'heading' ? block.text.toUpperCase() : block.text}${block.detail ? ` | ${block.detail}` : ''}`)
    .join('\n').trim();
}
