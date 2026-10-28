import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Copy, Mail, MessageSquare } from 'lucide-react';
import { REPLY_POLICY, SERVICE_CONTACT } from '../../data/servicePolicy';

const TOPICS = ['My experience', 'Report a problem', 'Suggest an improvement', 'Question or correction about a source'];

export function FeedbackSection() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLHeadingElement>(null);
  const copyGeneration = useRef(0);

  useEffect(() => { if (prepared) previewRef.current?.focus(); }, [prepared]);

  const invalidateDraft = () => {
    copyGeneration.current++;
    setPrepared(false); setMessage(''); setNotice(''); setError('');
  };
  const prepare = (event: React.FormEvent) => {
    event.preventDefault();
    copyGeneration.current++;
    if (!comment.trim()) {
      setError('Write a comment before preparing your feedback.');
      commentRef.current?.focus();
      return;
    }
    setError(''); setNotice('');
    setMessage([
      'ATS Resume Lab — private feedback',
      `Topic: ${topic}`,
      ...(name.trim() ? [`Name: ${name.trim()}`] : []),
      '', 'Comment:', comment.trim(),
    ].join('\n'));
    setPrepared(true);
  };
  const copyMessage = async () => {
    const generation = ++copyGeneration.current;
    try {
      await navigator.clipboard.writeText(message);
      if (copyGeneration.current === generation) setNotice('Copied. Paste the message into email or WhatsApp and press Send there. Nothing has been sent by this site.');
    } catch {
      if (copyGeneration.current !== generation) return;
      setNotice('Automatic copying is unavailable. Select and copy the message below, then send it from your email or WhatsApp app.');
      messageRef.current?.focus(); messageRef.current?.select();
    }
  };

  return (
    <section id="feedback" className="section scroll-mt-24 border-t border-line bg-soft" aria-labelledby="feedback-title">
      <div className="container-page grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div>
          <p className="eyebrow">Private feedback · public beta</p>
          <h2 id="feedback-title" className="mt-3 text-[28px] font-semibold leading-tight tracking-tight sm:text-[36px]">Help make the next version more useful.</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">What helped? What felt confusing? Tell the founder about your experience with the tools, downloaded documents or research. Bangla or English—both are welcome.</p>
          <ol className="mt-6 space-y-4 text-sm text-muted">
            {[
              ['Write a comment', 'Share what you tried and what could be better.'],
              ['Review your draft', 'This form prepares a private message for you.'],
              ['Send from your app', 'Open email or WhatsApp, then press Send there.'],
            ].map(([title, detail], index) => <li key={title} className="flex items-start gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-line text-xs font-semibold text-accent" aria-hidden="true">{index + 1}</span><div><p className="font-semibold text-ink">{title}</p><p className="mt-1 leading-relaxed">{detail}</p></div></li>)}
          </ol>
          <p className="mt-6 text-sm text-muted">{REPLY_POLICY}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">Feedback is voluntary and is not posted publicly. No resume or coach conversation is attached automatically.</p>
        </div>

        <div className="card min-w-0 p-5 sm:p-6">
          <form onSubmit={prepare} noValidate className="space-y-5" aria-label="Private feedback">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><label htmlFor="feedback-name" className="block text-sm font-medium">Your name (optional)</label><input id="feedback-name" className="field" autoComplete="name" maxLength={80} value={name} onChange={(event) => { invalidateDraft(); setName(event.target.value); }} /></div>
              <div className="space-y-2"><label htmlFor="feedback-topic" className="block text-sm font-medium">Feedback about</label><select id="feedback-topic" className="field" value={topic} onChange={(event) => { invalidateDraft(); setTopic(event.target.value); }}>{TOPICS.map((item) => <option key={item}>{item}</option>)}</select></div>
            </div>
            <div className="space-y-2">
              <label htmlFor="feedback-comment" className="block text-sm font-medium">Your comment</label>
              <textarea id="feedback-comment" ref={commentRef} className="field" rows={5} maxLength={1500} required value={comment} aria-invalid={Boolean(error)} aria-describedby={`feedback-hint${error ? ' feedback-error' : ''}`} placeholder="I tried… It would help if… For a problem, mention the tool and device you used." onChange={(event) => { invalidateDraft(); setComment(event.target.value); }} />
              <p id="feedback-hint" className="text-xs text-muted">Up to 1,500 characters. Your comment stays on this page until you choose a sharing option.</p>
              {error && <p id="feedback-error" role="alert" className="text-sm text-danger">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary">Prepare my feedback <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            <p className="text-xs leading-relaxed text-muted">Preparing a draft does not send a message. You review and send it using your own email or WhatsApp account.</p>
          </form>

          {prepared && <section className="mt-6 space-y-4 border-t border-line pt-5" aria-labelledby="feedback-preview-title">
            <div><h3 id="feedback-preview-title" ref={previewRef} tabIndex={-1} className="text-lg">Your draft is ready—not sent yet.</h3><p className="mt-2 break-words text-sm text-muted">To: {SERVICE_CONTACT.email} or WhatsApp {SERVICE_CONTACT.whatsappDisplay}</p></div>
            <div className="space-y-2"><label htmlFor="feedback-message" className="block text-sm font-medium">Review and edit your message</label><textarea id="feedback-message" ref={messageRef} className="field" rows={7} maxLength={2500} value={message} onChange={(event) => { copyGeneration.current++; setMessage(event.target.value); setNotice(''); }} /></div>
            <div className="flex flex-wrap gap-2">
              {message.trim() && <>
                <a href={`mailto:${SERVICE_CONTACT.email}?subject=${encodeURIComponent('ATS Resume Lab — private feedback')}&body=${encodeURIComponent(message)}`} className="btn btn-secondary" onClick={() => setNotice('Review the draft in your email app and press Send there. This site cannot confirm delivery.')}><Mail className="h-4 w-4" aria-hidden="true" />Open email draft</a>
                <a href={`${SERVICE_CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="btn btn-secondary" onClick={() => setNotice('Review the draft in WhatsApp and press Send there. This site cannot confirm delivery.')}><MessageSquare className="h-4 w-4" aria-hidden="true" />Open WhatsApp draft <span className="sr-only">(opens in a new tab)</span></a>
              </>}
              <button type="button" className="btn btn-ghost" disabled={!message.trim()} onClick={() => void copyMessage()}><Copy className="h-4 w-4" aria-hidden="true" />Copy message</button>
            </div>
            <p className="text-xs leading-relaxed text-muted">If a draft does not open correctly, copy the full message and send it manually. The form does not confirm receipt.</p>
            <p role="status" className="text-sm leading-relaxed text-muted">{notice}</p>
          </section>}
        </div>
      </div>
    </section>
  );
}
