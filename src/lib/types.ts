export interface Tenant {
  id: string;
  name: string;
  email: string;
  apiKey: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: string;
  updatedAt: string;
}

export interface DataItem {
  id: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  tenantId: string;
  type?: string;
  chunkCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    title: string;
    content: string;
    score: number;
  }>;
}

export interface ChatSession {
  id: string;
  tenantId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStats {
  apiCallsThisMonth: number;
  apiCallsLimit: number;
  sectionsCount: number;
  sectionsLimit: number;
  requestsPerMinute: number;
  requestsPerMinuteLimit: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
