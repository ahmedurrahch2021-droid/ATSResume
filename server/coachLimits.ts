import type { CoachUsage } from '../src/types/ai';

/** Bounded, server-side per-instance limits. Restarts reset them; not a global per-person entitlement. */
export class CoachLimits {
  private day = '';
  private total = 0;
  private active = 0;
  private clients = new Map<string, { count: number; last: number }>();
  constructor(private daily = 10, private totalDaily = 100, private cooldownMs = 10_000, private concurrency = 2) {}

  private reset(now: number) {
    const day = new Date(now).toISOString().slice(0, 10);
    if (day !== this.day) { this.day = day; this.total = 0; this.clients.clear(); }
  }
  usage(client: string, now = Date.now()): CoachUsage {
    this.reset(now);
    return { limit: this.daily, remaining: Math.max(0, Math.min(this.daily - (this.clients.get(client)?.count ?? 0), this.totalDaily - this.total)), resetAt: new Date(Date.parse(`${this.day}T00:00:00Z`) + 86_400_000).toISOString(), scope: 'server-instance' };
  }
  acquire(client: string, now = Date.now()): { allowed: boolean; retryAfter: number; usage: CoachUsage; release: () => void } {
    const usage = this.usage(client, now);
    const record = this.clients.get(client);
    let released = false;
    const retryAfter = usage.remaining <= 0 ? Math.ceil((Date.parse(usage.resetAt) - now) / 1000) : this.active >= this.concurrency ? 10 : record && now - record.last < this.cooldownMs ? Math.ceil((this.cooldownMs - now + record.last) / 1000) : 0;
    if (retryAfter || (!record && this.clients.size >= 1000)) return { allowed: false, retryAfter: retryAfter || 60, usage, release: () => {} };
    this.clients.set(client, { count: (record?.count ?? 0) + 1, last: now });
    this.total++; this.active++;
    return { allowed: true, retryAfter: 0, usage: this.usage(client, now), release: () => { if (!released) { this.active--; released = true; } } };
  }
}
