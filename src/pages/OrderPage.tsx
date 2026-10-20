import React, { useState } from 'react';
import { PACKAGES } from '../data/mockData';
import { OrderFormData, PricingPackage } from '../types';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  CreditCard, 
  FileText, 
  Sparkles, 
  Flame, 
  Download,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface OrderPageProps {
  initialPackageId?: 'starter' | 'boost' | 'full';
  preloadedData?: { resume: string; jd: string };
  onBackToPricing: () => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ 
  initialPackageId = 'boost', 
  preloadedData,
  onBackToPricing 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    preferredTime: 'Anytime',
    referralSource: 'Google Search',
    packageId: initialPackageId,
    urgentDelivery: false,
    currentRole: '',
    workExperience: preloadedData?.resume || '',
    education: '',
    keySkills: ['Project Management', 'Data Analysis'],
    certifications: '',
    targetRole: '',
    targetJobDescription: preloadedData?.jd || '',
    targetIndustry: '',
    specificRequirements: '',
    tone: 'modern',
    pageLength: '2',
    targetSalary: '$60K – $90K',
    specialNotes: '',
    paymentMethod: 'paypal'
  });

  const selectedPkg: PricingPackage = 
    PACKAGES.find(p => p.id === formData.packageId) || PACKAGES[1];

  const totalAmount = selectedPkg.price + (formData.urgentDelivery ? 10 : 0);

  const availableSkills = [
    'Project Management',
    'Data Analysis',
    'Customer Relations',
    'Content Writing',
    'Sales / Business Development',
    'Web Development',
    'Graphic Design',
    'Social Media',
    'Product Strategy',
    'Cloud / DevOps'
  ];

  const handleToggleSkill = (skill: string) => {
    setFormData(prev => {
      const exists = prev.keySkills.includes(skill);
      return {
        ...prev,
        keySkills: exists ? prev.keySkills.filter(s => s !== skill) : [...prev.keySkills, skill]
      };
    });
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      setOrderId(`RR-${randomNum}`);
      setIsProcessingPayment(false);
      setOrderComplete(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleDownloadIntakeReceipt = () => {
    const content = `=====================================================
RESUMEREVIVE — OFFICIAL ORDER RECEIPT & INTAKE CONFIRMATION
Order Reference: ${orderId}
Status: VERIFIED & IN PRODUCTION QUEUE
=====================================================

CUSTOMER DETAILS:
- Name: ${formData.fullName}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Preferred Contact: ${formData.preferredTime}

SERVICE SPECIFICATION:
- Package: ${selectedPkg.name} ($${selectedPkg.price})
- Turnaround: ${formData.urgentDelivery ? '12-Hour Priority Urgent' : '24-Hour Guaranteed Delivery'}
- 12h Rush Add-on: ${formData.urgentDelivery ? '+$10' : 'None'}
- Total Paid: $${totalAmount} USD
- Payment Channel: ${formData.paymentMethod.toUpperCase()} (Confirmed)

TARGET ROLE BRIEF:
- Target Job Title: ${formData.targetRole || 'General Advancement'}
- Target Industry: ${formData.targetIndustry || 'Not specified'}
- Desired Tone: ${formData.tone.toUpperCase()}
- Target Page Count: ${formData.pageLength} Page(s)

100% MONEY-BACK POLICY:
If you are not satisfied after your free revision round, contact hello@resumerevive.ai for an immediate full refund.

Delivered by: Lead Engineer & Resume Editor, ResumeRevive.ai
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResumeRevive-Receipt-${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Order Confirmed & Queued
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              You're All Set! Order #{orderId}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              We have received your career details and target job description. Your draft has been sent to our developer production queue.
            </p>
          </div>

          {/* Delivery Timeline Card */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              What Happens Next:
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>An order verification email has been sent to <strong>{formData.email}</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>
                  Delivery in {formData.urgentDelivery ? '12 hours' : '24 hours'}: Your polished ATS-ready PDF and editable Microsoft Word (.docx) will arrive in your inbox.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>1 free revision round included if you need any adjustments within 7 days.</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadIntakeReceipt}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Receipt (.txt)</span>
            </button>
            <button
              onClick={() => {
                setOrderComplete(false);
                setCurrentStep(1);
                onBackToPricing();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Return To Homepage
            </button>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Protected by our 100% money-back satisfaction guarantee.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button
            onClick={onBackToPricing}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Pricing</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Guaranteed 24-Hour Turnaround</span>
          </div>
        </div>

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Order Your Professional Resume Overhaul
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Fill this out carefully — the more specific detail you provide, the higher your interview callback rate will be.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          {[
            { num: 1, label: 'Your Details' },
            { num: 2, label: 'Choose Package' },
            { num: 3, label: 'Experience' },
            { num: 4, label: 'Target Job' },
            { num: 5, label: 'Review & Pay' },
          ].map((s) => {
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (isCompleted) setCurrentStep(s.num);
                }}
                className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                  isCurrent 
                    ? 'text-blue-600' 
                    : isCompleted 
                    ? 'text-emerald-600 cursor-pointer' 
                    : 'text-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="hidden md:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* STEP 1: Your Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 1 of 5: Your Contact Details
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Where should we deliver your completed resume files?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Henderson"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Phone / WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000 or +91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Preferred Contact Time
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                    <option value="Afternoon (12 PM – 5 PM)">Afternoon (12 PM – 5 PM)</option>
                    <option value="Evening (5 PM – 9 PM)">Evening (5 PM – 9 PM)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  How Did You Hear About Us?
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Google Search">Google Search</option>
                  <option value="Reddit (r/resumes, r/careerguidance)">Reddit (r/resumes, r/careerguidance)</option>
                  <option value="Quora">Quora</option>
                  <option value="Friend / Recommendation">Friend / Recommendation</option>
                  <option value="Free Resume Score Checker">Free Resume Score Checker</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.fullName || !formData.email}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue to Package Selection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Package */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 2 of 5: Select Your Service Tier
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick the service level that aligns with your timeline and career goals.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PACKAGES.map((pkg) => {
                  const isSelected = formData.packageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-sm text-slate-900">
                          {pkg.name}
                        </span>
                        {pkg.popular && (
                          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 mb-2">
                        ${pkg.price}
                      </div>
                      <p className="text-[11px] text-slate-500 min-h-[30px] leading-relaxed">
                        {pkg.description}
                      </p>
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                        {pkg.features.slice(0, 3).map((feat, i) => (
                          <div key={i} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rush Delivery Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.urgentDelivery}
                    onChange={(e) => setFormData({ ...formData, urgentDelivery: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-500" />
                      Add 12-Hour Urgent Rush Delivery (+$10)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Bumps your order to priority front-of-queue. Guaranteed delivery in 12 hours.
                    </p>
                  </div>
                </label>
                <span className="text-xs font-bold text-slate-900 shrink-0">+$10</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue to Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Work Experience */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 3 of 5: Your Career Background & Experience
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your raw work history. Don't worry about perfect formatting — we rewrite it all.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Current / Most Recent Role & Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marketing Specialist at Acme Corp (2022 - Present)"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Past Work Experience & Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Or paste your current resume text
                  </span>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste your past jobs, dates, key projects, and any numbers you recall (e.g. managed $50k budget, scaled team, increased sales)..."
                  value={formData.workExperience}
                  onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                  className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Education
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.S. Computer Science, University of Michigan (2021), GPA 3.8"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Key Skills to Highlight
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((sk) => {
                    const isChecked = formData.keySkills.includes(sk);
                    return (
                      <button
                        type="button"
                        key={sk}
                        onClick={() => handleToggleSkill(sk)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          isChecked
                            ? 'bg-blue-600 text-white border-blue-600 font-medium'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked ? '✓ ' : '+ '}
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Certifications, Honors & Tools (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect, Google Analytics, Scrum Master"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!formData.workExperience.trim()}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue to Target Job</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Target Job */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 4 of 5: Target Job & Tailoring (Critical)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  This is our secret sauce: tailoring your achievements to the exact job description you are applying for.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    What Role Are You Applying For? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer, Marketing Manager"
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Industry / Company Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FinTech, B2B SaaS, Healthcare, Corporate"
                    value={formData.targetIndustry}
                    onChange={(e) => setFormData({ ...formData, targetIndustry: e.target.value })}
                    className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Paste the Job Description (Recommended) <span className="text-emerald-600 font-bold">★ High Impact</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Copy/paste from LinkedIn or job board
                  </span>
                </div>
                <textarea
                  rows={6}
                  placeholder="Paste the requirements & responsibilities from the job listing. This allows us to inject high-priority ATS keywords directly into your bullet points..."
                  value={formData.targetJobDescription}
                  onChange={(e) => setFormData({ ...formData, targetJobDescription: e.target.value })}
                  className="w-full p-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed bg-slate-50/40"
                />
              </div>

              {/* Tone & Length Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Desired Tone</label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="modern">Modern & Confident (Recommended)</option>
                    <option value="professional">Professional & Corporate</option>
                    <option value="creative">Creative & Expressive</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Resume Length</label>
                  <select
                    value={formData.pageLength}
                    onChange={(e) => setFormData({ ...formData, pageLength: e.target.value as any })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="1">1 Page (Standard for &lt;5 yrs)</option>
                    <option value="2">2 Pages (Standard for 5+ yrs)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Target Salary</label>
                  <select
                    value={formData.targetSalary}
                    onChange={(e) => setFormData({ ...formData, targetSalary: e.target.value })}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Under $40K">Under $40K</option>
                    <option value="$40K – $60K">$40K – $60K</option>
                    <option value="$60K – $90K">$60K – $90K</option>
                    <option value="$90K – $130K">$90K – $130K</option>
                    <option value="$130K+">$130K+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Special Notes or Gaps (Confidential)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Taking care of family in 2023, career transition from teaching to UX..."
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={!formData.targetRole}
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Review & Checkout (${totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Instant Payment */}
          {currentStep === 5 && (
            <form onSubmit={handleCompleteOrder} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  Step 5 of 5: Order Summary & Secure Payment
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your details and choose your preferred payment channel.
                </p>
              </div>

              {/* Order Summary Box */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-bold text-slate-800">{selectedPkg.name}</span>
                  <span className="font-mono font-bold text-slate-900">${selectedPkg.price}.00</span>
                </div>

                {formData.urgentDelivery && (
                  <div className="flex items-center justify-between text-xs text-amber-700">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      12-Hour Urgent Priority Rush Delivery
                    </span>
                    <span className="font-mono font-bold">+$10.00</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-heading font-bold text-base text-slate-900 block">Total Due:</span>
                    <span className="text-[11px] text-slate-500">One-time flat fee · Zero recurring bills</span>
                  </div>
                  <span className="font-heading text-2xl font-extrabold text-emerald-600">
                    ${totalAmount}.00 USD
                  </span>
                </div>
              </div>

              {/* Payment Channel Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Payment Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-xs block">PayPal</span>
                    <span className="text-[10px] text-slate-500">Global cards & PayPal balance</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      formData.paymentMethod === 'upi'
                        ? 'border-emerald-600 bg-emerald-50/40 text-emerald-950'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-xs block">PhonePe / UPI</span>
                    <span className="text-[10px] text-slate-500">Instant QR scan for India</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/40 text-blue-950 ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-xs block">VISA / Credit Card</span>
                      <span className="text-[10px] font-black tracking-wider text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded italic">
                        VISA
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Verified by Visa · 256-Bit SSL</span>
                  </button>
                </div>

                {/* Sub-UI for UPI */}
                {formData.paymentMethod === 'upi' && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <span className="text-xs font-bold text-emerald-950 block">
                      Pay via Any UPI App (PhonePe / Google Pay / Paytm):
                    </span>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-emerald-200">
                      <div className="w-24 h-24 bg-slate-900 text-white rounded-lg flex flex-col items-center justify-center text-center p-2">
                        <span className="text-[10px] font-mono">UPI QR</span>
                        <span className="font-bold text-xs text-emerald-400">₹{(totalAmount * 84).toLocaleString()}</span>
                        <span className="text-[9px] text-slate-400">Scan to pay</span>
                      </div>
                      <div className="text-xs space-y-1 text-slate-700">
                        <p>UPI VPA: <strong className="font-mono text-slate-900">resumerevive@upi</strong></p>
                        <p>Amount: <strong>${totalAmount} USD</strong> (~₹{(totalAmount * 84).toLocaleString()})</p>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText('resumerevive@upi');
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2000);
                          }}
                          className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedUpi ? 'Copied VPA!' : 'Copy UPI ID'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-UI for VISA / Card */}
                {formData.paymentMethod === 'card' && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          VISA & International Card Checkout
                        </span>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          3D Secure 2.0
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-black text-blue-800">
                        <span className="italic bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                          VISA
                        </span>
                        <span className="text-slate-400 text-[10px] font-normal">MasterCard · Amex</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700">Cardholder Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Name as it appears on your VISA card"
                          defaultValue={formData.fullName || 'Elena Vance'}
                          className="w-full p-2.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-semibold text-slate-700">VISA Card Number</label>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold">✓ VISA Verified</span>
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={19}
                              defaultValue="4111 •••• •••• 4242"
                              className="w-full p-2.5 pl-3 pr-14 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none tracking-wider"
                            />
                            <span className="absolute right-3 top-2 text-[11px] font-black italic text-blue-700">
                              VISA
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-700">Exp / CVV</label>
                          <input
                            type="text"
                            maxLength={9}
                            defaultValue="10/28 · 888"
                            className="w-full p-2.5 text-xs font-mono border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none text-center"
                          />
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Bank-Grade 256-Bit SSL Encryption
                        </span>
                        <span>Zero Fraud Liability</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guarantees micro-copy */}
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center gap-2.5 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  <strong>100% Money-Back Guarantee:</strong> Delivery guaranteed in {formData.urgentDelivery ? '12 hours' : '24 hours'}. Free revisions included.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Queuing Brief...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === 'card'
                          ? `Pay $${totalAmount}.00 via VISA Secure`
                          : formData.paymentMethod === 'upi'
                          ? `Confirm UPI Payment ($${totalAmount})`
                          : `Authorize $${totalAmount} via PayPal`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
