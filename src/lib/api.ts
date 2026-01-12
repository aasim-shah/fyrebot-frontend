import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tenant API
export const tenantApi = {
  create: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post('/tenants/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/tenants/login', { email, password });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/tenants/me');
    return response.data;
  },
  
  update: async (data: Partial<{ name: string; email: string }>) => {
    const response = await api.put('/tenants/me', data);
    return response.data;
  },
  
  getUsage: async () => {
    const response = await api.get('/tenants/usage');
    return response.data;
  },

  listApiKeys: async () => {
    const response = await api.get('/tenants/api-keys');
    return response.data;
  },

  createApiKey: async (name?: string) => {
    const response = await api.post('/tenants/api-keys', { name });
    return response.data;
  },
};

// Data Registry API
export const dataApi = {
  // Get supported file formats
  getFormats: async () => {
    const response = await api.get('/data/formats');
    return response.data;
  },

  // Upload files
  uploadFiles: async (files: File[], onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post('/data/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  register: async (data: { title: string; content: string; metadata?: Record<string, any> }) => {
    const response = await api.post('/data/register', data);
    // Map sectionId to id for frontend compatibility
    if (response.data.data) {
      response.data.data.id = response.data.data.sectionId;
    }
    return response.data;
  },
  
  list: async (page = 1, limit = 20) => {
    const response = await api.get('/data', { params: { page, limit } });
    // Map sectionId to id for all items
    if (response.data.data) {
      response.data.data = response.data.data.map((item: any) => ({
        ...item,
        id: item.sectionId,
        tenantId: item.tenantId || 'default'
      }));
    }
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await api.get(`/data/${id}`);
    if (response.data.data) {
      response.data.data.id = response.data.data.sectionId;
    }
    return response.data;
  },
  
  update: async (id: string, data: { title?: string; content?: string; metadata?: Record<string, any> }) => {
    const response = await api.put(`/data/${id}`, data);
    if (response.data.data) {
      response.data.data.id = response.data.data.sectionId;
    }
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/data/${id}`);
    return response.data;
  },
  
  bulkRegister: async (dataItems: Array<{ title: string; content: string; metadata?: Record<string, any> }>) => {
    const response = await api.post('/data/bulk', { data: dataItems });
    return response.data;
  },
};

// Chat API
export const chatApi = {
  sendMessage: async (message: string, sessionId?: string) => {
    const response = await api.post('/chat', { query: message, sessionId });
    return response.data.data; // Extract the nested data object
  },
  
  getSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  },
  
  getSession: async (sessionId: string) => {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },
  
  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  },
};

export default api;
