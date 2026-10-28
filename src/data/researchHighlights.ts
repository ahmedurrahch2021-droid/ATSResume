/** Logo provenance and source-to-product decisions are recorded in docs/RESEARCH_REFERENCES.md. */
export interface ResearchHighlight {
  sourceId: string;
  name: string;
  category: string;
  benefit: string;
  application: string;
  logos: { src: string; alt: string; width: number; height: number }[];
  darkLogoBackground?: boolean;
}

export const RESEARCH_HIGHLIGHTS: ResearchHighlight[] = [
  {
    sourceId: 'mit-ats', name: 'MIT CAPD', category: 'University career guidance',
    benefit: 'Readable structure',
    application: 'Single-column layouts and our extract-and-recheck flow follow MIT’s formatting guidance. Other readers may parse differently.',
    logos: [{ src: '/images/research/mit-capd.svg', alt: 'MIT', width: 1360, height: 796.37 }],
  },
  {
    sourceId: 'harvard-bullet', name: 'Harvard Mignone Center', category: 'University resume example',
    benefit: 'Clear section order',
    application: 'Harvard’s bullet-point example informs our section hierarchy and concise contributions. Our four layouts are independent designs.',
    logos: [
      { src: '/images/research/harvard-fas.svg', alt: 'Harvard Faculty of Arts and Sciences', width: 257.359, height: 53.202 },
      { src: '/images/research/harvard-mignone.svg', alt: 'Mignone Center for Career Success', width: 272.9331, height: 88.343 },
    ],
  },
  {
    sourceId: 'greenhouse-parse', name: 'Greenhouse', category: 'ATS-provider documentation',
    benefit: 'Parsing issues you can inspect',
    application: 'Keep contact details in body text and inspect complex document structure. Greenhouse documents its own parser’s limits, not every ATS.',
    logos: [{ src: '/images/research/greenhouse.svg', alt: 'Greenhouse', width: 140, height: 32 }],
  },
  {
    sourceId: 'nber-writing', name: 'NBER', category: 'Writing-assistance research',
    benefit: 'More attention to clarity',
    application: 'A randomized study supports attention to writing quality. It does not test this tool or establish an individual hiring result.',
    logos: [{ src: '/images/research/nber.svg', alt: 'NBER — National Bureau of Economic Research', width: 292.75, height: 31.24 }],
  },
  {
    sourceId: 'bdjobs-resume', name: 'Bdjobs', category: 'Bangladesh platform guidance',
    benefit: 'Local application context',
    application: 'Distinguish a Bdjobs profile from a separately uploaded resume. Our Bangladesh guide points you to the platform’s actual instructions.',
    logos: [{ src: '/images/research/bdjobs.svg', alt: 'Bdjobs.com', width: 500, height: 130 }],
  },
  {
    sourceId: 'imperial-cv', name: 'Imperial College London', category: 'University CV guidance',
    benefit: 'Relevant evidence first',
    application: 'Choose a useful section order and show evidence for your skills. Page length depends on your experience and the application.',
    logos: [{ src: '/images/research/imperial.svg', alt: 'Imperial', width: 727, height: 80 }],
  },
  {
    sourceId: 'nyuad-cv', name: 'NYU Abu Dhabi', category: 'Early-career CV guidance',
    benefit: 'Make projects count',
    application: 'Describe your projects, skills and contributions. We adapt student-focused guidance while keeping the document body in a single column.',
    logos: [{ src: '/images/research/nyu-abu-dhabi.svg', alt: 'New York University Abu Dhabi', width: 277.4, height: 69.6 }],
    darkLogoBackground: true,
  },
  {
    sourceId: 'iitm-internship', name: 'IIT Madras', category: 'Internship-process guidance',
    benefit: 'Support every claim',
    application: 'Label academic projects clearly and use facts you can substantiate. IIT’s internship rules are specific to its own process.',
    logos: [{ src: '/images/research/iit-madras.png', alt: 'Indian Institute of Technology Madras', width: 272, height: 60 }],
  },
];
