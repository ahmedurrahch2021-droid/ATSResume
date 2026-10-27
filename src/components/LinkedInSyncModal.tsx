import React, { useEffect, useRef, useState } from 'react';
import { Copy, X } from 'lucide-react';
import type { ResumeData } from '../types';

interface LinkedInSyncModalProps { isOpen: boolean; onClose: () => void; resumeData: ResumeData }

export function LinkedInSyncModal({ isOpen, onClose, resumeData }: LinkedInSyncModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const dialog = ref.current;
    if (isOpen && dialog && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog?.open) dialog.close();
  }, [isOpen]);
  const skills = Object.values(resumeData.skills).filter((value) => value.trim()).join(', ');
  const headline = [resumeData.targetTitle, resumeData.skills.languages.split(',').map((value) => value.trim()).filter(Boolean).slice(0, 3).join(' · ')].filter(Boolean).join(' | ');
  const contributions = resumeData.experience.slice(0, 2).flatMap((role) => role.bullets.filter((value) => value.trim()).slice(0, 1).map((bullet) => `${[role.role, role.company].filter(Boolean).join(' at ')}: ${bullet}`));
  const about = [resumeData.summary, skills ? `Skills: ${skills}` : '', contributions.join('\n'), [resumeData.email, resumeData.portfolio].filter(Boolean).join(' | ')].filter(Boolean).join('\n\n');
  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setMessage(`${label} copied.`); }
    catch { setMessage('Clipboard access was blocked. Select and copy the text below.'); }
  };
  return (
    <dialog ref={ref} className="m-auto w-[calc(100%_-_32px)] max-w-2xl max-h-[90vh] overflow-auto rounded-sheet border border-line bg-paper p-0 text-ink backdrop:bg-ink/50" aria-labelledby="linkedin-text-title" onCancel={onClose} onClose={onClose}>
      <div className="border-b border-line px-6 py-4 flex items-start justify-between gap-4"><div><h2 id="linkedin-text-title" className="text-xl">Text for your LinkedIn profile</h2><p className="mt-1 text-sm text-muted">Built from your current fields. Review, copy and paste it yourself.</p></div><button type="button" className="min-h-11 min-w-11 rounded-btn hover:bg-soft" aria-label="Close LinkedIn text" onClick={onClose}><X className="w-5 h-5 mx-auto" aria-hidden="true" /></button></div>
      <div className="p-6 space-y-6">
        {[{ id: 'headline', title: 'Headline', value: headline, rows: 3 }, { id: 'about', title: 'About', value: about, rows: 9 }].map((section) => <section key={section.id} className="space-y-3"><div className="flex items-center justify-between gap-3"><label htmlFor={`linkedin-${section.id}`} className="text-sm font-semibold">{section.title}</label><button type="button" className="btn btn-secondary" disabled={!section.value.trim()} onClick={() => void copy(section.value, section.title)}><Copy className="w-4 h-4" aria-hidden="true" />Copy</button></div><textarea id={`linkedin-${section.id}`} className="field" rows={section.rows} value={section.value} readOnly placeholder="Add your own details in the resume editor first." /></section>)}
        <p role="status" className="text-sm text-muted">{message || 'This does not connect to LinkedIn or change your public profile.'}</p>
      </div>
      <div className="border-t border-line px-6 py-4"><button type="button" className="btn btn-secondary" onClick={onClose}>Done</button></div>
    </dialog>
  );
}
