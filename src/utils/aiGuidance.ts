import type { DiagnosticRequest, DiagnosticResponse } from '../types/ai';
import { getCountryProfile } from '../data/targetCountries';

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
    && (data.clarifyingQuestion === null || typeof data.clarifyingQuestion === 'string');
}
