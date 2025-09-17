/**
 * Shared OpenRouter API client with comprehensive error handling and logging
 */

// Error types for different failure categories
export enum OpenRouterErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  API_ERROR = 'API_ERROR',
  JSON_PARSE_ERROR = 'JSON_PARSE_ERROR',
  RESPONSE_VALIDATION_ERROR = 'RESPONSE_VALIDATION_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  MODEL_ERROR = 'MODEL_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface OpenRouterError {
  type: OpenRouterErrorType;
  message: string;
  details?: unknown;
  shouldRetry: boolean;
  retryAfter?: number; // seconds
  httpStatus?: number;
  rawResponse?: unknown;
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Enhanced OpenRouter client with detailed error handling
 */
export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private defaultTimeout = 60000; // 60 seconds

  constructor(apiKey?: string) {
    this.apiKey = apiKey || (import.meta as { env?: { VITE_OPEN_ROUTER_API_KEY?: string } }).env?.VITE_OPEN_ROUTER_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Please set VITE_OPEN_ROUTER_API_KEY in your environment.');
    }
  }

  /**
   * Categorize errors based on response status and content
   */
  private categorizeError(response: Response, data?: unknown): OpenRouterErrorType {
    const status = response.status;

    if (status === 401) return OpenRouterErrorType.AUTH_ERROR;
    if (status === 429) return OpenRouterErrorType.RATE_LIMIT;
    if (status === 402 || status === 403) return OpenRouterErrorType.QUOTA_EXCEEDED;
    if (status >= 500) return OpenRouterErrorType.API_ERROR;
    if (status >= 400 && status < 500) {
      // Check if it's a model-specific error
      const errorData = data as { error?: { message?: string } };
      if (errorData?.error?.message?.toLowerCase().includes('model')) {
        return OpenRouterErrorType.MODEL_ERROR;
      }
      return OpenRouterErrorType.API_ERROR;
    }

    return OpenRouterErrorType.UNKNOWN_ERROR;
  }

  /**
   * Determine if an error should be retried and after how long
   */
  private getRetryInfo(errorType: OpenRouterErrorType, headers: Headers): { shouldRetry: boolean; retryAfter?: number } {
    switch (errorType) {
      case OpenRouterErrorType.RATE_LIMIT:
        const retryAfter = headers.get('retry-after');
        return {
          shouldRetry: true,
          retryAfter: retryAfter ? parseInt(retryAfter) : 60
        };

      case OpenRouterErrorType.API_ERROR:
      case OpenRouterErrorType.NETWORK_ERROR:
      case OpenRouterErrorType.TIMEOUT_ERROR:
        return { shouldRetry: true, retryAfter: 5 };

      case OpenRouterErrorType.AUTH_ERROR:
      case OpenRouterErrorType.QUOTA_EXCEEDED:
      case OpenRouterErrorType.JSON_PARSE_ERROR:
      case OpenRouterErrorType.RESPONSE_VALIDATION_ERROR:
      case OpenRouterErrorType.MODEL_ERROR:
        return { shouldRetry: false };

      default:
        return { shouldRetry: false };
    }
  }

  /**
   * Get user-friendly error message and troubleshooting steps
   */
  private getErrorMessage(errorType: OpenRouterErrorType, details?: any): string {
    switch (errorType) {
      case OpenRouterErrorType.AUTH_ERROR:
        return 'Invalid API key. Please check your OpenRouter API key configuration.';

      case OpenRouterErrorType.RATE_LIMIT:
        return 'Rate limit exceeded. Please wait a moment before trying again.';

      case OpenRouterErrorType.QUOTA_EXCEEDED:
        return 'API quota exceeded. Please check your OpenRouter account balance or upgrade your plan.';

      case OpenRouterErrorType.MODEL_ERROR:
        return 'Model error. The AI model is currently unavailable or the request format is invalid.';

      case OpenRouterErrorType.JSON_PARSE_ERROR:
        return 'Failed to parse AI response. The AI returned invalid JSON format.';

      case OpenRouterErrorType.RESPONSE_VALIDATION_ERROR:
        return 'AI response validation failed. The response structure was unexpected.';

      case OpenRouterErrorType.NETWORK_ERROR:
        return 'Network connection failed. Please check your internet connection.';

      case OpenRouterErrorType.TIMEOUT_ERROR:
        return 'Request timed out. The AI service took too long to respond.';

      case OpenRouterErrorType.API_ERROR:
        return `API error occurred. ${details?.message || 'Please try again later.'}`;

      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Log detailed error information for debugging
   */
  private logError(error: OpenRouterError, request: OpenRouterRequest, context: string): void {
    const logData = {
      context,
      errorType: error.type,
      message: error.message,
      httpStatus: error.httpStatus,
      shouldRetry: error.shouldRetry,
      retryAfter: error.retryAfter,
      model: request.model,
      messageCount: request.messages.length,
      timestamp: new Date().toISOString(),
      details: error.details
    };

    console.group(`🚨 OpenRouter Error - ${context}`);
    console.error('Error Summary:', {
      type: error.type,
      message: error.message,
      httpStatus: error.httpStatus,
      shouldRetry: error.shouldRetry
    });

    if (error.shouldRetry) {
      console.warn(`💡 Retry recommended after ${error.retryAfter || 5} seconds`);
    } else {
      console.error('❌ This error should not be retried');
    }

    console.log('Request Context:', {
      model: request.model,
      messageCount: request.messages.length,
      temperature: request.temperature,
      maxTokens: request.max_tokens
    });

    if (error.details) {
      console.log('Error Details:', error.details);
    }

    if (error.rawResponse) {
      console.log('Raw Response:', error.rawResponse);
    }

    console.groupEnd();

    // In development, also store in sessionStorage for debugging
    if ((import.meta as any).env?.DEV) {
      const errors = JSON.parse(sessionStorage.getItem('openrouter-errors') || '[]');
      errors.push(logData);
      // Keep only last 10 errors
      if (errors.length > 10) errors.shift();
      sessionStorage.setItem('openrouter-errors', JSON.stringify(errors));
    }
  }

  /**
   * Log successful API calls for monitoring
   */
  private logSuccess(response: OpenRouterResponse, request: OpenRouterRequest, context: string, duration: number): void {
    const logData = {
      context,
      model: request.model,
      duration,
      usage: response.usage,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ OpenRouter Success - ${context}`, {
      duration: `${duration}ms`,
      model: request.model,
      usage: response.usage
    });

    // In development, track successful calls
    if ((import.meta as any).env?.DEV) {
      const calls = JSON.parse(sessionStorage.getItem('openrouter-success') || '[]');
      calls.push(logData);
      // Keep only last 20 successful calls
      if (calls.length > 20) calls.shift();
      sessionStorage.setItem('openrouter-success', JSON.stringify(calls));
    }
  }

  /**
   * Main API call method with comprehensive error handling
   */
  async makeRequest(
    request: OpenRouterRequest,
    context: string,
    timeout?: number
  ): Promise<OpenRouterResponse> {
    const startTime = Date.now();
    const requestTimeout = timeout || this.defaultTimeout;

    try {
      console.log(`🤖 OpenRouter Request - ${context}`, {
        model: request.model,
        messageCount: request.messages.length,
        temperature: request.temperature,
        maxTokens: request.max_tokens
      });

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'FoodTracker AI',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let responseData: any;
      let responseText: string = '';

      try {
        responseText = await response.text();
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        const error: OpenRouterError = {
          type: OpenRouterErrorType.JSON_PARSE_ERROR,
          message: this.getErrorMessage(OpenRouterErrorType.JSON_PARSE_ERROR),
          details: { parseError, responseText },
          shouldRetry: false,
          httpStatus: response.status,
          rawResponse: responseText
        };

        this.logError(error, request, context);
        throw error;
      }

      if (!response.ok) {
        const errorType = this.categorizeError(response, responseData);
        const retryInfo = this.getRetryInfo(errorType, response.headers);

        const error: OpenRouterError = {
          type: errorType,
          message: this.getErrorMessage(errorType, responseData?.error),
          details: responseData?.error || responseData,
          shouldRetry: retryInfo.shouldRetry,
          retryAfter: retryInfo.retryAfter,
          httpStatus: response.status,
          rawResponse: responseData
        };

        this.logError(error, request, context);
        throw error;
      }

      // Validate response structure
      if (!responseData.choices || !Array.isArray(responseData.choices) || responseData.choices.length === 0) {
        const error: OpenRouterError = {
          type: OpenRouterErrorType.RESPONSE_VALIDATION_ERROR,
          message: this.getErrorMessage(OpenRouterErrorType.RESPONSE_VALIDATION_ERROR),
          details: { reason: 'Missing or empty choices array', response: responseData },
          shouldRetry: false,
          httpStatus: response.status,
          rawResponse: responseData
        };

        this.logError(error, request, context);
        throw error;
      }

      const choice = responseData.choices[0];
      if (!choice?.message?.content) {
        const error: OpenRouterError = {
          type: OpenRouterErrorType.RESPONSE_VALIDATION_ERROR,
          message: this.getErrorMessage(OpenRouterErrorType.RESPONSE_VALIDATION_ERROR),
          details: { reason: 'Missing message content', choice },
          shouldRetry: false,
          httpStatus: response.status,
          rawResponse: responseData
        };

        this.logError(error, request, context);
        throw error;
      }

      const duration = Date.now() - startTime;
      this.logSuccess(responseData, request, context, duration);

      return responseData;

    } catch (error) {
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }

      // Handle fetch errors (network, timeout, etc.)
      let errorType = OpenRouterErrorType.UNKNOWN_ERROR;
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorType = OpenRouterErrorType.NETWORK_ERROR;
        errorMessage = this.getErrorMessage(errorType);
      } else if ((error as any).name === 'AbortError') {
        errorType = OpenRouterErrorType.TIMEOUT_ERROR;
        errorMessage = this.getErrorMessage(errorType);
      }

      const openRouterError: OpenRouterError = {
        type: errorType,
        message: errorMessage,
        details: { originalError: (error as any).message, stack: (error as any).stack },
        shouldRetry: this.getRetryInfo(errorType, new Headers()).shouldRetry
      };

      this.logError(openRouterError, request, context);
      throw openRouterError;
    }
  }

  /**
   * Helper method for retrying failed requests
   */
  async makeRequestWithRetry(
    request: OpenRouterRequest,
    context: string,
    maxRetries: number = 2,
    timeout?: number
  ): Promise<OpenRouterResponse> {
    let lastError: OpenRouterError | null = null;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await this.makeRequest(request, `${context} (attempt ${attempt})`, timeout);
      } catch (error) {
        lastError = error as OpenRouterError;

        if (!lastError.shouldRetry || attempt > maxRetries) {
          throw lastError;
        }

        const waitTime = (lastError.retryAfter || 5) * 1000;
        console.log(`⏳ Retrying in ${waitTime/1000}s (attempt ${attempt + 1}/${maxRetries + 1})`);

        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError;
  }

  /**
   * Get debug information for troubleshooting
   */
  getDebugInfo(): any {
    if (!(import.meta as any).env?.DEV) {
      return { message: 'Debug info only available in development mode' };
    }

    return {
      errors: JSON.parse(sessionStorage.getItem('openrouter-errors') || '[]'),
      successfulCalls: JSON.parse(sessionStorage.getItem('openrouter-success') || '[]'),
      apiKeyConfigured: !!this.apiKey,
      environment: (import.meta as any).env?.MODE
    };
  }

  /**
   * Clear debug logs
   */
  clearDebugLogs(): void {
    if ((import.meta as any).env?.DEV) {
      sessionStorage.removeItem('openrouter-errors');
      sessionStorage.removeItem('openrouter-success');
      console.log('🧹 OpenRouter debug logs cleared');
    }
  }
}

// Export singleton instance
export const openRouterClient = new OpenRouterClient();

// Utility types are already exported above