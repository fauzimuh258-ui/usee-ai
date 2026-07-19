import { NextRequest, NextResponse } from 'next/server';
import { USEE_SYSTEM_PROMPT } from '@/lib/system-prompt';
import { buildUserPrompt, PromptValidationError } from '@/lib/prompt-builder';
import { callGroq, GroqApiError } from '@/lib/groq-client';
import { getClientIp, isRateLimited, recordRequest } from '@/lib/rate-limit';
import type { UseeAction } from '@/lib/types';

// Node runtime: the in-memory rate limiter needs a persistent module scope,
// which Edge runtime doesn't guarantee the same way.
export const runtime = 'nodejs';

const VALID_ACTIONS: readonly UseeAction[] = ['generate_post', 'analyze_trends', 'generate_reply'];

function isValidAction(value: unknown): value is UseeAction {
  return typeof value === 'string' && (VALID_ACTIONS as readonly string[]).includes(value);
}

function buildMockResponse(action: UseeAction, payload: Record<string, unknown>): string {
  const raw = payload.topic ?? payload.rawData ?? payload.targetPost;
  const topic = typeof raw === 'string' && raw.trim() ? raw.trim() : 'General Marketing';
  return `[MOCK ENGINE — GROQ_API_KEY not set]\nAction: ${action}\nTopic: "${topic}"\n\nStruggling to scale your cloud architecture deployment loops? ⚡\nHere is the atomic breakdown to unlock immediate throughput efficiency without structural tech degradation.\n\n#TechGrowth #DevOpsEngine`;
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req.headers);

  const rateLimit = isRateLimited(clientIp);
  if (rateLimit.limited) {
    return NextResponse.json(
      { success: false, error: `Rate limit exceeded. Please wait ${rateLimit.retryAfterSeconds}s before your next request.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { action, payload } = (body ?? {}) as { action?: unknown; payload?: unknown };

  if (!isValidAction(action)) {
    return NextResponse.json(
      { success: false, error: `Invalid action. Expected one of: ${VALID_ACTIONS.join(', ')}.` },
      { status: 400 }
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json({ success: false, error: 'Missing or invalid `payload` object.' }, { status: 400 });
  }

  const typedPayload = payload as Record<string, unknown>;

  let userPrompt: string;
  try {
    userPrompt = buildUserPrompt(action, typedPayload);
  } catch (error) {
    if (error instanceof PromptValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    throw error;
  }

  recordRequest(clientIp);

  if (!process.env.GROQ_API_KEY) {
    console.warn('[usee-ai] GROQ_API_KEY not set — serving mock response.');
    return NextResponse.json({ success: true, content: buildMockResponse(action, typedPayload) });
  }

  try {
    const content = await callGroq([
      { role: 'system', content: USEE_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    if (error instanceof GroqApiError) {
      console.error('[usee-ai] Groq API error:', error.message);
      return NextResponse.json(
        { success: false, error: 'The AI engine failed to generate a response. Please try again.' },
        { status: error.status >= 400 && error.status < 600 ? error.status : 502 }
      );
    }
    console.error('[usee-ai] Unexpected error:', error);
    return NextResponse.json({ success: false, error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}
