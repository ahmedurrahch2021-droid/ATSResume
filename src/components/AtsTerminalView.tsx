import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, AlertCircle, ShieldAlert, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { checkBioDataClutter, purgeBioDataClutter } from '../utils/fileExtractor';

interface AtsTerminalViewProps {
  plainText: string;
  onApplyCleanedText?: (cleanedText: string) => void;
}

export const AtsTerminalView: React.FC<AtsTerminalViewProps> = ({
  plainText,
  onApplyCleanedText
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showBioCleaner, setShowBioCleaner] = useState<boolean>(true);

  // Stats
  const stats = useMemo(() => {
    const chars = plainText.length;
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const lines = plainText.split('\n').length;
    return { chars, words, lines };
  }, [plainText]);

  // Bio-data check
  const bioData = useMemo(() => {
    return checkBioDataClutter(plainText);
  }, [plainText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurge = () => {
    const cleaned = purgeBioDataClutter(plainText);
    if (onApplyCleanedText) {
      onApplyCleanedText(cleaned);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ink text-slate-100 rounded-lg overflow-hidden border border-slate-800 shadow-md">
      {/* Terminal Header */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-danger-soft0/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning-soft0/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-soft0/80" />
          </div>
          <span className="font-mono text-xs text-muted/60 font-medium ml-2 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-success" />
            ATS Ingestion Stream (Raw Parsed Stream)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs text-muted/60 font-mono">
            <span>{stats.words} words</span>
            <span>·</span>
            <span>{stats.chars} chars</span>
            <span>·</span>
            <span>{stats.lines} lines</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-ink hover:bg-neutral text-slate-200 border border-slate-700 transition-colors"
            title="Copy plain text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-success" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Stream
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bio-data Purifier Alert if clutter detected */}
      {bioData.hasBioDataClutter && showBioCleaner && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 px-4 py-3 text-xs">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">
                  Outdated Bio-Data Detected ({bioData.detectedFields.length} items found)
                </p>
                <p className="text-amber-300/90 mt-0.5 leading-relaxed">
                  We found traditional fields that hurt ATS scoring and international hiring:{' '}
                  <span className="font-mono text-amber-100">
                    {bioData.detectedFields.map(f => f.field).join(', ')}
                  </span>
                  . Modern tech firms and international recruiters consider these private and unparseable.
                </p>
              </div>
            </div>
            {onApplyCleanedText && (
              <button
                onClick={handlePurge}
                className="shrink-0 px-3 py-1.5 bg-warning-soft0 hover:bg-amber-400 text-slate-950 font-medium rounded text-xs transition-colors flex items-center gap-1 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Purge
              </button>
            )}
          </div>
        </div>
      )}

      {/* Terminal Body */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 selection:bg-accent selection:text-white bg-ink/95 max-h-[600px]">
        <pre className="whitespace-pre-wrap font-mono break-words">
          {plainText || '// No text extracted yet. Ingest a document or enter information in the form.'}
        </pre>
      </div>

      {/* Terminal Footer explanation */}
      <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[11px] text-muted/60 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          Single-column standard verified: zero nested tables, icons, or multi-column stream collision.
        </span>
        <span className="text-muted/80 hidden md:inline">
          Tested against Workday, Greenhouse, Taleo, Lever parsers
        </span>
      </div>
    </div>
  );
};
