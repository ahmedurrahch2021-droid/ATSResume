export type PageRoute = 
  | 'home' 
  | 'suite'
  | 'editor'
  | 'templates'
  | 'pricing' 
  | 'examples' 
  | 'how-it-works' 
  | 'free-resume-score' 
  | 'about' 
  | 'faq' 
  | 'contact' 
  | 'cover-letter'
  | 'country-guides'
  | 'order';

export interface ResumeExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface ResumeEducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  dates: string;
  gpa?: string;
}

export interface ResumeProjectItem {
  id: string;
  name: string;
  roleOrTech: string;
  link?: string;
  bullets: string[];
}

export interface ResumeLanguageItem {
  id: string;
  name: string;
  level: '' | 'Native' | 'Fluent' | 'C2 (Mastery)' | 'C1 (Advanced)' | 'B2 (Upper Intermediate)' | 'B1 (Intermediate)' | 'A2' | 'A1';
}

export interface CompetitiveProgrammingItem {
  id: string;
  platform: 'Codeforces' | 'LeetCode' | 'HackerRank' | 'Kaggle' | 'CodeChef' | 'GitHub' | 'Other';
  handle: string;
  rating?: string;
  badgeOrRank?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export type TargetMarket = 'global' | 'us_uk' | 'bangladesh';

export interface ResumeData {
  fullName: string;
  targetTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github?: string;
  summary: string;
  // International & Photo fields
  photoUrl?: string;
  photoShape?: 'circle' | 'square' | 'hidden';
  nationality?: string;
  visaStatus?: string;
  drivingLicense?: string;
  remoteReadiness?: string;
  targetMarket?: TargetMarket;
  targetCountry?: import('./countryNorms').TargetCountry;
  // Core sections
  experience: ResumeExperienceItem[];
  education: ResumeEducationItem[];
  skills: {
    languages: string;
    frameworks: string;
    toolsAndCloud: string;
    methodologies: string;
  };
  languages?: ResumeLanguageItem[];
  competitiveProgramming?: CompetitiveProgrammingItem[];
  projects: ResumeProjectItem[];
  certifications: string[];
  customSections?: CustomSection[];
  /** Imported text the user elects to keep outside the standard sections. */
  additionalInformation?: string;
}

export interface JobMatchAnalysis {
  matchPercentage: number;
  matchedKeywords: string[];
  missingHardSkills: string[];
  missingSoftSkills: string[];
  keywordDensityWarning?: string;
  recommendedBullets: string[];
  summaryFeedback: string;
}

export type ResumeLayoutId = 'modern' | 'classic' | 'compact' | 'graduate';

export interface ResumeTemplate {
  id: string;
  title: string;
  category: 'tech' | 'product' | 'finance' | 'entry' | 'creative';
  categoryLabel: string;
  recommendedFor: string;
  layout: ResumeLayoutId;
  sourceIds: string[];
  architecture?: string;
  format: string;
  previewImage: string;
  highlightPoints: string[];
  sampleContent: {
    name: string;
    targetTitle?: string;
    contact: string;
    summary: string;
    skills: string[];
    experience: {
      role: string;
      company: string;
      dates: string;
      bullets: string[];
    }[];
    education: string;
    projects?: Omit<ResumeProjectItem, 'id'>[];
    certifications?: string[];
  };
}

export type ServicePricingRegion = 'bangladesh' | 'international';

export interface PricingPackage {
  id: 'starter' | 'boost' | 'full';
  name: string;
  price: number;
  /** Fixed Bangladesh price in BDT, not an automatic USD conversion. */
  bangladeshPrice: number;
  revisionRounds: 1 | 2;
  badge?: string;
  deliveryHours?: number;
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

export interface DetailedCheckItem {
  id: string;
  name: string;
  category: 'ATS Essentials' | 'Resume Sections' | 'Content' | 'Job Tailoring' | 'Recruiter Red Flags' | 'Bias & Discrimination' | 'Seniority & Impact';
  status: 'pass' | 'warning' | 'fail';
  detail: string;
  recommendation?: string;
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
  detailedChecks?: DetailedCheckItem[];
}

export interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredTime: string;
  referralSource: string;
  packageId: 'starter' | 'boost' | 'full';
  pricingRegion: ServicePricingRegion;
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
  pageLength: '1' | '2' | '3';
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
