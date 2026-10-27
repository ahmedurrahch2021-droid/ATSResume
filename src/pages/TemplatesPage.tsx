import React, { useState } from 'react';
import { ATS_TEMPLATES } from '../data/mockData';
import { ResumeTemplate, PageRoute, ResumeData } from '../types';
import { EmailSubscriptionBox } from '../components/EmailSubscriptionBox';
import { 
  Download, 
  Eye, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  X,
  FileCode,
  Layers,
  SearchCheck,
  Printer,
  Edit3
} from 'lucide-react';

interface TemplatesPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
  onOpenInEditor?: (templateResumeData: ResumeData) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ 
  onNavigate, 
  onOpenOrder,
  onOpenInEditor 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'tech', label: 'Tech & Engineering' },
    { id: 'product', label: 'Product & Growth' },
    { id: 'finance', label: 'Finance & Operations' },
    { id: 'entry', label: 'Entry Level & Graduate' }
  ];

  const filteredTemplates = ATS_TEMPLATES.filter(
    tpl => selectedCategory === 'all' || tpl.category === selectedCategory
  );

  // Convert template to rich ResumeData for live editor
  const handleLaunchEditor = (template: ResumeTemplate) => {
    const resumePayload: ResumeData = {
      fullName: template.sampleContent.name,
      targetTitle: template.title,
      email: 'alex.candidate@email.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA (Open to Remote)',
      linkedin: 'linkedin.com/in/alex-candidate',
      portfolio: 'github.com/alex-candidate',
      summary: template.sampleContent.summary,
      experience: template.sampleContent.experience.map((exp, idx) => ({
        id: `tpl-exp-${idx}`,
        role: exp.role,
        company: exp.company,
        location: 'Remote',
        dates: exp.dates,
        bullets: exp.bullets
      })),
      education: [
        {
          id: 'tpl-edu-1',
          degree: template.sampleContent.education.split('–')[0]?.trim() || template.sampleContent.education,
          institution: template.sampleContent.education.split('–')[1]?.trim() || 'State University',
          location: 'San Francisco, CA',
          dates: '2016 – 2020',
          gpa: '3.85 / 4.0'
        }
      ],
      skills: {
        languages: template.sampleContent.skills.slice(0, 4).join(', '),
        frameworks: template.sampleContent.skills.slice(4, 7).join(', '),
        toolsAndCloud: template.sampleContent.skills.slice(7).join(', '),
        methodologies: 'Agile, Scrum, CI/CD, Microservices, Clean Architecture'
      },
      projects: [
        {
          id: 'tpl-proj-1',
          name: 'OpenSource Systems Core',
          roleOrTech: 'TypeScript, React, Docker',
          bullets: [
            'Architected open-source productivity system with 1,200+ stars on GitHub.',
            'Decreased response latency by 35% through caching optimization.'
          ]
        }
      ],
      certifications: template.sampleContent.certifications || [
        'AWS Certified Solutions Architect (2024)',
        'Certified Scrum Master (CSM)'
      ]
    };

    if (onOpenInEditor) {
      onOpenInEditor(resumePayload);
    } else {
      onNavigate('suite');
    }
  };

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

  // Direct clean printable PDF routine
  const handleDownloadPdf = (template: ResumeTemplate) => {
    // Open print window safely formatted for PDF saving
    const printWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!printWindow) {
      // Fallback: load into editor and trigger print
      handleLaunchEditor(template);
      return;
    }

    const { sampleContent } = template;
    const safeName = escapeHtml(sampleContent.name);
    const safeTitle = escapeHtml(template.title);
    const safeContact = escapeHtml(sampleContent.contact);
    const safeSummary = escapeHtml(sampleContent.summary);
    const safeSkills = escapeHtml(sampleContent.skills.join(' · '));
    const safeEducation = escapeHtml(sampleContent.education);
    const safeCerts = sampleContent.certifications
      ? escapeHtml(sampleContent.certifications.join(', '))
      : '';

    const expHtml = sampleContent.experience.map(exp => `
      <div class="entry">
        <div class="entry-header">
          <span>${escapeHtml(exp.role)}</span>
          <span>${escapeHtml(exp.dates)}</span>
        </div>
        <div class="entry-sub">${escapeHtml(exp.company)}</div>
        <ul>
          ${exp.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeName} - ATS Resume</title>
          <style>
            @page { size: letter; margin: 0.7in; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 11pt; line-height: 1.45; color: #111827; margin: 0; padding: 0.5in; }
            h1 { font-size: 18pt; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; color: #C82333; }
            .title { font-size: 11pt; font-weight: bold; color: #374151; margin-bottom: 6px; }
            .contact { font-size: 9.5pt; color: #4B5563; margin-bottom: 14px; border-bottom: 1.5px solid #111827; padding-bottom: 8px; }
            h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.5px; font-weight: bold; color: #C82333; border-bottom: 1px solid #D1D5DB; padding-bottom: 3px; margin: 14px 0 6px 0; }
            .entry { margin-bottom: 10px; page-break-inside: avoid; }
            .entry-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 10pt; }
            .entry-sub { font-style: italic; color: #4B5563; font-size: 9.5pt; margin-bottom: 4px; }
            ul { margin: 4px 0 0 18px; padding: 0; font-size: 9.5pt; color: #374151; }
            li { margin-bottom: 3px; }
          </style>
        </head>
        <body>
          <h1>${safeName}</h1>
          <div class="title">${safeTitle}</div>
          <div class="contact">${safeContact}</div>

          <h2>Professional Summary</h2>
          <p style="font-size: 9.5pt; margin: 0 0 8px 0; color: #374151;">${safeSummary}</p>

          <h2>Core Technical Skills</h2>
          <p style="font-size: 9.5pt; margin: 0 0 8px 0; color: #374151;">${safeSkills}</p>

          <h2>Professional Experience</h2>
          ${expHtml}

          <h2>Education & Credentials</h2>
          <p style="font-size: 9.5pt; margin: 0; color: #374151;">${safeEducation}</p>
          ${safeCerts ? `<p style="font-size: 9.5pt; margin-top: 4px; color: #374151;"><strong>Certifications:</strong> ${safeCerts}</p>` : ''}

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleCopyText = (template: ResumeTemplate) => {
    const { sampleContent } = template;
    const content = `${sampleContent.name.toUpperCase()}
${sampleContent.contact}

PROFESSIONAL SUMMARY
${sampleContent.summary}

CORE SKILLS
${sampleContent.skills.join(' · ')}

WORK EXPERIENCE
${sampleContent.experience
  .map(exp => `${exp.role} | ${exp.company} (${exp.dates})\n${exp.bullets.map(b => `• ${b}`).join('\n')}`)
  .join('\n\n')}

EDUCATION
${sampleContent.education}
`;
    navigator.clipboard.writeText(content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-soft min-h-screen py-12 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-soft border border-line text-xs font-bold text-accent">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            100% Free · Verified ATS Single-Column Standard
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight">
            Free ATS-Verified Resume Templates
          </h1>
          <p className="text-muted text-sm sm:text-base leading-relaxed">
            Engineered strictly for high-volume parsing systems like Workday, Greenhouse, Taleo, and Lever. No tables, no columns, no lost data. 
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-accent text-white shadow-xs'
                  : 'bg-paper text-ink/90 border border-line hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Matching Cover Letter Banner */}
        <div className="bg-paper rounded-2xl border border-line p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-soft text-accent flex items-center justify-center shrink-0 border border-red-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-ink">
                  Pair with a Matching Cover Letter
                </h3>
                <span className="text-[10px] font-bold text-accent bg-soft px-2 py-0.5 rounded border border-line uppercase">
                  New
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">
                Create a matching cover letter with the exact same fonts, margins, and letterhead styles in our live two-pane editor.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('cover-letter')}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shrink-0"
          >
            <span>Open Cover Letter Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-paper rounded-2xl border border-line p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-soft text-accent border border-line">
                    {template.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-accent bg-soft px-2 py-0.5 rounded border border-line">
                    {template.architecture || 'Single-Column Standard'}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-ink group-hover:text-accent transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-muted/80 mt-1 font-medium">
                    Recommended for: {template.recommendedFor}
                  </p>
                  {template.compatibility && (
                    <p className="text-[11px] text-muted/60 mt-0.5 font-mono">
                      Parses in: {template.compatibility}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-2 border-t border-line">
                  {template.highlightPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-line space-y-2">
                {/* Primary: Open in Live Editor */}
                <button
                  type="button"
                  onClick={() => handleLaunchEditor(template)}
                  className="w-full py-2.5 px-3 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Open in Live Editor (Free)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPdf(template)}
                    className="w-full py-2 px-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                    title="Download clean printable vector PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-line" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePreviewTemplate(template)}
                    className="w-full py-2 px-2.5 bg-paper hover:bg-soft text-ink/90 border border-line text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-muted/80" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email Subscription Banner */}
        <EmailSubscriptionBox
          variant="banner"
          title="Get the 2026 International ATS Checklist & Weekly Job Alerts"
          description="Receive our verified single-column templates, parsing guidelines, and international hiring playbooks free in your inbox."
        />

      </div>

      {/* Template Preview Modal */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-paper rounded-2xl shadow-2xl border border-line w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 px-6 border-b border-line flex items-center justify-between bg-soft">
              <div>
                <h3 className="font-heading text-sm font-bold text-ink">
                  {activePreviewTemplate.title}
                </h3>
                <span className="text-[11px] text-accent font-semibold">
                  Verified ATS Single-Column Standard Layout
                </span>
              </div>
              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-1.5 text-muted/60 hover:text-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b-2 border-stone-900 space-y-1">
                <h2 className="font-heading text-xl font-black text-accent uppercase">
                  {activePreviewTemplate.sampleContent.name}
                </h2>
                <p className="text-[11px] text-muted">
                  {activePreviewTemplate.sampleContent.contact}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[11px] uppercase text-accent border-b border-line pb-0.5">
                  Professional Summary
                </h4>
                <p className="text-[11px] text-ink/90 leading-relaxed">
                  {activePreviewTemplate.sampleContent.summary}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[11px] uppercase text-accent border-b border-line pb-0.5">
                  Core Skills
                </h4>
                <p className="text-[11px] text-ink/90">
                  {activePreviewTemplate.sampleContent.skills.join(' · ')}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[11px] uppercase text-accent border-b border-line pb-0.5">
                  Professional Experience
                </h4>
                {activePreviewTemplate.sampleContent.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-ink">
                      <span>{exp.role} | {exp.company}</span>
                      <span className="font-mono text-muted/80 font-normal">{exp.dates}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-ink/90">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-line bg-soft flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDownloadPdf(activePreviewTemplate)}
                className="px-3 py-2 bg-paper border border-line text-ink/90 font-semibold text-xs rounded-lg flex items-center gap-1.5 hover:bg-soft"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>

              <button
                type="button"
                onClick={() => {
                  handleLaunchEditor(activePreviewTemplate);
                  setActivePreviewTemplate(null);
                }}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Open in Live Editor (Free)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
