import { AtsScanResult } from '../types';

const PASSIVE_PATTERNS = [
  /responsible for/i,
  /duties included/i,
  /helped with/i,
  /helped to/i,
  /assisted in/i,
  /worked on/i,
  /worked with/i,
  /tasked with/i,
  /participated in/i,
  /involved in/i
];

const STRONG_VERBS = [
  'spearheaded', 'orchestrated', 'architected', 'engineered', 'championed',
  'accelerated', 'scaled', 'generated', 'decreased', 'slashed', 'optimized',
  'negotiated', 'streamlined', 'delivered', 'automated', 'transformed',
  'executed', 'pioneered', 'implemented', 'directed', 'authored', 'built'
];

const METRIC_PATTERNS = [
  /\$\d+[\d,]*(?:\.\d+)?(?:k|m|b)?/i, // $500, $1.2M
  /\d+(?:\.\d+)?%/i,                   // 25%, 14.5%
  /\b\d+\s*(?:k|m|million|billion)\b/i,// 50k, 2 million
  /\b\d+\+?\s*(?:users|clients|customers|leads|accounts|teams|engineers|members|projects|transactions)\b/i,
  /\b\d+x\b/i                         // 3x, 10x
];

export function analyzeResumeText(resumeText: string, jobDescriptionText: string = ''): AtsScanResult {
  const cleanResume = resumeText.trim();
  const words = cleanResume.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 20) {
    return {
      score: 18,
      categoryScores: {
        quantifiedMetrics: 10,
        actionVerbs: 15,
        atsReadability: 30,
        skillsRelevance: 20,
        structureFormatting: 15
      },
      criticalIssues: [
        'Resume is too brief to parse meaningfully for ATS systems (under 50 words).',
        'No detailed job achievements or dates detected.',
        'Missing technical and industry keywords.'
      ],
      quickWins: [
        'Add at least 3-4 bullet points per previous role.',
        'Include measurable metrics and results.',
        'Paste your full work experience for a complete analysis.'
      ],
      detectedKeywords: [],
      missingCrucialKeywords: ['Work Experience', 'Quantified Achievements', 'Core Skills'],
      wordCount,
      quantifiedCount: 0,
      strongVerbsCount: 0,
      summaryFeedback: 'Resume contains insufficient text for ATS parsing.'
    };
  }

  // 1. Metric Analysis
  const lines = cleanResume.split('\n').filter(l => l.trim().length > 0);
  let quantifiedLines = 0;
  lines.forEach(line => {
    const hasMetric = METRIC_PATTERNS.some(regex => regex.test(line));
    if (hasMetric) quantifiedLines++;
  });

  const quantifiedRatio = lines.length > 0 ? (quantifiedLines / lines.length) : 0;
  const quantifiedScore = Math.min(100, Math.round(quantifiedRatio * 200)); // 50% lines with metrics = 100

  // 2. Action Verbs Analysis
  const lowerText = cleanResume.toLowerCase();
  let foundStrongVerbs = 0;
  STRONG_VERBS.forEach(verb => {
    if (lowerText.includes(verb)) foundStrongVerbs++;
  });

  let passiveHits = 0;
  PASSIVE_PATTERNS.forEach(pattern => {
    const matches = lowerText.match(pattern);
    if (matches) passiveHits += matches.length;
  });

  let verbScore = Math.min(100, (foundStrongVerbs * 18) - (passiveHits * 12));
  verbScore = Math.max(15, Math.min(100, verbScore));

  // 3. Formatting & ATS Readability
  let formatScore = 80;
  if (wordCount < 200) formatScore -= 30;
  if (wordCount > 1000) formatScore -= 15;
  if (!/(email|@)/i.test(cleanResume)) formatScore -= 20;
  if (!/(phone|\(\d{3}\)|\d{3}[-.]\d{3}[-.]\d{4})/i.test(cleanResume)) formatScore -= 10;
  formatScore = Math.max(20, formatScore);

  // 4. Skills & Job Description Match
  let skillsScore = 70;
  const detectedKeywords: string[] = [];
  const missingCrucialKeywords: string[] = [];

  if (jobDescriptionText.trim().length > 30) {
    const jdClean = jobDescriptionText.toLowerCase();
    // Extract potential meaningful keywords (words > 4 chars, not common stop words)
    const stopWords = new Set(['about', 'their', 'there', 'which', 'would', 'could', 'should', 'experience', 'looking', 'responsible', 'skills', 'degree', 'years', 'requirements', 'qualifications']);
    const jdWords = jdClean
      .replace(/[^a-zA-Z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4 && !stopWords.has(w));

    // Unique frequent keywords
    const wordFreq: Record<string, number> = {};
    jdWords.forEach(w => {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    });

    const topJdTerms = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([w]) => w);

    let matchCount = 0;
    topJdTerms.forEach(term => {
      if (lowerText.includes(term)) {
        matchCount++;
        detectedKeywords.push(term);
      } else {
        missingCrucialKeywords.push(term);
      }
    });

    skillsScore = topJdTerms.length > 0 ? Math.round((matchCount / topJdTerms.length) * 100) : 65;
  } else {
    // Generic check for standard professional skills
    const commonTechSkills = ['sql', 'python', 'javascript', 'agile', 'project management', 'excel', 'crm', 'analysis', 'cloud', 'strategy', 'leadership'];
    commonTechSkills.forEach(skill => {
      if (lowerText.includes(skill)) {
        detectedKeywords.push(skill);
      }
    });
    skillsScore = Math.min(90, Math.max(35, detectedKeywords.length * 15));
  }

  // 5. Structure & Headings
  let structureScore = 65;
  if (/(experience|employment|work history)/i.test(cleanResume)) structureScore += 15;
  if (/(education|degree|university)/i.test(cleanResume)) structureScore += 10;
  if (/(skills|technologies|tools)/i.test(cleanResume)) structureScore += 10;
  structureScore = Math.min(100, structureScore);

  // Weighted overall calculation
  const overallScore = Math.round(
    (quantifiedScore * 0.3) +
    (verbScore * 0.25) +
    (skillsScore * 0.25) +
    (formatScore * 0.1) +
    (structureScore * 0.1)
  );

  // Issues & Wins
  const criticalIssues: string[] = [];
  if (quantifiedRatio < 0.25) {
    criticalIssues.push('Severely lacking quantified metrics: recruiters and ATS algorithms rank candidates with measurable numbers 3x higher.');
  }
  if (passiveHits > 0) {
    criticalIssues.push(`Found ${passiveHits} instances of passive duty language (e.g. "Responsible for", "Helped with") instead of high-impact action verbs.`);
  }
  if (missingCrucialKeywords.length > 0) {
    criticalIssues.push(`Missing high-priority keywords from your target role: ${missingCrucialKeywords.slice(0, 4).join(', ')}.`);
  }
  if (wordCount < 300) {
    criticalIssues.push('Resume length is too brief (< 300 words), leaving potential ATS keyword matches on the table.');
  }

  const quickWins: string[] = [
    'Apply the Google XYZ Formula: "Accomplished [X], measured by [Y], by doing [Z]" to at least 4 core bullets.',
    'Replace passive duty statements with active leadership verbs like "Spearheaded", "Architected", or "Scaled".',
    'Cluster hard tools and certifications into a dedicated, unboxed skills block for instant ATS extraction.'
  ];

  let summaryFeedback = '';
  if (overallScore < 50) {
    summaryFeedback = 'High ATS Rejection Risk: This resume lacks measurable accomplishments and modern keyword tailoring. It is likely being auto-filtered before a human recruiter sees it.';
  } else if (overallScore < 75) {
    summaryFeedback = 'Moderate ATS Performance: The foundation exists, but the document relies heavily on passive responsibilities and misses several core domain keywords.';
  } else {
    summaryFeedback = 'Strong Draft: Good presence of active vocabulary and structure, but can be elevated to top 5% status with targeted metric density and keyword calibration.';
  }

  return {
    score: Math.max(22, Math.min(98, overallScore)),
    categoryScores: {
      quantifiedMetrics: Math.max(15, quantifiedScore),
      actionVerbs: Math.max(20, verbScore),
      atsReadability: formatScore,
      skillsRelevance: skillsScore,
      structureFormatting: structureScore
    },
    criticalIssues: criticalIssues.length > 0 ? criticalIssues : ['Could benefit from deeper keyword alignment against specific job listings.'],
    quickWins,
    detectedKeywords: detectedKeywords.slice(0, 8),
    missingCrucialKeywords: missingCrucialKeywords.slice(0, 6),
    wordCount,
    quantifiedCount: quantifiedLines,
    strongVerbsCount: foundStrongVerbs,
    summaryFeedback
  };
}
