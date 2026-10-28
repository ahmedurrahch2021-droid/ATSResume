import type { CoachTurn } from '../types/ai';

const PREFIX = 'atsresume:coach:history:v1:';
export function readCoachHistory(context: string): CoachTurn[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PREFIX + context) ?? '[]');
    return Array.isArray(value) ? value.filter((turn) => turn && ['user', 'assistant'].includes(turn.role) && typeof turn.text === 'string').slice(-6).map((turn) => ({ role: turn.role, text: turn.text.slice(0, 1500) })) : [];
  } catch { return []; }
}
export function saveCoachHistory(context: string, turns: CoachTurn[]): boolean {
  try { localStorage.setItem(PREFIX + context, JSON.stringify(turns.slice(-6).map((turn) => ({ role: turn.role, text: turn.text.slice(0, 1500) })))); return true; }
  catch { return false; }
}
export function clearCoachHistory(context: string): void {
  try { localStorage.removeItem(PREFIX + context); } catch { /* In-memory conversation is cleared by the caller. */ }
}
