import { GraphQLError } from 'graphql';
import { calculateQueryCost } from './cost.js';

type RateLimitOptions = {
    windowMs: number;
    maxRequests: number;
    maxCost: number;
};

type Bucket = {
    windowStart: number;
    requestCount: number;
    totalCost: number;
}

type ExecuteArgs = {
    contextValue: {
        request?: Request;
        params?: {
            query?: string;
        };
    };
    variableValues?: Record<string, unknown> | null;
};

export function createRateLimitPlugin(opts: RateLimitOptions) {
    // In-memory store (good for local practice). For production, you'd use Redis.
    const buckets = new Map<string, Bucket>();

    function getClientKey(request: Request): string {
        const apiKey = request.headers.get('x-api-key')?.trim();
        if (apiKey) return `key:${apiKey}`;

        // Best-effort IP: in real deployments you'd use trusted proxy headers.
        const fwd = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
        if (fwd) return `ip:${fwd}`;

        return 'ip:unknown';
    }

    function getOrResetBucket(key: string, now: number): Bucket {
        const b = buckets.get(key);
        if (!b) {
            const nb = { windowStart: now, requestCount: 0, totalCost: 0 };
            buckets.set(key, nb);
            return nb;
        }
        const elapsed = now - b.windowStart;
        if (elapsed >= opts.windowMs) {
            b.windowStart = now;
            b.requestCount = 0;
            b.totalCost = 0;
        }
        return b;
    }

    function retryAfterSec(bucket: Bucket, now: number) {
        const remainingMs = Math.max(0, opts.windowMs - (now - bucket.windowStart));
        return Math.ceil(remainingMs / 1000);
    }

    return {
        onExecute({ args }: { args: ExecuteArgs }) {
            const now = Date.now();
            const request = args.contextValue.request as Request | undefined;

            if (!request) return;

            const key = getClientKey(request);
            const bucket = getOrResetBucket(key, now);

            const rawQuery = args.contextValue.params?.query;

            if (typeof rawQuery !== 'string') {
                // If we can't read the raw query, apply a minimal cost of 1.
                bucket.requestCount += 1;
                bucket.totalCost += 1;
            } else {
                const cost = calculateQueryCost(rawQuery, args.variableValues ?? null);
                bucket.requestCount += 1;
                bucket.totalCost += cost;
            }

            // Enforce limits
            if (bucket.requestCount > opts.maxRequests || bucket.totalCost > opts.maxCost) {
                const ra = retryAfterSec(bucket, now);
                throw new GraphQLError('Rate limit exceeded', {
                    extensions: {
                        code: 'RATE_LIMITED',
                        key,
                        windowMs: opts.windowMs,
                        maxRequests: opts.maxRequests,
                        maxCost: opts.maxCost,
                        requestCount: bucket.requestCount,
                        totalCost: bucket.totalCost,
                        retryAfterSec: ra
                    }
                });
            }
        }
    };
}