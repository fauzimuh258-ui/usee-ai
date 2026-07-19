/**
 * In-memory rate limiter — scoped to a single serverless function instance.
 * On Vercel, concurrent or cold-started instances do NOT share this Map, so
 * it's fine as light abuse protection but isn't a hard per-IP guarantee.
 * For that, swap to a shared store (Upstash Redis / Vercel KV) behind the
 * same isRateLimited/recordRequest interface.
 */

const rateLimitStore = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
const MAX_STORE_SIZE = 5000; // bounds memory so the Map can't grow forever

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0];
    if (first && first.trim()) return first.trim();
  }
  return headers.get('x-real-ip') || 'anonymous';
}

export function isRateLimited(key: string): { limited: boolean; retryAfterSeconds?: number } {
  const last = rateLimitStore.get(key);
  if (!last) return { limited: false };

  const elapsed = Date.now() - last;
  if (elapsed < COOLDOWN_MS) {
    return { limited: true, retryAfterSeconds: Math.ceil((COOLDOWN_MS - elapsed) / 1000) };
  }
  return { limited: false };
}

export function recordRequest(key: string): void {
  if (rateLimitStore.size >= MAX_STORE_SIZE) {
    const oldestKey = rateLimitStore.keys().next().value;
    if (oldestKey) rateLimitStore.delete(oldestKey);
  }
  rateLimitStore.set(key, Date.now());
}
