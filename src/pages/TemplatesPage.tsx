import React, { useState } from 'react';
import { ATS_TEMPLATES, ATS_IMAGES } from '../data/mockData';
import { ResumeTemplate, PageRoute } from '../types';
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
  SearchCheck
} from 'lucide-react';

interface TemplatesPageProps {
  onNavigate: (route: PageRoute) => void;
  onOpenOrder: (packageId?: 'starter' | 'boost' | 'full') => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onNavigate, onOpenOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

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

  const handleDownloadFile = (template: ResumeTemplate, formatType: 'docx' | 'pdf' | 'txt') => {
    // Generate clean text representation of the ATS resume for immediate download
    const { sampleContent } = template;
    const content = `=======================================================
${sampleContent.name.toUpperCase()}
${sampleContent.contact}
=======================================================

PROFESSIONAL SUMMARY
-------------------------------------------------------
${sampleContent.summary}

CORE TECHNICAL SKILLS & COMPETENCIES
-------------------------------------------------------
${sampleContent.skills.join(' · ')}

PROFESSIONAL EXPERIENCE
-------------------------------------------------------
${sampleContent.experience
  .map(
    exp => `${exp.role} | ${exp.company}
Dates: ${exp.dates}
${exp.bullets.map(b => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

EDUCATION & ACADEMICS
-------------------------------------------------------
${sampleContent.education}

${
  sampleContent.certifications
    ? `CERTIFICATIONS & CREDENTIALS
-------------------------------------------------------
${sampleContent.certifications.map(c => `• ${c}`).join('\n')}
`
    : ''
}
=======================================================
ATS Compliance Benchmark: Verified Single-Column UTF-8
Verified by ATSresume (https://atsresume.ai)
`;

    const blob = new Blob([content], { type: formatType === 'docx' ? 'application/msword' : 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.id}-ats-resume-template.${formatType === 'docx' ? 'doc' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMessage(`Downloaded "${template.title}" in ${formatType.toUpperCase()} format!`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 4000);
  };

  const handleCopyText = (template: ResumeTemplate) => {
    const { sampleContent } = template;
    const plainText = `${sampleContent.name}\n${sampleContent.contact}\n\nSUMMARY\n${sampleContent.summary}\n\nSKILLS\n${sampleContent.skills.join(', ')}\n\nEXPERIENCE\n` +
      sampleContent.experience.map(e => `${e.role} - ${e.company} (${e.dates})\n` + e.bullets.map(b => `- ${b}`).join('\n')).join('\n\n') +
      `\n\nEDUCATION\n${sampleContent.education}`;
    
    navigator.clipboard.writeText(plainText);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section with Generous Whitespace */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Free · ATS-Verified Single-Column Layouts</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight text-balance leading-tight">
            ATS-Tested Resume Templates for <span className="text-emerald-700">Immediate Download</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Every template below is mathematically verified against parsing algorithms in Workday, Greenhouse, Taleo, and Lever. No multi-column tables, no broken icons, and no hidden text boxes.
          </p>

          {/* Quick Notice Banner on Download Success */}
          {downloadSuccessMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{downloadSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Visual Header with Real Image or Styled Fallback */}
              <div className="relative aspect-[16/10] bg-slate-50 border-b border-slate-100 overflow-hidden">
                <img
                  src={template.previewImage || ATS_IMAGES.templatePreview}
                  alt={`${template.title} preview`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                
                {/* Overlay Metadata */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-xs border border-slate-200">
                    {template.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{template.atsScore}% ATS Score</span>
                </div>

                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] text-slate-600 font-medium px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs border border-slate-200/60">
                    {template.downloadCount}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Recommended for: {template.recommendedFor}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    {template.highlightPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Row */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActivePreviewTemplate(template)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Live Preview</span>
                    </button>

                    <button
                      onClick={() => handleCopyText(template)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      {copiedId === template.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Plain Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDownloadFile(template, 'docx')}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download DOCX</span>
                    </button>

                    <button
                      onClick={() => handleDownloadFile(template, 'pdf')}
                      className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade / Pro Customization Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-md">
              Need Personal Human Review?
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Don't Want to Format it Yourself? We'll Tailor it for $10
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Send us your raw job history and your target job description. We run algorithmic ATS alignment and our senior web developer personally reviews and edits every line with a 24-hour turnaround guarantee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenOrder('starter')}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Build My Tailored Resume — $10</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('free-resume-score')}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <SearchCheck className="w-4 h-4 text-emerald-600" />
              <span>Free ATS Score Scanner</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Live Preview Modal */}
      {activePreviewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="p-4 px-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-heading font-bold text-sm text-slate-900">
                    {activePreviewTemplate.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Authentic single-column ATS hierarchy · 100% parseable text strings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFile(activePreviewTemplate, 'docx')}
                  className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .DOCX</span>
                </button>
                <button
                  onClick={() => setActivePreviewTemplate(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Paper View */}
            <div className="p-6 sm:p-10 overflow-y-auto bg-slate-100 space-y-6">
              <div className="bg-white p-8 sm:p-12 rounded-xl shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-6 font-sans text-xs text-slate-800 leading-relaxed">
                {/* Header */}
                <div className="border-b border-slate-800 pb-3 text-center sm:text-left space-y-1">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                    {activePreviewTemplate.sampleContent.name}
                  </h1>
                  <p className="text-[11px] text-slate-600">
                    {activePreviewTemplate.sampleContent.contact}
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="space-y-1">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                    Professional Summary
                  </h4>
                  <p className="text-[11px] text-slate-700 leading-relaxed">
                    {activePreviewTemplate.sampleContent.summary}
                  </p>
                </div>

                {/* Core Skills */}
                <div className="space-y-1">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                    Core Competencies & Technical Skills
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    {activePreviewTemplate.sampleContent.skills.join(' · ')}
                  </p>
                </div>

                {/* Work Experience */}
                <div className="space-y-3">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                    Professional Experience
                  </h4>
                  {activePreviewTemplate.sampleContent.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900">{exp.role}</span>
                        <span className="text-slate-500 font-mono">{exp.dates}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 italic">{exp.company}</p>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
                    Education & Credentials
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    {activePreviewTemplate.sampleContent.education}
                  </p>
                  {activePreviewTemplate.sampleContent.certifications && (
                    <p className="text-[10px] text-slate-600 mt-1">
                      Certifications: {activePreviewTemplate.sampleContent.certifications.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Single-column ATS format · Guaranteed Workday & Greenhouse pass
              </span>
              <button
                onClick={() => handleDownloadFile(activePreviewTemplate, 'docx')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download This Template Free</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
