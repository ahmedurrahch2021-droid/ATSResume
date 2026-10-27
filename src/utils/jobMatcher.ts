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
      matchPercentage: 0,
      matchedKeywords: [],
      missingHardSkills: [],
      missingSoftSkills: [],
      recommendedBullets: [
        'Paste a complete job description (two or three paragraphs) to compare its vocabulary with this draft.',
      ],
      summaryFeedback: 'Job description is too brief to extract terms from.',
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

  // 4. Term coverage. This is the share of the terms we looked for that appear
  // in the resume. It is not a fit score and the UI labels it as counts.
  const totalRelevantSkills = matchedKeywords.length + missingHardSkills.length + missingSoftSkills.length;
  const matchPercentage =
    totalRelevantSkills > 0 ? Math.round((matchedKeywords.length / totalRelevantSkills) * 100) : 0;

  // 5. Prompts, not invented bullets. We do not know your numbers, and a
  // filled-in "32% throughput" would be a lie you then have to defend.
  const recommendedBullets: string[] = [];
  if (missingHardSkills.length > 0) {
    const topMissing = missingHardSkills.slice(0, 2).join(' and ');
    recommendedBullets.push(
      `If you have used ${topMissing}: rewrite one bullet to name it, then add the scale you worked at and the result that changed.`,
    );
  }
  if (missingSoftSkills.length > 0) {
    recommendedBullets.push(
      `If ${missingSoftSkills[0]} is part of your work, show it as an action with an outcome (who you coordinated, what shipped, what improved) rather than listing it as a trait.`,
    );
  }
  recommendedBullets.push(
    'Pick your three strongest bullets and add one number to each: volume, time saved, money moved, people managed, or error rate reduced.',
  );

  const summaryFeedback =
    totalRelevantSkills === 0
      ? 'No terms from our list appear in the posting.'
      : `${matchedKeywords.length} of ${totalRelevantSkills} terms appear in both the posting and this resume.`;

  return {
    matchPercentage,
    matchedKeywords: Array.from(new Set(matchedKeywords)),
    missingHardSkills: Array.from(new Set(missingHardSkills)).slice(0, 8),
    missingSoftSkills: Array.from(new Set(missingSoftSkills)).slice(0, 6),
    recommendedBullets,
    summaryFeedback
  };
}
