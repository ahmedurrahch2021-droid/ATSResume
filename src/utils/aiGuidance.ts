import type { CoachFallbackReason, CoachUsage, DiagnosticRequest, DiagnosticResponse } from '../types/ai';
import { getCountryProfile } from '../data/targetCountries';

/** Fixed public messages: never display a raw provider exception or request payload. */
export const COACH_FALLBACK_MESSAGES: Record<CoachFallbackReason, string> = {
  'not-configured': 'Online coaching is not configured on this server. Local writing guidance is available.',
  'invalid-key': 'Google did not accept this site’s API key. Please contact the founder; local writing guidance is available.',
  'permission-denied': 'Google denied access for this site’s AI project or location. Please contact the founder; local writing guidance is available.',
  'model-unavailable': 'The configured Gemini model is unavailable to this site. Please contact the founder; local writing guidance is available.',
  'invalid-request': 'Google could not accept this site’s AI request settings. Please contact the founder; local writing guidance is available.',
  'provider-quota': 'Google’s shared AI quota is exhausted or temporarily rate-limited. Try again later or contact the founder. Local writing guidance is available.',
  'provider-unavailable': 'Gemini is temporarily unavailable. Try again later; local writing guidance is available.',
  timeout: 'Gemini took too long to respond. Try again later or use the local writing guidance below.',
  'invalid-response': 'The AI response did not pass our response checks. Your original text is retained; local writing guidance is available.',
  'daily-limit': 'This server’s daily pilot allowance is used up for your connection or the shared server budget. Local writing guidance is available.',
  cooldown: 'Please wait briefly between online requests. Local writing guidance is available now.',
  'server-busy': 'This server is helping other people right now. Try again shortly; local writing guidance is available.',
  network: 'The online coach could not be reached. Local guidance is shown and your text is retained.',
};

export function coachFallback(request: DiagnosticRequest, reason: CoachFallbackReason): DiagnosticResponse {
  return { ...localCoachGuidance(request, COACH_FALLBACK_MESSAGES[reason]), fallbackReason: reason };
}

/** A fallback supplies guidance, never a made-up achievement or a pretend AI rewrite. */
export function localCoachGuidance(request: DiagnosticRequest, message = 'Gemini is unavailable. Your text is unchanged.'): DiagnosticResponse {
  const duty = /\b(responsible for|assisted with|worked on|helped)\b/i.test(request.currentText);
  return {
    originalText: request.currentText,
    suggestedText: request.currentText,
    rationale: duty
      ? 'Describe the action you actually performed and how you did it. “Assisted” does not establish that you led, engineered or directed the work.'
      : 'Keep the relevant action, method and outcome. Remove repetition only when the meaning and supplied facts remain accurate. A specific qualitative result is valid.',
    clarifyingQuestion: 'What did you personally do, how did you do it, and what changed? Include a number only if you have an accurate one.',
    sourceIds: getCountryProfile(request.countryNorm).sourceIds,
    isFallback: true, message,
  };
}

export function isDiagnosticResponse(value: unknown): value is DiagnosticResponse {
  if (!value || typeof value !== 'object') return false;
  const data = value as DiagnosticResponse;
  return ['originalText', 'suggestedText', 'rationale'].every((key) => typeof data[key as keyof DiagnosticResponse] === 'string')
    && typeof data.isFallback === 'boolean' && Array.isArray(data.sourceIds) && data.sourceIds.every((id) => typeof id === 'string')
    && (data.clarifyingQuestion === null || typeof data.clarifyingQuestion === 'string')
    && (data.message === undefined || (typeof data.message === 'string' && data.message.length <= 2000))
    && (data.usage === undefined || isCoachUsage(data.usage))
    && (data.fallbackReason === undefined || (typeof data.fallbackReason === 'string' && Object.hasOwn(COACH_FALLBACK_MESSAGES, data.fallbackReason)))
    && (data.retryAfterSeconds === undefined || (Number.isInteger(data.retryAfterSeconds) && data.retryAfterSeconds >= 0 && data.retryAfterSeconds <= 86400));
}

export function isCoachUsage(value: unknown): value is CoachUsage {
  if (!value || typeof value !== 'object') return false;
  const usage = value as CoachUsage;
  return Number.isInteger(usage.limit) && usage.limit > 0 && usage.limit <= 10000
    && Number.isInteger(usage.remaining) && usage.remaining >= 0 && usage.remaining <= usage.limit
    && usage.scope === 'server-instance' && typeof usage.resetAt === 'string' && Number.isFinite(Date.parse(usage.resetAt));
}
