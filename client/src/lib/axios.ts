//client/src/lib/axios.ts

import axios from 'axios';
import { AI_TIMEOUT_MS, API_TIMEOUT_MS } from '@/src/constants';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ─── Regular API instance (auth, quiz CRUD, bookmarks, etc.) ─────────────────
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// ─── AI instance (syllabus generation, quiz generation, daily challenge) ──────
export const aiClient = axios.create({
  baseURL: BASE_URL,
  timeout: AI_TIMEOUT_MS,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor – attach token from localStorage if cookie fails ─────
const attachToken = (config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

apiClient.interceptors.request.use(attachToken);
aiClient.interceptors.request.use(attachToken);

// ─── Response interceptor – global error handling ────────────────────────────
const handleError = (error: any) => {
  if (error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
  }
  return Promise.reject(error);
};

apiClient.interceptors.response.use((res: any) => res, handleError);
aiClient.interceptors.response.use((res: any) => res, handleError);