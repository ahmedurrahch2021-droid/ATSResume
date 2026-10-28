import React from 'react';
import { Link } from 'react-router';
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
import { DELIVERY_POLICY, REPLY_POLICY } from '../data/servicePolicy';
import { formatPackagePrice } from '../utils/servicePricing';
import { EVIDENCE, MYTHS } from '../data/evidence';
import { CountryGuideCards } from '../components/resume/CountryGuideCards';
import { ResearchCarousel } from '../components/home/ResearchCarousel';
import { FeedbackSection } from '../components/home/FeedbackSection';
import { ROUTE_PATHS } from '../routes';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  onOpenChecklist: () => void;
}

/* ------------------------------------------------------------------ */
/* Paper preview: a document, not a web page                           */
/* ------------------------------------------------------------------ */

const ResumePaperExample: React.FC = () => (
  <div className="relative mx-auto max-w-[440px] pb-8">
    <figure className="rounded-sheet border border-line bg-soft p-5">
      <figcaption className="mb-3 text-xs text-muted">Our actual layout · fictional example</figcaption>
      <img src="/images/templates/modern.png" width={794} height={1123} fetchPriority="high" alt="Modern Professional resume layout showing fictional software engineering experience" className="mx-auto w-full max-w-[340px] border border-line bg-surface shadow-card" />
    </figure>

    <div className="absolute bottom-0 left-0 w-[248px] max-w-full rounded-card border border-line bg-surface p-3 shadow-lift">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
          Inspect, then apply
        </span>
        <span className="rounded-[4px] bg-accent-soft px-1.5 py-0.5 text-[9px] font-medium text-accent">
          no score
        </span>
      </div>
      <ul className="space-y-1.5">
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
           Single-column body text
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <Check className="h-3 w-3 shrink-0 text-success" aria-hidden="true" />
           Contact details in the body
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <AlertCircle className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
           Recheck the downloaded file
        </li>
        <li className="flex items-center gap-1.5 text-[10.5px] text-ink">
          <AlertCircle className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
          US / UK preset omits photo
        </li>
      </ul>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */

const TRUTHS = [
  {
    stat: '43%',
    label: 'reported in a vendor parsing estimate',
    detail:
      'A directional reason to inspect extracted text, not a measured error rate for this product or every ATS.',
    ref: 'EV-PARSE-ERRORS',
  },
  {
    stat: 'Settings',
    label: 'matter for employer screening',
    detail:
      'Some vendors document configurable rejection through screening answers. This tool cannot see an employer’s settings.',
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
    body: 'Your own fields in an A4 document, with explicit layout and region controls.',
    route: 'suite' as PageRoute,
  },
  {
    n: '02',
    title: 'Paste the job',
    body: 'Compare frequent terms from the actual posting with your draft.',
    route: 'free-resume-score' as PageRoute,
  },
  {
    n: '03',
    title: 'Review and edit',
    body: 'Parse, format and content prompts link to sections you can correct.',
    route: 'free-resume-score' as PageRoute,
  },
  {
    n: '04',
    title: 'Export and apply',
    body: 'Follow the employer’s file instructions, export the draft and write a cover letter.',
    route: 'cover-letter' as PageRoute,
  },
];

const PILLARS = [
  {
    icon: FileText,
    title: 'Build',
    body: 'Live editor, four profession starters, multi-page A4, DOCX and PDF printing.',
    route: 'suite' as PageRoute,
    meta: 'Free',
  },
  {
    icon: ScanSearch,
    title: 'Check',
    body: 'The text and fields our reader extracts, with explained review prompts.',
    route: 'free-resume-score' as PageRoute,
    meta: 'Free · no signup',
  },
  {
    icon: Target,
    title: 'Tailor',
    body: 'Job-posting vocabulary coverage with the comparison method disclosed.',
    route: 'free-resume-score' as PageRoute,
    meta: 'Free',
  },
  {
    icon: Mail,
    title: 'Apply',
    body: 'A letter editor that can copy contact details from your resume draft.',
    route: 'cover-letter' as PageRoute,
    meta: 'Free core',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    body: 'Fictional role examples, application considerations and method explanations.',
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

const FAQ_PREVIEW = [
  MYTHS[0],
  MYTHS[1],
  MYTHS[3],
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenOrder, onOpenChecklist }) => {
  const previewTemplates = ['modern', 'classic', 'graduate'].map((id) => ATS_TEMPLATES.find((template) => template.layout === id)!);
  const reviewPackages = PACKAGES.slice(0, 3);

  return (
    <div className="bg-paper">
      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-line">
        <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">Resume · Cover letter · ATS check</p>
            <h1 className="mt-4 text-[38px] font-semibold leading-[1.12] tracking-[-0.025em] text-ink sm:text-[46px] lg:text-[56px]">
              See what our reader extracts. Make your resume clearer.
            </h1>
            <p className="lede mt-5">
              Inspect the text and fields we can read from your file, review specific findings,
              then edit the same draft before you apply. Other parsers can read a file differently.
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
                Local file checking
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                No signup to check
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Multi-page A4 documents
              </li>
            </ul>
          </div>

          <div className="lg:pl-6">
             <ResumePaperExample />
          </div>
        </div>
      </section>

      <ResearchCarousel />

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
                <span className="font-heading text-[13px] font-semibold tracking-[0.1em] text-accent">
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
                 Four original layouts, informed by career-service guidance. These previews come
                 from the actual print renderer—not a decorative mockup. Your existing facts stay intact when you choose a layout.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="btn btn-secondary"
            >
               All {ATS_TEMPLATES.length} layouts
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {previewTemplates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onNavigate('templates')}
                className="card card-hover overflow-hidden text-left"
              >
                 <div className="border-b border-line bg-soft p-6">
                   <img src={tpl.previewImage} width={794} height={1123} loading="lazy" decoding="async" alt={`First page of ${tpl.title} with fictional career details`} className="mx-auto w-full max-w-[218px] border border-line bg-surface shadow-card" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <span className="chip chip-active">
                       Free layout
                    </span>
                     <span className="text-[11.5px] text-muted">Fictional preview</span>
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
         <div className="container-page space-y-8">
           <div className="max-w-3xl">
            <p className="eyebrow">International application considerations</p>
            <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
              A resume is not the same document everywhere.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">
              Follow the actual employer or application form rather than a blanket country rule.
               Each country card links a suggested structure, photo guidance and sources in a new tab.
               Some local evidence is limited; we say where. These are application guides, not twelve automatic country formats.
            </p>
             <Link to={ROUTE_PATHS['country-guides']} className="btn btn-secondary mt-5">
               Country & layout guides
               <ArrowRight className="h-4 w-4" aria-hidden="true" />
             </Link>
          </div>

           <CountryGuideCards />
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
              {[EVIDENCE[0], EVIDENCE[2], EVIDENCE[7], EVIDENCE[8]].map((item) => (
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
              nothing. Human review and rewriting are paid services in Bangladesh and other
              countries — once, with no subscription.
            </p>
            <p className="mt-3 text-sm text-muted">{REPLY_POLICY} {DELIVERY_POLICY}</p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            <div className="card flex flex-col justify-between p-6">
              <div>
                <span className="chip chip-active">Free core</span>
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
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="min-w-0 text-[13px] font-medium text-muted">{pkg.name}</span>
                    {pkg.badge && <span className="chip chip-active">{pkg.badge}</span>}
                  </div>
                  <dl className="mt-4 space-y-2"><div><dt className="text-xs text-muted">Bangladesh · BDT</dt><dd className="font-heading text-[26px] font-semibold text-ink">{formatPackagePrice(pkg, 'bangladesh')}</dd></div><div><dt className="text-xs text-muted">International · USD</dt><dd className="font-heading text-[22px] font-semibold text-ink">{formatPackagePrice(pkg, 'international')}</dd></div></dl>
                  <p className="mt-1 text-[12.5px] text-muted">
                    One-time · delivery agreed before payment
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
                  Inquire about {pkg.name}
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
              We distinguish product review prompts from research claims. The method page explains
              the limits and research identifiers.
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

      <FeedbackSection />

      {/* ---------------- Final CTA ---------------- */}
      <section className="border-t border-line bg-ink">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
          <div className="max-w-[520px]">
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-paper sm:text-[32px]">
              Inspect your resume before you send it.
            </h2>
            <p className="mt-2 text-[13.5px] text-paper/70">
              Free local file checking, with no account required. Optional online coaching shares only the context you choose to send.
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
