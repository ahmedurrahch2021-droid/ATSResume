import React from 'react';
import { Download, Mail } from 'lucide-react';
import { downloadChecklist } from '../utils/checklist';

interface EmailSubscriptionBoxProps { variant?: 'card' | 'inline' | 'banner'; title?: string; description?: string }

export function EmailSubscriptionBox({ variant = 'card', title = 'Keep a resume review checklist', description = 'Download the manual checklist to review your contact details, evidence and exported file.' }: EmailSubscriptionBoxProps) {
  return (
    <section className={`rounded-card border border-line p-5 sm:p-6 ${variant === 'banner' ? 'bg-soft' : 'bg-surface'}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-xl"><p className="eyebrow">Free resource</p><h3 className="mt-2 text-xl">{title}</h3><p className="mt-2 text-sm text-muted">{description}</p></div>
        <button type="button" className="btn btn-secondary shrink-0" onClick={() => downloadChecklist()}><Download className="h-4 w-4 shrink-0" aria-hidden="true" />Download checklist (.txt)</button>
      </div>
      <p className="mt-5 border-t border-line pt-4 text-xs text-muted">Email subscriptions and job alerts are not connected yet. <a className="inline-flex min-h-11 items-center gap-1 text-accent underline underline-offset-4" href="mailto:ahmedur.rahch2021@gmail.com?subject=Interest%20in%20email%20updates"><Mail className="h-3.5 w-3.5" aria-hidden="true" />Email us about future updates</a>.</p>
    </section>
  );
}
