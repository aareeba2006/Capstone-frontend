// Very small in-memory fixed-window rate limiter.
// Good enough for a single-instance deploy (e.g. one Vercel function region,
// hobby/small projects). NOT distributed — if you scale to multiple instances
// or need durability across cold starts, swap this for Upstash Redis
// (@upstash/ratelimit) using the same `check()` interface.

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 10; // 10 requests per minute per IP

export function checkRateLimit(key: string): {
  ok: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: MAX_REQUESTS - 1, resetAt };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: MAX_REQUESTS - bucket.count, resetAt: bucket.resetAt };
}

// Periodically clear old buckets so the Map doesn't grow forever on a
// long-lived instance.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets.entries()) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}, WINDOW_MS).unref?.();
