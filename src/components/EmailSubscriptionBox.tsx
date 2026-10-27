import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface EmailSubscriptionBoxProps {
  variant?: 'card' | 'inline' | 'banner';
  title?: string;
  description?: string;
}

export const EmailSubscriptionBox: React.FC<EmailSubscriptionBoxProps> = ({
  variant = 'card',
  title = 'Get the 2026 International ATS Checklist & Job Alerts',
  description = 'Receive our battle-tested resume audit formulas, remote job updates, and Workday/Greenhouse parser cheat sheet. 100% free, zero spam.'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('atsresume_subscribers') || '[]');
      existing.push({ email, timestamp: Date.now() });
      localStorage.setItem('atsresume_subscribers', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-soft/70 border border-line rounded-2xl p-6 text-center space-y-2 animate-in fade-in duration-200">
        <div className="w-10 h-10 mx-auto rounded-full bg-red-100 text-accent flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h4 className="font-heading font-bold text-sm text-ink">
          You're on the list!
        </h4>
        <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
          We've dispatched the <strong>2026 International ATS Formatting Guide</strong> to <span className="font-mono text-accent">{email}</span>. Check your inbox.
        </p>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent text-white">
                Free Candidate Resource
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
            <p className="text-xs text-line max-w-lg leading-relaxed">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
            <div className="relative">
              <Mail className="w-4 h-4 text-muted/60 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full sm:w-64 text-xs pl-9 pr-3 py-2.5 bg-stone-800/90 text-white placeholder-stone-400 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C82333]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-[0.98]"
            >
              <span>Get Free Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper border border-line rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-soft text-accent flex items-center justify-center font-bold">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-sm text-ink">{title}</h4>
          <span className="text-[11px] text-accent font-semibold">Weekly Remote & International Job Alerts</span>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">{description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="flex-1 text-xs px-3.5 py-2.5 bg-soft border border-line rounded-xl focus:bg-paper focus:outline-none focus:ring-2 focus:ring-[#C82333]"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-[0.98]"
        >
          <span>Subscribe Free</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="flex items-center gap-2 text-[11px] text-muted/60 pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>Strict privacy. Unsubscribe at any time with 1 click.</span>
      </div>
    </div>
  );
};
