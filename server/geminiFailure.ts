import type { CoachFallbackReason } from '../src/types/ai';

export interface CoachFailureEvent {
  reason: CoachFallbackReason;
  providerStatus?: number;
}

const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {};

/** Inspect bounded SDK metadata; only an allowlisted reason and HTTP status leave this function. */
export function classifyGeminiFailure(error: unknown): CoachFailureEvent {
  const raw = object(error);
  const message = typeof raw.message === 'string' ? raw.message.slice(0, 16000) : '';
  let parsed: Record<string, unknown> = {};
  try { parsed = object(JSON.parse(message)); } catch { /* Some SDK errors have a plain-text message. */ }
  const payload = object(parsed.error ?? raw.error);
  const statusValue = raw.status ?? payload.code;
  const providerStatus = typeof statusValue === 'number' && Number.isInteger(statusValue) && statusValue >= 400 && statusValue <= 599 ? statusValue : undefined;
  const status = typeof payload.status === 'string' ? payload.status : '';
  const details = Array.isArray(payload.details) ? payload.details.slice(0, 10).map((item) => object(item).reason).filter((item) => typeof item === 'string').join(' ') : '';
  const hint = `${status} ${details} ${typeof payload.message === 'string' ? payload.message.slice(0, 4000) : message}`;
  let reason: CoachFallbackReason = 'provider-unavailable';
  if (providerStatus === 401 || /API_KEY_(?:INVALID|EXPIRED|REVOKED|NOT_FOUND)|API key (?:not valid|expired)|invalid API key/i.test(hint)) reason = 'invalid-key';
  else if (providerStatus === 429 || /RESOURCE_EXHAUSTED|QUOTA_EXCEEDED|RATE_LIMIT_EXCEEDED/.test(hint)) reason = 'provider-quota';
  else if (providerStatus === 404 || status === 'NOT_FOUND' || /model[^\n]*(?:not found|not supported|not available)/i.test(hint)) reason = 'model-unavailable';
  else if (providerStatus === 403 || status === 'PERMISSION_DENIED' || /(?:location|region|country)[^\n]*(?:not supported|not allowed|unavailable)/i.test(hint)) reason = 'permission-denied';
  else if (providerStatus === 408 || providerStatus === 504 || raw.name === 'TimeoutError') reason = 'timeout';
  else if (providerStatus === 400 || providerStatus === 422 || status === 'INVALID_ARGUMENT' || status === 'FAILED_PRECONDITION') reason = 'invalid-request';
  return { reason, ...(providerStatus ? { providerStatus } : {}) };
}

export function logCoachFailure(event: CoachFailureEvent) {
  console.warn(JSON.stringify({ event: 'gemini-coach-fallback', reason: event.reason, ...(event.providerStatus ? { providerStatus: event.providerStatus } : {}) }));
}
