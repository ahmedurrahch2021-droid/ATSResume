import React, { useState } from 'react';
import { Plus, Trash2, WandSparkles } from 'lucide-react';
import type { ResumeData, ResumeLanguageItem, CompetitiveProgrammingItem } from '../../types';
import type { EditorSection } from '../../utils/resumeActions';
import { bulletHasNumber } from '../../utils/resumeAudit';
import { ResumeField } from './ResumeField';
import { GuidedBulletEditor } from './GuidedBulletEditor';

interface ResumeSectionFormProps {
  section: EditorSection;
  resume: ResumeData;
  onChange: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const newId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

function AddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" className="btn btn-secondary" onClick={onClick}><Plus className="w-4 h-4" aria-hidden="true" />{children}</button>;
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-btn px-2 text-xs font-medium text-danger hover:bg-danger-soft" onClick={onClick}><Trash2 className="w-4 h-4" aria-hidden="true" />{label}</button>;
}

export function ResumeSectionForm({ section, resume, onChange }: ResumeSectionFormProps) {
  const [guidedBullet, setGuidedBullet] = useState<string | null>(null);
  const update = (key: keyof ResumeData, value: string) => onChange((current) => ({ ...current, [key]: value }));
  const updateRole = (id: string, key: 'role' | 'company' | 'location' | 'dates', value: string) => onChange((current) => ({ ...current, experience: current.experience.map((item) => item.id === id ? { ...item, [key]: value } : item) }));
  const updateBullet = (id: string, index: number, text: string) => onChange((current) => ({ ...current, experience: current.experience.map((item) => item.id === id ? { ...item, bullets: item.bullets.map((bullet, bulletIndex) => bulletIndex === index ? text : bullet) } : item) }));

  if (section === 'contact') return (
    <div className="space-y-5">
      <ResumeField id="resume-fullName" label="Full name" value={resume.fullName} onChange={(value) => update('fullName', value)} />
      <ResumeField id="resume-targetTitle" label="Professional title (optional)" value={resume.targetTitle} onChange={(value) => update('targetTitle', value)} hint="Use an accurate role title. Do not upgrade your seniority to match a posting." />
      <ResumeField id="resume-email" label="Email" type="email" value={resume.email} onChange={(value) => update('email', value)} />
      <ResumeField id="resume-phone" label="Phone" value={resume.phone} onChange={(value) => update('phone', value)} hint="Include the country code if you apply internationally." />
      <ResumeField id="resume-location" label="City, country" value={resume.location} onChange={(value) => update('location', value)} hint="A full home address is usually unnecessary for a corporate resume. Follow the application’s instructions." />
      <ResumeField id="resume-linkedin" label="LinkedIn (optional)" value={resume.linkedin} onChange={(value) => update('linkedin', value)} />
      <ResumeField id="resume-portfolio" label="Portfolio or website (optional)" value={resume.portfolio} onChange={(value) => update('portfolio', value)} />
      <ResumeField id="resume-github" label="GitHub (optional)" value={resume.github ?? ''} onChange={(value) => update('github', value)} />
      <ResumeField id="resume-visaStatus" label="Work authorisation / visa (optional)" value={resume.visaStatus ?? ''} onChange={(value) => update('visaStatus', value)} hint="State your actual status if relevant to the application." />
    </div>
  );

  if (section === 'summary') return (
    <div className="space-y-5">
      <ResumeField id="resume-summary" label="Professional summary" rows={7} value={resume.summary} onChange={(value) => update('summary', value)} hint="Optional. Explain your relevant work and the role you want, rather than adding generic traits. Leave it blank if it adds no useful information." />
      <div className="rounded-card border border-line bg-soft p-4 text-sm text-muted space-y-2">
        <p className="font-medium text-ink">A useful starting structure</p>
        <p>“[Your profession] with experience in [your actual field]. [A specific contribution or scope you can support]. Seeking [the role you are applying for].”</p>
        <p className="text-xs">This is a prompt, not ready-to-use experience. Fill it with your own facts.</p>
      </div>
    </div>
  );

  if (section === 'experience') return (
    <div className="space-y-6">
      {resume.experience.length === 0 && <p className="text-sm text-muted">No roles were mapped yet. Add an actual role, internship or relevant volunteer experience. You can compare the original text from the navigation.</p>}
      {resume.experience.map((role, roleIndex) => (
        <div key={role.id} className="space-y-4 rounded-card border border-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base">{role.role || `Role ${roleIndex + 1}`}</h3>
            <RemoveButton label="Remove role" onClick={() => onChange((current) => ({ ...current, experience: current.experience.filter((item) => item.id !== role.id) }))} />
          </div>
          <ResumeField id={`role-${role.id}-role`} label="Job title" value={role.role} onChange={(value) => updateRole(role.id, 'role', value)} />
          <ResumeField id={`role-${role.id}-company`} label="Employer / organisation" value={role.company} onChange={(value) => updateRole(role.id, 'company', value)} />
          <ResumeField id={`role-${role.id}-dates`} label="Dates" value={role.dates} onChange={(value) => updateRole(role.id, 'dates', value)} placeholder="e.g. Jan 2022 – Present" />
          <ResumeField id={`role-${role.id}-location`} label="Location (optional)" value={role.location} onChange={(value) => updateRole(role.id, 'location', value)} />
          <div className="space-y-5 border-t border-line pt-4">
            <p className="text-sm font-medium text-ink">Contribution bullets</p>
            <p className="text-xs text-muted">What did you do? What was the scope or result? Numbers are optional and must be accurate.</p>
            {role.bullets.map((bullet, index) => {
              const id = `bullet-${role.id}-${index}`;
              return (
                <div key={id} className="space-y-2">
                  <ResumeField id={id} label={`Bullet ${index + 1}`} rows={3} value={bullet} onChange={(value) => updateBullet(role.id, index, value)} />
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs text-muted">{bullet.trim() ? bulletHasNumber(bullet) ? 'Number present — verify its relevance.' : 'A specific qualitative result is also valid.' : 'Nothing will be exported until you add text.'}</span>
                    <div className="flex flex-wrap gap-1">
                      <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-btn px-2 text-xs font-medium text-accent hover:bg-accent-soft" aria-expanded={guidedBullet === id} onClick={() => setGuidedBullet(guidedBullet === id ? null : id)}><WandSparkles className="w-4 h-4" aria-hidden="true" />{guidedBullet === id ? 'Close helper' : 'Help me rewrite'}</button>
                      <RemoveButton label="Remove bullet" onClick={() => { setGuidedBullet(null); onChange((current) => ({ ...current, experience: current.experience.map((item) => item.id === role.id ? { ...item, bullets: item.bullets.filter((_, bulletIndex) => bulletIndex !== index) } : item) })); }} />
                    </div>
                  </div>
                  {guidedBullet === id && <GuidedBulletEditor id={id} original={bullet} onApply={(text) => updateBullet(role.id, index, text)} />}
                </div>
              );
            })}
            <AddButton onClick={() => onChange((current) => ({ ...current, experience: current.experience.map((item) => item.id === role.id ? { ...item, bullets: [...item.bullets, ''] } : item) }))}>Add bullet</AddButton>
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange((current) => ({ ...current, experience: [...current.experience, { id: newId('role'), role: '', company: '', dates: '', location: '', bullets: [''] }] }))}>Add role</AddButton>
    </div>
  );

  if (section === 'education') return (
    <div className="space-y-6">
      {resume.education.length === 0 && <p className="text-sm text-muted">No education entry was mapped. Add only qualifications you actually have, including ongoing study if you label it clearly.</p>}
      {resume.education.map((item, index) => {
        const change = (key: 'degree' | 'institution' | 'dates' | 'location' | 'gpa', value: string) => onChange((current) => ({ ...current, education: current.education.map((entry) => entry.id === item.id ? { ...entry, [key]: value } : entry) }));
        return (
          <div key={item.id} className="space-y-4 rounded-card border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-base">Qualification {index + 1}</h3><RemoveButton label="Remove entry" onClick={() => onChange((current) => ({ ...current, education: current.education.filter((entry) => entry.id !== item.id) }))} /></div>
            <ResumeField id={`education-${item.id}-degree`} label="Degree / qualification" value={item.degree} onChange={(value) => change('degree', value)} />
            <ResumeField id={`education-${item.id}-institution`} label="Institution" value={item.institution} onChange={(value) => change('institution', value)} />
            <ResumeField id={`education-${item.id}-dates`} label="Dates / graduation year" value={item.dates} onChange={(value) => change('dates', value)} />
            <ResumeField id={`education-${item.id}-location`} label="Location (optional)" value={item.location} onChange={(value) => change('location', value)} />
            <ResumeField id={`education-${item.id}-gpa`} label="GPA / result (optional)" value={item.gpa ?? ''} onChange={(value) => change('gpa', value)} />
          </div>
        );
      })}
      <AddButton onClick={() => onChange((current) => ({ ...current, education: [...current.education, { id: newId('education'), degree: '', institution: '', dates: '', location: '' }] }))}>Add education</AddButton>
    </div>
  );

  if (section === 'skills') return (
    <div className="space-y-5">
      {([
        ['languages', 'Core skills', 'e.g. Financial reporting, curriculum design, TypeScript'],
        ['frameworks', 'Specialist tools', 'e.g. SAP FICO, AutoCAD, React'],
        ['toolsAndCloud', 'Platforms & software', 'e.g. Excel, QuickBooks, AWS'],
        ['methodologies', 'Methods & standards', 'e.g. IFRS, GMP, Agile'],
      ] as const).map(([key, label, placeholder]) => <ResumeField key={key} id={`resume-skills-${key}`} label={label} value={resume.skills[key]} placeholder={placeholder} onChange={(value) => onChange((current) => ({ ...current, skills: { ...current.skills, [key]: value } }))} />)}
      <p className="text-sm text-muted">Comma-separated lists. A job-posting word appearing here is not proof of competence. Where relevant, show the skill in an actual contribution bullet too.</p>
    </div>
  );

  if (section === 'projects') return (
    <div className="space-y-6">
      {resume.projects.length === 0 && <p className="text-sm text-muted">Projects are optional. Include relevant work rather than a generic example.</p>}
      {resume.projects.map((project, index) => {
        const change = (key: 'name' | 'roleOrTech' | 'link', value: string) => onChange((current) => ({ ...current, projects: current.projects.map((item) => item.id === project.id ? { ...item, [key]: value } : item) }));
        return (
          <div key={project.id} className="space-y-4 rounded-card border border-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-base">Project {index + 1}</h3><RemoveButton label="Remove project" onClick={() => onChange((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== project.id) }))} /></div>
            <ResumeField id={`project-${project.id}-name`} label="Project name" value={project.name} onChange={(value) => change('name', value)} />
            <ResumeField id={`project-${project.id}-role`} label="Your role / tools (optional)" value={project.roleOrTech} onChange={(value) => change('roleOrTech', value)} />
            <ResumeField id={`project-${project.id}-link`} label="Link (optional)" value={project.link ?? ''} onChange={(value) => change('link', value)} />
            <ResumeField id={`project-${project.id}-bullets`} label="Contribution bullets — one per line" rows={5} value={project.bullets.join('\n')} onChange={(value) => onChange((current) => ({ ...current, projects: current.projects.map((item) => item.id === project.id ? { ...item, bullets: value.split('\n') } : item) }))} />
          </div>
        );
      })}
      <AddButton onClick={() => onChange((current) => ({ ...current, projects: [...current.projects, { id: newId('project'), name: '', roleOrTech: '', link: '', bullets: [] }] }))}>Add project</AddButton>
    </div>
  );

  if (section === 'certifications') return (
    <ResumeField id="resume-certifications" label="Certifications / licences — one per line" rows={8} value={resume.certifications.join('\n')} onChange={(value) => onChange((current) => ({ ...current, certifications: value.split('\n') }))} hint="Optional. Name the issuer and date if useful. Label incomplete study as ongoing, not as a qualification you already hold." />
  );

  if (section === 'extras') return (
    <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="spoken-languages-title">
        <h3 id="spoken-languages-title" className="text-base">Spoken languages</h3>
        {(resume.languages ?? []).map((language) => (
          <div key={language.id} className="space-y-3 rounded-card border border-line p-4">
            <ResumeField id={`language-${language.id}-name`} label="Language" value={language.name} onChange={(value) => onChange((current) => ({ ...current, languages: (current.languages ?? []).map((item) => item.id === language.id ? { ...item, name: value } : item) }))} />
            <label htmlFor={`language-${language.id}-level`} className="block text-sm font-medium">Proficiency (optional)</label>
            <select id={`language-${language.id}-level`} className="field" value={language.level} onChange={(event) => onChange((current) => ({ ...current, languages: (current.languages ?? []).map((item) => item.id === language.id ? { ...item, level: event.target.value as ResumeLanguageItem['level'] } : item) }))}>
              <option value="">Not specified</option>{['Native', 'Fluent', 'C2 (Mastery)', 'C1 (Advanced)', 'B2 (Upper Intermediate)', 'B1 (Intermediate)', 'A2', 'A1'].map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
            <RemoveButton label="Remove language" onClick={() => onChange((current) => ({ ...current, languages: (current.languages ?? []).filter((item) => item.id !== language.id) }))} />
          </div>
        ))}
        <AddButton onClick={() => onChange((current) => ({ ...current, languages: [...(current.languages ?? []), { id: newId('language'), name: '', level: '' }] }))}>Add language</AddButton>
      </section>
      <section className="space-y-4" aria-labelledby="developer-profiles-title">
        <h3 id="developer-profiles-title" className="text-base">Developer / competitive programming profiles</h3>
        <p className="text-xs text-muted">Optional, and only relevant for some roles. No rank or rating is supplied for you.</p>
        {(resume.competitiveProgramming ?? []).map((profile) => (
          <div key={profile.id} className="space-y-3 rounded-card border border-line p-4">
            <label htmlFor={`profile-${profile.id}-platform`} className="block text-sm font-medium">Platform</label>
            <select id={`profile-${profile.id}-platform`} className="field" value={profile.platform} onChange={(event) => onChange((current) => ({ ...current, competitiveProgramming: (current.competitiveProgramming ?? []).map((item) => item.id === profile.id ? { ...item, platform: event.target.value as CompetitiveProgrammingItem['platform'] } : item) }))}>{['Other', 'Codeforces', 'LeetCode', 'HackerRank', 'Kaggle', 'CodeChef', 'GitHub'].map((platform) => <option key={platform}>{platform}</option>)}</select>
            {(['handle', 'rating', 'badgeOrRank'] as const).map((key) => <ResumeField key={key} id={`profile-${profile.id}-${key}`} label={key === 'handle' ? 'Username / handle' : key === 'rating' ? 'Rating (optional)' : 'Rank / badge (optional)'} value={profile[key] ?? ''} onChange={(value) => onChange((current) => ({ ...current, competitiveProgramming: (current.competitiveProgramming ?? []).map((item) => item.id === profile.id ? { ...item, [key]: value } : item) }))} />)}
            <RemoveButton label="Remove profile" onClick={() => onChange((current) => ({ ...current, competitiveProgramming: (current.competitiveProgramming ?? []).filter((item) => item.id !== profile.id) }))} />
          </div>
        ))}
        <AddButton onClick={() => onChange((current) => ({ ...current, competitiveProgramming: [...(current.competitiveProgramming ?? []), { id: newId('profile'), platform: 'Other', handle: '', rating: '', badgeOrRank: '' }] }))}>Add profile</AddButton>
      </section>
      <section className="space-y-4" aria-labelledby="custom-sections-title">
        <h3 id="custom-sections-title" className="text-base">Custom sections</h3>
        {(resume.customSections ?? []).map((custom) => (
          <div key={custom.id} className="space-y-4 rounded-card border border-line p-4">
            <ResumeField id={`custom-${custom.id}-title`} label="Section heading" value={custom.title} onChange={(value) => onChange((current) => ({ ...current, customSections: (current.customSections ?? []).map((item) => item.id === custom.id ? { ...item, title: value } : item) }))} />
            {custom.items.map((item) => <div key={item.id} className="space-y-3 border-t border-line pt-3">
              {(['title', 'subtitle', 'date', 'description'] as const).map((key) => <ResumeField key={key} id={`custom-item-${item.id}-${key}`} label={key === 'description' ? 'Description' : key === 'subtitle' ? 'Subtitle (optional)' : key === 'date' ? 'Date (optional)' : 'Item title'} value={item[key] ?? ''} rows={key === 'description' ? 4 : undefined} onChange={(value) => onChange((current) => ({ ...current, customSections: (current.customSections ?? []).map((entry) => entry.id === custom.id ? { ...entry, items: entry.items.map((child) => child.id === item.id ? { ...child, [key]: value } : child) } : entry) }))} />)}
              <RemoveButton label="Remove item" onClick={() => onChange((current) => ({ ...current, customSections: (current.customSections ?? []).map((entry) => entry.id === custom.id ? { ...entry, items: entry.items.filter((child) => child.id !== item.id) } : entry) }))} />
            </div>)}
            <div className="flex flex-wrap gap-2"><AddButton onClick={() => onChange((current) => ({ ...current, customSections: (current.customSections ?? []).map((entry) => entry.id === custom.id ? { ...entry, items: [...entry.items, { id: newId('custom-item'), title: '', description: '' }] } : entry) }))}>Add item</AddButton><RemoveButton label="Remove section" onClick={() => onChange((current) => ({ ...current, customSections: (current.customSections ?? []).filter((item) => item.id !== custom.id) }))} /></div>
          </div>
        ))}
        <AddButton onClick={() => onChange((current) => ({ ...current, customSections: [...(current.customSections ?? []), { id: newId('custom'), title: '', items: [{ id: newId('custom-item'), title: '', description: '' }] }] }))}>Add custom section</AddButton>
      </section>
      <ResumeField id="resume-additionalInformation" label="Additional information" rows={6} value={resume.additionalInformation ?? ''} onChange={(value) => update('additionalInformation', value)} hint="Use this for relevant imported text that was not mapped into the standard fields. It is included in the export, so review it before downloading." />
    </div>
  );
  return null;
}
