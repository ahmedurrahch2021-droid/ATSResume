import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, Mail, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { PACKAGES } from '../data/mockData';
import type { OrderFormData, ServicePricingRegion } from '../types';
import { downloadBlob } from '../utils/resumeExporter';
import { ServicePricingRegionSelect } from '../components/ServicePricingRegionSelect';
import { DELIVERY_POLICY, REPLY_POLICY, SERVICE_CONTACT } from '../data/servicePolicy';
import { formatPackagePrice, rushQuoteNote, rushRequestLabel, serviceSelectionFromSearch } from '../utils/servicePricing';

interface OrderPageProps {
  initialPackageId?: 'starter' | 'boost' | 'full';
  initialUrgent?: boolean;
  initialPricingRegion?: ServicePricingRegion;
  preloadedData?: { resume: string; jd: string };
  onBackToPricing: () => void;
}

const STEPS = ['Your details', 'Package', 'Background', 'Target job', 'Review & contact'];
type TextKey = Exclude<keyof OrderFormData, 'packageId' | 'pricingRegion' | 'urgentDelivery' | 'keySkills' | 'tone' | 'pageLength' | 'paymentMethod'>;

export function OrderPage({ initialPackageId = 'boost', initialUrgent = false, initialPricingRegion = 'international', preloadedData, onBackToPricing }: OrderPageProps) {
  const [searchParams] = useSearchParams();
  const selection = serviceSelectionFromSearch(searchParams);
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '', email: '', phone: '', preferredTime: '', referralSource: '', packageId: selection.packageId ?? initialPackageId,
    pricingRegion: selection.pricingRegion ?? initialPricingRegion, urgentDelivery: selection.urgent ?? initialUrgent,
    currentRole: '', workExperience: preloadedData?.resume ?? '', education: '', keySkills: [], certifications: '', targetRole: '', targetJobDescription: preloadedData?.jd ?? '',
    targetIndustry: '', specificRequirements: '', tone: 'professional', pageLength: '2', targetSalary: '', specialNotes: '', paymentMethod: 'card',
  });
  useEffect(() => { if (step > 0) { headingRef.current?.focus({ preventScroll: true }); headingRef.current?.scrollIntoView({ block: 'start' }); } }, [step]);
  const pkg = PACKAGES.find((item) => item.id === formData.packageId)!;
  const priceText = formatPackagePrice(pkg, formData.pricingRegion, formData.urgentDelivery);
  const currency = formData.pricingRegion === 'bangladesh' ? 'BDT' : 'USD';
  const update = <K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => setFormData((current) => ({ ...current, [key]: value }));
  const textField = (key: TextKey, label: string, options: { multiline?: boolean; required?: boolean; type?: string } = {}) => <div className="space-y-2" key={key}>
    <label htmlFor={`inquiry-${key}`} className="text-sm font-medium">{label}{options.required ? ' (required)' : ' (optional)'}</label>
    {options.multiline ? <textarea id={`inquiry-${key}`} rows={5} className="field" required={options.required} value={formData[key]} onChange={(event) => update(key, event.target.value)} /> : <input id={`inquiry-${key}`} type={options.type ?? 'text'} className="field" required={options.required} value={formData[key]} onChange={(event) => update(key, event.target.value)} />}
  </div>;
  const brief = [
    'ATS Resume Lab — review inquiry (not an order or receipt)',
    `Package requested: ${pkg.name} — ${priceText} ${currency} (one-time)`,
    `Pricing region: ${formData.pricingRegion === 'bangladesh' ? 'Bangladesh' : 'International'}`,
    `Included scope: ${pkg.description}\nRevision rounds: ${pkg.revisionRounds}`,
    ...(formData.urgentDelivery ? [`Urgent delivery requested: ${rushQuoteNote(formData.pricingRegion)}`] : []),
    `Name: ${formData.fullName}`, `Email: ${formData.email}`, `Phone: ${formData.phone}`, `Contact time / timezone: ${formData.preferredTime}`,
    `Current role: ${formData.currentRole}`, `Background:\n${formData.workExperience}`, `Education:\n${formData.education}`, `Skills: ${formData.keySkills.join(', ')}`, `Certifications:\n${formData.certifications}`,
    `Target role: ${formData.targetRole}`, `Industry: ${formData.targetIndustry}`, `Job posting:\n${formData.targetJobDescription}`, `Requirements:\n${formData.specificRequirements}`,
    `Tone: ${formData.tone}`, `Preferred length: ${formData.pageLength} pages`, `Salary context: ${formData.targetSalary}`, `Notes:\n${formData.specialNotes}`, `Heard about us: ${formData.referralSource}`,
    'Please confirm availability, scope, delivery date, revision/refund terms and payment arrangements before starting work.',
    `${REPLY_POLICY} ${DELIVERY_POLICY}`,
  ].join('\n\n');
  const emailBody = `Hello,\n\nI would like to discuss ${pkg.name} (${priceText} ${currency}, ${formData.pricingRegion === 'bangladesh' ? 'Bangladesh' : 'international'} pricing).\n${formData.urgentDelivery ? `${rushQuoteNote(formData.pricingRegion)}\n` : ''}Target role: ${formData.targetRole}\nName: ${formData.fullName}\nReply email: ${formData.email}\n\nPlease confirm availability, scope, timing, revision/refund terms and payment arrangements. I can attach the inquiry brief and resume myself.\n`;

  return (
    <div className="section bg-soft">
      <div className="container-page max-w-4xl space-y-6">
        <button type="button" className="btn btn-ghost" onClick={onBackToPricing}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to pricing</button>
        <div><p className="eyebrow">Paid human help · free core tools</p><h1 className="mt-3 text-3xl sm:text-4xl">Prepare a review inquiry</h1><p className="mt-4 text-muted">Human help is paid in Bangladesh and other countries. Your answers stay in this page until you download or share them. Online checkout and automatic order submission are not connected. Send your brief to agree the work before paying.</p><p className="mt-3 text-sm text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p></div>
        <ol aria-label="Inquiry steps" className="grid grid-cols-5 gap-1 rounded-card border border-line bg-paper p-2 sm:gap-3 sm:p-4">{STEPS.map((label, index) => <li key={label}><button type="button" className="flex min-h-11 w-full flex-col items-center gap-1 rounded-btn p-1 text-xs disabled:opacity-60" disabled={index > step} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined} aria-label={`Step ${index + 1}: ${label}`}><span className={`grid h-7 w-7 place-items-center rounded-full ${index === step ? 'bg-accent text-white' : 'bg-soft text-ink'}`}>{index + 1}</span><span className="hidden sm:block">{label}</span></button></li>)}</ol>
        <section className="card p-5 sm:p-7">
          <h2 ref={headingRef} tabIndex={-1} className="mb-5 scroll-mt-24 text-xl">Step {step + 1} of {STEPS.length}: {STEPS[step]}</h2>
          <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); if (step < 4) setStep(step + 1); }}>
            {step === 0 && <>
              <div className="grid gap-4 sm:grid-cols-2">{textField('fullName', 'Full name', { required: true })}{textField('email', 'Email', { required: true, type: 'email' })}{textField('phone', 'Phone / WhatsApp', { type: 'tel' })}{textField('preferredTime', 'Preferred contact time and timezone')}</div>
              <ServicePricingRegionSelect id="inquiry-region" value={formData.pricingRegion} onChange={(value) => update('pricingRegion', value)} />
              {textField('referralSource', 'How did you hear about us?')}
            </>}
            {step === 1 && <>
              <fieldset className="space-y-3"><legend className="mb-3 text-sm font-medium">Requested package</legend>{PACKAGES.map((option) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-card border border-line p-4 has-checked:border-accent-line has-checked:bg-accent-soft/40"><input type="radio" name="inquiry-package" className="mt-1 accent-accent" checked={option.id === formData.packageId} onChange={() => update('packageId', option.id)} /><span className="min-w-0"><span className="block font-medium">{option.name} — {formatPackagePrice(option, formData.pricingRegion)} {currency}</span><span className="mt-1 block text-sm text-muted">{option.description}</span></span></label>)}</fieldset>
              <label className="flex cursor-pointer items-start gap-3 rounded-card border border-line p-4"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-accent" checked={formData.urgentDelivery} onChange={(event) => update('urgentDelivery', event.target.checked)} /><span><span className="block text-sm font-medium">{rushRequestLabel(formData.pricingRegion)}</span><span className="mt-1 block text-xs text-muted">Subject to availability and written confirmation. {formData.urgentDelivery ? rushQuoteNote(formData.pricingRegion) : 'Any fee and delivery date must be agreed before payment.'}</span></span></label>
            </>}
            {step === 2 && <>
              {textField('currentRole', 'Current role or study area')}
              {textField('workExperience', 'Experience, projects or training', { required: true, multiline: true })}
              {textField('education', 'Education', { multiline: true })}
              <div className="space-y-2"><label htmlFor="inquiry-skills" className="text-sm font-medium">Skills (optional; comma-separated)</label><input id="inquiry-skills" className="field" value={formData.keySkills.join(',')} onChange={(event) => update('keySkills', event.target.value.split(','))} /></div>
              {textField('certifications', 'Certifications', { multiline: true })}
            </>}
            {step === 3 && <>
              <div className="grid gap-4 sm:grid-cols-2">{textField('targetRole', 'Target role', { required: true })}{textField('targetIndustry', 'Industry')}</div>
              {textField('targetJobDescription', 'Job posting text or URL', { multiline: true })}
              {textField('specificRequirements', 'Employer requirements', { multiline: true })}
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><label htmlFor="inquiry-tone" className="text-sm font-medium">Preferred tone</label><select id="inquiry-tone" className="field" value={formData.tone} onChange={(event) => update('tone', event.target.value as OrderFormData['tone'])}><option value="professional">Professional</option><option value="modern">Direct and concise</option><option value="creative">Creative</option></select></div><div className="space-y-2"><label htmlFor="inquiry-pages" className="text-sm font-medium">Preferred length</label><select id="inquiry-pages" className="field" value={formData.pageLength} onChange={(event) => update('pageLength', event.target.value as OrderFormData['pageLength'])}><option value="1">1 page</option><option value="2">2 pages</option><option value="3">3 pages</option></select></div></div>
              {textField('targetSalary', 'Salary context, including currency')}{textField('specialNotes', 'Additional notes', { multiline: true })}
            </>}
            {step === 4 && <div className="space-y-4">
              <p className="text-sm text-muted">Review your brief, download it and attach it to an email. Nothing has been submitted or charged. Your inquiry is confirmed only when you receive a reply.</p>
              <label htmlFor="inquiry-brief" className="block text-sm font-medium">Your inquiry brief</label><textarea id="inquiry-brief" readOnly className="field" rows={15} value={brief} />
              <div className="flex flex-wrap gap-2"><button type="button" className="btn btn-secondary" onClick={() => downloadBlob(new Blob([brief], { type: 'text/plain;charset=utf-8' }), 'ATS-Resume-Lab-Review-Inquiry.txt')}><Download className="h-4 w-4" aria-hidden="true" />Download brief</button><a className="btn btn-primary" href={`mailto:${SERVICE_CONTACT.email}?subject=${encodeURIComponent(`Review inquiry — ${pkg.name}`)}&body=${encodeURIComponent(emailBody)}`}><Mail className="h-4 w-4" aria-hidden="true" />Open email app</a><a className="btn btn-secondary" href={SERVICE_CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><MessageCircle className="h-4 w-4" aria-hidden="true" />Message on WhatsApp</a></div>
              <p className="text-xs text-muted">Email <a className="break-all text-accent underline" href={`mailto:${SERVICE_CONTACT.email}`}>{SERVICE_CONTACT.email}</a> or WhatsApp {SERVICE_CONTACT.whatsappDisplay}. Attach the brief and resume yourself; these links do not upload files or send your answers automatically.</p>
            </div>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back</button> : <p className="text-xs text-muted">No payment on this site.</p>}
              {step < 4 && <button type="submit" className="btn btn-primary">Continue <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
