import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResumeData } from '../types';

interface LinkedInSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
}

export const LinkedInSyncModal: React.FC<LinkedInSyncModalProps> = ({
  isOpen,
  onClose,
  resumeData
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate LinkedIn Headline
  const headline = `${resumeData.targetTitle || 'Senior Software Engineer'} | ${
    resumeData.skills.languages ? resumeData.skills.languages.split(',').slice(0, 3).map(s => s.trim()).join(' · ') : 'Distributed Systems'
  } | ${resumeData.skills.frameworks ? resumeData.skills.frameworks.split(',').slice(0, 2).map(s => s.trim()).join(' · ') : 'Cloud Architecture'}`;

  // Generate LinkedIn About
  const about = `${resumeData.summary || ''}

📌 Core Technical Strengths:
• Languages: ${resumeData.skills.languages || 'TypeScript, Python, Go, SQL'}
• Frameworks & Web: ${resumeData.skills.frameworks || 'React, Next.js, Node.js'}
• Cloud & Infrastructure: ${resumeData.skills.toolsAndCloud || 'AWS, Docker, Kubernetes, PostgreSQL'}

🎯 Key Recent Impacts:
${resumeData.experience.slice(0, 2).map(exp => `• At ${exp.company} (${exp.role}): ${exp.bullets[0] || ''}`).join('\n')}

📫 Connect with me: ${resumeData.email || ''} | ${resumeData.portfolio || ''}`;

  // Copy helper
  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-paper rounded-xl shadow-2xl border border-line w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between bg-soft">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center font-bold text-sm">
              in
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                LinkedIn & International Job Portal Optimizer
              </h3>
              <p className="text-xs text-muted/80">
                Format your resume data for 1-click sync with LinkedIn, Wellfound, and Otta.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted/60 hover:text-muted rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Headline Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink tracking-wide uppercase">
                1. Optimized LinkedIn Headline (High Search Indexing)
              </label>
              <button
                onClick={() => handleCopy(headline, 'headline')}
                className="text-xs flex items-center gap-1 font-medium text-accent hover:text-accent bg-soft px-2.5 py-1 rounded border border-line transition-colors"
              >
                {copiedSection === 'headline' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Headline
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-soft border border-line rounded-lg text-xs font-mono text-ink leading-relaxed break-words">
              {headline}
            </div>
            <p className="text-[11px] text-muted/80">
              Recruiters search by role title and top 3 technical keywords. This format maximizes search appearances.
            </p>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-ink tracking-wide uppercase">
                2. LinkedIn "About / Summary" Section
              </label>
              <button
                onClick={() => handleCopy(about, 'about')}
                className="text-xs flex items-center gap-1 font-medium text-accent hover:text-accent bg-soft px-2.5 py-1 rounded border border-line transition-colors"
              >
                {copiedSection === 'about' ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy About Text
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-soft border border-line rounded-lg text-xs font-mono text-ink whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
              {about}
            </div>
          </div>

          {/* Experience Tips */}
          <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-950 space-y-2">
            <div className="font-semibold flex items-center gap-1.5 text-sky-900">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Easy Apply Ingestion Tip
            </div>
            <p className="text-sky-800 leading-relaxed">
              When applying with LinkedIn "Easy Apply", applicant tracking systems parse your LinkedIn profile directly. Keeping your LinkedIn experience bullets identical to your ATS Resume Lab bullets ensures 100% data consistency.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-soft flex items-center justify-between">
          <span className="text-xs text-muted/80">
            Copy text and paste directly into your LinkedIn profile editor.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ink text-white rounded-lg text-xs font-medium hover:bg-ink transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
