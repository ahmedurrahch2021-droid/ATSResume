import { PricingPackage, ExampleResume, Testimonial, FaqItem, ResumeTemplate } from '../types';
import { DELIVERY_POLICY, REPLY_POLICY, SERVICE_CONTACT } from './servicePolicy';
import { describePackagePrices } from '../utils/servicePricing';

export const ATS_IMAGES = {
  verifiedResume: '/images/ats_verified_resume_showcase_1792524530590.jpg',
  scannerDashboard: '/images/ats_scanner_software_dashboard_1792524531983.jpg',
  templatePreview: '/images/ats_resume_template_preview_1792524530797.jpg'
};

export const PACKAGES: PricingPackage[] = [
  {
    id: 'starter',
    name: 'Human Resume Review',
    price: 10,
    bangladeshPrice: 499,
    revisionRounds: 1,
    description: 'A written review and focused edits for one resume and one target role.',
    recommendedFor: 'Early to mid-level job seekers applying to standard roles',
    features: [
      'Written review of one resume, including 2–3 page documents',
      'Focused edits for one target role',
      'Suggestions using only facts you supply',
      'One revision round included',
      'Written notes and editable document updates',
      'Scope, delivery date and terms confirmed before payment'
    ]
  },
  {
    id: 'boost',
    name: 'Targeted Resume Rewrite',
    price: 35,
    bangladeshPrice: 1999,
    revisionRounds: 1,
    popular: true,
    description: 'Rewrite one resume using your supplied facts for one target role.',
    recommendedFor: 'Career switchers & competitive corporate applicants',
    features: [
      'Rewrite of one resume, including 2–3 page documents',
      'Tailoring to one target role and job posting',
      'Preserve the facts, titles, dates and achievements you supply',
      'One revision round included',
      'Editable DOCX, PDF and plain-text files',
      'Cover letter and LinkedIn wording are not included'
    ]
  },
  {
    id: 'full',
    name: 'Application Kit',
    price: 59,
    bangladeshPrice: 3499,
    revisionRounds: 2,
    badge: 'APPLICATION SET',
    description: 'A targeted resume, one cover letter and LinkedIn headline/About wording for one role.',
    recommendedFor: 'Applicants who need a coordinated set of application materials',
    features: [
      'Targeted resume rewrite for one role',
      'One matching cover letter',
      'LinkedIn headline and About wording',
      'Two revision rounds included',
      'Editable document files you can keep',
      'Scope, delivery date and terms confirmed before payment'
    ]
  }
];

export const RESUME_EXAMPLES: ExampleResume[] = [
  {
    id: 'marketing-tech',
    title: 'Marketing Manager to High-Growth Tech Startup',
    role: 'Growth Marketing Lead',
    industry: 'SaaS / B2B Tech',
    result: '4 interviews secured in 14 days, resulting in a $115k offer',
    metricsHighlight: '+140% Pipeline Growth · $420k ARR Attribution Added',
    before: {
      title: 'Marketing Specialist — Legacy Retail Corp (Old Version)',
      summary: 'Hardworking marketing professional with 4 years of experience managing marketing campaigns, social media accounts, and email marketing. Looking for an exciting opportunity in a fast-paced environment to utilize my skills.',
      experience: [
        'Responsible for managing company social media channels including Instagram, Facebook, and LinkedIn.',
        'Helped coordinate email newsletter campaigns sent to the customer mailing list every week.',
        'Worked with design team to create collateral, banners, and promotional brochures.',
        'Handled marketing budget spreadsheets and tracked monthly advertising expenditures.',
        'Assisted with event planning and trade show booth setups across regional conferences.'
      ],
      critique: [
        'Passive responsibility verbs ("Responsible for", "Helped coordinate", "Assisted")',
        'Zero numbers, zero revenue metrics, and zero conversion percentages',
        'Generic summary stating personal desire rather than value delivered to employer',
        'Failed ATS check: missing terms like "Demand Gen", "CAC/LTV", "HubSpot", "Attribution"'
      ]
    },
    after: {
      title: 'Growth & Lifecycle Marketing Manager (ATS Resume Lab Version)',
      summary: 'Data-driven Growth Marketer with 4+ years spearheading multi-channel B2B customer acquisition. Engineered inbound funnels generating $1.8M in pipeline and cut Customer Acquisition Cost (CAC) by 28% through lifecycle email sequences and automated lead scoring.',
      experience: [
        'Spearheaded full-funnel inbound marketing campaigns across LinkedIn Ads and organic search, scaling MQL pipeline by +140% YoY and directly attributing $420K in closed-won ARR.',
        'Architected automated nurture sequences in HubSpot for 65,000+ subscribers, lifting average email open rate from 17% to 34% and driving an 18% lift in demo bookings.',
        'Managed a $350K annual performance marketing budget with zero overspend, reallocating ad spend to high-converting channels to decrease blended CPA by 31%.',
        'Built cross-functional experimentation roadmap alongside product engineering, executing 24+ landing page A/B tests to boost trial-to-paid conversion from 2.8% to 5.1%.',
        'Presented monthly KPI dashboard (CAC, LTV, Pipeline Velocity) directly to VP of Marketing to steer quarterly growth allocation.'
      ],
      improvements: [
        'Quantified revenue impact ($420k ARR, $350k budget, +140% MQL)',
        'Powerful leadership action verbs (Spearheaded, Architected, Engineered)',
        'Injected essential high-value keywords (HubSpot, Blended CPA, Demo Bookings, Funnel)',
        'Passes modern ATS scanners with a 98/100 keyword density match'
      ]
    }
  },
  {
    id: 'software-cloud',
    title: 'Software Engineer to Senior Cloud/Backend Role',
    role: 'Senior Backend Engineer',
    industry: 'FinTech / Distributed Systems',
    result: 'Cut application-to-interview turnaround from 4 weeks to 3 days',
    metricsHighlight: '45ms p99 Latency · 10M+ Daily API Events Handled',
    before: {
      title: 'Web Developer — Agency (Old Version)',
      summary: 'Experienced software developer skilled in JavaScript, Node.js, and databases. Quick learner looking for backend developer positions.',
      experience: [
        'Wrote backend API routes for various customer websites using Node and Express.',
        'Fixed bugs in SQL database queries and maintained servers on AWS.',
        'Participated in daily standup meetings and worked with frontend engineers.',
        'Updated unit tests and committed code to GitHub repositories.',
        'Worked on Stripe payment integration for e-commerce client store.'
      ],
      critique: [
        'Sounded like a junior ticket-taker rather than an engineer with architectural judgment',
        'Vague tech stack mentions with no scale or load context',
        'Fails recruiter scans looking for system architecture, throughput, or microservices'
      ]
    },
    after: {
      title: 'Senior Backend Engineer — Distributed Systems (ATS Resume Lab Version)',
      summary: 'Senior Backend Engineer with 5+ years building fault-tolerant microservices and high-throughput transaction pipelines. Architected distributed Node.js/PostgreSQL services handling 10M+ daily events at 99.99% uptime with sub-50ms p99 response times.',
      experience: [
        'Architected and deployed distributed event-driven payment engine using Node.js, TypeScript, and Redis, successfully processing $12M+ in monthly transactions with zero downtime.',
        'Refactored legacy PostgreSQL queries and implemented connection pooling with read replicas, dropping p99 API query latency from 320ms to 45ms across peak traffic spikes.',
        'Containerized 14 microservices using Docker and orchestrated Kubernetes CI/CD pipelines in AWS (EKS), slashing deployment rollback frequency by 75%.',
        'Engineered idempotency and webhook failure recovery for Stripe integration, preventing duplicate charges across 400,000+ checkout sessions.',
        'Mentored 4 junior engineers on distributed tracing, unit test mocking, and clean architecture principles.'
      ],
      improvements: [
        'Technical precision highlighting scale (10M events, $12M volume, 45ms p99)',
        'Demonstrates senior architectural ownership and reliability engineering',
        'Dense ATS matching for Kubernetes, Redis, Microservices, and Cloud infrastructure'
      ]
    }
  },
  {
    id: 'graduate-analyst',
    title: 'Recent University Graduate to Business Analyst',
    role: 'Junior Business Analyst',
    industry: 'Consulting & Analytics',
    result: 'Overcame "no experience" barrier to land 3 competitive corporate offers',
    metricsHighlight: 'Transformed Capstone into $45k Feasibility Case Study',
    before: {
      title: 'Recent Graduate — B.S. Economics & Business (Old Version)',
      summary: 'Motivated recent graduate seeking an entry-level analyst position where I can utilize my academic knowledge and strong work ethic to contribute to team success.',
      experience: [
        'Attended classes in economics, statistics, and business strategy.',
        'Completed senior capstone project on local logistics company.',
        'Member of university Business Student Association and participated in meetings.',
        'Worked part-time as retail cashier at campus store assisting customers.'
      ],
      critique: [
        'Read like a student transcript rather than an employable analyst candidate',
        'Treated the senior capstone like homework rather than an analytical project',
        'Dismissed part-time retail work instead of mining it for customer data & inventory skills'
      ]
    },
    after: {
      title: 'Business Operations & Data Analyst (ATS Resume Lab Version)',
      summary: 'Analytical and results-oriented graduate in Economics & Data Analytics (GPA 3.8/4.0). Proficient in SQL, Python, and Tableau, with hands-on consulting capstone experience delivering supply chain recommendations that projected $45K in annual logistics savings.',
      experience: [
        'Led 4-person consulting capstone team evaluating regional supply chain logistics; cleaned and modeled 15,000+ shipping records using Python (Pandas) and SQL.',
        'Synthesized transportation data into interactive Tableau dashboard, uncovering route redundancies and presenting 3 cost-reduction initiatives to client management.',
        'Analyzed retail POS transaction patterns across 2,500+ campus store customer purchases, recommending inventory restocking schedule that reduced stockouts by 22%.',
        'Awarded 1st Place in University Annual Case Competition (out of 28 teams) for financial valuation and risk assessment model.',
        'Mastered data analytics stack: SQL, Excel (Advanced Modeling, Pivot Tables), Tableau, Python, and Jira.'
      ],
      improvements: [
        'Framed university capstone as client consulting engagement',
        'Demonstrated practical proficiency in SQL, Tableau, and financial modeling',
        'Turned campus retail job into analytical POS inventory accomplishment'
      ]
    }
  }
];

// Legacy fictional content, not verified customers. Never publish as testimonials.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah M.',
    role: 'Product Marketing Manager',
    companyTarget: 'Series B FinTech',
    quote: 'I had sent out 60+ resumes over 2 months with zero responses. Within 10 days of uploading my ATS Resume Lab overhaul, I had 3 recruiter screening calls and signed an offer 3 weeks later.',
    metric: '3 interviews in 10 days',
    avatarSeed: 'sarah',
    packageUsed: 'Career Boost ($25)'
  },
  {
    name: 'David L.',
    role: 'Full-Stack Developer',
    companyTarget: 'HealthTech Scaleup',
    quote: 'As an engineer, I hate writing about myself. The AI draft pulled out the right tech stack, but the developer review made my actual system architectures and metrics look truly impressive. Worth 5x the price.',
    metric: 'Offer accepted at $130k',
    avatarSeed: 'david',
    packageUsed: 'Resume Starter ($10)'
  },
  {
    name: 'Priya R.',
    role: 'Operations & Strategy Associate',
    companyTarget: 'Tier-1 Consulting Firm',
    quote: 'The cover letter and LinkedIn headline included in Career Boost were game changers. Recruiters on LinkedIn started messaging me first. The 24-hour turnaround is real and honest.',
    metric: 'Inbound LinkedIn messages doubled',
    avatarSeed: 'priya',
    packageUsed: 'Career Boost ($25)'
  },
  {
    name: 'Marcus T.',
    role: 'Director of Customer Success',
    companyTarget: 'Enterprise SaaS',
    quote: 'Most resume builders give you cookie-cutter tables that get butchered by Workday and Greenhouse. The ATS clean format passed every scanner with green checkmarks.',
    metric: 'Interview callback within 48 hours',
    avatarSeed: 'marcus',
    packageUsed: 'Full Career Package ($35)'
  }
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'quality',
    question: 'What can I do for free?',
    directAnswer: 'Read a PDF, DOCX or text resume, inspect the extracted fields, edit the same draft and download your document without an account or a card.',
    extendedAnswer: 'Job-posting vocabulary comparison and a cover letter builder are also available. The guided rewrite helper uses facts you provide. No AI provider or cloud sync is connected.'
  },
  {
    id: 'faq-2',
    category: 'delivery',
    question: 'How quickly will you reply, and when will my documents be ready?',
    directAnswer: REPLY_POLICY,
    extendedAnswer: `${DELIVERY_POLICY} An urgent-delivery request is subject to availability and an agreed fee. Free editor downloads do not require a human-review order.`
  },
  {
    id: 'faq-3',
    category: 'pricing',
    question: 'What if I am not satisfied with my resume?',
    directAnswer: 'Agree revision, cancellation and refund terms in writing before paying for human review.',
    extendedAnswer: 'Human Resume Review and Targeted Resume Rewrite include one revision round; Application Kit includes two. The revision window and scope are confirmed before payment. The website does not issue automatic refunds.'
  },
  {
    id: 'faq-4',
    category: 'ats',
    question: 'Will my new resume pass automated ATS scanners?',
    directAnswer: 'There is no universal ATS pass mark. This reader reports what it extracted and flags review prompts; it cannot see an employer’s configuration or predict an interview.',
    extendedAnswer: 'The editor produces single-column body text. Download the actual file and upload it for another extraction check. Other parsers can read it differently, and successful extraction is not proof of suitability for a role.'
  },
  {
    id: 'faq-5',
    category: 'revisions',
    question: 'Where is my resume stored?',
    directAnswer: 'Checking and editing happen in your browser. The resume draft is saved in browser storage when available; it is not a cloud backup.',
    extendedAnswer: 'Storage can be blocked or cleared, so keep a downloaded backup. Choosing to email or message a file for human help shares it outside these local tools. Online sign-in and email subscriptions are not connected.'
  },
  {
    id: 'faq-6',
    category: 'quality',
    question: 'Can you help if I am switching careers or have employment gaps?',
    directAnswer: 'You can include projects, training and transferable work in the free editor, or discuss those needs in a human-review inquiry.',
    extendedAnswer: 'Keep dates and job titles accurate. A change in wording must not turn a project into employment or invent qualifications. The same applies to sample achievements and suggested metrics.'
  },
  {
    id: 'faq-7',
    category: 'pricing',
    question: 'Is human help paid in Bangladesh too, and how do I arrange it?',
    directAnswer: 'Yes. Human review, rewriting and application kits are paid services in Bangladesh and other countries. Checking, editing and downloads remain free worldwide.',
    extendedAnswer: `${PACKAGES.map((pkg) => `${pkg.name} — ${describePackagePrices(pkg)}`).join('; ')}. These are one-time prices, not subscriptions. Online checkout is not connected. Contact ${SERVICE_CONTACT.email} or WhatsApp ${SERVICE_CONTACT.whatsappDisplay} to confirm scope, availability, delivery, terms and payment arrangements.`
  },
  {
    id: 'faq-8',
    category: 'delivery',
    question: 'What file formats will I receive?',
    directAnswer: 'The resume editor offers editable DOCX, browser Print / Save as PDF, plain text and a JSON field backup. The cover letter builder offers DOCX, PDF printing and text.',
    extendedAnswer: 'Follow the employer’s file instructions. Word may reflow differently from the browser preview. Review every exported page and check the extracted text before sending it.'
  }
];

export const CHECKLIST_ITEMS = [
  { id: 1, category: 'ATS Architecture', title: 'Simple reading order', description: 'Review the extracted text from your exported document. A single-column layout reduces the layout choices you need to check.' },
  { id: 2, category: 'ATS Architecture', title: 'Standard Section Headings', description: 'Uses recognized headers: "Work Experience", "Education", "Skills".' },
  { id: 3, category: 'ATS Architecture', title: 'Readable document fonts', description: 'Check the document at 100% zoom. Avoid shrinking the type to force everything onto one page.' },
  { id: 4, category: 'Content & Impact', title: 'Supported outcomes', description: 'Use accurate numbers when you have them. Qualitative results are valid; never invent a metric to satisfy a percentage rule.' },
  { id: 5, category: 'Content & Impact', title: 'Specific contributions', description: 'Explain what you actually did. Replace a vague duty statement where a more specific, accurate example is available.' },
  { id: 6, category: 'Content & Impact', title: 'Action, method and result', description: 'Try describing the action, how you did it and the outcome. This is a writing prompt, not a required formula.' },
  { id: 7, category: 'Keyword Calibration', title: 'Relevant job terminology', description: 'Use the employer’s terminology where it accurately describes your experience. Repetition is not an objective.' },
  { id: 8, category: 'Keyword Calibration', title: 'Hard Skills Cluster', description: 'Categorized skills section (e.g. Tools, Frameworks, Languages) for rapid skimming.' },
  { id: 9, category: 'Header & Contact', title: 'Clickable Clean Links', description: 'Clean LinkedIn and GitHub links without long tracking query strings.' },
  { id: 10, category: 'Header & Contact', title: 'Relevant personal details', description: 'Follow the specific country, employer and application instructions for photos and personal fields. A government form and a corporate resume may ask for different details.' },
  { id: 11, category: 'Formatting', title: 'Consistent Date Formats', description: 'Uniform date structures (e.g., "Jan 2022 – Present") across all entries.' },
  { id: 12, category: 'Formatting', title: 'Relevant length', description: 'Keep relevant experience and remove repetition. Two or three pages are supported; follow any page limit in the vacancy.' },
  { id: 13, category: 'Grammar & Tone', title: 'Tense Consistency', description: 'Past tense for previous jobs, present tense for current active employment.' },
  { id: 14, category: 'Grammar & Tone', title: 'Clear, concise wording', description: 'Read each sentence aloud and remove unnecessary words. Check that the wording still accurately represents your role.' },
  { id: 15, category: 'Final Polish', title: 'Review the exported file', description: 'Open the actual PDF or DOCX, inspect each page and recheck the extracted text. Follow the application portal’s file type and size limits.' }
];

export const SAMPLE_WEAK_RESUMES = {
  marketing: `Jane Doe
janedoe@email.com | (555) 123-4567 | San Francisco, CA

SUMMARY
Hardworking and passionate marketing professional with 3 years of experience. I am responsible, organized, and looking for an exciting position at a forward-thinking tech company to learn and grow my career.

EXPERIENCE
Marketing Specialist | Acme Retail Group (2022 - Present)
- Responsible for social media accounts like Facebook and Instagram.
- Helped create weekly newsletters sent to customers.
- Worked with graphic designers to make brochures and sales collateral.
- Assisted with organizing trade show booths and company events.
- Handled spreadsheet data entry and tracked marketing expenses.

Marketing Intern | Beta Agency (2021 - 2022)
- Helped the marketing team with various tasks as needed.
- Researched competitors and drafted blog posts.
- Participated in weekly team brainstorming meetings.

EDUCATION
B.A. in Communications | State University (2021)

SKILLS
Microsoft Office, Social Media, Teamwork, Communication, Problem Solving, Canva`,

  developer: `John Smith
jsmith@email.com | New York, NY

OBJECTIVE
Software engineer seeking a good programming job where I can code in modern languages and contribute to client applications.

EXPERIENCE
Web Developer | Digital Studio (2022 - Present)
- Wrote code for customer websites using JavaScript and Node.
- Fixed bugs in database queries and worked on servers.
- Participated in standup meetings and pushed code to Git.
- Helped team finish sprint tickets on time.

Junior Developer | Local IT (2020 - 2022)
- Maintained legacy PHP websites and updated WordPress plugins.
- Answered client support emails regarding website outages.

SKILLS
HTML, CSS, JavaScript, Node.js, SQL, Git, Team Player`,

  sales: `Alex Rivera
arivera@email.com | Chicago, IL

PROFILE
Energetic sales professional with a track record of talking to customers and selling products. Very motivated to exceed quota.

EXPERIENCE
Account Executive | Midwestern Supplies (2021 - Present)
- Responsible for cold calling prospective businesses.
- Did product demos on Zoom and answered customer questions.
- Handled contract renewals and customer relationship management.
- Attended weekly sales meetings.

SKILLS
Salesforce, Cold Calling, Negotiation, Communication, MS Excel`
};

export const SAMPLE_JOB_DESCRIPTIONS = {
  marketing: `We are looking for a Growth Marketing Manager to scale our B2B SaaS pipeline. 
Requirements:
- 3+ years experience driving inbound demand generation and MQL pipeline.
- Experience managing performance marketing budgets ($250k+) and optimizing CAC/LTV.
- Deep expertise in HubSpot marketing automation, lead scoring, and email nurture workflows.
- Proven track record of A/B testing landing pages and analyzing conversion funnels.
- Excellent data modeling and attribution skills.`,

  developer: `Senior Backend Engineer needed for distributed transaction systems.
Requirements:
- 4+ years with Node.js, TypeScript, and microservice architectures.
- Deep understanding of PostgreSQL query optimization, connection pooling, and Redis caching.
- Experience handling high throughput (1M+ events/day) with low latency (sub-100ms).
- AWS infrastructure experience (Docker, Kubernetes/EKS, CI/CD).
- Stripe payment APIs and webhook idempotency experience.`,

  sales: `Enterprise Account Executive.
Requirements:
- 3+ years closing enterprise SaaS deals with $50k+ ACV.
- Proven history exceeding 100%+ annual quota and managing pipeline in Salesforce.
- Experience selling to VP and C-level stakeholders.
- Solution-selling methodology (MEDDPICC).`
};

// Legacy fictional illustration, not a measured customer outcome or parser test.
export const ATS_CASE_STUDY_DATA = {
  candidate: 'Elena Vance',
  background: 'Customer Support Lead with 4.5 years experience & 98.2% CSAT',
  targetRole: 'Customer Success Manager (SaaS)',
  salaryTarget: '$80,000 – $95,000',
  initialAttempt: {
    applicationsSent: 38,
    automatedRejections: 35,
    recruiterInterviews: 0,
    templateUsed: 'Popular 2-column aesthetic Canva template with skill stars & icons',
    timeframe: 'Over 6 frustrating weeks'
  },
  technicalFlawsFound: [
    {
      title: 'Multi-Column Reading Order Scramble',
      impact: 'CRITICAL',
      explanation: 'Workday & Greenhouse read PDFs left-to-right across the entire page geometry. Her left-column skills merged with right-column dates into unintelligible strings like "Zendesk 2021 Escalations B.A. Communications". The parser discarded the entire block.'
    },
    {
      title: 'Visual Skill Bars & Star Ratings Rendered Blank',
      impact: 'HIGH',
      explanation: 'Her "5/5 stars in Salesforce & Jira" was an SVG graphic. Document text scrapers read zero characters for tools, tagging her candidate profile as lacking any CRM experience.'
    },
    {
      title: 'Duty-Based Phrasing vs. Search Algorithm Keywords',
      impact: 'HIGH',
      explanation: 'The recruiter ran a Boolean search for "Net Revenue Retention", "Churn Mitigation", and "QBRs". Elena wrote "Helped users stay happy and resolved angry tickets". She had the exact skills, but her vocabulary scored 12% keyword cosine match.'
    }
  ],
  theOptimizationFixes: [
    {
      action: 'Clean Single-Column UTF-8 Structure',
      detail: 'Rebuilt into an unboxed ATS hierarchy with standardized headers (Work Experience, Core Competencies, Technical Stack) that parses at 100% fidelity.'
    },
    {
      action: 'Google XYZ Formula Bullet Transformation',
      detail: 'Transformed "Helped customers with renewals" into "Spearheaded retention initiative across 120 key accounts, lifting Net Retention Rate (NRR) from 92% to 108% and preventing ~$240k in ARR churn."'
    },
    {
      action: 'Algorithmic Keyword Frequency Alignment',
      detail: 'Injected 14 high-value domain keywords (Churn Mitigation, Executive QBRs, CSAT/NPS, Salesforce CRM, Cross-Functional Escalations) naturally into her actual accomplishments.'
    }
  ],
  theResult: {
    newApplications: 10,
    recruiterScreeningCalls: 6,
    finalRoundInterviews: 3,
    offerLanded: '$82,000 Base + Equity at Series B Tech Scaleup',
    timeToOffer: '18 days after ATS Resume Lab overhaul'
  }
};

export const ATS_PIPELINE_STEPS = [
  {
    step: '1',
    name: 'Raw Document Ingestion & Stripping',
    subtitle: 'Formatting stress-test',
    desc: 'The ATS strips all visual styling, converting your PDF or DOCX into raw, unformatted text strings. Tables, columns, icons, and text boxes frequently scramble or drop out entirely here.'
  },
  {
    step: '2',
    name: 'Entity & Taxonomy Extraction',
    subtitle: 'Database population',
    desc: 'Algorithms parse for job titles, employer names, employment dates, degrees, and technical skills to populate relational database fields in the recruiter’s portal.'
  },
  {
    step: '3',
    name: 'Boolean & Semantic Matching',
    subtitle: 'The 75% filter gate',
    desc: 'The hiring team inputs required criteria (e.g. "React AND TypeScript AND Microservices"). Resumes lacking exact matches or semantic synonyms are automatically filtered into the "Do Not Advance" bucket.'
  },
  {
    step: '4',
    name: 'Ranked Recruiter Dashboard',
    subtitle: 'Top 5-10 candidates only',
    desc: 'Out of 250+ submissions, the recruiter only opens the top 5 to 10 profiles sorted by ATS match score. If you aren\'t in that top tier, no human ever sees your qualifications.'
  }
];

export const ATS_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'tech-core',
    title: 'Modern Professional',
    category: 'tech',
    categoryLabel: 'Tech & Engineering',
    recommendedFor: 'A clear, spacious resume; shown with a software engineering example',
    layout: 'modern',
    sourceIds: ['mit-ats', 'imperial-cv', 'greenhouse-parse'],
    architecture: 'Single-column body text',
    format: 'Arial · 11 pt body · open spacing',
    previewImage: '/images/templates/modern.png',
    highlightPoints: [
      'Left-aligned name and contact details in the document body',
      'Restrained warm headings and fine section rules',
      'Work experience before education; skills stay as readable text',
      'Editable DOCX, PDF printing and plain text; supports multiple pages'
    ],
    sampleContent: {
      name: 'Alex R. Chen',
      contact: 'San Francisco, CA · (555) 123-4567 · alex.chen@email.com · linkedin.com/in/alexrchen',
      summary: 'Senior Software Engineer with 6+ years designing distributed backend microservices and high-throughput web applications. Proven track record reducing API latency by 35% and scaling transactional platforms to 2M+ daily requests.',
      skills: ['TypeScript', 'Node.js', 'Go', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS (EKS, S3, RDS)', 'CI/CD Pipelines'],
      experience: [
        {
          role: 'Senior Software Engineer',
          company: 'ScaleTech Systems · San Francisco, CA',
          dates: '04/2021 – Present',
          bullets: [
            'Spearheaded migration of legacy monolithic payment service to Go/Node.js microservices, cutting p99 latency from 450ms to 85ms across 1.8M daily transactions.',
            'Architected distributed Redis caching layer, reducing PostgreSQL read query loads by 42% and eliminating peak Black Friday database bottlenecks.',
            'Mentored 5 junior engineers and instituted automated TypeScript linting and unit testing protocols, elevating sprint code coverage from 68% to 92%.'
          ]
        },
        {
          role: 'Software Engineer',
          company: 'Nexus Digital Media · San Jose, CA',
          dates: '08/2018 – 03/2021',
          bullets: [
            'Developed 12+ customer-facing React components with Tailwind CSS, improving core web vitals (LCP/FID) by 28%.',
            'Engineered RESTful and GraphQL APIs consumed by iOS and Android clients, maintaining 99.98% operational uptime.',
            'Collaborated with product managers in 2-week agile sprints, delivering 94% of committed user stories on schedule.'
          ]
        }
      ],
      education: 'B.S. in Computer Science · University of California, Berkeley (3.8 GPA)',
      certifications: ['AWS Certified Solutions Architect – Associate', 'Certified Kubernetes Application Developer (CKAD)']
    }
  },
  {
    id: 'product-growth',
    title: 'Compact Professional',
    category: 'product',
    categoryLabel: 'Product & Growth',
    recommendedFor: 'Relevant, longer career histories; shown with a product management example',
    layout: 'compact',
    sourceIds: ['mit-ats', 'imperial-cv', 'qld-resume'],
    architecture: 'Single-column body text',
    format: 'Calibri · 11 pt body · compact spacing',
    previewImage: '/images/templates/compact.png',
    highlightPoints: [
      'Black text, uppercase headings and no decorative rules',
      'Closer spacing without reducing the 11 pt body text',
      'Work experience before education, followed by skills',
      'Continues onto another page when your relevant experience needs it'
    ],
    sampleContent: {
      name: 'Maya Lin, MBA',
      contact: 'New York, NY · (555) 987-6543 · maya.lin@email.com · linkedin.com/in/mayalin-pm',
      summary: 'Data-driven Senior Product Manager with 7+ years scaling B2B SaaS revenue funnels. Experienced driving cross-functional squads across UX, data science, and engineering to deliver $12M+ in net new annualized revenue.',
      skills: ['Product Lifecycle Management', 'Roadmap Prioritization', 'A/B Experimentation', 'SQL & Amplitude', 'Customer Discovery', 'Pricing Strategy', 'Jira / Agile'],
      experience: [
        {
          role: 'Lead Product Manager (Growth)',
          company: 'CloudPulse B2B SaaS · New York, NY',
          dates: '01/2022 – Present',
          bullets: [
            'Revamped user onboarding activation flow across web & mobile, boosting day-14 trial-to-paid conversion from 4.2% to 7.8% (+$3.4M ARR).',
            'Designed and executed 45+ multivariate experimentation cycles in Amplitude, isolating key churn drivers and reducing monthly account churn by 18%.',
            'Led discovery interviews with 60+ enterprise procurement leaders to define quarterly roadmap OKRs.'
          ]
        },
        {
          role: 'Product Manager',
          company: 'Insight Analytics · Boston, MA',
          dates: '06/2019 – 12/2021',
          bullets: [
            'Owned self-serve reporting dashboard product line from PRD specification to launch, reaching 45,000 monthly active users within 6 months.',
            'Partnered with product marketing to launch enterprise tier pricing, resulting in a 24% uplift in Average Contract Value (ACV).'
          ]
        }
      ],
      education: 'M.B.A. in Product Strategy · NYU Stern School of Business | B.A. Economics · Boston University',
      certifications: ['Pragmatic Institute Certified (PMC-III)', 'Scrum Alliance Certified Scrum Product Owner (CSPO)']
    }
  },
  {
    id: 'finance-ops',
    title: 'Classic Chronological',
    category: 'finance',
    categoryLabel: 'Finance & Operations',
    recommendedFor: 'A traditional typographic style; shown with a finance and operations example',
    layout: 'classic',
    sourceIds: ['harvard-bullet', 'mit-ats', 'greenhouse-parse'],
    architecture: 'Single-column body text',
    format: 'Georgia · 11 pt body · fine rules',
    previewImage: '/images/templates/classic.png',
    highlightPoints: [
      'Centred identity, serif type and uppercase section headings',
      'Fine section rules with all contact text in the body',
      'Role, employer and dates grouped above contribution bullets',
      'Optional photo moves identity text left and places the image at the right'
    ],
    sampleContent: {
      name: 'David K. Vance, CPA',
      contact: 'Chicago, IL · (555) 345-6789 · david.vance@email.com · linkedin.com/in/davidvance-cpa',
      summary: 'Senior Corporate Financial Analyst with 5+ years specializing in FP&A, revenue forecasting, and capital budget modeling for multi-entity healthcare and retail enterprises.',
      skills: ['Financial Modeling', 'FP&A', 'Variance Analysis', 'Advanced Excel / VBA', 'SAP ERP', 'Power BI / Tableau', 'GAAP Accounting', 'Cash Flow Optimization'],
      experience: [
        {
          role: 'Senior Financial Analyst (FP&A)',
          company: 'Midwest Health Partners · Chicago, IL',
          dates: '03/2021 – Present',
          bullets: [
            'Built 3-statement rolling forecasting model for $140M operating division, improving quarterly expense forecasting accuracy from 88% to 96.4%.',
            'Identified $1.8M in annual vendor contract overlap through cost-center audit, negotiating restructured vendor agreements.',
            'Prepared monthly executive variance reports and board presentation decks directly for CFO and Audit Committee.'
          ]
        },
        {
          role: 'Financial Analyst',
          company: 'Apex Retail Corporation · Chicago, IL',
          dates: '07/2018 – 02/2021',
          bullets: [
            'Automated store-level P&L consolidation spreadsheets in Excel/VBA, saving the accounting team 14 hours each monthly close.',
            'Conducted capital expenditure ROI analyses for 22 store expansions, resulting in approval of 19 high-performing locations.'
          ]
        }
      ],
      education: 'B.S. in Accountancy & Finance · University of Illinois Urbana-Champaign',
      certifications: ['Certified Public Accountant (CPA) – Illinois Board', 'Financial Modeling & Valuation Analyst (FMVA)']
    }
  },
  {
    id: 'early-career',
    title: 'Education-first Graduate',
    category: 'entry',
    categoryLabel: 'Entry Level & Graduate',
    recommendedFor: 'Students and recent graduates whose education is more relevant than their work history',
    layout: 'graduate',
    sourceIds: ['harvard-bullet', 'imperial-cv', 'uk-cv'],
    architecture: 'Education-first single column',
    format: 'Calibri · 11 pt body · education first',
    previewImage: '/images/templates/graduate.png',
    highlightPoints: [
      'Education before work experience in preview, DOCX and plain text',
      'Clear headings, black text and familiar sans-serif type',
      'Course projects remain projects, separate from employment',
      'A useful starting order; the vacancy determines any page limit'
    ],
    sampleContent: {
      name: 'Jordan Miller',
      targetTitle: 'Graduate Software Developer',
      contact: 'Austin, TX · (555) 789-0123 · jordan.miller@email.com · linkedin.com/in/jordanmiller-tech',
      summary: 'Computer Science graduate with experience building web applications during an engineering internship and a university capstone. Used React, Node.js and PostgreSQL to develop interfaces, test features and document APIs.',
      skills: ['Python', 'JavaScript (ES6+)', 'React', 'HTML5/CSS3', 'SQL (PostgreSQL)', 'Git / GitHub', 'REST APIs', 'Agile Principles'],
      experience: [
        {
          role: 'Software Engineering Intern',
          company: 'Austin Tech Labs · Austin, TX',
          dates: '05/2023 – 08/2023',
          bullets: [
            'Collaborated with 4-person team to build customer analytics dashboard in React & Node.js, utilized by 2,000+ daily internal users.',
            'Wrote 30+ unit tests using Jest, catching 6 critical bugs prior to production staging deployment.',
            'Documented internal API endpoints in Swagger/Postman, reducing onboarding ramp time for new engineering interns by 40%.'
          ]
        }
      ],
      projects: [{
        name: 'Campus event reservation app — course project',
        roleOrTech: 'React, Node.js, PostgreSQL · Jan – May 2023',
        bullets: [
          'Built event booking and authentication features with a student project team.',
          'Integrated test payments and email notifications in a demonstration environment.'
        ]
      }],
      education: 'B.S. in Computer Science · University of Texas at Austin (Graduated May 2024 · Dean’s List)',
      certifications: ['Meta Front-End Developer Professional Certificate (Coursera)']
    }
  }
];

