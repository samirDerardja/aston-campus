import { Promotion, Student, Trainer, ActionItem, Interview, ActionStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Service API HTTP Aston Campus
 * Se connecte au backend Fastify Node.js et à la base de données Supabase.
 * Fournit un repli local transparent en cas d'indisponibilité du serveur réseau.
 */
class ApiService {
  private isOnline: boolean | null = null;

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:3001/health', { method: 'GET', signal: AbortSignal.timeout(1500) });
      this.isOnline = res.ok;
      return res.ok;
    } catch {
      this.isOnline = false;
      return false;
    }
  }

  // --- PROMOTIONS ---
  async getPromotions(): Promise<Promotion[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/promotions`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getPromotionById(id: string): Promise<Promotion | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/promotions/${id}`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- APPRENANTS ---
  async getStudents(): Promise<Student[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getStudentById(id: string): Promise<Student | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${id}`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- ACTIONS CORRECTIVES ---
  async getActions(): Promise<ActionItem[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/actions`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async createAction(data: {
    title: string;
    description?: string;
    studentName?: string;
    assigneeName?: string;
    priority: string;
    dueDate: string;
    status?: string;
  }): Promise<ActionItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async updateActionStatus(id: string, status: ActionStatus): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/actions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- ENTRETIENS ---
  async getInterviews(): Promise<Interview[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async createInterview(data: {
    title: string;
    studentName?: string;
    date: string;
    type?: string;
    location?: string;
  }): Promise<Interview | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const api = new ApiService();

