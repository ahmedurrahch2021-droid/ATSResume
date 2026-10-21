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

  // Direct clean printable PDF routine
  const handleDownloadPdf = (template: ResumeTemplate) => {
    // Open print window formatted cleanly for PDF saving
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback: load into editor and trigger print
      handleLaunchEditor(template);
      return;
    }

    const { sampleContent } = template;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${sampleContent.name} - ATS Resume</title>
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
          <h1>${sampleContent.name}</h1>
          <div class="title">${template.title}</div>
          <div class="contact">${sampleContent.contact}</div>

          <h2>Professional Summary</h2>
          <p style="font-size: 9.5pt; margin: 0 0 8px 0; color: #374151;">${sampleContent.summary}</p>

          <h2>Core Technical Skills</h2>
          <p style="font-size: 9.5pt; margin: 0 0 8px 0; color: #374151;">${sampleContent.skills.join(' · ')}</p>

          <h2>Professional Experience</h2>
          ${sampleContent.experience.map(exp => `
            <div class="entry">
              <div class="entry-header">
                <span>${exp.role}</span>
                <span>${exp.dates}</span>
              </div>
              <div class="entry-sub">${exp.company}</div>
              <ul>
                ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          `).join('')}

          <h2>Education & Credentials</h2>
          <p style="font-size: 9.5pt; margin: 0; color: #374151;">${sampleContent.education}</p>
          ${sampleContent.certifications ? `<p style="font-size: 9.5pt; margin-top: 4px; color: #374151;"><strong>Certifications:</strong> ${sampleContent.certifications.join(', ')}</p>` : ''}

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
    <div className="bg-stone-50 min-h-screen py-12 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-[#C82333]">
            <Sparkles className="w-3.5 h-3.5 text-[#C82333]" />
            100% Free · Verified ATS Single-Column Standard
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
            Free ATS-Verified Resume Templates
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
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
                  ? 'bg-[#C82333] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#C82333] border border-red-200">
                    {template.categoryLabel}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {template.atsScore}% ATS Pass
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-stone-900 group-hover:text-[#C82333] transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    Recommended for: {template.recommendedFor}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  {template.highlightPoints.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                      <Check className="w-3.5 h-3.5 text-[#C82333] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-stone-100 space-y-2">
                {/* Primary: Open in Live Editor */}
                <button
                  type="button"
                  onClick={() => handleLaunchEditor(template)}
                  className="w-full py-2.5 px-3 bg-[#C82333] hover:bg-[#A71D2A] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98]"
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
                    <Printer className="w-3.5 h-3.5 text-stone-300" />
                    <span>Print PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePreviewTemplate(template)}
                    className="w-full py-2 px-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
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
          description="Join 28,000+ engineers, product managers, and remote professionals receiving our verified ATS templates and international hiring playbooks free."
        />

      </div>

      {/* Template Preview Modal */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 px-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-heading text-sm font-bold text-stone-900">
                  {activePreviewTemplate.title}
                </h3>
                <span className="text-[11px] text-[#C82333] font-semibold">
                  Verified ATS Single-Column Layout ({activePreviewTemplate.atsScore}% Pass Rate)
                </span>
              </div>
              <button
                onClick={() => setActivePreviewTemplate(null)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b-2 border-stone-900 space-y-1">
                <h2 className="font-heading text-xl font-black text-[#C82333] uppercase">
                  {activePreviewTemplate.sampleContent.name}
                </h2>
                <p className="text-[11px] text-stone-600">
                  {activePreviewTemplate.sampleContent.contact}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[11px] uppercase text-[#C82333] border-b border-stone-200 pb-0.5">
                  Professional Summary
                </h4>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {activePreviewTemplate.sampleContent.summary}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-[11px] uppercase text-[#C82333] border-b border-stone-200 pb-0.5">
                  Core Skills
                </h4>
                <p className="text-[11px] text-stone-700">
                  {activePreviewTemplate.sampleContent.skills.join(' · ')}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-[11px] uppercase text-[#C82333] border-b border-stone-200 pb-0.5">
                  Professional Experience
                </h4>
                {activePreviewTemplate.sampleContent.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{exp.role} | {exp.company}</span>
                      <span className="font-mono text-stone-500 font-normal">{exp.dates}</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-stone-700">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 px-6 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDownloadPdf(activePreviewTemplate)}
                className="px-3 py-2 bg-white border border-stone-200 text-stone-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 hover:bg-stone-100"
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
                className="px-4 py-2 bg-[#C82333] hover:bg-[#A71D2A] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
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
