import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Check,
  FileText,
  Globe,
  Lock,
  Mail,
  ScanSearch,
  ShieldCheck,
  Target,
  UserCheck,
} from 'lucide-react';
import { PageRoute } from '../types';
import { ATS_TEMPLATES, PACKAGES } from '../data/mockData';
import { EVIDENCE, MYTHS } from '../data/evidence';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  onOpenChecklist: () => void;
}

/* ------------------------------------------------------------------ */
/* Paper preview: a document, not a web page                           */
/* ------------------------------------------------------------------ */

const ResumePaperMock: React.FC = () => (
  <div className="relative">
    <div className="rounded-[12px] border border-line bg-surface p-6 shadow-[0_8px_28px_rgba(32,33,31,0.08)] sm:p-7">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-tight text-ink">Nusrat Jahan</p>
          <p className="mt-0.5 text-[11px] text-muted">Product Analyst · Dhaka, Bangladesh</p>
          <p className="mt-1 text-[10px] text-muted">
            nusrat@email.com · +880 1XXX-XXXXXX · linkedin.com/in/nusrat
          </p>
        </div>
        <div className="grid h-14 w-12 shrink-0 place-items-center rounded-[3px] border border-line bg-soft text-[8px] uppercase tracking-wider text-muted">
          Photo
        </div>
      </div>

      <div className="mt-4 space-y-3.5">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-accent">Experience</p>
          <div className="mt-1.5 space-y-1">
            <div className="h-[6px] w-[38%] rounded-full bg-ink/70" />
            <div className="h-[5px] w-[62%] rounded-full bg-line" />
            <div className="h-[5px] w-[92%] rounded-full bg-line" />
            <div className="h-[5px] w-[80%] rounded-full bg-line" />
          </div>
        </div>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-accent">Education</p>
          <div className="mt-1.5 space-y-1">
            <div className="h-[5px] w-[70%] rounded-full bg-line" />
            <div className="h-[5px] w-[54%] rounded-full bg-line" />
          </div>
        </div>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-accent">Skills</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {['SQL', 'Python', 'Figma', 'A/B testing', 'Stakeholder comms'].map((s) => (
              <span
                key={s}
                className="rounded-[3px] border border-line px-1.5 py-0.5 text-[8px] text-muted"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Report card overlay */}
    <div className="absolute -bottom-6 -left-4 w-[248px] rounded-[8px] border border-line bg-surface p-3 shadow-[0_10px_30px_rgba(32,33,31,0.12)] sm:-left-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Readiness report
        </span>
        <span className="rounded-[4px] bg-accent-soft px-1.5 py-0.5 text-[9px] font-medium text-accent">
          no score
        </span>
      </div>
      <ul className="space-y-1.5">
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
          Single column · text parses
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
          Contact block inside body
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <AlertCircle className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
          2 bullets have no number
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <AlertCircle className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
          Photo not allowed for UK
        </li>
      </ul>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */

const TRUTHS = [
  {
    stat: '43%',
    label: 'of resumes contain at least one parsing error',
    detail:
      'The information is not deleted. It lands in the wrong field, where a recruiter search will never find it.',
    ref: 'EV-PARSE-ERRORS',
  },
  {
    stat: '0',
    label: 'resumes auto-rejected for using a table',
    detail:
      'Automatic rejection runs on screening questions, not on your formatting. The 75% figure came from a vendor that closed in 2013.',
    ref: 'EV-REJECT',
  },
  {
    stat: '6–7.4s',
    label: 'of human triage on the first pass',
    detail:
      'Eye-tracking studies measure a recruiter skimming, not software reading. Structure is what survives that window.',
    ref: 'EV-SECONDS',
  },
];

const KIT_STEPS = [
  {
    n: '01',
    title: 'Build once',
    body: 'Your master profile, in a real A4 document with your country’s format applied.',
    route: 'suite' as PageRoute,
  },
  {
    n: '02',
    title: 'Paste the job',
    body: 'We read the description and show what it asks for, in plain language.',
    route: 'free-resume-score' as PageRoute,
  },
  {
    n: '03',
    title: 'Fix what fails',
    body: 'Parse, format and content findings — each with a reason and a one-click fix.',
    route: 'free-resume-score' as PageRoute,
  },
  {
    n: '04',
    title: 'Export and apply',
    body: 'DOCX for portals, PDF for humans, a matching cover letter, and a record to track.',
    route: 'cover-letter' as PageRoute,
  },
];

const PILLARS = [
  {
    icon: FileText,
    title: 'Build',
    body: 'Live editor, nine templates, real multi-page A4, DOCX and PDF.',
    route: 'suite' as PageRoute,
    meta: 'Free',
  },
  {
    icon: ScanSearch,
    title: 'Check',
    body: 'What a parser extracts, what breaks formatting, what a recruiter skims.',
    route: 'free-resume-score' as PageRoute,
    meta: 'Free · no signup',
  },
  {
    icon: Target,
    title: 'Tailor',
    body: 'Job-description matching with title normalisation, not keyword stuffing.',
    route: 'free-resume-score' as PageRoute,
    meta: 'Free',
  },
  {
    icon: Mail,
    title: 'Apply',
    body: 'A cover letter built from the same data, plus an application tracker.',
    route: 'cover-letter' as PageRoute,
    meta: 'Free core',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    body: 'Role examples, country rules, and the myths this industry keeps repeating.',
    route: 'examples' as PageRoute,
    meta: 'Free',
  },
  {
    icon: UserCheck,
    title: 'Get help',
    body: 'A human rewrites it when you want a person, not software.',
    route: 'pricing' as PageRoute,
    meta: 'From $10',
  },
];

const COUNTRIES = [
  { code: 'BD', name: 'Bangladesh', note: 'Photo, NID, 2–3 pages' },
  { code: 'AE', name: 'UAE', note: 'Photo, visa status' },
  { code: 'SA', name: 'Saudi Arabia', note: 'Photo, nationality' },
  { code: 'QA', name: 'Qatar', note: 'Photo, QID' },
  { code: 'GB', name: 'United Kingdom', note: 'No photo, 2 pages' },
  { code: 'US', name: 'United States', note: 'No photo, 1–2 pages' },
  { code: 'CA', name: 'Canada', note: 'No photo, 1–2 pages' },
  { code: 'AU', name: 'Australia', note: 'Work rights, 2–3 pages' },
  { code: 'DE', name: 'Germany', note: 'Photo, tabular CV' },
  { code: 'FR', name: 'France', note: '1 page' },
  { code: 'NL', name: 'Netherlands', note: 'No photo, 1–2 pages' },
  { code: 'IN', name: 'India', note: 'DOB, address common' },
];

const FAQ_PREVIEW = [
  MYTHS[0],
  MYTHS[1],
  MYTHS[3],
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenOrder, onOpenChecklist }) => {
  const previewTemplates = ATS_TEMPLATES.slice(0, 3);
  const reviewPackages = PACKAGES.slice(0, 3);

  return (
    <div className="bg-paper">
      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-line">
        <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Resume · Cover letter · ATS check</p>
            <h1 className="mt-4 text-[38px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink sm:text-[46px] lg:text-[56px]">
              Your resume, read the way recruiters and software actually read it.
            </h1>
            <p className="lede mt-5">
              Most tools guess. This one shows you what a parser extracts from your file, what
              breaks when it does, and what the job description is actually asking for — before you
              hit apply.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('free-resume-score')}
                className="btn btn-primary px-5"
              >
                Check my resume free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('suite')}
                className="btn btn-secondary px-5"
              >
                Build from scratch
              </button>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted">
              <li className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Files stay in your browser
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                No signup to check
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                12 country formats
              </li>
            </ul>
          </div>

          <div className="lg:pl-6">
            <ResumePaperMock />
          </div>
        </div>
      </section>

      {/* ---------------- Truth strip ---------------- */}
      <section className="border-b border-line bg-soft">
        <div className="container-page py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">The part nobody tells you</p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-tight text-ink sm:text-[28px]">
                Applicant tracking systems are not the filter you were sold.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('how-it-works')}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent hover:text-accent-hover"
            >
              Read the evidence
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            {TRUTHS.map((t) => (
              <div key={t.stat} className="border-t border-accent-line/60 pt-4">
                <dt className="font-heading text-[30px] font-semibold leading-none text-accent">
                  {t.stat}
                </dt>
                <dd className="mt-2 text-[13.5px] font-medium text-ink">{t.label}</dd>
                <dd className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{t.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Job Kit ---------------- */}
      <section className="section">
        <div className="container-page">
          <div className="max-w-[640px]">
            <p className="eyebrow">The job kit</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              One job description in. A complete application out.
            </h2>
            <p className="lede mt-4">
              Not fifteen tools in a list. One flow that carries your data from the first line of
              your resume to the interview question you should prepare for.
            </p>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {KIT_STEPS.map((step) => (
              <li key={step.n} className="relative">
                <span className="font-heading text-[13px] font-semibold tracking-[0.1em] text-accent-line">
                  {step.n}
                </span>
                <h3 className="mt-2 text-[17px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Pillars ---------------- */}
      <section className="section border-y border-line bg-soft">
        <div className="container-page">
          <div className="max-w-[620px]">
            <p className="eyebrow">Everything, in one place</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              Six things you need. One site that does them.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, body, route, meta }) => (
              <button
                key={title}
                type="button"
                onClick={() => onNavigate(route)}
                className="card card-hover group flex flex-col items-start p-6 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-line bg-paper text-accent">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <span className="mt-4 flex w-full items-center justify-between gap-2">
                  <span className="text-[16px] font-semibold text-ink">{title}</span>
                  <span className="chip">{meta}</span>
                </span>
                <span className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{body}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-medium text-accent">
                  Open
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Templates ---------------- */}
      <section className="section">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[560px]">
              <p className="eyebrow">Templates</p>
              <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
                Single column, by design.
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                Every template is tagged by how it behaves in a parser, so you choose with your eyes
                open instead of guessing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="btn btn-secondary"
            >
              All nine templates
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewTemplates.map((tpl, index) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onNavigate('templates')}
                className="card card-hover overflow-hidden text-left"
              >
                <div className="flex h-[176px] items-center justify-center border-b border-line bg-soft p-6">
                  <div className="h-full w-full max-w-[132px] rounded-[2px] bg-surface p-3 shadow-card">
                    <div className="h-[7px] w-[58%] rounded-full bg-ink/60" />
                    <div className="mt-1 h-[3px] w-[38%] rounded-full bg-line" />
                    <div className="mt-3 space-y-1">
                      <div className="h-[3px] w-[86%] rounded-full bg-line" />
                      <div className="h-[3px] w-[78%] rounded-full bg-line" />
                      <div className="h-[3px] w-[90%] rounded-full bg-line" />
                      <div className="h-[3px] w-[64%] rounded-full bg-line" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="h-[3px] w-[72%] rounded-full bg-line" />
                      <div className="h-[3px] w-[84%] rounded-full bg-line" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="chip chip-active">
                      {index < 2 ? 'ATS-safe' : 'Designed'}
                    </span>
                    <span className="text-[11.5px] text-muted">1–2 pages</span>
                  </div>
                  <h3 className="mt-3 text-[15px] font-semibold text-ink">{tpl.title}</h3>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                    {tpl.recommendedFor}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Countries ---------------- */}
      <section className="section border-y border-line bg-soft">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">Country formats</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              A resume is not the same document everywhere.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              In Bangladesh, a state application expects a 300×300 photo, your parents’ names and
              your NID. In the UK, the same fields are a liability. We switch the whole document —
              and tell you why.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('suite')}
              className="btn btn-primary mt-6"
            >
              Try a country format
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {COUNTRIES.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-3 rounded-[6px] border border-line bg-surface px-3 py-2.5"
              >
                <span className="grid h-7 w-8 shrink-0 place-items-center rounded-[3px] border border-line bg-paper text-[10px] font-semibold tracking-wide text-accent">
                  {c.code}
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-medium text-ink">{c.name}</span>
                  <span className="block text-[11px] text-muted">{c.note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Evidence ---------------- */}
      <section className="section">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="eyebrow">Why the report is different</p>
              <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
                No score. No invented percentage. Just findings you can check.
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
                A single number tells you nothing about what to fix. We report what was extracted,
                what was skipped, and what the job asks for — each tagged with the source behind the
                rule.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="btn btn-secondary"
                >
                  How the check works
                </button>
                <button
                  type="button"
                  onClick={onOpenChecklist}
                  className="btn btn-ghost"
                >
                  See the full checklist
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {[EVIDENCE[0], EVIDENCE[2], EVIDENCE[7], EVIDENCE[8]].map((item, i) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-[8px] border border-line bg-surface p-4"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success-soft text-success">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-relaxed text-ink">{item.publicWording}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-muted">
                      Grade {item.grade} · {item.refs.slice(0, 2).join(', ')}
                      {i === 0 ? ' · verified' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Pricing ---------------- */}
      <section className="section border-y border-line bg-soft">
        <div className="container-page">
          <div className="max-w-[600px]">
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              The software is free. People are not.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              Building, checking, matching and exporting cost us almost nothing, so they cost you
              nothing. When a human rewrites your resume, you pay for their hours — once, with no
              subscription.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            <div className="card flex flex-col justify-between p-6">
              <div>
                <span className="chip chip-active">Always free</span>
                <p className="mt-4 font-heading text-[28px] font-semibold text-ink">$0</p>
                <p className="mt-1 text-[12.5px] text-muted">No card, no trial, no signup wall</p>
                <ul className="mt-4 space-y-2 text-[13px] text-ink">
                  {['Full resume editor', 'ATS check', 'Job matching', 'DOCX + PDF export'].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('free-resume-score')}
                className="btn btn-secondary mt-6 w-full"
              >
                Start free
              </button>
            </div>

            {reviewPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={[
                  'card flex flex-col justify-between p-6',
                  pkg.popular ? 'border-accent-line ring-1 ring-accent/15' : '',
                ].join(' ')}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-muted">{pkg.name}</span>
                    {pkg.popular && <span className="chip chip-active">Most chosen</span>}
                  </div>
                  <p className="mt-4 font-heading text-[28px] font-semibold text-ink">
                    ${pkg.price}
                    <span className="ml-1 font-sans text-[12px] font-normal text-muted">once</span>
                  </p>
                  <p className="mt-1 text-[12.5px] text-muted">
                    Human rewrite · {pkg.deliveryHours}h delivery
                  </p>
                  <ul className="mt-4 space-y-2 text-[13px] text-ink">
                    {pkg.features.slice(1, 5).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                        <span className="min-w-0">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenOrder(pkg.id)}
                  className={[
                    'btn mt-6 w-full',
                    pkg.popular ? 'btn-primary' : 'btn-secondary',
                  ].join(' ')}
                >
                  Choose {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Myths / FAQ ---------------- */}
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">Myths</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              Three things you have been told that are not true.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              We would rather correct the industry than repeat it. Every correction links to the
              source it came from.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="btn btn-ghost mt-4 -ml-1"
            >
              All questions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {FAQ_PREVIEW.map((m) => (
              <details key={m.claim} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="text-[14px] font-medium text-ink">“{m.claim}”</span>
                  <span
                    className={[
                      'chip shrink-0',
                      m.verdict === 'false'
                        ? 'bg-danger-soft text-danger'
                        : 'bg-warning-soft text-warning',
                    ].join(' ')}
                  >
                    {m.verdict === 'false' ? 'False' : 'Misleading'}
                  </span>
                </summary>
                <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-muted">
                  {m.correction}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="border-t border-line bg-ink">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
          <div className="max-w-[520px]">
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-paper sm:text-[32px]">
              Find out what your resume actually says — in about a minute.
            </h2>
            <p className="mt-2 text-[13.5px] text-paper/70">
              Free, no account, and your file never leaves your device.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('free-resume-score')}
              className="btn bg-paper text-ink hover:bg-white"
            >
              Check my resume
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="btn border border-paper/25 text-paper hover:bg-white/10"
            >
              Browse templates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
