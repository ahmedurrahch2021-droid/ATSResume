import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Send
} from 'lucide-react';

interface ContactPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onSelectPlan }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Pricing');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <MessageSquare className="w-3.5 h-3.5" />
            Direct Developer Support
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Got Questions? Let's Talk.
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Need advice choosing between Starter and Career Boost? Have an urgent deadline tonight? Send a message and we'll reply directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Side Panel */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#0F172A] text-white p-6 rounded-2xl shadow-md space-y-6">
              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  Direct Inquiries
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Every message goes straight to the engineering and resume review desk.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-muted/60 block text-[11px]">Direct Email</span>
                    <a href="mailto:ahmedur.rahch2021@gmail.com" className="font-medium text-white hover:text-blue-300 transition-colors">
                      ahmedur.rahch2021@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-muted/60 block text-[11px]">Avg Response Time</span>
                    <span className="font-medium text-white">Under 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-muted/60 block text-[11px]">Satisfaction Guarantee</span>
                    <span className="font-medium text-white">100% money-back policy</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-muted/60">
                Operating 7 days a week: 9:00 AM – 9:00 PM EST.
              </div>
            </div>

            <div className="bg-paper p-5 rounded-2xl border border-line shadow-xs space-y-2">
              <span className="text-xs font-bold text-ink block">
                Ready to submit an order right away?
              </span>
              <p className="text-xs text-muted leading-relaxed">
                You do not need to email first. You can place your order directly through our secure questionnaire:
              </p>
              <button
                onClick={() => onSelectPlan('starter')}
                className="w-full mt-2 py-2 bg-soft0 hover:bg-accent text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Order Resume Starter ($10)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Form Main Area */}
          <div className="md:col-span-2 bg-paper p-6 sm:p-8 rounded-2xl border border-line shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-bold text-lg text-ink mb-2">
                  Send A Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-ink/90">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-ink/90">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink/90">Inquiry Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-paper focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Pricing">Question about packages ($15 / $25 / $35)</option>
                    <option value="Delivery">Turnaround timing / 12-hour urgent rush inquiry</option>
                    <option value="Custom">Custom package for leadership / multi-industry roles</option>
                    <option value="ATS">ATS compatibility question for specific ATS software</option>
                    <option value="Other">Other question</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-ink/90">Message / Questions</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us what role you are targeting or what questions you have..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Developer Desk</span>
                </button>
              </form>
            ) : (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-accent rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-ink">
                  Message Received!
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Thanks <strong>{name || 'there'}</strong>. We have received your inquiry regarding <em>"{subject}"</em>. Our team will review and reply to <strong>{email}</strong> within 2 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
