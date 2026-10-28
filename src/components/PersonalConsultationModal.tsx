import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import type { ResumeData } from '../types';
import { PACKAGES } from '../data/mockData';
import { DELIVERY_POLICY, REPLY_POLICY } from '../data/servicePolicy';
import { describePackagePrices } from '../utils/servicePricing';
import { Modal } from './Modal';

interface PersonalConsultationModalProps { isOpen: boolean; onClose: () => void; resumeData: ResumeData; onProceedOrder: (pkg: 'starter' | 'boost' | 'full', notes?: string, targetJobUrl?: string) => void }

export function PersonalConsultationModal({ isOpen, onClose, onProceedOrder }: PersonalConsultationModalProps) {
  const [selected, setSelected] = useState<'starter' | 'boost' | 'full'>('starter');
  const [jobUrl, setJobUrl] = useState('');
  const [notes, setNotes] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="human-review-title" className="max-w-xl">
      <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4"><div><p className="eyebrow">Optional paid human help</p><h2 id="human-review-title" className="mt-1 text-xl">A second pair of eyes</h2><p className="mt-2 text-sm text-muted">Free editing and downloads are available without buying a package. Human help is paid in Bangladesh and other countries. Confirm scope and availability before paying.</p></div><button type="button" className="min-h-11 min-w-11 shrink-0 rounded-btn hover:bg-soft" aria-label="Close human review options" onClick={onClose}><X className="w-5 h-5 mx-auto" aria-hidden="true" /></button></div>
      <form className="modal-content p-5 space-y-5" onSubmit={(event) => { event.preventDefault(); onProceedOrder(selected, notes, jobUrl); onClose(); }}>
        <fieldset className="space-y-3"><legend className="text-sm font-semibold mb-3">One-time package</legend>{PACKAGES.map((pkg) => <label key={pkg.id} className={`flex items-start gap-3 rounded-card border p-4 cursor-pointer ${selected === pkg.id ? 'border-accent-line bg-accent-soft/40' : 'border-line bg-surface'}`}><input type="radio" name="human-review-package" className="mt-1 accent-accent" value={pkg.id} checked={selected === pkg.id} onChange={() => setSelected(pkg.id)} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{pkg.name}</span><span className="mt-1 block text-xs text-accent">{describePackagePrices(pkg)}</span><span className="mt-2 block text-xs text-muted">{pkg.description}</span></span></label>)}</fieldset>
        <p className="text-xs text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p>
        <div className="space-y-2"><label htmlFor="review-job-url" className="text-sm font-medium">Target role or job URL (optional)</label><input id="review-job-url" className="field" value={jobUrl} onChange={(event) => setJobUrl(event.target.value)} /></div>
        <div className="space-y-2"><label htmlFor="review-notes" className="text-sm font-medium">What would you like help with?</label><textarea id="review-notes" className="field" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} /></div>
        <p className="text-xs text-muted">Continue to review your order details. This button does not take payment or send the resume to a reviewer.</p>
        <div className="flex flex-wrap justify-between gap-3"><button type="button" className="btn btn-ghost" onClick={onClose}>Keep editing free</button><button type="submit" className="btn btn-secondary">View order details <ArrowRight className="w-4 h-4" aria-hidden="true" /></button></div>
      </form>
    </Modal>
  );
}
