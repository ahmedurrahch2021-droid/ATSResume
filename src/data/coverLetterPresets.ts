import { CoverLetterPreset, CoverLetterData } from '../types/coverLetter';

export const INITIAL_COVER_LETTER: CoverLetterData = {
  id: 'cl-default',
  title: 'Software Engineer Application',
  sender: {
    fullName: 'Alex Vance',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex.vance.dev@gmail.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    portfolioUrl: 'alexvance.dev',
    linkedInUrl: 'linkedin.com/in/alexvance',
  },
  recipient: {
    hiringManagerName: 'Jane Smith',
    companyName: 'Stripe, Inc.',
    department: 'Core Infrastructure Team',
    companyAddress: '354 Oyster Point Blvd, South San Francisco, CA',
  },
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  salutation: 'Dear Ms. Smith and the Infrastructure Hiring Team,',
  opening: 'I am writing to express my enthusiastic interest in the Senior Full-Stack Engineer role on the Core Infrastructure team at Stripe. With over seven years of experience architecting distributed event-driven systems and microservices handling millions of daily transactions, I have long admired Stripe\'s engineering discipline and commitment to developer velocity.',
  bodyParagraphs: [
    'In my current role at Apex Distributed Systems, I spearheaded the redesign of our payment settlement pipeline. By transitioning to an asynchronous Kafka-backed architecture with zero-copy serialization, my team reduced end-to-end processing latency by 42% while sustaining 99.995% uptime during peak holiday traffic volume.',
    'Beyond backend reliability, I take pride in building developer tooling that teams love using. I collaborated closely with product managers and security teams to implement automated idempotency keys and comprehensive integration testing suites that cut onboarding time for new engineers from 3 weeks to 4 days.'
  ],
  keyHighlights: [
    'Architected high-throughput payment ingestion processing $14M+ in daily transaction volume with sub-50ms p99 latency.',
    'Pioneered internal distributed tracing with OpenTelemetry, cutting mean time to resolution (MTTR) by 35% across 18 services.',
    'Mentored 6 junior and mid-level engineers through system design reviews, code quality workshops, and career milestone promotions.'
  ],
  closing: 'Stripe\'s mission to increase the GDP of the internet deeply resonates with me. I welcome the opportunity to discuss how my background in distributed systems, reliability engineering, and clean API design can help advance your infrastructure roadmap.',
  signOff: 'Sincerely,',
  templateStyle: 'modern',
  accentColor: '#C82333',
  fontFamily: 'sans',
  fontSize: 'standard',
};

export const COVER_LETTER_PRESETS: CoverLetterPreset[] = [
  {
    id: 'preset-swe',
    name: 'Senior Software Engineer',
    role: 'Full Stack & Cloud Architecture',
    targetCompany: 'Stripe',
    badge: 'Tech / SaaS',
    description: 'High-impact distributed systems narrative with quantified throughput metrics.',
    data: {
      title: 'Senior Software Engineer - Stripe',
      sender: {
        fullName: 'Alex Vance',
        jobTitle: 'Senior Full-Stack Engineer',
        email: 'alex.vance.dev@gmail.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        portfolioUrl: 'alexvance.dev',
        linkedInUrl: 'linkedin.com/in/alexvance',
      },
      recipient: {
        hiringManagerName: 'Jane Smith',
        companyName: 'Stripe, Inc.',
        department: 'Core Infrastructure Team',
        companyAddress: 'South San Francisco, CA',
      },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      salutation: 'Dear Ms. Smith and the Infrastructure Hiring Team,',
      opening: 'I am writing to express my enthusiastic interest in the Senior Full-Stack Engineer role on the Core Infrastructure team at Stripe. With over seven years of experience architecting distributed event-driven systems and microservices handling millions of daily transactions, I have long admired Stripe\'s engineering discipline and commitment to developer velocity.',
      bodyParagraphs: [
        'In my current role at Apex Distributed Systems, I spearheaded the redesign of our payment settlement pipeline. By transitioning to an asynchronous Kafka-backed architecture with zero-copy serialization, my team reduced end-to-end processing latency by 42% while sustaining 99.995% uptime during peak holiday traffic volume.',
        'Beyond backend reliability, I take pride in building developer tooling that teams love using. I collaborated closely with product managers and security teams to implement automated idempotency keys and comprehensive integration testing suites that cut onboarding time for new engineers from 3 weeks to 4 days.'
      ],
      keyHighlights: [
        'Architected high-throughput payment ingestion processing $14M+ in daily volume with sub-50ms p99 latency.',
        'Pioneered internal distributed tracing with OpenTelemetry, cutting MTTR by 35% across 18 microservices.',
        'Mentored 6 junior and mid-level engineers through architectural reviews, code quality, and career progression.'
      ],
      closing: 'Stripe\'s mission to increase the GDP of the internet deeply resonates with me. I welcome the opportunity to discuss how my background in distributed systems, reliability engineering, and clean API design can help advance your infrastructure roadmap.',
      signOff: 'Sincerely,',
      templateStyle: 'modern',
      accentColor: '#C82333',
      fontFamily: 'sans',
      fontSize: 'standard',
    }
  },
  {
    id: 'preset-pm',
    name: 'Product Manager',
    role: 'B2B SaaS & Growth',
    targetCompany: 'Airbnb',
    badge: 'Product & Strategy',
    description: 'Outcome-oriented narrative centered on customer discovery, conversion rates, and cross-functional leadership.',
    data: {
      title: 'Product Manager - Airbnb',
      sender: {
        fullName: 'Maya Lin',
        jobTitle: 'Senior Product Manager',
        email: 'maya.lin.pm@gmail.com',
        phone: '+1 (555) 345-6789',
        location: 'New York, NY',
        portfolioUrl: 'mayalin.co',
        linkedInUrl: 'linkedin.com/in/mayalin-pm',
      },
      recipient: {
        hiringManagerName: 'David Chen',
        companyName: 'Airbnb',
        department: 'Guest Experience & Search Product Group',
        companyAddress: '888 Brannan St, San Francisco, CA',
      },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      salutation: 'Dear Mr. Chen and Search Product Selection Committee,',
      opening: 'I am excited to submit my application for the Product Manager role within Airbnb\'s Guest Experience & Search team. Over the past six years leading customer-facing product squads, I have focused on solving friction in search discovery, recommendation algorithms, and mobile conversion funnels.',
      bodyParagraphs: [
        'At Horizon Travel Technologies, I led a cross-functional squad of 11 engineers, designers, and data scientists to rebuild the flexible dates recommendation engine. Through iterative user research across 40+ customer interviews and rigorous A/B testing with 4M monthly active travelers, we unlocked a 19.4% uplift in booking conversion and $8.2M annualized incremental GMV.',
        'I believe the best products balance analytical rigor with deep emotional empathy for the user. My approach centers on transparent hypothesis validation, clear OKR alignment, and fostering a team culture where engineering and design collaborate from day zero.'
      ],
      keyHighlights: [
        'Led end-to-end launch of AI-driven semantic search, decreasing zero-result search queries by 64%.',
        'Partnered with UX research to establish weekly customer listening sessions, increasing feature adoption by 28%.',
        'Managed a portfolio of 14 experimental flags concurrently, maintaining statistical hygiene across 5 global locales.'
      ],
      closing: 'Airbnb\'s focus on belonging and design craftsmanship sets the benchmark for our industry. I look forward to the possibility of discussing how my experience in search discovery and conversion optimization can support your product roadmap.',
      signOff: 'Warm regards,',
      templateStyle: 'classic',
      accentColor: '#1E3A8A',
      fontFamily: 'serif',
      fontSize: 'standard',
    }
  },
  {
    id: 'preset-data',
    name: 'Data Analyst / Scientist',
    role: 'Analytics & Machine Learning',
    targetCompany: 'Spotify',
    badge: 'Data & Insights',
    description: 'Quantified metrics on predictive modeling, SQL pipeline automation, and executive dashboarding.',
    data: {
      title: 'Data Analyst - Spotify',
      sender: {
        fullName: 'Marcus Brody',
        jobTitle: 'Data Analyst & Analytics Engineer',
        email: 'm.brody.data@gmail.com',
        phone: '+1 (555) 456-7890',
        location: 'Boston, MA',
        portfolioUrl: 'github.com/mbrody-data',
        linkedInUrl: 'linkedin.com/in/marcusbrody',
      },
      recipient: {
        hiringManagerName: 'Dr. Elena Rostova',
        companyName: 'Spotify',
        department: 'Content Discovery & User Retention Analytics',
        companyAddress: 'New York, NY',
      },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      salutation: 'Dear Dr. Rostova and the Analytics Team,',
      opening: 'I am writing to express my strong enthusiasm for the Data Analyst role supporting Content Discovery at Spotify. Combining rigorous statistical modeling with clear data storytelling, I specialize in translating complex listening behavior telemetry into actionable growth strategies.',
      bodyParagraphs: [
        'At SoundStream Media, I built the user retention churn prediction pipeline in BigQuery and dbt. By engineering behavioral velocity features (skip rate changes, playlist creation momentum, session duration decay), our model identified at-risk subscribers 21 days before renewal with 84% precision, enabling targeted re-engagement campaigns that salvaged $1.2M in annual recurring revenue.',
        'I am passionate about building automated, self-serve reporting models that empower product managers to query data with confidence while maintaining strict data governance and metric definitions.'
      ],
      keyHighlights: [
        'Automated 35+ manual executive dashboards into production dbt models, saving 16 hours of engineering time weekly.',
        'Designed Bayesian A/B testing framework evaluating recommendation diversity across 12M monthly active sessions.',
        'Expert in SQL, Python (pandas, scikit-learn), Tableau, Snowflake, and production data testing.'
      ],
      closing: 'Spotify has revolutionized how the world connects with music and audio storytelling. I would welcome the opportunity to contribute my analytics expertise to your personalization initiatives.',
      signOff: 'Sincerely,',
      templateStyle: 'executive',
      accentColor: '#047857',
      fontFamily: 'sans',
      fontSize: 'standard',
    }
  },
  {
    id: 'preset-entry',
    name: 'Fresh Graduate / Career Switcher',
    role: 'Junior Developer / Associate',
    targetCompany: 'Microsoft',
    badge: 'Early Career',
    description: 'Structured to highlight hands-on capstone projects, learning agility, and collaborative teamwork.',
    data: {
      title: 'Associate Software Engineer - Microsoft',
      sender: {
        fullName: 'Priya Sharma',
        jobTitle: 'Aspiring Software Engineer',
        email: 'priya.sharma.cs@gmail.com',
        phone: '+1 (555) 567-8901',
        location: 'Seattle, WA',
        portfolioUrl: 'priyasharma.io',
        linkedInUrl: 'linkedin.com/in/priyasharma-cs',
      },
      recipient: {
        hiringManagerName: 'University Recruiting Team',
        companyName: 'Microsoft Corporation',
        department: 'Azure Developer Experience Team',
        companyAddress: 'One Microsoft Way, Redmond, WA',
      },
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      salutation: 'Dear Microsoft Recruiting Team and Engineering Mentors,',
      opening: 'I am excited to apply for the Associate Software Engineer position within the Azure Developer Experience organization at Microsoft. As a recent Computer Science graduate with a strong foundation in modern web frameworks, cloud fundamentals, and open-source contribution, I am eager to contribute to tooling that empowers millions of cloud builders worldwide.',
      bodyParagraphs: [
        'During my capstone engineering project, I led a four-person team in creating an open-source accessibility auditor for web applications. The tool parses client-side DOM trees to detect WCAG 2.1 color contrast and aria attribute violations, generating actionable remediation reports. The project earned 1st place in our Department Showcase and was adopted by our university\'s digital accessibility center.',
        'In addition to academic work, my summer internship at CloudPeak allowed me to write production TypeScript APIs, participate in daily standups, and resolve 28 backlog bug tickets, sharpening my ability to write clean, self-documenting code and submit thoughtful pull requests.'
      ],
      keyHighlights: [
        'Graduated with B.S. in Computer Science with Honors (3.92 GPA).',
        'Contributed 12 merged pull requests to open-source developer tooling on GitHub.',
        'Proficient in TypeScript, React, Node.js, Git, and automated testing with Jest.'
      ],
      closing: 'Microsoft\'s dedication to growth mindset and inclusive engineering represents the ideal environment for me to launch my engineering career. Thank you for your time and consideration, and I look forward to hearing from you.',
      signOff: 'Respectfully yours,',
      templateStyle: 'minimal',
      accentColor: '#334155',
      fontFamily: 'sans',
      fontSize: 'standard',
    }
  }
];
