import React from 'react';
import { CoverLetterData } from '../../types/coverLetter';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  scale?: number;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  data,
  scale = 1,
}) => {
  const accent = data.accentColor || '#C82333';

  const fontClass = data.fontFamily === 'serif' 
    ? 'font-serif' 
    : data.fontFamily === 'mono'
    ? 'font-mono'
    : 'font-sans';

  const sizeClass = data.fontSize === 'compact'
    ? 'text-[12px] leading-relaxed'
    : data.fontSize === 'spacious'
    ? 'text-[14px] leading-loose'
    : 'text-[13px] leading-normal';

  return (
    <div className="flex justify-center w-full">
      <div 
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150"
      >
        <div 
          className={`w-[210mm] min-h-[297mm] bg-paper text-ink shadow-xl border border-line/90 p-[20mm] flex flex-col justify-between ${fontClass} ${sizeClass}`}
          id="cover-letter-preview-sheet"
        >
          <div>
            {/* Header Layout based on Template Style */}
            {data.templateStyle === 'modern' && (
              <header className="border-b-2 pb-5 mb-7" style={{ borderColor: accent }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-ink">
                      {data.sender.fullName || 'Your Full Name'}
                    </h1>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: accent }}>
                      {data.sender.jobTitle || 'Target Professional Role'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted">
                  {data.sender.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-muted/60" />
                      {data.sender.email}
                    </span>
                  )}
                  {data.sender.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted/60" />
                      {data.sender.phone}
                    </span>
                  )}
                  {data.sender.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted/60" />
                      {data.sender.location}
                    </span>
                  )}
                  {data.sender.portfolioUrl && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-muted/60" />
                      {data.sender.portfolioUrl}
                    </span>
                  )}
                  {data.sender.linkedInUrl && (
                    <span className="flex items-center gap-1">
                      <Linkedin className="w-3 h-3 text-muted/60" />
                      {data.sender.linkedInUrl}
                    </span>
                  )}
                </div>
              </header>
            )}

            {data.templateStyle === 'classic' && (
              <header className="text-center border-b pb-6 mb-7 border-line">
                <h1 className="text-2xl font-bold tracking-tight text-ink font-serif">
                  {data.sender.fullName || 'Your Full Name'}
                </h1>
                <p className="text-xs uppercase tracking-widest font-semibold mt-1 text-muted/80">
                  {data.sender.jobTitle || 'Target Professional Role'}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-muted">
                  <span>{data.sender.email}</span>
                  <span>·</span>
                  <span>{data.sender.phone}</span>
                  <span>·</span>
                  <span>{data.sender.location}</span>
                </div>
              </header>
            )}

            {data.templateStyle === 'executive' && (
              <header className="mb-8">
                <div className="flex items-start justify-between border-l-4 pl-4 py-1" style={{ borderColor: accent }}>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink">
                      {data.sender.fullName || 'Your Full Name'}
                    </h1>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted/80 mt-0.5">
                      {data.sender.jobTitle || 'Target Professional Role'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted space-y-0.5">
                    <div>{data.sender.email}</div>
                    <div>{data.sender.phone}</div>
                    <div>{data.sender.location}</div>
                  </div>
                </div>
              </header>
            )}

            {data.templateStyle === 'minimal' && (
              <header className="mb-7 pb-4 border-b border-slate-150">
                <div className="flex justify-between items-baseline">
                  <h1 className="text-xl font-bold text-ink">
                    {data.sender.fullName || 'Your Full Name'}
                  </h1>
                  <span className="text-xs text-muted/80">
                    {data.sender.location}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-muted mt-1">
                  <span>{data.sender.email}</span>
                  <span>·</span>
                  <span>{data.sender.phone}</span>
                  {data.sender.portfolioUrl && (
                    <>
                      <span>·</span>
                      <span>{data.sender.portfolioUrl}</span>
                    </>
                  )}
                </div>
              </header>
            )}

            {/* Recipient Details & Date */}
            <div className="text-xs text-muted space-y-1 mb-6">
              <div className="text-muted/80 font-medium">{data.date}</div>
              <div className="pt-2 text-ink font-bold">{data.recipient.hiringManagerName}</div>
              {data.recipient.department && <div>{data.recipient.department}</div>}
              <div className="font-semibold text-ink">{data.recipient.companyName}</div>
              {data.recipient.companyAddress && <div>{data.recipient.companyAddress}</div>}
            </div>

            {/* Salutation */}
            <div className="font-semibold text-ink mb-4">
              {data.salutation}
            </div>

            {/* Opening Paragraph */}
            <div className="mb-4 text-justify text-ink leading-relaxed">
              {data.opening}
            </div>

            {/* Body Paragraphs */}
            {data.bodyParagraphs.map((para, idx) => (
              para.trim().length > 0 && (
                <div key={idx} className="mb-4 text-justify text-ink leading-relaxed">
                  {para}
                </div>
              )
            ))}

            {/* Key Highlights / Bullets */}
            {data.keyHighlights && data.keyHighlights.length > 0 && (
              <div className="my-5 pl-2">
                <ul className="space-y-2 text-ink list-disc list-outside pl-4">
                  {data.keyHighlights.map((highlight, idx) => (
                    highlight.trim().length > 0 && (
                      <li key={idx} className="pl-1 leading-relaxed">
                        {highlight}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )}

            {/* Closing Paragraph */}
            <div className="mb-6 text-justify text-ink leading-relaxed">
              {data.closing}
            </div>

            {/* Sign-off & Name */}
            <div className="space-y-6 pt-2">
              <div className="text-ink">{data.signOff}</div>
              <div>
                <div className="font-bold text-ink">{data.sender.fullName}</div>
                <div className="text-xs text-muted/80">{data.sender.jobTitle}</div>
              </div>
            </div>
          </div>

          {/* Footer watermark/trust indicator */}
          <div className="border-t border-line pt-3 mt-8 flex justify-between items-center text-[10px] text-muted/60">
            <span>Standard ATS-Compliant Layout</span>
            <span>Created with ATS Resume Lab</span>
          </div>
        </div>
      </div>
    </div>
  );
};
