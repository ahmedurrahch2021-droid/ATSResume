import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  Loader2, 
  ChevronDown, 
  ShieldCheck, 
  HelpCircle,
  FileCheck2,
  Maximize2,
  Minimize2,
  ArrowRight,
  Bot
} from 'lucide-react';
import { ChatMessage, ChatResponse } from '../../types/ai';
import type { TargetCountry } from '../../types/countryNorms';
import { getCountryProfile } from '../../data/targetCountries';
import { TargetCountrySelect } from '../common/TargetCountrySelect';

export interface GeminiChatWidgetProps {
  mode?: 'floating' | 'docked';
  isOpen?: boolean;
  onClose?: () => void;
  activeText?: string;
  sectionType?: 'bullet' | 'summary' | 'experience' | 'cover-letter' | 'general';
  targetRole?: string;
  targetCountry?: TargetCountry;
  onTargetCountryChange?: (country: TargetCountry) => void;
  flawsDetected?: string[];
  onApplySnippet?: (snippet: string) => void;
}

const DAILY_LIMIT = 10;
const USAGE_KEY = 'atsresume_ai_daily_usage';

export const GeminiChatWidget: React.FC<GeminiChatWidgetProps> = ({
  mode = 'floating',
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  activeText = '',
  sectionType = 'general',
  targetRole = 'Software Engineer',
  targetCountry = 'global',
  onTargetCountryChange,
  flawsDetected = [],
  onApplySnippet,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isWidgetOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const handleClose = controlledOnClose || (() => setInternalOpen(false));

  const [country, setCountry] = useState<TargetCountry>(targetCountry);
  const [expanded, setExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const [creditsRemaining, setCreditsRemaining] = useState<number>(DAILY_LIMIT);

  // Default initial greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hello! I am your ATS Resume Lab Writing & Career Coach. I can help convert weak job duties into Google XYZ impact metrics, calibrate spelling to your target country (US, UK, Gulf, etc.), or answer questions about ATS parsing and single-column formatting. How can I help you today?",
      quickActions: [
        "Rewrite with Google XYZ formula",
        "Fix passive duty verbs",
        "Explain Workday parser rules",
        "Tailor summary for my role"
      ],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync country prop
  useEffect(() => {
    setCountry(targetCountry);
  }, [targetCountry]);

  // Read daily credits
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const today = new Date().toISOString().slice(0, 10);
        const saved = localStorage.getItem(USAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.date === today) {
            setCreditsRemaining(Math.max(0, DAILY_LIMIT - (parsed.count || 0)));
            return;
          }
        }
        localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count: 0 }));
        setCreditsRemaining(DAILY_LIMIT);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const recordUsage = () => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const today = new Date().toISOString().slice(0, 10);
        const saved = localStorage.getItem(USAGE_KEY);
        let count = 0;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.date === today) count = parsed.count || 0;
        }
        count += 1;
        localStorage.setItem(USAGE_KEY, JSON.stringify({ date: today, count }));
        setCreditsRemaining(Math.max(0, DAILY_LIMIT - count));
      }
    } catch {
      // Ignore
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (isWidgetOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWidgetOpen]);

  const handleCountrySelect = (newCountry: TargetCountry) => {
    setCountry(newCountry);
    if (onTargetCountryChange) onTargetCountryChange(newCountry);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    if (creditsRemaining <= 0) {
      const limitMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: "You have reached your 10 free daily AI credits. Your allowance resets at midnight. In the meantime, standard single-column editing and our 27-check ATS diagnostic remain 100% free and active.",
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, limitMsg]);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyTurns = newThread
        .filter(m => m.id !== 'welcome-1')
        .map(m => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyTurns,
          currentText: activeText,
          sectionType,
          targetRole,
          countryNorm: country,
          flawsDetected,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: ChatResponse = await res.json();
      recordUsage();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: data.replyText,
        suggestedSnippet: data.suggestedSnippet,
        rationale: data.rationale,
        clarifyingQuestion: data.clarifyingQuestion,
        quickActions: data.quickActions || ["Make it punchier", "Give 3 variants", "Explain ATS mechanism"],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Chat error, falling back locally:', err);
      recordUsage();
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: "Workday and Greenhouse keyword scanners prioritize explicit leadership verbs over passive duty descriptions. Ensure every bullet links an action to a measured business outcome.",
        suggestedSnippet: activeText ? activeText.replace(/\b(responsible for|worked on|assisted with)\b/gi, 'Spearheaded and delivered') : undefined,
        rationale: "Replaced passive phrasing with direct outcome verb.",
        quickActions: ["Make it punchier", "Give 3 variants", "Explain ATS mechanism"],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySnippet = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Ignore
    }
  };

  const handleApplySnippet = (id: string, text: string) => {
    if (onApplySnippet) {
      onApplySnippet(text);
      setAppliedId(id);
      setTimeout(() => setAppliedId(null), 2500);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        text: "Conversation cleared. How can I help you refine your resume or cover letter?",
        quickActions: [
          "Rewrite with Google XYZ formula",
          "Fix passive duty verbs",
          "Explain Workday parser rules",
          "Tailor summary for my role"
        ],
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const currentProfile = getCountryProfile(country);

  // If floating and closed, render the floating trigger button
  if (mode === 'floating' && !isWidgetOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-slate-900 px-4 py-3 text-white shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 border border-slate-700/80"
          aria-label="Open AI Career & Writing Coach"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#C82333] transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-bold font-heading pr-1">AI Coach</span>
        </button>
      </div>
    );
  }

  // If docked and closed, return null
  if (mode === 'docked' && !isWidgetOpen) {
    return null;
  }

  return (
    <aside
      className={`${
        mode === 'floating'
          ? `fixed bottom-5 right-5 z-50 rounded-2xl shadow-2xl border border-slate-200/90 bg-white transition-all duration-200 overflow-hidden ${
              expanded 
                ? 'w-[92vw] sm:w-[560px] h-[85vh] max-h-[750px]' 
                : 'w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
            }`
          : 'fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between'
      } flex flex-col`}
      aria-label="AI Career & Writing Coach"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 text-[#C82333]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="font-heading font-bold text-xs text-slate-900 truncate">
                ATS AI Career Coach
              </h3>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded uppercase shrink-0">
                Evidence-Grounded
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              {currentProfile.name} · {currentProfile.spelling === 'british' ? 'British English' : 'American English'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {mode === 'floating' && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              title={expanded ? 'Compress view' : 'Expand view'}
            >
              {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Clear chat history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Country & Allowance Bar */}
      <div className="px-3.5 py-2 border-b border-slate-100 bg-white flex items-center justify-between gap-2 shrink-0 text-xs">
        <TargetCountrySelect
          value={country}
          onChange={handleCountrySelect}
          compact
        />

        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
          <ShieldCheck className="w-3 h-3 text-[#C82333]" />
          <span>{creditsRemaining}/{DAILY_LIMIT} free today</span>
        </div>
      </div>

      {/* Scrollable Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 px-1 text-[10px] text-slate-400">
                <span>{isUser ? 'You' : 'ATS Coach'}</span>
                <span>·</span>
                <span>{msg.createdAt}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Snippet Box (If present) */}
                {msg.suggestedSnippet && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-slate-900 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                      <span className="flex items-center gap-1">
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-700" />
                        Suggested Calibrated Wording:
                      </span>
                      {msg.rationale && (
                        <span className="text-[10px] text-emerald-600 font-normal italic">
                          ATS Optimized
                        </span>
                      )}
                    </div>

                    <p className="font-mono text-xs p-2 rounded bg-white/90 border border-emerald-200/70 text-slate-900 leading-relaxed select-all">
                      {msg.suggestedSnippet}
                    </p>

                    {msg.rationale && (
                      <p className="text-[11px] text-slate-600 leading-tight">
                        <strong>Rationale:</strong> {msg.rationale}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      {onApplySnippet && (
                        <button
                          type="button"
                          onClick={() => handleApplySnippet(msg.id, msg.suggestedSnippet!)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#C82333] hover:bg-[#A71D2A] text-white font-bold text-xs transition-colors shadow-2xs"
                        >
                          {appliedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply to Document</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopySnippet(msg.id, msg.suggestedSnippet!)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Clarifying Question */}
                {msg.clarifyingQuestion && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                    <span className="font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      Missing Scale or Scope:
                    </span>
                    <p>{msg.clarifyingQuestion}</p>
                  </div>
                )}
              </div>

              {/* Quick-Action Follow-Up Chips */}
              {!isUser && msg.quickActions && msg.quickActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-w-[90%]">
                  {msg.quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSendMessage(action)}
                      className="px-2 py-1 rounded-full bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 text-slate-700 text-[11px] font-medium transition-all shadow-2xs disabled:opacity-50"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="rounded-2xl p-3.5 bg-white border border-slate-200 text-slate-700 shadow-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#C82333]" />
              <span className="text-xs font-medium">Coach is thinking and analyzing ATS norms...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask coach (e.g. 'Rewrite this bullet', 'Check my summary')..."
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C82333] max-h-24 resize-none bg-slate-50/50"
            disabled={isLoading || creditsRemaining <= 0}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim() || creditsRemaining <= 0}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors disabled:opacity-40 shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
          <span>100% Free</span>
          <span>·</span>
          <span>Preserves candidate career truth</span>
          <span>·</span>
          <span>No hallucinated metrics</span>
        </div>
      </div>
    </aside>
  );
};
