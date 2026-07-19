export type UseeAction = 'generate_post' | 'analyze_trends' | 'generate_reply';

export interface UseeRequestBody {
  action: UseeAction;
  payload: {
    topic?: string;
    tone?: string;
    rawData?: string;
    targetPost?: string;
  };
}

export interface UseeSuccessResponse {
  success: true;
  content: string;
}

export interface UseeErrorResponse {
  success: false;
  error: string;
}

export type UseeResponse = UseeSuccessResponse | UseeErrorResponse;
