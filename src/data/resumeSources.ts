export interface ResumeSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  scope: string;
  status: 'reviewed' | 'further-reading';
}

export const SOURCE_REVIEW_DATE = '28 October 2026';

/** Public primary/institutional references. These are not template endorsements. */
export const RESUME_SOURCES: ResumeSource[] = [
  {
    id: 'mit-ats', publisher: 'MIT CAPD', title: 'Make your resume ATS-friendly',
    url: 'https://capd.mit.edu/resources/make-your-resume-ats-friendly/',
    scope: 'Readable fonts, conventional headings, avoiding graphics/tables/text boxes, following file instructions and checking extracted text. Formatting advice, not a hiring guarantee.', status: 'reviewed',
  },
  {
    id: 'harvard-bullet', publisher: 'Harvard Mignone Center', title: 'Harvard College bullet point resume template',
    url: 'https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/',
    scope: 'An original university example with Word, accessible Word and Google Docs links. Reference for section hierarchy and bullet structure; our designs are independent.', status: 'reviewed',
  },
  {
    id: 'imperial-cv', publisher: 'Imperial College London', title: 'Writing a CV',
    url: 'https://www.imperial.ac.uk/careers/applications-and-interviews/cv/',
    scope: 'Consistent formatting, relevant evidence and choosing section order for your experience. Used for CV structure, not its broader statements about ATS scoring.', status: 'reviewed',
  },
  {
    id: 'greenhouse-parse', publisher: 'Greenhouse Support', title: 'Unsuccessful resume parse',
    url: 'https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse',
    scope: 'Vendor-documented parsing problems include photos, graphics, columns, tables, header/footer contact details and files over 2.5 MB. This describes Greenhouse, not every ATS.', status: 'reviewed',
  },
  {
    id: 'uk-cv', publisher: 'UK National Careers Service', title: 'How to write a CV',
    url: 'https://nationalcareers.service.gov.uk/careers-advice/cv-sections',
    scope: 'Clear fonts at least 11 pt, headings and bullets, relevant education/experience, and omitting age, birth date, marital status and nationality.', status: 'reviewed',
  },
  {
    id: 'us-eeoc', publisher: 'U.S. EEOC', title: 'Prohibited employment policies / practices',
    url: 'https://www.eeoc.gov/prohibited-employment-policiespractices',
    scope: 'Advises employers not to ask for an applicant photograph before an accepted job offer. This is employer guidance, not a claim that an applicant photo is universally illegal.', status: 'reviewed',
  },
  {
    id: 'canada-jobbank', publisher: 'Government of Canada Job Bank', title: 'How to write a good resume',
    url: 'https://www.jobbank.gc.ca/findajob/resources/write-good-resume',
    scope: 'Tailor relevant experience, keep the document clear and avoid including a photograph or unnecessary personal details.', status: 'reviewed',
  },
  {
    id: 'qld-resume', publisher: 'Queensland Government', title: 'Writing a resume',
    url: 'https://www.qld.gov.au/jobs/finding/resume',
    scope: 'Simple, clear resumes, generally 1–3 pages depending on your experience, with skills, qualifications and employment history. Follow the particular job advertisement.', status: 'reviewed',
  },
  {
    id: 'france-cv', publisher: 'Service Public (France)', title: 'Curriculum vitae — application for a job',
    url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F33336?lang=en',
    scope: 'Job-relevant experience and training; an identity photograph is listed as possible, not mandatory. Information requested must relate to the proposed position.', status: 'reviewed',
  },
  {
    id: 'bdjobs-resume', publisher: 'Bdjobs', title: 'Job seekers’ frequently asked questions',
    url: 'https://mybdjobs.bdjobs.com/mybdjobs/faq.asp',
    scope: 'Distinguishes the form-generated Bdjobs Resume from a separately uploaded personalized Word/PDF resume. Platform fields do not establish a universal corporate CV rule.', status: 'reviewed',
  },
  {
    id: 'nyuad-cv', publisher: 'NYU Abu Dhabi Career Development Center', title: 'Building a Curriculum Vitae (PDF)',
    url: 'https://nyuad.nyu.edu/content/dam/nyuad/academics/undergraduate/career-development/documents/cdc-building-cv.pdf',
    scope: 'Student-focused examples, reverse chronology, relevant skills and evidence-based bullets. Its one-page advice is contextual; its table suggestion differs from MIT/Greenhouse, so we use linear body text.', status: 'reviewed',
  },
  {
    id: 'iitm-internship', publisher: 'IIT Madras', title: 'Internship resume guidelines 2025–26 (PDF)',
    url: 'https://internship.iitm.ac.in/downloads/Internship_Resume_Guidelines_2025-26.pdf',
    scope: 'Rules for that institute’s internship process, including evidence for claims and labelling course projects. Its no-contact and logo rules are process-specific, not India-wide guidance.', status: 'reviewed',
  },
  {
    id: 'saudi-work', publisher: 'Saudi Ministry of Human Resources', title: 'Employment of non-Saudis',
    url: 'https://www.hrsd.gov.sa/en/%D8%AA%D9%88%D8%B8%D9%8A%D9%81-%D8%BA%D9%8A%D8%B1-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D9%8A%D9%86',
    scope: 'Work-permit and employment context only. It does not establish a required CV photo, biography section or national template.', status: 'reviewed',
  },
  {
    id: 'germany-application', publisher: 'Make it in Germany', title: 'Applying for a job',
    url: 'https://www.make-it-in-germany.com/en/working-in-germany/job-search-application/application',
    scope: 'Federal information portal for current application guidance. Direct access was blocked during this review; linked for further reading, not used to impose a photo rule.', status: 'further-reading',
  },
  {
    id: 'netherlands-cv', publisher: 'UWV / Werk.nl', title: 'Cv maken',
    url: 'https://www.werk.nl/nl/solliciteren/cv-maken',
    scope: 'Public employment-service CV guidance. Direct access could not be verified during this review; check the current page for local advice.', status: 'further-reading',
  },
];

export function sourcesFor(ids: string[]): ResumeSource[] {
  return ids.map((id) => RESUME_SOURCES.find((source) => source.id === id)).filter((source): source is ResumeSource => Boolean(source));
}
