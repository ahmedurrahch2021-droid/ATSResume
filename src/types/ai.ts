import type { TargetCountry } from './countryNorms';

export type DiagnosticSection = 'bullet' | 'summary' | 'experience' | 'cover-letter' | 'general';
export interface CoachTurn { role: 'user' | 'assistant'; text: string }
export interface DiagnosticRequest {
  currentText: string;
  sectionType: DiagnosticSection;
  targetRole?: string;
  countryNorm?: TargetCountry;
  flawsDetected?: string[];
  userInstruction?: string;
  confirmedFacts?: string;
  jobDescription?: string;
  history?: CoachTurn[];
}
export interface CoachUsage { remaining: number; limit: number; resetAt: string; scope: 'server-instance' }
export type CoachFallbackReason = 'not-configured' | 'invalid-key' | 'permission-denied' | 'model-unavailable'
  | 'invalid-request' | 'provider-quota' | 'provider-unavailable' | 'timeout' | 'invalid-response'
  | 'daily-limit' | 'cooldown' | 'server-busy' | 'network';
export interface DiagnosticResponse {
  originalText: string;
  suggestedText: string;
  rationale: string;
  clarifyingQuestion: string | null;
  sourceIds: string[];
  isFallback: boolean;
  message?: string;
  usage?: CoachUsage;
  fallbackReason?: CoachFallbackReason;
  retryAfterSeconds?: number;
}
export interface CoachTarget { id: string; label: string; text: string; sectionType: DiagnosticSection }
