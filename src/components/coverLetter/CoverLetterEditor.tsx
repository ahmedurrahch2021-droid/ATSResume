import React, { useState } from 'react';
import { 
  CoverLetterData, 
  CoverLetterTemplateStyle, 
  CoverLetterFontFamily 
} from '../../types/coverLetter';
import { COVER_LETTER_PRESETS } from '../../data/coverLetterPresets';
import { 
  User, 
  Building2, 
  Sparkles, 
  FileText, 
  Award, 
  Send, 
  Palette, 
  ChevronDown, 
  Plus, 
  Trash2, 
  RefreshCw,
  FolderSync,
  HelpCircle
} from 'lucide-react';

interface CoverLetterEditorProps {
  data: CoverLetterData;
  onChange: (updated: CoverLetterData) => void;
  onApplyPreset: (presetId: string) => void;
  onSyncFromResume: () => void;
  hasResumeData: boolean;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  data,
  onChange,
  onApplyPreset,
  onSyncFromResume,
  hasResumeData,
}) => {
  // Collapsible cards state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    sender: true,
    recipient: true,
    opening: true,
    body: true,
    highlights: true,
    closing: false,
    styling: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSenderChange = (field: keyof CoverLetterData['sender'], value: string) => {
    onChange({
      ...data,
      sender: {
        ...data.sender,
        [field]: value,
      },
    });
  };

  const handleRecipientChange = (field: keyof CoverLetterData['recipient'], value: string) => {
    onChange({
      ...data,
      recipient: {
        ...data.recipient,
        [field]: value,
      },
    });
  };

  const handleParagraphChange = (index: number, value: string) => {
    const updated = [...data.bodyParagraphs];
    updated[index] = value;
    onChange({ ...data, bodyParagraphs: updated });
  };

  const addParagraph = () => {
    onChange({
      ...data,
      bodyParagraphs: [...data.bodyParagraphs, ''],
    });
  };

  const removeParagraph = (index: number) => {
    const updated = data.bodyParagraphs.filter((_, i) => i !== index);
    onChange({ ...data, bodyParagraphs: updated });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const updated = [...data.keyHighlights];
    updated[index] = value;
    onChange({ ...data, keyHighlights: updated });
  };

  const addHighlight = () => {
    onChange({
      ...data,
      keyHighlights: [...data.keyHighlights, ''],
    });
  };

  const removeHighlight = (index: number) => {
    const updated = data.keyHighlights.filter((_, i) => i !== index);
    onChange({ ...data, keyHighlights: updated });
  };

  const ACCENT_COLORS = [
    { label: 'Brand Carmine Red', hex: '#C82333' },
    { label: 'Executive Navy', hex: '#1E3A8A' },
    { label: 'Forest Emerald', hex: '#047857' },
    { label: 'Slate Charcoal', hex: '#334155' },
    { label: 'Royal Burgundy', hex: '#831843' },
    { label: 'Midnight Obsidian', hex: '#0F172A' },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Presets & Resume Sync Header */}
      <div className="bg-paper rounded-xl border border-line p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              Quick Starters & Presets
            </h3>
          </div>

          {hasResumeData && (
            <button
              type="button"
              onClick={onSyncFromResume}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-accent bg-soft hover:bg-red-100/80 rounded-md border border-line transition-colors"
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span>Import from Active Resume</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {COVER_LETTER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset.id)}
              className="p-2 text-left rounded-lg border border-line hover:border-line hover:bg-soft transition-all text-xs group"
            >
              <div className="font-semibold text-ink truncate group-hover:text-accent">
                {preset.name}
              </div>
              <div className="text-[10px] text-muted/80 truncate">
                {preset.targetCompany} · {preset.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modular Section 1: Sender Contact Information */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sender')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-soft text-accent flex items-center justify-center font-bold text-xs">
              <User className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                1. Your Personal Information
              </h4>
              <p className="text-[11px] text-muted/80">
                Full name, target title, email, phone and location
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.sender ? 'rotate-180' : ''}`} />
        </button>

        {openSections.sender && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.sender.fullName}
                  onChange={(e) => handleSenderChange('fullName', e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Professional Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.sender.jobTitle}
                  onChange={(e) => handleSenderChange('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={data.sender.email}
                  onChange={(e) => handleSenderChange('email', e.target.value)}
                  placeholder="alex.vance@gmail.com"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={data.sender.phone}
                  onChange={(e) => handleSenderChange('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Location (City, Country/State)
                </label>
                <input
                  type="text"
                  value={data.sender.location}
                  onChange={(e) => handleSenderChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Portfolio / GitHub Link
                </label>
                <input
                  type="text"
                  value={data.sender.portfolioUrl || ''}
                  onChange={(e) => handleSenderChange('portfolioUrl', e.target.value)}
                  placeholder="alexvance.dev"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={data.sender.linkedInUrl || ''}
                  onChange={(e) => handleSenderChange('linkedInUrl', e.target.value)}
                  placeholder="linkedin.com/in/alexvance"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modular Section 2: Recipient Details */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('recipient')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-accent-soft text-accent flex items-center justify-center font-bold text-xs">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                2. Employer & Recipient Details
              </h4>
              <p className="text-[11px] text-muted/80">
                Company name, hiring manager, department, and application date
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.recipient ? 'rotate-180' : ''}`} />
        </button>

        {openSections.recipient && (
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Hiring Manager / Team <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.recipient.hiringManagerName}
                  onChange={(e) => handleRecipientChange('hiringManagerName', e.target.value)}
                  placeholder="e.g. Jane Smith or Hiring Team"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Target Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.recipient.companyName}
                  onChange={(e) => handleRecipientChange('companyName', e.target.value)}
                  placeholder="e.g. Stripe, Inc."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Department / Group
                </label>
                <input
                  type="text"
                  value={data.recipient.department || ''}
                  onChange={(e) => handleRecipientChange('department', e.target.value)}
                  placeholder="Core Infrastructure Team"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Company Location / Address
                </label>
                <input
                  type="text"
                  value={data.recipient.companyAddress || ''}
                  onChange={(e) => handleRecipientChange('companyAddress', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Letter Date
                </label>
                <input
                  type="text"
                  value={data.date}
                  onChange={(e) => onChange({ ...data, date: e.target.value })}
                  placeholder="e.g. October 24, 2026"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>
            </div>

            {/* Salutation Helper */}
            <div>
              <label className="block text-xs font-medium text-ink/90 mb-1">
                Formal Salutation
              </label>
              <input
                type="text"
                value={data.salutation}
                onChange={(e) => onChange({ ...data, salutation: e.target.value })}
                placeholder="Dear Ms. Smith and the Hiring Team,"
                className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
              />
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  `Dear ${data.recipient.hiringManagerName || 'Hiring Manager'},`,
                  `Dear ${data.recipient.companyName ? `${data.recipient.companyName} Team` : 'Hiring Team'},`,
                  `To the ${data.recipient.department || 'Engineering Team'},`
                ].map((quick, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange({ ...data, salutation: quick })}
                    className="text-[10px] text-muted bg-soft hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modular Section 3: The Opening Hook */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('opening')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-soft text-accent flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                3. Opening Hook & Intent
              </h4>
              <p className="text-[11px] text-muted/80">
                Specify role, excitement for company, and candidate summary
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.opening ? 'rotate-180' : ''}`} />
        </button>

        {openSections.opening && (
          <div className="p-4 space-y-2">
            <textarea
              rows={3}
              value={data.opening}
              onChange={(e) => onChange({ ...data, opening: e.target.value })}
              placeholder="State the role you are applying for, your background, and why this company's mission inspires you..."
              className="w-full text-xs p-3 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333] leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-muted/80">
              <span>Tip: Avoid generic phrases like "I found this job on LinkedIn". Lead with specific mission alignment.</span>
              <span>{data.opening.length} chars</span>
            </div>
          </div>
        )}
      </div>

      {/* Modular Section 4: Narrative Body Paragraphs */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('body')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-warning-soft text-warning flex items-center justify-center font-bold text-xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                4. Core Evidence & Value Story
              </h4>
              <p className="text-[11px] text-muted/80">
                Detailed paragraphs connecting your past track record to their job requirements
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.body ? 'rotate-180' : ''}`} />
        </button>

        {openSections.body && (
          <div className="p-4 space-y-3">
            {data.bodyParagraphs.map((paragraph, index) => (
              <div key={index} className="space-y-1 relative">
                <div className="flex items-center justify-between text-xs text-muted mb-1">
                  <span className="font-medium">Paragraph {index + 1}</span>
                  {data.bodyParagraphs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      className="text-muted/60 hover:text-danger transition-colors p-1"
                      title="Remove paragraph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  placeholder={`Describe your technical or organizational achievements relevant to the ${data.recipient.companyName || 'target'} role...`}
                  className="w-full text-xs p-3 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333] leading-relaxed"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1.5 text-xs text-ink/90 hover:text-accent font-medium py-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Paragraph</span>
            </button>
          </div>
        )}
      </div>

      {/* Modular Section 5: Key Highlights & Metrics */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('highlights')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                5. Scannable Metric Highlights (Optional)
              </h4>
              <p className="text-[11px] text-muted/80">
                Enhancv-style bullet points highlighting quantifiable wins
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.highlights ? 'rotate-180' : ''}`} />
        </button>

        {openSections.highlights && (
          <div className="p-4 space-y-2.5">
            <p className="text-xs text-muted/80 leading-relaxed">
              Recruiters spend 7 seconds scanning cover letters. Adding 2–3 quantified bullet points dramatically boosts interview callbacks.
            </p>

            {data.keyHighlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted/60 text-xs font-bold shrink-0">•</span>
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  placeholder="e.g. Scaled API throughput to $14M+ daily volume with sub-50ms latency..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="text-muted/60 hover:text-danger transition-colors p-1 shrink-0"
                  title="Remove highlight"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addHighlight}
              className="inline-flex items-center gap-1.5 text-xs text-ink/90 hover:text-accent font-medium py-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Metric Highlight</span>
            </button>
          </div>
        )}
      </div>

      {/* Modular Section 6: Closing & Call-to-Action */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('closing')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-stone-100 text-ink/90 flex items-center justify-center font-bold text-xs">
              <Send className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                6. Closing Paragraph & Sign-off
              </h4>
              <p className="text-[11px] text-muted/80">
                Polite interview invitation and formal signature
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.closing ? 'rotate-180' : ''}`} />
        </button>

        {openSections.closing && (
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-ink/90 mb-1">
                Closing Paragraph
              </label>
              <textarea
                rows={2}
                value={data.closing}
                onChange={(e) => onChange({ ...data, closing: e.target.value })}
                placeholder="State your gratitude, excitement to discuss next steps, and contact preference..."
                className="w-full text-xs p-3 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333] leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Sign-off Phrase
                </label>
                <input
                  type="text"
                  value={data.signOff}
                  onChange={(e) => onChange({ ...data, signOff: e.target.value })}
                  placeholder="e.g. Sincerely, or Respectfully,"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line focus:outline-none focus:ring-1 focus:ring-[#C82333]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Printed Signature Name
                </label>
                <input
                  type="text"
                  value={data.sender.fullName}
                  disabled
                  className="w-full text-xs px-3 py-2 rounded-lg border border-line bg-soft text-muted/80 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modular Section 7: Design, Typography & Accent Color */}
      <div className="bg-paper rounded-xl border border-line shadow-2xs overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('styling')}
          className="w-full px-4 py-3 bg-soft/60 hover:bg-soft border-b border-line/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-soft text-accent flex items-center justify-center font-bold text-xs">
              <Palette className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wide">
                7. Layout, Font & Accent Color
              </h4>
              <p className="text-[11px] text-muted/80">
                Choose template architecture, typography, and letterhead accents
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-muted/60 transition-transform ${openSections.styling ? 'rotate-180' : ''}`} />
        </button>

        {openSections.styling && (
          <div className="p-4 space-y-4">
            {/* Template Style Selector */}
            <div>
              <label className="block text-xs font-medium text-ink/90 mb-2">
                Letterhead Structure
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'modern', label: 'Modern Accent', desc: 'Bold color rule & clean contact' },
                  { id: 'classic', label: 'Classic Center', desc: 'Formal centered letterhead' },
                  { id: 'executive', label: 'Executive Bar', desc: 'Thick left brand bar' },
                  { id: 'minimal', label: 'Minimalist', desc: 'Single-line compact rule' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => onChange({ ...data, templateStyle: style.id as CoverLetterTemplateStyle })}
                    className={`p-2 text-left rounded-lg border transition-all text-xs ${
                      data.templateStyle === style.id
                        ? 'border-[#C82333] bg-soft/40 text-ink font-semibold shadow-2xs'
                        : 'border-line hover:border-line text-muted'
                    }`}
                  >
                    <div>{style.label}</div>
                    <div className="text-[10px] text-muted/60 mt-0.5">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div>
              <label className="block text-xs font-medium text-ink/90 mb-2">
                Accent Theme Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onChange({ ...data, accentColor: c.hex })}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                      data.accentColor === c.hex
                        ? 'border-slate-900 bg-ink text-white font-medium shadow-2xs'
                        : 'border-line hover:border-line text-ink/90 bg-paper'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography & Spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Typography Pairing
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'sans', label: 'Sans-Serif', family: 'Inter' },
                    { id: 'serif', label: 'Editorial Serif', family: 'Georgia' },
                    { id: 'mono', label: 'Technical Mono', family: 'Courier' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => onChange({ ...data, fontFamily: font.id as CoverLetterFontFamily })}
                      className={`px-2 py-1.5 text-center rounded border text-xs transition-all ${
                        data.fontFamily === font.id
                          ? 'border-[#C82333] bg-soft text-accent font-bold'
                          : 'border-line text-muted hover:bg-soft'
                      }`}
                    >
                      <div className="text-xs">{font.label}</div>
                      <div className="text-[10px] text-muted/60">{font.family}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/90 mb-1">
                  Line Density & Size
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'compact', label: 'Compact' },
                    { id: 'standard', label: 'Standard' },
                    { id: 'spacious', label: 'Spacious' },
                  ].map((density) => (
                    <button
                      key={density.id}
                      type="button"
                      onClick={() => onChange({ ...data, fontSize: density.id as CoverLetterData['fontSize'] })}
                      className={`px-2 py-2 text-center rounded border text-xs transition-all ${
                        data.fontSize === density.id
                          ? 'border-[#C82333] bg-soft text-accent font-bold'
                          : 'border-line text-muted hover:bg-soft'
                      }`}
                    >
                      {density.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
