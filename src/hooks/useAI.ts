// @ts-nocheck
import { useState } from 'react';
import { TogetherService, TogetherConfig } from '@/lib/services/together';

export type AIResponse = {
  content: string;
  error?: string;
};

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const service = new TogetherService();

  const generateCompletion = async (
    prompt: string, 
    config?: Partial<TogetherConfig>
  ): Promise<AIResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      const content = await service.generateCompletion(prompt, config);
      return { content: content || '' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { content: '', error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateCompletion,
  };
}
