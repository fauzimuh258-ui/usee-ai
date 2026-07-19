import type { UseeAction } from './types';

export class PromptValidationError extends Error {}

const MAX_INPUT_LENGTH = 2000;

function requireField(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new PromptValidationError(`Field "${field}" is required and must be a non-empty string.`);
  }
  const trimmed = value.trim();
  if (trimmed.length > MAX_INPUT_LENGTH) {
    throw new PromptValidationError(`Field "${field}" exceeds the ${MAX_INPUT_LENGTH} character limit.`);
  }
  return trimmed;
}

export function buildUserPrompt(action: UseeAction, payload: Record<string, unknown>): string {
  switch (action) {
    case 'generate_post': {
      const topic = requireField(payload.topic, 'topic');
      const tone = typeof payload.tone === 'string' && payload.tone.trim() ? payload.tone.trim() : 'Professional & Energetic';
      return `Action: Generate high-engagement marketing post.\nContext Topic: ${topic}\nTone Guideline: ${tone}\nGenerate a high-value single post with optimal hashtags. Ensure strict self-correction under 280 characters.`;
    }
    case 'analyze_trends': {
      const rawData = requireField(payload.rawData, 'rawData');
      return `Action: Analyze modern tech industry trends.\nRaw Data Input: ${rawData}\nProvide a structured breakdown of top 3 high-velocity marketing vectors and appropriate tag optimization pathways.`;
    }
    case 'generate_reply': {
      const targetPost = requireField(payload.targetPost, 'targetPost');
      return `Action: Create acquisition pipeline reply.\nTarget Post To Reply To: "${targetPost}"\nFormulate a precise value-add reply that subtly solves their core bottleneck. Avoid generic spam architecture.`;
    }
    default: {
      const _exhaustive: never = action;
      throw new PromptValidationError(`Unsupported action: ${String(_exhaustive)}`);
    }
  }
}
