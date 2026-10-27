import React, { useState } from 'react';
import { PACKAGES } from '../data/mockData';
import { PricingPackage } from '../types';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  Zap, 
  Flame,
  FileCheck
} from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (packageId: 'starter' | 'boost' | 'full', urgent?: boolean) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const [rushDelivery, setRushDelivery] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent bg-accent-soft px-3 py-1 rounded-md border border-accent-line">
            <Sparkles className="w-3.5 h-3.5" />
            Clear Upfront Pricing · Zero Subscriptions
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            Choose The Package That Fits Your Career Goals
          </h1>
          <p className="text-base text-muted leading-relaxed">
            Every package combines AI generation speed with personal editing by a senior web developer. No recurring bills. 100% money-back guarantee.
          </p>

          {/* Rush Delivery Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <label className="inline-flex items-center gap-3 p-2.5 px-4 bg-paper border border-line rounded-xl shadow-xs cursor-pointer hover:border-line transition-colors">
              <input
                type="checkbox"
                checked={rushDelivery}
                onChange={(e) => setRushDelivery(e.target.checked)}
                className="w-4 h-4 text-accent rounded border-line focus:ring-emerald-500"
              />
              <span className="text-xs sm:text-sm font-semibold text-ink flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                Add 12-Hour Urgent Priority Delivery (+ $10)
              </span>
            </label>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => {
            const totalPrice = pkg.price + (rushDelivery ? 10 : 0);
            return (
              <div
                key={pkg.id}
                className={`relative bg-paper rounded-2xl transition-all duration-200 flex flex-col justify-between ${
                  pkg.popular
                    ? 'border-2 border-emerald-600 shadow-md ring-2 ring-emerald-600/10'
                    : 'border border-line shadow-xs hover:border-line'
                }`}
              >
                {/* Popular / Value Badges */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                      {pkg.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Title & Price */}
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ink">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-muted/80 mt-1 min-h-[32px]">
                      {pkg.description}
                    </p>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-heading text-4xl font-extrabold text-ink">
                        ${totalPrice}
                      </span>
                      <span className="text-xs text-muted/80 font-medium">
                        / one-time fee
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>
                        {rushDelivery ? 'Guaranteed in 12 Hours' : `${pkg.deliveryHours}-Hour Delivery`}
                      </span>
                    </div>
                  </div>

                  {/* Who this is for box */}
                  <div className="p-3 bg-soft rounded-xl border border-line text-xs text-ink/90">
                    <span className="font-semibold text-ink block mb-0.5">Best For:</span>
                    {pkg.recommendedFor}
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted/60">
                      What's Included:
                    </span>
                    <ul className="space-y-2.5">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-ink/90 flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 sm:p-8 pt-0 border-t border-line mt-6 space-y-3">
                  <button
                    onClick={() => onSelectPlan(pkg.id, rushDelivery)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                      pkg.popular
                        ? 'bg-accent hover:bg-accent/90 text-white shadow-emerald-600/20'
                        : 'bg-ink hover:bg-ink text-white'
                    }`}
                  >
                    <span>Choose {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-muted/80 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    100% money-back guarantee
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-paper rounded-2xl border border-line overflow-hidden shadow-sm">
          <div className="p-6 bg-ink text-white">
            <h3 className="font-heading text-lg font-bold">
              Detailed Feature Comparison Matrix
            </h3>
            <p className="text-xs text-muted/60 mt-1">
              Compare deliverable files and scope across our packages
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-soft border-b border-line text-muted font-semibold uppercase">
                <tr>
                  <th className="p-4 pl-6">Deliverable / Feature</th>
                  <th className="p-4 text-center">Starter ($10)</th>
                  <th className="p-4 text-center text-accent font-bold">Career Boost ($25)</th>
                  <th className="p-4 text-center">Full Package ($35)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink/90">
                <tr>
                  <td className="p-4 pl-6 font-medium">ATS-Optimized Resume (PDF & DOCX)</td>
                  <td className="p-4 text-center text-accent font-bold">✓ 1–2 Pages</td>
                  <td className="p-4 text-center text-accent font-bold">✓ 1–2 Pages</td>
                  <td className="p-4 text-center text-accent font-bold">✓ Up to 3 Pages</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Target Job Description Calibration</td>
                  <td className="p-4 text-center text-accent">✓ 1 Role</td>
                  <td className="p-4 text-center text-accent font-bold">✓ 1 Role</td>
                  <td className="p-4 text-center text-accent font-bold">✓ 2 Target Roles</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Senior Developer Human Review & Edit</td>
                  <td className="p-4 text-center text-accent">✓ Yes</td>
                  <td className="p-4 text-center text-accent">✓ Yes</td>
                  <td className="p-4 text-center text-accent">✓ Priority Review</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Custom Tailored Cover Letter (PDF)</td>
                  <td className="p-4 text-center text-muted/60">—</td>
                  <td className="p-4 text-center text-accent font-bold">✓ Included</td>
                  <td className="p-4 text-center text-accent font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">LinkedIn Headline & About Bio</td>
                  <td className="p-4 text-center text-muted/60">—</td>
                  <td className="p-4 text-center text-accent font-bold">✓ Included</td>
                  <td className="p-4 text-center text-accent font-bold">✓ Complete Profile</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Interview Prep Notes & Question Predictions</td>
                  <td className="p-4 text-center text-muted/60">—</td>
                  <td className="p-4 text-center text-muted/60">—</td>
                  <td className="p-4 text-center text-accent font-bold">✓ 10 STAR Prompts</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Free Revisions Round</td>
                  <td className="p-4 text-center">1 Round (7 Days)</td>
                  <td className="p-4 text-center">1 Round (7 Days)</td>
                  <td className="p-4 text-center">2 Rounds (14 Days)</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-medium">Money-Back Guarantee</td>
                  <td className="p-4 text-center text-accent font-bold">100%</td>
                  <td className="p-4 text-center text-accent font-bold">100%</td>
                  <td className="p-4 text-center text-accent font-bold">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQ Snippet */}
        <div className="bg-paper rounded-2xl border border-line p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-heading text-lg font-bold text-ink">
            Frequently Asked Questions About Pricing & Payments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-ink">
                Are there any recurring monthly charges?
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Zero. Unlike automated resume websites that trick you into a $29.99/month recurring charge after a $2 trial, ATS Resume Lab is 100% one-time flat fee. You only pay for the service you order.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-ink">
                How does the 100% money-back guarantee work?
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                If our finished draft doesn't exceed your expectations after your free revision round, send an email to ahmedur.rahch2021@gmail.com and we immediately issue a full refund to your original payment method.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-ink">
                Can I pay with UPI or PhonePe if I am in India?
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Yes! We support VISA debit/credit, Mastercard, international PayPal, and instant UPI QR code scans for PhonePe, Google Pay, and Paytm.
              </p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-ink">
                What if I need to change my target job after submitting?
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Just reply to your order confirmation email with the new job listing within 3 hours and we will update your brief at no extra charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
