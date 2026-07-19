const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Env-configurable on purpose: Groq regularly deprecates/replaces models
// (see console.groq.com/docs/deprecations), so swapping the default here
// means the next migration is a Vercel env var change, not a redeploy.
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const REQUEST_TIMEOUT_MS = 15_000;

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'GroqApiError';
  }
}

export async function callGroq(messages: GroqChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqApiError('GROQ_API_KEY is not configured on the server.', 500);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const isReasoningModel = GROQ_MODEL.includes('gpt-oss');

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_completion_tokens: 2048,
        // reasoning_effort/include_reasoning only apply to GPT-OSS models —
        // omitted for other model families so they aren't sent a param
        // that model doesn't support.
        ...(isReasoningModel ? { reasoning_effort: 'low', include_reasoning: false } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new GroqApiError(errorText || `Groq API request failed with status ${response.status}.`, response.status);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== 'string' || content.length === 0) {
      throw new GroqApiError('Groq API returned an empty response.', 502);
    }

    return content;
  } catch (error) {
    if (error instanceof GroqApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new GroqApiError('Groq API request timed out.', 504);
    }
    throw new GroqApiError(error instanceof Error ? error.message : 'Unknown error calling Groq API.', 500);
  } finally {
    clearTimeout(timeout);
  }
}
