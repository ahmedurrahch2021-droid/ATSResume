import { JobMatchAnalysis, ResumeData } from '../types';
import { formatResumeAsPlainText } from './resumeParser';

const COMMON_STOP_WORDS = new Set([
  'about', 'their', 'there', 'which', 'would', 'could', 'should', 'experience',
  'looking', 'responsible', 'skills', 'degree', 'years', 'requirements', 'qualifications',
  'candidate', 'team', 'work', 'working', 'ability', 'must', 'have', 'with', 'using',
  'preferred', 'equal', 'opportunity', 'employer', 'salary', 'benefits', 'apply', 'role'
]);

const TECHNICAL_SKILL_CORPUS = [
  'react', 'typescript', 'javascript', 'python', 'java', 'go', 'golang', 'c++', 'c#',
  '.net', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'api',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'terraform', 'ci/cd', 'git', 'github',
  'linux', 'next.js', 'node.js', 'express', 'tailwind', 'microservices', 'kafka',
  'rabbitmq', 'elasticsearch', 'tdd', 'jest', 'cypress', 'prometheus', 'grafana',
  'pandas', 'numpy', 'scikit-learn', 'pytorch', 'tensorflow', 'tableau', 'snowflake'
];

const SOFT_SKILL_CORPUS = [
  'cross-functional', 'leadership', 'communication', 'collaboration', 'stakeholder management',
  'mentorship', 'problem solving', 'agile', 'scrum', 'strategic thinking', 'ownership',
  'time management', 'adaptability', 'presentation', 'negotiation'
];

export function analyzeJobMatch(
  resumeInput: ResumeData | string,
  jobDescription: string
): JobMatchAnalysis {
  const resumeText = typeof resumeInput === 'string' 
    ? resumeInput 
    : formatResumeAsPlainText(resumeInput);

  const cleanJd = jobDescription.toLowerCase();
  const cleanResume = resumeText.toLowerCase();

  if (cleanJd.trim().length < 40) {
    return {
      matchPercentage: 45,
      matchedKeywords: [],
      missingHardSkills: [],
      missingSoftSkills: [],
      recommendedBullets: [
        'Paste a complete job description (at least 2-3 paragraphs) to see comprehensive keyword matches and missing requirements.'
      ],
      summaryFeedback: 'Job description is too brief to extract meaningful keyword frequency.'
    };
  }

  // 1. Identify Tech Skills in JD
  const matchedKeywords: string[] = [];
  const missingHardSkills: string[] = [];

  TECHNICAL_SKILL_CORPUS.forEach(skill => {
    const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillRegex.test(cleanJd)) {
      if (skillRegex.test(cleanResume)) {
        matchedKeywords.push(skill);
      } else {
        missingHardSkills.push(skill);
      }
    }
  });

  // 2. Identify Soft / Organizational Skills in JD
  const missingSoftSkills: string[] = [];
  SOFT_SKILL_CORPUS.forEach(skill => {
    const skillRegex = new RegExp(`\\b${skill}\\b`, 'i');
    if (skillRegex.test(cleanJd)) {
      if (skillRegex.test(cleanResume)) {
        matchedKeywords.push(skill);
      } else {
        missingSoftSkills.push(skill);
      }
    }
  });

  // 3. Extract frequent domain terms from JD
  const jdTokens = cleanJd
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length >= 4 && !COMMON_STOP_WORDS.has(t));

  const freqMap: Record<string, number> = {};
  jdTokens.forEach(token => {
    freqMap[token] = (freqMap[token] || 0) + 1;
  });

  const highPriorityJdTerms = Object.entries(freqMap)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([term]) => term);

  highPriorityJdTerms.forEach(term => {
    if (!matchedKeywords.includes(term) && !missingHardSkills.includes(term)) {
      if (cleanResume.includes(term)) {
        matchedKeywords.push(term);
      } else {
        missingHardSkills.push(term);
      }
    }
  });

  // 4. Calculate Match Percentage
  const totalRelevantSkills = matchedKeywords.length + missingHardSkills.length + missingSoftSkills.length;
  let matchPercentage = 60;
  if (totalRelevantSkills > 0) {
    matchPercentage = Math.round((matchedKeywords.length / totalRelevantSkills) * 100);
    // Boundary clamp for realism
    matchPercentage = Math.max(24, Math.min(97, matchPercentage));
  }

  // 5. Generate Recommended Bullets using Google XYZ Formula
  const recommendedBullets: string[] = [];
  if (missingHardSkills.length > 0) {
    const topMissing = missingHardSkills.slice(0, 2).map(s => s.toUpperCase()).join(' and ');
    recommendedBullets.push(
      `Engineered core services leveraging ${topMissing}, improving processing throughput by 32% and reducing latency across peak traffic periods.`
    );
  }
  if (missingSoftSkills.length > 0) {
    const soft = missingSoftSkills[0];
    recommendedBullets.push(
      `Fostered ${soft} across 4 cross-functional pods, standardizing deployment runbooks and accelerating project delivery by 20%.`
    );
  }
  recommendedBullets.push(
    `Spearheaded automated testing and reliability initiatives, cutting regression bug discovery time by 45% prior to production release.`
  );

  let summaryFeedback = '';
  if (matchPercentage >= 80) {
    summaryFeedback = 'High Match Alignment! Your resume reflects strong keyword harmony with the core job listing requirements.';
  } else if (matchPercentage >= 60) {
    summaryFeedback = 'Moderate Match Alignment. You share foundation terms, but adding the missing high-frequency keywords below will substantially elevate your ATS ranking.';
  } else {
    summaryFeedback = 'Low Match Risk. The employer ATS is likely to filter this resume out due to missing critical tech and domain keywords found in their job posting.';
  }

  return {
    matchPercentage,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    missingHardSkills: Array.from(new Set(missingHardSkills)).slice(0, 8),
    missingSoftSkills: Array.from(new Set(missingSoftSkills)).slice(0, 6),
    recommendedBullets,
    summaryFeedback
  };
}
