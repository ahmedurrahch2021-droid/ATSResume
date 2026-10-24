export type CoverLetterTemplateStyle = 'modern' | 'classic' | 'minimal' | 'executive';

export type CoverLetterFontFamily = 'sans' | 'serif' | 'mono';

export interface CoverLetterSender {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
}

export interface CoverLetterRecipient {
  hiringManagerName: string;
  companyName: string;
  department?: string;
  companyAddress?: string;
}

export interface CoverLetterData {
  id: string;
  title: string;
  sender: CoverLetterSender;
  recipient: CoverLetterRecipient;
  date: string;
  salutation: string;
  opening: string;
  bodyParagraphs: string[];
  keyHighlights: string[];
  closing: string;
  signOff: string;
  templateStyle: CoverLetterTemplateStyle;
  accentColor: string;
  fontFamily: CoverLetterFontFamily;
  fontSize: 'compact' | 'standard' | 'spacious';
}

export interface CoverLetterPreset {
  id: string;
  name: string;
  role: string;
  targetCompany: string;
  badge: string;
  description: string;
  data: Omit<CoverLetterData, 'id'>;
}
