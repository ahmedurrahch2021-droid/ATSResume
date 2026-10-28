import type { ResumeLayoutId } from '../types';

export interface CountryGuide {
  id: string;
  code: string;
  name: string;
  zone: string;
  layout: ResumeLayoutId;
  note: string;
  structure: string;
  photo: string;
  application: string;
  evidenceNote: string;
  sourceIds: string[];
}

/** Layout suggestions from ATS Resume Lab, not nationally mandated templates. */
export const COUNTRY_GUIDES: CountryGuide[] = [
  {
    id: 'bangladesh', code: 'BD', name: 'Bangladesh', zone: 'South Asia', layout: 'modern',
    note: 'Corporate CV or application form?',
    structure: 'For a corporate application, start with contact details, relevant experience, education and skills. Modern Professional gives these sections room; graduates can use Education-first Graduate.',
    photo: 'Optional in our editor. Include a right-side photo when the particular employer requests one. A photo upload on a government form is a separate requirement from the resume document.',
    application: 'Bdjobs distinguishes its structured profile from a personalized uploaded resume. Check the vacancy and its file requirements; complete required portal fields in the portal.',
    evidenceNote: 'Platform-specific evidence supports this distinction. It does not make biography fields or a photo mandatory on every Bangladeshi corporate CV.',
    sourceIds: ['bdjobs-resume', 'mit-ats', 'greenhouse-parse'],
  },
  {
    id: 'uae', code: 'AE', name: 'United Arab Emirates', zone: 'Gulf', layout: 'modern',
    note: 'Relevant experience, clear contact details',
    structure: 'Use a clear work-history layout for experienced roles, or education first for an early-career application. Keep projects and language proficiency in named sections.',
    photo: 'Employer-specific. The reviewed student guide does not establish a UAE-wide requirement for a photo. Our default is a document without an image.',
    application: 'Use the employer’s requested language, document length and work-authorisation fields. Write only accurate, relevant availability or work-rights information.',
    evidenceNote: 'NYU Abu Dhabi provides local institutional examples for students. That context does not prescribe the format for every UAE employer or profession.',
    sourceIds: ['nyuad-cv', 'mit-ats', 'greenhouse-parse'],
  },
  {
    id: 'saudi-arabia', code: 'SA', name: 'Saudi Arabia', zone: 'Gulf', layout: 'classic',
    note: 'Check employer and work-rights fields',
    structure: 'Classic Chronological is our suggested traditional presentation: contact details, a relevant summary, work history, education and skills. State licences or qualifications when relevant to the role.',
    photo: 'No Saudi-wide photo rule was established by the reviewed sources. Leave it out by default or follow the specific application instructions.',
    application: 'For international applications, check the employer’s work-authorisation process. Work-permit requirements do not by themselves tell you what to put in a CV.',
    evidenceNote: 'The Saudi source covers employment of non-Saudis, not CV design. The layout recommendation uses general career-service guidance.',
    sourceIds: ['saudi-work', 'mit-ats', 'harvard-bullet'],
  },
  {
    id: 'qatar', code: 'QA', name: 'Qatar', zone: 'Gulf', layout: 'modern',
    note: 'Use the vacancy’s instructions',
    structure: 'Modern Professional offers a general starting order: contact details, relevant experience, education and skills. Add role-related certifications and languages as needed.',
    photo: 'No Qatar-specific primary source establishing a universal photo rule was verified in this review. Our image-free default is a product choice; follow the particular employer.',
    application: 'Check the job advertisement and portal for document language, file type, size and any work-rights questions. Keep application-form answers accurate and separate from unnecessary CV biography.',
    evidenceNote: 'General guidance only. A Qatar-wide CV format, photo policy or page limit is not claimed.',
    sourceIds: ['mit-ats', 'greenhouse-parse'],
  },
  {
    id: 'united-kingdom', code: 'GB', name: 'United Kingdom', zone: 'Europe', layout: 'classic',
    note: 'Clear headings and job-relevant detail',
    structure: 'Use a clear chronological CV for work experience, or put education first when that is your strongest relevant evidence. Our layouts use 11 pt body text and standard section headings.',
    photo: 'Our US / UK preset omits photos and nationality. The National Careers Service advises leaving out age, birth date, marital status and nationality.',
    application: 'Tailor the CV to the job description. Include a professional contact route and concise evidence of the skills requested; follow any stated page limit.',
    evidenceNote: 'National Careers Service and Imperial guidance informs structure and personal-detail choices. Photo omission is also supported by the general parser considerations below.',
    sourceIds: ['uk-cv', 'imperial-cv', 'greenhouse-parse'],
  },
  {
    id: 'united-states', code: 'US', name: 'United States', zone: 'North America', layout: 'classic',
    note: 'A photo-free professional resume',
    structure: 'Choose a concise chronological resume for an experienced applicant, or an education-first structure for a student. Use contributions and relevant projects to support the job requirements.',
    photo: 'Start without a photo. EEOC guidance advises employers not to request applicant photographs before an accepted offer. Our US / UK preset omits the photo from exports.',
    application: 'The vacancy controls file format and length. Federal applications and academic CVs may have different instructions from a conventional private-sector resume.',
    evidenceNote: 'Harvard is a student-oriented example, and EEOC guidance is directed at employers. Neither establishes a universal winning template.',
    sourceIds: ['us-eeoc', 'harvard-bullet', 'mit-ats'],
  },
  {
    id: 'canada', code: 'CA', name: 'Canada', zone: 'North America', layout: 'modern',
    note: 'Job Bank advises leaving photos out',
    structure: 'Modern Professional gives relevant work history and skills a clear single-column presentation. Select the experience that supports the advertised role.',
    photo: 'Leave out the photograph, following Government of Canada Job Bank guidance. If your existing draft has one, choose Hide photo in the editor.',
    application: 'Avoid unnecessary personal details. Use clear examples of your contributions and check that your contact details and requested file format are correct.',
    evidenceNote: 'The photo guidance is directly supported by Job Bank. The visual layout is our original design, not a government template.',
    sourceIds: ['canada-jobbank', 'mit-ats'],
  },
  {
    id: 'australia', code: 'AU', name: 'Australia', zone: 'Oceania', layout: 'compact',
    note: 'Relevant length, readable type',
    structure: 'Compact Professional fits relevant experience with closer spacing while retaining 11 pt body text. Queensland guidance describes simple resumes of roughly 1–3 pages, depending on experience.',
    photo: 'The reviewed Queensland guidance does not establish a mandatory photo. Use our image-free default and follow the employer’s application instructions.',
    application: 'Include relevant qualifications, skills and employment history. Keep requested selection-criteria responses or additional documents distinct from the resume when the vacancy asks for them.',
    evidenceNote: 'Queensland guidance is practical public-service advice. A page range is context, not an ATS pass/fail threshold or a rule for every Australian role.',
    sourceIds: ['qld-resume', 'mit-ats'],
  },
  {
    id: 'germany', code: 'DE', name: 'Germany', zone: 'Europe', layout: 'classic',
    note: 'Confirm industry-specific expectations',
    structure: 'Classic Chronological is our general starting point for an orderly employment and education history. Use the language and supporting documents requested in the vacancy.',
    photo: 'Make the choice for the specific employer and industry. We have not turned photo customs into an automatic country requirement.',
    application: 'Check the federal Make it in Germany portal for current application guidance and the employer for any requested certificates or qualifications.',
    evidenceNote: 'The federal reference was identified, but direct access was blocked during review. The design suggestion uses general sources; local photo rules are not asserted.',
    sourceIds: ['germany-application', 'mit-ats', 'harvard-bullet'],
  },
  {
    id: 'france', code: 'FR', name: 'France', zone: 'Europe', layout: 'modern',
    note: 'A photo is optional information',
    structure: 'Modern Professional keeps employment, education and skills easy to locate. Tailor the language and content to the advertised position.',
    photo: 'Service Public lists an identity photograph as possible information, not a mandatory CV element. You can leave it out, or enable the right-side photo for a specific application.',
    application: 'Focus on information related to the position. Include qualifications and experience accurately and avoid adding unrelated personal details.',
    evidenceNote: 'The source supports job relevance and the optional nature of the photograph. It does not endorse this template or prescribe an ATS score.',
    sourceIds: ['france-cv', 'mit-ats', 'greenhouse-parse'],
  },
  {
    id: 'netherlands', code: 'NL', name: 'Netherlands', zone: 'Europe', layout: 'compact',
    note: 'Check local guidance and the vacancy',
    structure: 'Compact Professional is our general suggestion for a concise work and education history. Keep skills and language proficiency readable as text.',
    photo: 'No mandatory photo rule is applied. Check the employer’s instructions and current local advice before choosing to include an image.',
    application: 'UWV’s Werk.nl CV guide is linked for local reading. Confirm the expected document language, length and file type with the actual vacancy.',
    evidenceNote: 'Direct access to the Werk.nl reference could not be verified during review. The structure suggestion relies on the general career-service sources.',
    sourceIds: ['netherlands-cv', 'mit-ats', 'imperial-cv'],
  },
  {
    id: 'india', code: 'IN', name: 'India', zone: 'South Asia', layout: 'graduate',
    note: 'Campus-process rules are specific',
    structure: 'Education-first Graduate is useful for an early-career application; experienced applicants can choose a work-history layout. Course projects stay clearly labelled as projects.',
    photo: 'Check the process. IIT Madras’s 2025–26 internship guidelines exclude photos apart from its logo, but that rule belongs to that institute’s process.',
    application: 'Use the institution’s prescribed template for campus placement when required. For direct employer applications, include useful contact information and follow the vacancy rather than copying campus-only restrictions.',
    evidenceNote: 'The IIT Madras guide also has a no-contact rule and claim-verification requirements. These are process-specific examples, not requirements for all Indian resumes.',
    sourceIds: ['iitm-internship', 'imperial-cv', 'mit-ats'],
  },
];
