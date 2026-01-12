import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tenant {
  id?: string;
  tenantId: string;
  name: string;
  email: string;
  businessName: string;
  plan: string;
  createdAt?: string;
  limits: {
    monthlyMessages: number;
    maxDataItems: number;
    maxChunkSize: number;
  };
}

interface AuthState {
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (tenant: Tenant, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tenant: null,
      token: null,
      isAuthenticated: false,
      setAuth: (tenant, token) => {
        localStorage.setItem('auth_token', token);
        set({ tenant, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ tenant: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

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

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  currentMessages: ChatMessage[];
  isLoading: boolean;
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  createNewSession: () => void;
  clearCurrentSession: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentSessionId: null,
  currentMessages: [],
  isLoading: false,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (sessionId) => {
    set((state) => {
      const session = state.sessions.find((s) => s.id === sessionId);
      return {
        currentSessionId: sessionId,
        currentMessages: session?.messages || [],
      };
    });
  },
  addMessage: (message) =>
    set((state) => ({
      currentMessages: [...state.currentMessages, message],
    })),
  setMessages: (messages) => set({ currentMessages: messages }),
  setLoading: (loading) => set({ isLoading: loading }),
  createNewSession: () => set({ currentSessionId: null, currentMessages: [] }),
  clearCurrentSession: () => set({ currentMessages: [], currentSessionId: null }),
}));

interface DataItem {
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

interface DataState {
  items: DataItem[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  selectedItem: DataItem | null;
  setItems: (items: DataItem[], total: number) => void;
  setSelectedItem: (item: DataItem | null) => void;
  setPage: (page: number) => void;
  addItem: (item: DataItem) => void;
  updateItem: (id: string, item: Partial<DataItem>) => void;
  removeItem: (id: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  items: [],
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 20,
  selectedItem: null,
  setItems: (items, total) => set({ items, totalItems: total }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  setPage: (page) => set({ currentPage: page }),
  addItem: (item) =>
    set((state) => ({
      items: [item, ...state.items],
      totalItems: state.totalItems + 1,
    })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      totalItems: state.totalItems - 1,
    })),
}));
