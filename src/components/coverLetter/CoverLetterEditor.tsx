import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import type { CoverLetterData } from '../../types/coverLetter';
import { COVER_LETTER_PRESETS } from '../../data/coverLetterPresets';
import { ResumeField } from '../resume/ResumeField';

interface CoverLetterEditorProps { data: CoverLetterData; onChange: (updated: CoverLetterData) => void; onApplyPreset: (id: string) => void; onSyncFromResume: () => void; hasResumeData: boolean }

function LetterSection({ id, title, children, initiallyOpen = true }: { id: string; title: string; children: React.ReactNode; initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  return <section className="card min-w-0"><h2><button type="button" className="flex min-h-11 w-full items-center justify-between gap-3 p-4 text-left text-base" aria-expanded={open} aria-controls={`letter-section-${id}`} onClick={() => setOpen(!open)}>{title}<ChevronDown className={`h-4 w-4 shrink-0 ${open ? 'rotate-180' : ''}`} aria-hidden="true" /></button></h2>{open && <div id={`letter-section-${id}`} className="space-y-4 border-t border-line p-4">{children}</div>}</section>;
}

export function CoverLetterEditor({ data, onChange, onApplyPreset, onSyncFromResume, hasResumeData }: CoverLetterEditorProps) {
  const senderField = (key: keyof CoverLetterData['sender'], label: string) => <ResumeField key={key} id={`letter-sender-${key}`} label={label} value={data.sender[key] ?? ''} type={key === 'email' ? 'email' : 'text'} onChange={(value) => onChange({ ...data, sender: { ...data.sender, [key]: value } })} />;
  const recipientField = (key: keyof CoverLetterData['recipient'], label: string) => <ResumeField key={key} id={`letter-recipient-${key}`} label={label} value={data.recipient[key] ?? ''} onChange={(value) => onChange({ ...data, recipient: { ...data.recipient, [key]: value } })} />;
  const textField = (key: 'title' | 'date' | 'salutation' | 'opening' | 'closing' | 'signOff', label: string, rows?: number) => <ResumeField id={`letter-${key}`} label={label} value={data[key]} rows={rows} onChange={(value) => onChange({ ...data, [key]: value })} />;

  return (
    <div className="space-y-4">
      <div className="card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base">Start with your own details</h2><button type="button" className="btn btn-secondary" disabled={!hasResumeData} onClick={onSyncFromResume}>Import resume contact details</button></div>
        <p className="text-xs text-muted">This copies contact fields from the current resume draft. It does not generate experience or a letter for you.</p>
        <details><summary className="min-h-11 cursor-pointer py-3 text-sm font-medium">Explore fictional examples</summary><p className="mb-3 text-xs text-muted">Loading an example replaces all letter fields. Every person, achievement and application in these examples is illustrative.</p><div className="grid gap-2 sm:grid-cols-2">{COVER_LETTER_PRESETS.map((preset) => <button type="button" key={preset.id} className="min-h-11 rounded-input border border-line p-3 text-left text-sm hover:bg-soft" onClick={() => onApplyPreset(preset.id)}>{preset.name}<span className="mt-1 block text-xs text-muted">Fictional {preset.badge.toLowerCase()} example</span></button>)}</div></details>
      </div>
      <LetterSection id="sender" title="1. Your contact details">
        {textField('title', 'Draft title (not printed)')}
        <div className="grid gap-4 sm:grid-cols-2">{senderField('fullName', 'Full name')}{senderField('jobTitle', 'Professional title')}{senderField('email', 'Email')}{senderField('phone', 'Phone')}{senderField('location', 'Location')}{senderField('portfolioUrl', 'Portfolio (optional)')}{senderField('linkedInUrl', 'LinkedIn (optional)')}</div>
      </LetterSection>
      <LetterSection id="recipient" title="2. The employer">
        <div className="grid gap-4 sm:grid-cols-2">{recipientField('hiringManagerName', 'Hiring manager or team')}{recipientField('companyName', 'Company')}{recipientField('department', 'Department (optional)')}{recipientField('companyAddress', 'Company address (optional)')}</div>
        {textField('date', 'Date')}{textField('salutation', 'Salutation')}
      </LetterSection>
      <LetterSection id="opening" title="3. Opening paragraph">{textField('opening', 'Why this role and organisation?', 5)}<p className="text-xs text-muted">Use a specific reason you can support. Refer to the actual vacancy and your own experience.</p></LetterSection>
      <LetterSection id="body" title="4. Supporting paragraphs">
        {data.bodyParagraphs.map((paragraph, index) => <div key={index} className="space-y-2"><ResumeField id={`letter-body-${index}`} label={`Paragraph ${index + 1}`} rows={5} value={paragraph} onChange={(value) => onChange({ ...data, bodyParagraphs: data.bodyParagraphs.map((item, i) => i === index ? value : item) })} /><button type="button" className="btn btn-ghost text-danger" onClick={() => onChange({ ...data, bodyParagraphs: data.bodyParagraphs.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove paragraph {index + 1}</button></div>)}
        <button type="button" className="btn btn-secondary" onClick={() => onChange({ ...data, bodyParagraphs: [...data.bodyParagraphs, ''] })}><Plus className="h-4 w-4" aria-hidden="true" />Add paragraph</button>
      </LetterSection>
      <LetterSection id="highlights" title="5. Optional contribution bullets">
        <p className="text-xs text-muted">Use verified achievements. Qualitative outcomes are valid; do not add invented numbers.</p>
        {data.keyHighlights.map((highlight, index) => <div key={index} className="space-y-2"><ResumeField id={`letter-highlight-${index}`} label={`Contribution ${index + 1}`} rows={3} value={highlight} onChange={(value) => onChange({ ...data, keyHighlights: data.keyHighlights.map((item, i) => i === index ? value : item) })} /><button type="button" className="btn btn-ghost text-danger" onClick={() => onChange({ ...data, keyHighlights: data.keyHighlights.filter((_, i) => i !== index) })}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove contribution {index + 1}</button></div>)}
        <button type="button" className="btn btn-secondary" onClick={() => onChange({ ...data, keyHighlights: [...data.keyHighlights, ''] })}><Plus className="h-4 w-4" aria-hidden="true" />Add contribution</button>
      </LetterSection>
      <LetterSection id="closing" title="6. Close and sign off" initiallyOpen={false}>{textField('closing', 'Closing paragraph', 4)}{textField('signOff', 'Sign-off')}</LetterSection>
      <LetterSection id="styling" title="7. Document appearance" initiallyOpen={false}>
        <div className="space-y-2"><label htmlFor="letter-layout" className="text-sm font-medium">Header style</label><select id="letter-layout" className="field" value={data.templateStyle} onChange={(event) => onChange({ ...data, templateStyle: event.target.value as CoverLetterData['templateStyle'] })}>{['modern', 'classic', 'minimal', 'executive'].map((style) => <option key={style} value={style}>{style[0].toUpperCase() + style.slice(1)}</option>)}</select></div>
        <div className="space-y-2"><label htmlFor="letter-font" className="text-sm font-medium">Document font</label><select id="letter-font" className="field" value={data.fontFamily} onChange={(event) => onChange({ ...data, fontFamily: event.target.value as CoverLetterData['fontFamily'] })}><option value="sans">Arial</option><option value="serif">Georgia</option><option value="mono">Courier New</option></select></div>
        <div className="space-y-2"><label htmlFor="letter-font-size" className="text-sm font-medium">Text size</label><select id="letter-font-size" className="field" value={data.fontSize} onChange={(event) => onChange({ ...data, fontSize: event.target.value as CoverLetterData['fontSize'] })}><option value="compact">Compact (10.5 pt)</option><option value="standard">Standard (11 pt)</option><option value="spacious">Spacious (12 pt)</option></select></div>
        <div className="space-y-2"><label htmlFor="letter-accent" className="block text-sm font-medium">Heading colour</label><input id="letter-accent" type="color" className="h-11 w-16 rounded-input border border-line p-1" value={data.accentColor} onChange={(event) => onChange({ ...data, accentColor: event.target.value })} /></div>
        <p className="text-xs text-muted">These header styles apply to the paper preview and PDF. DOCX uses a simple body-flow header with the selected font and colour.</p>
      </LetterSection>
    </div>
  );
}
