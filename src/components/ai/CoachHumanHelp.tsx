import React from 'react';
import { Link } from 'react-router';
import { Mail, MessageSquare } from 'lucide-react';
import type { CoachFallbackReason } from '../../types/ai';
import { REPLY_POLICY, SERVICE_CONTACT } from '../../data/servicePolicy';
import { ROUTE_PATHS } from '../../routes';

export function CoachHumanHelp({ reason, onClose }: { reason?: CoachFallbackReason; onClose: () => void }) {
  // The handoff includes a diagnostic code only, never selected text, facts or conversation history.
  const message = [
    'Hello, I would like personal writing help with my resume or cover letter on ATS Resume Lab.',
    ...(reason ? [`Coach help reference: ${reason}.`] : []),
    'Please share your availability, service scope and price.',
  ].join('\n');

  return <section className="space-y-3 rounded-card border border-accent-line bg-accent-soft p-4" aria-labelledby="coach-human-help-title">
    <h3 id="coach-human-help-title" className="text-base">Need more help or a human second opinion?</h3>
    <p className="text-sm leading-relaxed text-muted">Contact the founder for personal help. Human review and rewriting are separately paid; checking, editing, templates and downloads stay free.</p>
    <div className="flex flex-wrap gap-2">
      <a href={`mailto:${SERVICE_CONTACT.email}?subject=${encodeURIComponent('ATS Resume Lab — personal writing help')}&body=${encodeURIComponent(message)}`} className="btn btn-secondary"><Mail className="h-4 w-4" aria-hidden="true" />Email for personal help</a>
      <a href={`${SERVICE_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="btn btn-secondary"><MessageSquare className="h-4 w-4" aria-hidden="true" />WhatsApp for personal help <span className="sr-only">(opens in a new tab)</span></a>
    </div>
    <p className="break-words text-xs leading-relaxed text-muted">{SERVICE_CONTACT.email} · {SERVICE_CONTACT.whatsappDisplay}<br />{REPLY_POLICY}</p>
    <p className="text-xs leading-relaxed text-muted">Links prepare a short message. Send it from your app; your resume and coach conversation are not attached.</p>
    <Link to={ROUTE_PATHS.pricing} onClick={onClose} className="inline-flex min-h-11 items-center text-sm font-medium text-accent underline underline-offset-4">See human-help prices</Link>
  </section>;
}
