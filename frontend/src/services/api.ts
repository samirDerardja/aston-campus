import { Promotion, Student, Trainer, ActionItem, Interview, ActionStatus, Cursus, StudentAlert, Partner } from '../types';

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

  // --- ALERTES ASSIDUITÉ EN TEMPS RÉEL (RETARDS, ABSENCES) ---
  async getAlerts(status?: string, type?: string): Promise<StudentAlert[] | null> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (type) params.append('type', type);
      const url = `${API_BASE_URL}/alerts?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async updateAlertStatus(id: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async convertAlertToAction(id: string): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts/${id}/convert-to-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async importAttendanceCsv(rows?: any[]): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/attendance/import-nevea-csv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- PARTENAIRES ESN (HELPLINE, XEFI) ---
  async getPartners(): Promise<Partner[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/partners`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  // --- RÉFÉRENTIEL DES CURSUS & COMPÉTENCES ---
  async getCursus(status?: string): Promise<Cursus[] | null> {
    try {
      const url = status ? `${API_BASE_URL}/cursus?status=${encodeURIComponent(status)}` : `${API_BASE_URL}/cursus`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async getCursusById(id: string): Promise<Cursus | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/cursus/${id}`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
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

  async updateInterview(id: string, data: any): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteInterview(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/interviews/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- PROMOTIONS CRUD ---
  async createPromotion(data: Partial<Promotion>): Promise<Promotion | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/promotions`, {
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

  async updatePromotion(id: string, data: Partial<Promotion>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deletePromotion(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/promotions/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- APPRENANTS CRUD ---
  async createStudent(data: Partial<Student>): Promise<Student | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/students`, {
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

  async updateStudent(id: string, data: Partial<Student>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- ACTIONS CRUD COMPLET ---
  async updateAction(id: string, data: Partial<ActionItem>): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteAction(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/actions/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- RÉUNIONS / SYNCHRONISATIONS CRUD ---
  async getMeetings(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async createMeeting(data: any): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings`, {
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

  async updateMeeting(id: string, data: any): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteMeeting(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- DOCUMENTS CRUD ---
  async getDocuments(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async createDocument(data: any): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
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

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // --- PLANNING ÉVÉNEMENTS LOCAUX CRUD ---
  async getEvents(): Promise<any[] | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async createEvent(data: any): Promise<any | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
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

  async deleteEvent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiService();

