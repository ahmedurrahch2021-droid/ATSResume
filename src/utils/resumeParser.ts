import { ResumeData } from '../types';
import { documentPlainText } from './resumeDocument';

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: 'Alex Morgan',
  targetTitle: 'Senior Full Stack Software Engineer',
  email: 'alex.morgan@email.com',
  phone: '(555) 234-5678',
  location: 'San Francisco, CA',
  linkedin: 'linkedin.com/in/alexmorgan-dev',
  portfolio: 'github.com/alexmorgan-fullstack',
  summary: 'Senior Full Stack Engineer with 6+ years designing scalable cloud-native architectures, high-concurrency microservices, and reactive TypeScript frontends. Spearheaded distributed systems supporting 1.8M active daily users with 99.99% uptime SLA.',
  experience: [
    {
      id: 'exp-1',
      role: 'Lead Full Stack Engineer',
      company: 'Apex Cloud Solutions',
      location: 'San Francisco, CA',
      dates: '2022 – Present',
      bullets: [
        'Architected and deployed reactive real-time telemetry pipeline using React, Node.js, and Redis, reducing dashboard load times by 48% across 1.2M sessions.',
        'Spearheaded automated CI/CD pipeline migration to Kubernetes and GitHub Actions, cutting staging deployment cycles from 45 minutes to 7 minutes.',
        'Mentored 6 junior/mid-level engineers, enforcing strict TypeScript type safety and unit test coverage that eliminated 34% of production regressions.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Software Engineer II',
      company: 'HyperScale Metrics Inc.',
      location: 'Austin, TX',
      dates: '2019 – 2022',
      bullets: [
        'Engineered 14 high-throughput REST and GraphQL microservices processing over $4.2M in monthly tokenized billing transactions with zero data loss.',
        'Optimized PostgreSQL indexing and caching strategies, reducing p99 API query response latencies from 320ms to 42ms.',
        'Collaborated with product and security leads to achieve SOC-2 Type II certification across all consumer-facing endpoints.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.S. in Computer Science',
      institution: 'University of Texas at Austin',
      location: 'Austin, TX',
      dates: '2015 – 2019',
      gpa: '3.82 / 4.0'
    }
  ],
  skills: {
    languages: 'TypeScript, JavaScript (ES6+), Python, Go, SQL, HTML5, CSS3',
    frameworks: 'React 19, Next.js, Node.js, Express, Tailwind CSS, Redux Toolkit',
    toolsAndCloud: 'Docker, Kubernetes, AWS (S3, ECS, Lambda), PostgreSQL, Redis, Git, Vite',
    methodologies: 'Agile/Scrum, Test-Driven Development (TDD), Microservices, REST & GraphQL APIs'
  },
  projects: [
    {
      id: 'proj-1',
      name: 'OmniStream Analytics Engine',
      roleOrTech: 'TypeScript, WebSockets, Kafka, Docker',
      link: 'github.com/alexmorgan/omnistream',
      bullets: [
        'Built an open-source real-time event aggregation engine processing up to 25,000 events/sec with memory footprint under 180MB.',
        'Garnered 1,400+ GitHub stars and featured in Hacker News top developer tool roundups.'
      ]
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (2023)',
    'Certified Kubernetes Application Developer (CKAD)'
  ],
  languages: [
    { id: 'lang-1', name: 'English', level: 'Native' },
    { id: 'lang-2', name: 'Spanish', level: 'B2 (Upper Intermediate)' }
  ],
  competitiveProgramming: [
    { id: 'cp-1', platform: 'LeetCode', handle: 'alexm_dev', rating: '2040', badgeOrRank: 'Guardian (Top 1.5%)' },
    { id: 'cp-2', platform: 'GitHub', handle: 'alexmorgan-fullstack', badgeOrRank: '1,400+ Stars' }
  ]
};

export const BANGLADESH_TECH_SAMPLE: ResumeData = {
  fullName: 'Tahmidur Rahman',
  targetTitle: 'Senior Full Stack Software Engineer (Remote & Global)',
  email: 'tahmid.rahman.dev@gmail.com',
  phone: '+880 1712-345678',
  location: 'Dhaka, Bangladesh (Open to Global Remote / Relocation)',
  linkedin: 'linkedin.com/in/tahmid-rahman-eng',
  portfolio: 'tahmid-tech.dev',
  github: 'github.com/tahmid-rahman-bd',
  targetMarket: 'bangladesh',
  summary: 'Senior Software Engineer with 5+ years specializing in distributed systems, high-concurrency Node.js/Go backends, and responsive React/TypeScript architectures. Designed high-volume payment processing engines handling 120,000+ daily transactions with 99.98% uptime for leading digital financial ecosystems. Active open-source contributor and competitive programmer.',
  experience: [
    {
      id: 'exp-bd1',
      role: 'Senior Software Engineer (Backend & Microservices)',
      company: 'Fintech Innovations Ltd.',
      location: 'Dhaka, Bangladesh',
      dates: '2022 – Present',
      bullets: [
        'Architected real-time merchant settlement microservice using Go, Kafka, and PostgreSQL, slashing batch reconciliation latency from 3.5 hours to 12 minutes.',
        'Engineered zero-downtime database failover protocol handling 120,000+ peak daily payment transactions with 99.98% availability.',
        'Spearheaded Docker containerization and Kubernetes cluster orchestration, reducing production deployment rollbacks by 70%.'
      ]
    },
    {
      id: 'exp-bd2',
      role: 'Full Stack Software Engineer',
      company: 'Apex Digital Solutions',
      location: 'Dhaka, Bangladesh',
      dates: '2020 – 2022',
      bullets: [
        'Built reactive enterprise dashboard in React and TypeScript serving 40,000+ concurrent enterprise users with sub-80ms API response times.',
        'Refactored legacy REST APIs into unified GraphQL gateway with Redis caching, cutting bandwidth consumption by 42% across mobile networks.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-bd1',
      degree: 'B.Sc. in Computer Science & Engineering (CSE)',
      institution: 'Bangladesh University of Engineering and Technology (BUET)',
      location: 'Dhaka, Bangladesh',
      dates: '2016 – 2020',
      gpa: '3.86 / 4.0'
    }
  ],
  skills: {
    languages: 'TypeScript, JavaScript (ES6+), Go, Python, SQL, C++, HTML5, CSS3',
    frameworks: 'React, Next.js, Node.js, Express, Gin (Go), Tailwind CSS, Redux',
    toolsAndCloud: 'Docker, Kubernetes, AWS, PostgreSQL, Redis, Kafka, Git, Linux',
    methodologies: 'Distributed Microservices, REST & GraphQL APIs, CI/CD, Agile/Scrum'
  },
  languages: [
    { id: 'l-bd1', name: 'Bengali (Bangla)', level: 'Native' },
    { id: 'l-bd2', name: 'English', level: 'C1 (Advanced)' }
  ],
  competitiveProgramming: [
    { id: 'cp-bd1', platform: 'Codeforces', handle: 'tahmid_code', rating: '1620', badgeOrRank: 'Expert' },
    { id: 'cp-bd2', platform: 'LeetCode', handle: 'tahmid_buet', rating: '1980', badgeOrRank: 'Knight (Top 4%)' },
    { id: 'cp-bd3', platform: 'GitHub', handle: 'tahmid-rahman-bd', badgeOrRank: '450+ Contributions / Year' }
  ],
  projects: [
    {
      id: 'proj-bd1',
      name: 'BanglaNLP Open Sentiment Engine',
      roleOrTech: 'Python, FastAPI, PyTorch, Transformers',
      link: 'github.com/tahmid-rahman-bd/banglanlp-sentiment',
      bullets: [
        'Engineered an open-source Bengali natural language processing library with 92.4% accuracy on customer sentiment classification.',
        'Adopted by 8 local startup teams for customer feedback automation.'
      ]
    }
  ],
  certifications: [
    'AWS Certified Developer – Associate (2024)',
    'Meta Certified Front-End Developer'
  ]
};

export const SAMPLE_RESUMES: Record<'developer' | 'product' | 'devops' | 'bangladesh', ResumeData> = {
  developer: DEFAULT_RESUME_DATA,
  bangladesh: BANGLADESH_TECH_SAMPLE,
  product: {
    fullName: 'Sarah Chen',
    targetTitle: 'Principal Product Manager',
    email: 'sarah.chen.pm@email.com',
    phone: '(555) 789-0123',
    location: 'Seattle, WA',
    linkedin: 'linkedin.com/in/sarahchen-pm',
    portfolio: 'sarahchen-portfolio.com',
    summary: 'Data-driven Principal Product Manager with 7+ years orchestrating B2B SaaS product lifecycles, user journey optimization, and revenue growth. Led cross-functional squads delivering $8.4M ARR new product lines.',
    experience: [
      {
        id: 'exp-p1',
        role: 'Principal Product Manager, Core Growth',
        company: 'Vanguard Enterprise SaaS',
        location: 'Seattle, WA',
        dates: '2021 – Present',
        bullets: [
          'Spearheaded user onboarding redesign that lifted self-serve trial-to-paid conversion rates from 3.2% to 7.8%, unlocking $3.4M in incremental annual revenue.',
          'Conducted 60+ user discovery interviews and analyzed telemetry via Mixpanel, identifying core churn drivers and decreasing 90-day churn by 22%.',
          'Managed product roadmap across 3 cross-functional agile engineering pods (18 developers, 3 designers) with a 94% on-time sprint velocity.'
        ]
      },
      {
        id: 'exp-p2',
        role: 'Senior Product Manager',
        company: 'FinPulse Technologies',
        location: 'San Jose, CA',
        dates: '2018 – 2021',
        bullets: [
          'Launched automated invoicing and payouts feature used by 18,000 SMB clients within first 6 months of release.',
          'Pioneered AI-assisted invoice reconciliation workflow that slashed customer support ticket volume by 41%.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-p1',
        degree: 'B.A. in Economics & Informatics',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        dates: '2014 – 2018',
        gpa: '3.78 / 4.0'
      }
    ],
    skills: {
      languages: 'SQL, Python for Data Analysis, Tableau, Amplitude, Mixpanel',
      frameworks: 'Agile Scrum, Kanban, OKR Frameworks, User Story Mapping, JTBD',
      toolsAndCloud: 'Jira, Confluence, Figma, Google Analytics 4, Salesforce CRM, Postman',
      methodologies: 'A/B Testing, Quantitative & Qualitative Research, GTM Strategy, PRDs'
    },
    projects: [
      {
        id: 'proj-p1',
        name: 'OpenMetrics PM Benchmark Framework',
        roleOrTech: 'Open Source Community Guide',
        link: 'pmbenchmarks.org',
        bullets: [
          'Authored industry benchmark report downloaded by 12,000+ SaaS product leaders worldwide.'
        ]
      }
    ],
    certifications: [
      'Reforge Growth Series Graduate',
      'Certified Scrum Product Owner (CSPO)'
    ]
  },
  devops: {
    fullName: 'Marcus Vance',
    targetTitle: 'Senior Site Reliability & Cloud DevOps Engineer',
    email: 'marcus.vance.devops@email.com',
    phone: '(555) 456-7890',
    location: 'Denver, CO (Remote)',
    linkedin: 'linkedin.com/in/marcusvance-sre',
    portfolio: 'github.com/marcusvance-infra',
    summary: 'Senior SRE & DevOps Engineer with 8+ years architecting zero-trust cloud infrastructure, multi-region Kubernetes clusters, and automated Terraform deployments. Maintained 99.995% uptime across mission-critical fintech infrastructure.',
    experience: [
      {
        id: 'exp-d1',
        role: 'Senior SRE & Infrastructure Lead',
        company: 'Nexus Financial Core',
        location: 'Denver, CO',
        dates: '2021 – Present',
        bullets: [
          'Engineered multi-region AWS EKS clusters hosting 120+ microservices, improving disaster recovery RTO from 4 hours to under 3 minutes.',
          'Implemented Infrastructure-as-Code with Terraform and Terragrunt, standardizing 45+ enterprise environments and eliminating manual drift.',
          'Built Prometheus and Grafana alerting topology that reduced mean-time-to-detection (MTTD) from 18 minutes to 45 seconds.'
        ]
      },
      {
        id: 'exp-d2',
        role: 'Cloud DevOps Engineer',
        company: 'StrataScale Networks',
        location: 'Boulder, CO',
        dates: '2017 – 2021',
        bullets: [
          'Cut enterprise AWS cloud compute expenditures by $260k annually by instituting Karpenter dynamic node autoscaling and Spot instances.',
          'Automated security vulnerability scanning via Trivy and SonarQube in GitLab CI, resolving 180+ critical CVEs prior to production deployments.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-d1',
        degree: 'B.S. in Computer Engineering',
        institution: 'Colorado School of Mines',
        location: 'Golden, CO',
        dates: '2013 – 2017'
      }
    ],
    skills: {
      languages: 'Bash, Python, Go, HCL (Terraform), YAML, SQL',
      frameworks: 'Kubernetes (K8s), Helm, Docker, ArgoCD, GitHub Actions, GitLab CI',
      toolsAndCloud: 'AWS (EKS, IAM, RDS, Route53), GCP, Terraform, Ansible, Prometheus, Datadog',
      methodologies: 'GitOps, Zero-Trust Architecture, Chaos Engineering, High Availability (HA)'
    },
    projects: [
      {
        id: 'proj-d1',
        name: 'KubeSentry Auto-Remediation Operator',
        roleOrTech: 'Go, Kubernetes CRD Operator',
        link: 'github.com/marcusvance/kubesentry',
        bullets: [
          'Developed lightweight Kubernetes controller to automatically evict and cycle pods exhibiting silent OOM/zombie behavior.'
        ]
      }
    ],
    certifications: [
      'Certified Kubernetes Administrator (CKA)',
      'AWS Certified DevOps Engineer – Professional',
      'HashiCorp Certified: Terraform Associate'
    ]
  }
};

/**
 * Intelligent client-side parser to extract structured resume fields from raw text
 */
/* -------------------------------------------------------------------------- */
/* Resume text → structured data                                               */
/* -------------------------------------------------------------------------- */

/**
 * What the parser could and could not read.
 *
 * This is the honest half of the import: a field that was not found is
 * reported as missing, never filled with a placeholder. A resume that arrives
 * with an invented employer is worse than one that arrives blank.
 */
export interface ParseFieldReport {
  key:
    | 'name'
    | 'title'
    | 'email'
    | 'phone'
    | 'location'
    | 'linkedin'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'certifications';
  label: string;
  found: boolean;
  detail: string;
}

export interface ParseReport {
  fields: ParseFieldReport[];
  found: number;
  total: number;
}

export interface ParsedResume {
  resume: ResumeData;
  report: ParseReport;
}

type SectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'languages'
  | 'awards'
  | 'profiles'
  | 'additional'
  | 'other';

const HEADING_RULES: Array<{ key: SectionKey; re: RegExp }> = [
  { key: 'summary', re: /^(professional\s+|career\s+)?(summary|profile|objective|about( me)?)$/i },
  { key: 'experience', re: /^(?:(work|professional|employment|career|relevant)?\s*(experience|history|employment history)|employment|internships?)$/i },
  { key: 'education', re: /^(education|academic (background|qualifications)|academics|qualifications)$/i },
  { key: 'skills', re: /^(technical\s+|professional\s+|technical & professional\s+)?(skills|skills & tools|technologies|core competencies|expertise)$/i },
  { key: 'certifications', re: /^(certifications?( & honors)?|licenses?|licences?|courses?|training)$/i },
  { key: 'projects', re: /^(projects?|personal projects|selected projects|featured projects)$/i },
  { key: 'languages', re: /^(spoken\s+)?languages?$/i },
  { key: 'profiles', re: /^(developer profiles|competitive programming( & (profiles|developer profiles))?)$/i },
  { key: 'additional', re: /^additional information$/i },
  { key: 'awards', re: /^(awards?|honors?|achievements?)$/i },
];

const MONTH = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*';
const DATE_TOKEN = `(?:${MONTH}\\.?\\s*\\d{4}|\\d{1,2}\\/\\d{4}|\\d{4})`;
const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN})\\s*(?:-|–|—|to|until)\\s*(${DATE_TOKEN}|present|current|now|ongoing)`,
  'i',
);

const DEGREE_RE =
  /\b(b\.?\s?sc|b\.?\s?a|b\.?\s?tech|b\.?\s?e|bachelor|m\.?\s?sc|m\.?\s?a|m\.?\s?tech|master|mba|ph\.?\s?d|diploma|hsc|ssc|higher secondary|secondary|associate|llb|b\.?\s?com|m\.?\s?com)\b/i;

const INSTITUTION_RE = /\b(university|college|institute|school|polytechnic|academy)\b/i;

function normaliseHeading(line: string): SectionKey | null {
  const cleaned = line
    .replace(/[:\s]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (!cleaned || cleaned.length > 45) return null;

  for (const rule of HEADING_RULES) {
    if (rule.re.test(cleaned)) return rule.key;
  }
  return null;
}

function isBullet(line: string): boolean {
  return /^\s*(?:[•▪◦‣·*\-–—]|\d+[.)])\s+/.test(line);
}

function stripBullet(line: string): string {
  return line.replace(/^\s*(?:[•▪◦‣·*\-–—]|\d+[.)])\s+/, '').trim();
}

interface TextSection {
  key: SectionKey | 'header';
  lines: string[];
}

/** Split the document into the sections a parser would segment on. */
function segment(text: string): TextSection[] {
  const lines = text.split('\n');
  const sections: TextSection[] = [{ key: 'header', lines: [] }];

  for (const raw of lines) {
    const line = raw.trim();
    const heading = line.length > 0 && line.length <= 45 ? normaliseHeading(line) : null;
    if (heading) {
      sections.push({ key: heading, lines: [] });
      continue;
    }
    sections[sections.length - 1].lines.push(line);
  }

  return sections.filter((s) => s.lines.some((l) => l.trim()));
}

function sectionText(sections: TextSection[], key: SectionKey): string[] {
  return sections.filter((s) => s.key === key).flatMap((s) => s.lines);
}

function extractDateRange(line: string): { raw: string; text: string } | null {
  const match = line.match(DATE_RANGE_RE);
  if (!match) return null;
  const text = match[0]
    .replace(/\s*(?:-|–|—|to|until)\s*/i, ' – ')
    .replace(/\bpresent\b|\bcurrent\b|\bnow\b|\bongoing\b/i, 'Present');
  return { raw: match[0], text };
}

function looksLikeName(line: string): boolean {
  const clean = line.trim();
  if (!clean || clean.length < 3 || clean.length > 42) return false;
  if (/[@|/\\\d,:]/.test(clean)) return false;
  if (/https?:|linkedin|github|www\./i.test(clean)) return false;
  if (normaliseHeading(clean)) return false;
  const words = clean.split(/\s+/);
  if (words.length < 2 || words.length > 5) return false;
  return /^[\p{L}][\p{L}\p{M}.'’\- ]+$/u.test(clean);
}

function splitRoleCompany(line: string): { role: string; company: string } {
  // "Software Engineer at Acme" / "Software Engineer | Acme" / "Acme — Software Engineer"
  const at = line.split(/\s+at\s+/i);
  if (at.length === 2) return { role: at[0].trim(), company: at[1].trim() };

  const parts = line
    .split(/\s*[|•·]\s*|\s+[–—]\s+|\s+-\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length >= 2) {
    // Role first is the common resume convention.
    return { role: parts[0], company: parts[1] };
  }
  return { role: line.trim(), company: '' };
}

const SKILL_BUCKETS: Record<keyof ResumeData['skills'], RegExp> = {
  languages: /\b(javascript|typescript|python|java|kotlin|swift|go|golang|rust|ruby|php|c\+\+|c#|sql|r|scala|dart|bash|html|css|sass|matlab|perl|objc|objective-c)\b/i,
  frameworks: /\b(react|next\.?js|vue|angular|svelte|node\.?js|express|nest|django|flask|fastapi|spring|laravel|rails|\.net|flutter|react native|tailwind|bootstrap|jquery|graphql|rest|redux)\b/i,
  toolsAndCloud: /\b(git|github|gitlab|docker|kubernetes|aws|azure|gcp|firebase|jenkins|terraform|ansible|jira|confluence|figma|postman|linux|nginx|redis|postgres|postgresql|mysql|mongodb|sqlite|supabase|vercel|netlify|excel|tableau|power bi|sap|salesforce)\b/i,
  methodologies: /\b(agile|scrum|kanban|tdd|bdd|ci\/?cd|devops|microservices|lean|six sigma|itil|prince2|waterfall|okr|design thinking)\b/i,
};

function bucketSkills(raw: string[]): ResumeData['skills'] {
  const buckets: Record<keyof ResumeData['skills'], string[]> = {
    languages: [],
    frameworks: [],
    toolsAndCloud: [],
    methodologies: [],
  };

  const seen = new Set<string>();

  let labelledBucket: keyof ResumeData['skills'] | undefined;
  for (let skill of raw) {
    const label = skill.match(/^(core skills|languages|specialist tools|frameworks|platforms & software|cloud & tools|methods & standards|methodologies)\s*:\s*/i);
    if (label) {
      const group = label[1].toLowerCase();
      labelledBucket = /core skills|languages/.test(group) ? 'languages' : /specialist tools|frameworks/.test(group) ? 'frameworks' : /methods & standards|methodologies/.test(group) ? 'methodologies' : 'toolsAndCloud';
      skill = skill.slice(label[0].length).trim();
    }
    const key = skill.toLowerCase();
    if (!skill || seen.has(key)) continue;
    seen.add(key);

    if (labelledBucket) { buckets[labelledBucket].push(skill); continue; }
    let placed = false;
    for (const [bucket, re] of Object.entries(SKILL_BUCKETS) as Array<
      [keyof ResumeData['skills'], RegExp]
    >) {
      if (re.test(skill)) {
        buckets[bucket].push(skill);
        placed = true;
        break;
      }
    }
    // Unrecognised skills are not guessed at. They land in the general bucket,
    // which is the one every profession has, and the report says to check them.
    if (!placed) buckets.languages.push(skill);
  }

  return {
    languages: buckets.languages.join(', '),
    frameworks: buckets.frameworks.join(', '),
    toolsAndCloud: buckets.toolsAndCloud.join(', '),
    methodologies: buckets.methodologies.join(', '),
  };
}

function parseExperience(lines: string[]): ResumeData['experience'] {
  type Record_ = { head: string[]; bullets: string[]; dates: string };
  const records: Record_[] = [];
  let head: string[] = [];
  let bullets: string[] = [];
  let dates = '';

  const flush = () => {
    if (head.length || bullets.length || dates) records.push({ head, bullets, dates });
    head = [];
    bullets = [];
    dates = '';
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const raw = lines[lineIndex];
    const line = raw.trim();
    if (!line) continue;

    const range = extractDateRange(line);
    if (range) {
      const remainder = line.replace(range.raw, '').replace(/[|·•,\s]+$/, '').trim();

      // "Software Engineer | Acme | Jan 2022 – Present" is one complete record.
      if (remainder) {
        flush();
        head.push(remainder);
        dates = range.text;
        continue;
      }

      // "Software Engineer at Acme" then a bare date line: the date belongs to
      // the role above it, not to a new empty role.
      if (!dates && (head.length > 0 || bullets.length > 0)) {
        dates = range.text;
        continue;
      }

      // The previous role is complete; this date opens the next one.
      flush();
      dates = range.text;
      continue;
    }

    if (isBullet(line)) {
      bullets.push(stripBullet(line));
      continue;
    }

    if (bullets.length > 0) {
      const nextLine = lines.slice(lineIndex + 1).find((value) => value.trim()) ?? '';
      const afterBlank = lineIndex > 0 && !lines[lineIndex - 1].trim();
      const startsRole = Boolean(extractDateRange(nextLine)) || (afterBlank && line.length < 100 && /^\p{Lu}/u.test(line) && /\s+at\s+|\s[|·]\s/.test(line));
      if (startsRole) { flush(); head.push(line); }
      else bullets[bullets.length - 1] += ` ${line}`;
      continue;
    }

    head.push(line);
  }
  flush();

  return records
    .filter((r) => r.head.length > 0 || r.bullets.length > 0)
    .map((r, index) => {
      const header = r.head.length > 1 && !/[|·•]|\s+at\s+/i.test(r.head[0]) ? `${r.head[0]} | ${r.head.slice(1).join(' | ')}` : r.head.join(' | ');
      const { role, company } = splitRoleCompany(header);
      return {
        id: `exp-imported-${index + 1}`,
        role,
        company,
        location: pickLocation(r.head),
        dates: r.dates,
        bullets: r.bullets,
      };
    })
    // A date with no role and no bullets is not a job; it is noise between jobs.
    .filter((item) => item.role || item.bullets.length > 0);
}

function parseEducation(lines: string[]): ResumeData['education'] {
  const education: ResumeData['education'] = [];
  let pending: string[] = [];

  const isGpaLine = (line: string) => /^(gpa|grade|cgpa)\b[:.\s]*[\d.]/i.test(line.trim());
  const gpaOf = (line: string) => line.match(/[\d.]+\s*(?:\/\s*[\d.]+)?\s*$/)?.[0]?.trim() ?? '';

  const flush = (dates: string) => {
    if (!pending.length) return;
    const parts = pending.flatMap((line) => line.split(/\s*\|\s*/)).filter(Boolean);
    const degreeLine = parts.find((l) => DEGREE_RE.test(l)) || parts[0];
    const institutionLine = parts.find((l) => INSTITUTION_RE.test(l)) || '';
    const gpaLine = parts.find(isGpaLine);
    const gpa = gpaLine ? gpaOf(gpaLine) : '';

    education.push({
      id: `edu-imported-${education.length + 1}`,
      degree: degreeLine.replace(/\s{2,}/g, ' ').trim(),
      institution: institutionLine === degreeLine ? '' : institutionLine,
      location: '',
      dates,
      ...(gpa ? { gpa } : {}),
    });
    pending = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // "GPA: 3.62" belongs to the degree above it, not to a new qualification.
    if (isGpaLine(line)) {
      const last = education[education.length - 1];
      const gpa = gpaOf(line);
      if (last && gpa && pending.length === 0) {
        last.gpa = gpa;
        continue;
      }
      if (!pending.length) continue;
      pending.push(line);
      continue;
    }

    const range = extractDateRange(line);
    if (range) {
      const remainder = line.replace(range.raw, '').replace(/[|·•,\s]+$/, '').trim();
      if (remainder) pending.push(remainder);
      flush(range.text);
      continue;
    }
    if (isBullet(line)) {
      const bullet = stripBullet(line);
      if (DEGREE_RE.test(bullet) || INSTITUTION_RE.test(bullet)) {
        flush('');
        pending.push(bullet);
      }
      continue;
    }
    if (DEGREE_RE.test(line) && pending.some((value) => DEGREE_RE.test(value))) flush('');
    pending.push(line);
  }
  flush('');

  return education.filter((e) => e.degree && !isGpaLine(e.degree));
}

function parseSkills(lines: string[]): string[] {
  return lines
    .join(', ')
    .split(/[,;|•▪◦‣·\t]|\s{3,}/)
    .map((s) => s.replace(/^[-–—*]\s*/, '').replace(/\.$/, '').trim())
    .filter((s) => s.length > 1 && s.length < 40 && !/^(skills?|tools?|technologies)$/i.test(s));
}

function parseProjects(lines: string[]): ResumeData['projects'] {
  const projects: ResumeData['projects'] = [];
  let current: ResumeData['projects'][number] | null = null;
  let afterBlank = true;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { afterBlank = true; continue; }
    if (isBullet(line)) { if (current) current.bullets.push(stripBullet(line)); continue; }
    if (/^(?:https?:\/\/|(?:www\.)?github\.com\/)/i.test(line) && current) { current.link = line; continue; }
    if (!current || afterBlank) {
      const [name, ...tools] = line.split(/\s*[|·]\s*/);
      current = { id: `project-imported-${projects.length + 1}`, name, roleOrTech: tools.join(' | '), bullets: [] };
      projects.push(current);
    } else if (current.bullets.length > 0) current.bullets[current.bullets.length - 1] += ` ${line}`;
    else if (!current.roleOrTech) current.roleOrTech = line;
    else current.bullets.push(line);
    afterBlank = false;
  }
  return projects;
}

/** Restrict phone matching to contact-line segments so dates cannot join across lines. */
export function pickPhone(lines: string[]): string {
  for (const line of lines) {
    for (const segment of line.split(/[|·•]/)) {
      if (/@|https?:|linkedin|github/i.test(segment)) continue;
      for (const value of segment.match(/\+?\d[\d ().-]{5,}\d/g) ?? []) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) continue;
        if (/^(?:19|20)\d{2}\s*[-–—]\s*(?:19|20)\d{2}$/.test(value.trim())) continue;
        return value.trim();
      }
    }
  }
  return '';
}

export function pickLocation(lines: string[]): string {
  // A location is usually one segment of the contact line, not its own line:
  // "email · +880 17… · Dhaka, Bangladesh · linkedin.com/in/…"
  const segments = lines
    .flatMap((line) => line.split(/\s*[|·•]\s*|\s{3,}/))
    .map((s) => s.trim())
    .filter(Boolean);

  const isPlace = (s: string) => {
    if (!s || s.length > 45) return false;
    if (/[@\d/\\]|https?:|linkedin|github|www\./i.test(s)) return false;
    if (looksLikeName(s)) return false;
    return /^[\p{L}\p{M}.'’\- ]+,\s*[\p{L}\p{M}.'’\- ]+(?:\s*\([^)]*\))?$/u.test(s);
  };

  return segments.find(isPlace) ?? '';
}

function buildReport(resume: ResumeData, sections: TextSection[]): ParseReport {
  const hasSection = (key: SectionKey) => sections.some((s) => s.key === key);

  const fields: ParseFieldReport[] = [
    { key: 'name', label: 'Name', found: Boolean(resume.fullName), detail: resume.fullName || 'not found in the first lines' },
    { key: 'title', label: 'Target title', found: Boolean(resume.targetTitle), detail: resume.targetTitle || 'no headline under the name' },
    { key: 'email', label: 'Email', found: Boolean(resume.email), detail: resume.email || 'no email pattern found' },
    { key: 'phone', label: 'Phone', found: Boolean(resume.phone), detail: resume.phone || 'no phone number found' },
    { key: 'location', label: 'Location', found: Boolean(resume.location), detail: resume.location || 'no "City, Country" line found' },
    { key: 'linkedin', label: 'LinkedIn', found: Boolean(resume.linkedin), detail: resume.linkedin || 'no linkedin.com/in link' },
    { key: 'summary', label: 'Summary', found: Boolean(resume.summary), detail: resume.summary ? `${resume.summary.split(/\s+/).length} words` : hasSection('summary') ? 'heading found, text empty' : 'no summary section' },
    { key: 'experience', label: 'Experience', found: resume.experience.length > 0, detail: resume.experience.length ? `${resume.experience.length} role(s), ${resume.experience.reduce((n, e) => n + e.bullets.length, 0)} bullet(s); review names and dates` : 'no role mapped' },
    { key: 'education', label: 'Education', found: resume.education.length > 0, detail: resume.education.length ? `${resume.education.length} entry(ies)` : 'no degree line found' },
    { key: 'skills', label: 'Skills', found: Boolean(resume.skills.languages || resume.skills.frameworks || resume.skills.toolsAndCloud || resume.skills.methodologies), detail: hasSection('skills') ? 'read, check the four boxes' : 'no skills section' },
    { key: 'certifications', label: 'Certifications', found: resume.certifications.length > 0, detail: resume.certifications.length ? `${resume.certifications.length} item(s)` : 'none found' },
  ];

  return {
    fields,
    found: fields.filter((f) => f.found).length,
    total: fields.length,
  };
}

/**
 * Read a resume's text into structured fields.
 *
 * Every value comes from the text. Where the text does not contain a field,
 * the field is empty and the report says so.
 */
export function parseResumeText(text: string): ParsedResume {
  const sections = segment(text);
  const headerLines = sections.find((s) => s.key === 'header')?.lines ?? [];
  const headerText = headerLines.join('\n');

  const email = headerText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ?? '';
  const phone = pickPhone(headerLines);
  const linkedin = headerText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i)?.[0] ?? '';
  const github = headerText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i)?.[0] ?? '';

  const nameLine = headerLines.filter(Boolean).slice(0, 5).find(looksLikeName) ?? '';

  // The title is the first non-contact line after the name.
  let targetTitle = '';
  if (nameLine) {
    const nameIndex = headerLines.indexOf(nameLine);
    for (const candidate of headerLines.slice(nameIndex + 1, nameIndex + 4)) {
      const line = candidate.trim();
      if (!line || line.length > 70) continue;
      if (/@|https?:|linkedin|github|\d{3}/i.test(line)) continue;
      if (pickLocation([line])) continue;
      if (normaliseHeading(line)) continue;
      targetTitle = line;
      break;
    }
  }

  const summaryLines = sectionText(sections, 'summary');
  const summary = summaryLines
    .map((l) => (isBullet(l) ? stripBullet(l) : l.trim()))
    .filter(Boolean)
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const skills = bucketSkills(parseSkills(sectionText(sections, 'skills')));

  const certifications = sectionText(sections, 'certifications')
    .map((l) => (isBullet(l) ? stripBullet(l) : l.trim()))
    .filter((l) => l && l.length < 160);

  const resume: ResumeData = {
    fullName: nameLine.replace(/\s{2,}/g, ' ').trim(),
    targetTitle,
    email,
    phone,
    location: pickLocation(headerLines),
    linkedin,
    portfolio: '',
    github,
    summary,
    experience: parseExperience(sectionText(sections, 'experience')),
    education: parseEducation(sectionText(sections, 'education')),
    skills,
    projects: parseProjects(sectionText(sections, 'projects')),
    certifications,
    languages: sectionText(sections, 'languages').filter((line) => line.trim()).map((line, index) => {
      const parts = stripBullet(line).split(/\s*[:|–—]\s*|\s+-\s+/);
      const level = parts.slice(1).join(' ').trim();
      const knownLevels = ['Native', 'Fluent', 'C2 (Mastery)', 'C1 (Advanced)', 'B2 (Upper Intermediate)', 'B1 (Intermediate)', 'A2', 'A1'];
      return { id: `language-imported-${index + 1}`, name: parts[0], level: (knownLevels.find((value) => value.toLowerCase() === level.toLowerCase()) ?? '') as NonNullable<ResumeData['languages']>[number]['level'] };
    }),
    competitiveProgramming: sectionText(sections, 'profiles').flatMap((line, index) => {
      const match = stripBullet(line).match(/^(Codeforces|LeetCode|HackerRank|Kaggle|CodeChef|GitHub|Other)\s*:\s*([^\s(]+)(?:\s*\(([^)]+)\))?(?:\s*[–—]\s*(.+))?$/i);
      if (!match) return [];
      return [{ id: `profile-imported-${index + 1}`, platform: match[1] as NonNullable<ResumeData['competitiveProgramming']>[number]['platform'], handle: match[2], rating: match[3] ?? '', badgeOrRank: match[4] ?? '' }];
    }),
    additionalInformation: sectionText(sections, 'additional').join('\n').trim(),
  };

  return { resume, report: buildReport(resume, sections) };
}

/**
 * Backwards-compatible wrapper: returns the resume only.
 * Prefer parseResumeText when the caller needs to show what was missing.
 */
export function parseRawResumeText(text: string): ResumeData {
  return parseResumeText(text).resume;
}

/**
 * Format ResumeData as plain text for easy copying, job match testing, or order pre-filling
 */
export function formatResumeAsPlainText(resume: ResumeData): string {
  return documentPlainText(resume);
}

/**
 * Trigger client-side JSON export download
 */
export function exportResumeAsJson(resume: ResumeData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(resume, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  const cleanName = resume.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  downloadAnchor.setAttribute('download', `${cleanName}_ats_resume.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
