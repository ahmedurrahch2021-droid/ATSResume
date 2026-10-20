export type PageRoute = 
  | 'home' 
  | 'pricing' 
  | 'examples' 
  | 'how-it-works' 
  | 'free-resume-score' 
  | 'about' 
  | 'faq' 
  | 'contact' 
  | 'order';

export interface PricingPackage {
  id: 'starter' | 'boost' | 'full';
  name: string;
  price: number;
  badge?: string;
  deliveryHours: number;
  description: string;
  features: string[];
  recommendedFor: string;
  popular?: boolean;
}

export interface ExampleResume {
  id: string;
  title: string;
  role: string;
  industry: string;
  result: string;
  before: {
    title: string;
    summary: string;
    experience: string[];
    critique: string[];
  };
  after: {
    title: string;
    summary: string;
    experience: string[];
    improvements: string[];
  };
  metricsHighlight: string;
}

export interface AtsScanResult {
  score: number;
  categoryScores: {
    quantifiedMetrics: number;
    actionVerbs: number;
    atsReadability: number;
    skillsRelevance: number;
    structureFormatting: number;
  };
  criticalIssues: string[];
  quickWins: string[];
  detectedKeywords: string[];
  missingCrucialKeywords: string[];
  wordCount: number;
  quantifiedCount: number;
  strongVerbsCount: number;
  summaryFeedback: string;
}

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredTime: string;
  referralSource: string;
  packageId: 'starter' | 'boost' | 'full';
  urgentDelivery: boolean;
  currentRole: string;
  workExperience: string;
  education: string;
  keySkills: string[];
  certifications: string;
  targetRole: string;
  targetJobDescription: string;
  targetIndustry: string;
  specificRequirements: string;
  tone: 'professional' | 'modern' | 'creative';
  pageLength: '1' | '2';
  targetSalary: string;
  specialNotes: string;
  paymentMethod: 'visa' | 'mastercard' | 'paypal' | 'upi' | 'card';
}

export interface Testimonial {
  name: string;
  role: string;
  companyTarget: string;
  quote: string;
  metric: string;
  avatarSeed: string;
  packageUsed: string;
}

export interface FaqItem {
  id: string;
  category: 'pricing' | 'delivery' | 'quality' | 'ats' | 'revisions';
  question: string;
  directAnswer: string;
  extendedAnswer: string;
}
