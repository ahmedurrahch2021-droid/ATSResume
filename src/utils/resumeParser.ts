import { ResumeData } from '../types';

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
export function parseRawResumeText(text: string): ResumeData {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const fullText = text;

  // Extract Email
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Extract Phone
  const phoneMatch = fullText.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Extract LinkedIn
  const linkedinMatch = fullText.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  // Extract Name (First non-empty line without special characters usually)
  let name = 'Applicant Name';
  if (lines.length > 0) {
    const candidateName = lines[0].replace(/[^a-zA-Z\s.-]/g, '').trim();
    if (candidateName.length > 2 && candidateName.length < 40 && !candidateName.includes('@')) {
      name = candidateName;
    }
  }

  // Extract Title (Second line or look for keywords)
  let title = 'Experienced Professional';
  if (lines.length > 1) {
    const secondLine = lines[1].trim();
    if (secondLine.length > 3 && secondLine.length < 60 && !secondLine.includes('@')) {
      title = secondLine;
    }
  }

  // Extract summary
  let summary = '';
  const summaryMatch = fullText.match(/(?:summary|profile|about me|objective)[:\s\n]+([\s\S]*?)(?=(?:experience|work history|employment|education|skills|projects|$))/i);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].trim().replace(/\n+/g, ' ');
  } else if (lines.length > 2) {
    summary = lines.slice(2, 5).join(' ');
  }

  // Extract Skills
  let languages = '';
  let frameworks = '';
  let toolsAndCloud = '';
  let methodologies = '';

  const skillsMatch = fullText.match(/(?:skills|technologies|technical skills)[:\s\n]+([\s\S]*?)(?=(?:experience|work history|education|certifications|projects|$))/i);
  if (skillsMatch && skillsMatch[1]) {
    const rawSkills = skillsMatch[1].trim().replace(/\n+/g, ', ');
    languages = rawSkills;
  } else {
    languages = 'JavaScript, TypeScript, Python, SQL, HTML, CSS';
    frameworks = 'React, Node.js, Express, Next.js';
    toolsAndCloud = 'Git, Docker, AWS, PostgreSQL';
    methodologies = 'Agile, CI/CD, Microservices';
  }

  // Experience extraction
  const experience: ResumeData['experience'] = [];
  const expMatch = fullText.match(/(?:experience|work history|employment)[:\s\n]+([\s\S]*?)(?=(?:education|skills|projects|certifications|$))/i);
  const expChunk = expMatch ? expMatch[1] : '';

  if (expChunk) {
    const bulletLines = expChunk.split('\n').filter(l => l.trim().startsWith('•') || l.trim().startsWith('-') || l.trim().startsWith('*') || l.trim().length > 30);
    if (bulletLines.length > 0) {
      experience.push({
        id: 'exp-parsed-1',
        role: title || 'Senior Specialist',
        company: 'Leading Enterprise / Tech Co.',
        location: 'Remote / Hybrid',
        dates: '2021 – Present',
        bullets: bulletLines.slice(0, 4).map(b => b.replace(/^[-•*]\s*/, '').trim())
      });
    }
  }

  // Fallback to defaults if experience was not properly partitioned
  if (experience.length === 0) {
    experience.push({
      id: 'exp-default-1',
      role: title || 'Professional Role',
      company: 'Enterprise Company',
      location: 'New York, NY',
      dates: '2021 – Present',
      bullets: [
        'Accelerated cross-team deployment cycles by 35% through standardized CI/CD pipelines.',
        'Spearheaded key initiatives impacting 100,000+ end-users with 99.9% uptime SLA.',
        'Authored comprehensive system documentation and technical specifications.'
      ]
    });
  }

  return {
    fullName: name,
    targetTitle: title,
    email: email || 'applicant@email.com',
    phone: phone || '(555) 012-3456',
    location: 'United States',
    linkedin: linkedin || 'linkedin.com/in/applicant',
    portfolio: 'github.com/applicant',
    summary: summary || 'High-performing professional with demonstrated success scaling business outcomes and engineering robust solutions.',
    experience,
    education: [
      {
        id: 'edu-parsed-1',
        degree: 'Bachelor of Science',
        institution: 'Accredited University',
        location: 'United States',
        dates: '2016 – 2020'
      }
    ],
    skills: {
      languages,
      frameworks: frameworks || 'Industry Standard Tools',
      toolsAndCloud: toolsAndCloud || 'Modern Development Suite',
      methodologies: methodologies || 'Agile Development & Delivery'
    },
    projects: [
      {
        id: 'proj-parsed-1',
        name: 'Key Production Initiative',
        roleOrTech: 'Core Project Lead',
        bullets: [
          'Engineered end-to-end user features increasing platform engagement by 28%.'
        ]
      }
    ],
    certifications: [
      'Professional Certification in Industry Standards'
    ]
  };
}

/**
 * Format ResumeData as plain text for easy copying, job match testing, or order pre-filling
 */
export function formatResumeAsPlainText(resume: ResumeData): string {
  let output = `${resume.fullName}\n${resume.targetTitle}\n`;
  output += `${resume.email} | ${resume.phone} | ${resume.location} | ${resume.linkedin}\n\n`;

  if (resume.summary) {
    output += `PROFESSIONAL SUMMARY\n${resume.summary}\n\n`;
  }

  output += `WORK EXPERIENCE\n`;
  resume.experience.forEach(exp => {
    output += `${exp.role} | ${exp.company} | ${exp.location} | ${exp.dates}\n`;
    exp.bullets.forEach(b => {
      output += `• ${b}\n`;
    });
    output += `\n`;
  });

  output += `TECHNICAL & PROFESSIONAL SKILLS\n`;
  if (resume.skills.languages) output += `Languages: ${resume.skills.languages}\n`;
  if (resume.skills.frameworks) output += `Frameworks: ${resume.skills.frameworks}\n`;
  if (resume.skills.toolsAndCloud) output += `Cloud & Tools: ${resume.skills.toolsAndCloud}\n`;
  if (resume.skills.methodologies) output += `Methodologies: ${resume.skills.methodologies}\n`;
  output += `\n`;

  if (resume.education.length > 0) {
    output += `EDUCATION\n`;
    resume.education.forEach(edu => {
      output += `${edu.degree} – ${edu.institution} (${edu.dates})${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}\n`;
    });
    output += `\n`;
  }

  if (resume.projects && resume.projects.length > 0) {
    output += `PROJECTS\n`;
    resume.projects.forEach(p => {
      output += `${p.name} (${p.roleOrTech})\n`;
      p.bullets.forEach(b => {
        output += `• ${b}\n`;
      });
      output += `\n`;
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    output += `CERTIFICATIONS\n`;
    resume.certifications.forEach(c => {
      output += `• ${c}\n`;
    });
    output += `\n`;
  }

  if (resume.languages && resume.languages.length > 0) {
    output += `LANGUAGES\n`;
    resume.languages.forEach(l => {
      output += `• ${l.name}: ${l.level}\n`;
    });
    output += `\n`;
  }

  if (resume.competitiveProgramming && resume.competitiveProgramming.length > 0) {
    output += `COMPETITIVE PROGRAMMING & PROFILES\n`;
    resume.competitiveProgramming.forEach(cp => {
      output += `• ${cp.platform}: ${cp.handle}${cp.rating ? ` (Rating: ${cp.rating})` : ''}${cp.badgeOrRank ? ` [${cp.badgeOrRank}]` : ''}\n`;
    });
    output += `\n`;
  }

  return output;
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
