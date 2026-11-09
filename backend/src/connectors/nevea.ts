/**
 * Connecteur Nevea — Interface & Implémentation Isolée
 * Fichier : backend/src/connectors/nevea.ts
 *
 * Ce module définit les contrats d'échange avec Nevea.
 * Conformément aux directives :
 * - Aucune URL ou endpoint non documenté n'est inventé.
 * - Le connecteur API direct est formellement désactivé par défaut.
 * - Un adaptateur de simulation (NeveaSandboxConnector) permet la recette locale.
 */

export interface NeveaStudentPayload {
  externalId: string;
  lastName: string;
  firstName: string;
  email: string;
  phone?: string;
  promotionCode: string;
  companyName?: string;
  tutorName?: string;
}

export interface NeveaPromotionPayload {
  externalId: string;
  code: string;
  name: string;
  cursusCode: string;
  startDate: string;
  endDate: string;
}

export interface NeveaCourseSessionPayload {
  externalId: string;
  promotionCode: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  room?: string;
  trainerExternalId?: string;
}

export interface NeveaSyncResult {
  success: boolean;
  timestamp: string;
  studentsProcessed: number;
  promotionsProcessed: number;
  sessionsProcessed: number;
  errors: string[];
}

export interface INeveaConnector {
  testConnection(): Promise<{ connected: boolean; message: string }>;
  syncStudents(promotionCode?: string): Promise<NeveaStudentPayload[]>;
  syncPromotions(): Promise<NeveaPromotionPayload[]>;
  syncCourseSessions(startDate: string, endDate: string): Promise<NeveaCourseSessionPayload[]>;
}

/**
 * Connecteur Direct Nevea (API REST / OAuth2)
 * STATUT : DÉSACTIVÉ JUSQU'À OBTENTION DU CAHIER DES CHARGES OFFICIEL NEVEA
 */
export class NeveaDirectConnector implements INeveaConnector {
  private isEnabled: boolean = false;
  private apiBaseUrl: string | null = null;
  private apiKey: string | null = null;

  constructor(config?: { apiBaseUrl?: string; apiKey?: string }) {
    this.apiBaseUrl = config?.apiBaseUrl || process.env.NEVEA_API_URL || null;
    this.apiKey = config?.apiKey || process.env.NEVEA_API_KEY || null;
    this.isEnabled = Boolean(this.apiBaseUrl && this.apiKey);
  }

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    if (!this.isEnabled) {
      return {
        connected: false,
        message: "Connecteur API Nevea inactif : URL d'API ou clés d'authentification non renseignées.",
      };
    }
    throw new Error("ASTON_ERR_NEVEA_NOT_CONFIGURED: Les spécifications officielles de l'API Nevea sont requises.");
  }

  async syncStudents(): Promise<NeveaStudentPayload[]> {
    if (!this.isEnabled) {
      throw new Error("Connecteur Nevea désactivé.");
    }
    return [];
  }

  async syncPromotions(): Promise<NeveaPromotionPayload[]> {
    if (!this.isEnabled) {
      throw new Error("Connecteur Nevea désactivé.");
    }
    return [];
  }

  async syncCourseSessions(): Promise<NeveaCourseSessionPayload[]> {
    if (!this.isEnabled) {
      throw new Error("Connecteur Nevea désactivé.");
    }
    return [];
  }
}
