import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../data/mockData';
import { downloadChecklist } from '../utils/checklist';
import { Modal } from './Modal';

interface ChecklistModalProps { isOpen: boolean; onClose: () => void; onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void }

export function ChecklistModal({ isOpen, onClose, onSelectPlan }: ChecklistModalProps) {
  const [category, setCategory] = useState('All');
  const [checked, setChecked] = useState(new Set<number>());
  const categories = ['All', ...new Set(CHECKLIST_ITEMS.map((item) => item.category))];
  const items = CHECKLIST_ITEMS.filter((item) => category === 'All' || item.category === category);
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="checklist-title" className="max-w-2xl">
      <div className="flex items-start justify-between gap-3 border-b border-line p-5"><div><p className="eyebrow">Free manual review</p><h2 id="checklist-title" className="mt-1 text-xl">Your resume checklist</h2><p className="mt-2 text-sm text-muted">{CHECKLIST_ITEMS.length} review prompts. Follow the employer’s instructions; this is not a score.</p></div><button type="button" className="btn btn-ghost px-3" aria-label="Close checklist" onClick={onClose}><X className="h-5 w-5" aria-hidden="true" /></button></div>
      <div className="modal-content p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{checked.size} marked reviewed</p><button type="button" className="btn btn-secondary" onClick={() => downloadChecklist(checked)}><Download className="h-4 w-4" aria-hidden="true" />Download checklist</button></div>
        <div className="space-y-2"><label htmlFor="checklist-category" className="text-sm font-medium">Review category</label><select id="checklist-category" className="field" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
        <ul className="space-y-3">{items.map((item) => <li key={item.id}><label className="flex gap-3 rounded-card border border-line p-3 cursor-pointer"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-accent" checked={checked.has(item.id)} onChange={(event) => setChecked((current) => { const next = new Set(current); if (event.target.checked) next.add(item.id); else next.delete(item.id); return next; })} /><span className="min-w-0"><span className="block text-sm font-medium">{item.title}</span><span className="mt-1 block text-sm text-muted">{item.description}</span></span></label></li>)}</ul>
        <div className="rounded-card border border-line bg-soft p-4"><p className="text-sm text-muted">Want help reviewing your draft? Human review starts at $10, with scope and availability confirmed by email.</p><button type="button" className="btn btn-secondary mt-3" onClick={() => { onClose(); onSelectPlan('starter'); }}>View review options</button></div>
      </div>
    </Modal>
  );
}
