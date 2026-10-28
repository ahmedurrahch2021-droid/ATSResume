import React, { useState } from 'react';
import { ArrowRight, Copy, Mail } from 'lucide-react';

const CONTACT_EMAIL = 'ahmedur.rahch2021@gmail.com';

interface ContactPageProps { onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void }

export function ContactPage({ onSelectPlan }: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Question about packages');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [copyMessage, setCopyMessage] = useState('');

  return (
    <div className="section bg-soft">
      <div className="container-page max-w-5xl space-y-8">
        <div className="max-w-2xl"><p className="eyebrow">Contact</p><h1 className="mt-3 text-3xl sm:text-4xl">Let’s talk about your application.</h1><p className="mt-4 text-muted">Ask about the tools, a review package or an existing inquiry. Messages are handled by email.</p></div>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <aside className="card min-w-0 p-5 space-y-5">
            <div><h2 className="text-lg">Direct email</h2><a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-block break-all text-sm text-accent underline underline-offset-4">{CONTACT_EMAIL}</a></div>
            <p className="text-sm text-muted">For paid review, confirm availability, delivery timing, revision terms and payment arrangements before paying.</p>
            <button type="button" className="btn btn-secondary w-full" onClick={() => onSelectPlan('starter')}>Prepare a review inquiry <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></button>
          </aside>
          <section className="card min-w-0 p-5 sm:p-6">
            <h2 className="text-xl">Prepare your message</h2>
            <p className="mt-2 mb-5 text-sm text-muted">This form prepares an email for you. It does not send a message through the website.</p>
            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setDraft({ subject, body: `Name: ${name}\nReply email: ${email}\n\n${message}` }); setCopyMessage(''); }}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><label htmlFor="contact-name" className="text-sm font-medium">Your name</label><input id="contact-name" autoComplete="name" required className="field" value={name} onChange={(event) => { setName(event.target.value); setDraft(null); }} /></div>
                <div className="space-y-2"><label htmlFor="contact-email" className="text-sm font-medium">Reply email</label><input id="contact-email" type="email" autoComplete="email" required className="field" value={email} onChange={(event) => { setEmail(event.target.value); setDraft(null); }} /></div>
              </div>
              <div className="space-y-2"><label htmlFor="contact-subject" className="text-sm font-medium">Subject</label><select id="contact-subject" className="field" value={subject} onChange={(event) => { setSubject(event.target.value); setDraft(null); }}>{['Question about packages', 'Delivery availability', 'Existing inquiry', 'Resume checker or editor issue', 'Other question'].map((option) => <option key={option}>{option}</option>)}</select></div>
              <div className="space-y-2"><label htmlFor="contact-message" className="text-sm font-medium">Message</label><textarea id="contact-message" rows={6} required className="field" value={message} onChange={(event) => { setMessage(event.target.value); setDraft(null); }} /></div>
              <button type="submit" className="btn btn-primary">Prepare email <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </form>
            {draft && <div className="mt-6 space-y-3 border-t border-line pt-5">
              <p role="status" className="text-sm font-medium">Your email draft is ready. Send it from your email app to contact us.</p>
              <label htmlFor="contact-draft" className="block text-sm">Message to send</label><textarea id="contact-draft" className="field" rows={6} readOnly value={draft.body} />
              <div className="flex flex-wrap gap-2"><a className="btn btn-secondary" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}><Mail className="h-4 w-4" aria-hidden="true" />Open email app</a><button type="button" className="btn btn-ghost" onClick={async () => { try { await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`); setCopyMessage('Message copied. Paste it into an email.'); } catch { setCopyMessage('Select and copy the text above, then email it to the address shown.'); } }}><Copy className="h-4 w-4" aria-hidden="true" />Copy message</button></div>
              <p role="status" className="text-xs text-muted">{copyMessage || 'If no email app opens, copy the message and use your usual email service. The website cannot confirm delivery.'}</p>
            </div>}
          </section>
        </div>
      </div>
    </div>
  );
}
