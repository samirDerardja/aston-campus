export type UserRole = 'direction' | 'coordinateur' | 'formateur' | 'admin_technique';

export type PromotionStatus = 'active' | 'upcoming' | 'completed' | 'archived';

export type StudentStatus = 'active' | 'resigned' | 'interrupted' | 'graduated';

export type InterviewType = 'apprenant_individuel' | 'formateur_point' | 'point_pedagogique' | 'urgent';

export type InterviewStatus = 'scheduled' | 'completed' | 'postponed' | 'cancelled';

export type ActionStatus = 'todo' | 'in_progress' | 'waiting' | 'completed' | 'cancelled';

export type ActionPriority = 'low' | 'medium' | 'high' | 'urgent';

export type EventSourceType = 'nevea_readonly' | 'aston_local';

export type NotificationType = 
  | 'action_assigned'
  | 'due_date_warning'
  | 'action_overdue'
  | 'interview_scheduled'
  | 'meeting_upcoming'
  | 'report_pending';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

export type CursusStatus = 'active' | 'upcoming' | 'frozen' | 'archived';

export interface SkillBlock {
  id: string;
  cursusId?: string;
  blockNumber: number;
  title: string;
  description?: string;
}

export interface Cursus {
  id: string;
  code: string;
  title: string;
  shortName?: string;
  type?: string;
  modality?: string;
  rncpLevel: string;
  totalHours: number;
  totalDays: number;
  status: CursusStatus;
  description?: string;
  tags?: string[];
  skillBlocks?: SkillBlock[];
}

export type AlertType = 
  | 'absence_repetition'    // Absences répétées
  | 'retard_repetition'     // Retards répétés
  | 'absence_longue'        // Longue absence consécutive
  | 'justificatif_manquant' // Justificatif manquant sous 48h
  | 'decrochage_general';   // Baisse assiduité < 80%

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AlertStatus = 'open' | 'in_progress' | 'resolved' | 'dismissed';

export interface StudentAlert {
  id: string;
  studentId: string;
  studentName?: string;
  promotionId: string;
  promotionName?: string;
  partnerName?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  status: AlertStatus;
  actionId?: string;
  triggeredAt: string;
  resolvedAt?: string;
  delayMinutes?: number;
  unexcusedDays?: number;
}

export interface Partner {
  id: string;
  code: string;
  name: string;
  type: string;
  notes?: string;
  contactName?: string;
  contactEmail?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  promotionId: string;
  date: string;
  period: 'matin' | 'apres_midi' | 'journee';
  status: 'present' | 'absent' | 'late' | 'excused';
  lateMinutes?: number;
  justified: boolean;
  justificationReason?: string;
  rawImportSource?: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  cursusId: string;
  cursusName?: string;
  cursus?: string;
  partnerId?: string;
  partnerName?: string;
  academicYear?: string;
  startDate: string;
  endDate: string;
  coordinatorId?: string;
  coordinatorName?: string;
  coordinator?: string;
  referentTrainerId?: string;
  referentTrainerName?: string;
  referentTrainer?: string;
  studentsCount: number;
  status: PromotionStatus;
  isFrozen?: boolean;
  totalHours?: number;
  totalDays?: number;
  rncpLevel?: string;
  schedulePace?: string; // ex: "1 sem. école / 3 sem. entreprise"
  neveaReference?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  companyTutor: string;
  promotionId: string;
  promotionName: string;
  status: StudentStatus;
  neveaReference?: string;
  attendanceRate: number; // Pourcentage assiduité indicatif
  partnerName?: string;
  alertsCount?: number;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  assignedPromotionIds: string[];
  isLead?: boolean;              // Formateur référent officiel
  leadTrainerId?: string;       // Rattaché à un formateur référent
  leadTrainerName?: string;     // Nom du référent (ex: Mourad)
  poleSpecialty?: string;       // ex: 'Pôle ESN Helpline & Partenaires'
  neveaReference?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  promotionId: string;
  promotionName: string;
  trainerName?: string;
  room?: string;
  sourceType: EventSourceType;
  isReadonly: boolean;
}

export interface InterviewReport {
  id: string;
  summary: string;
  academicProgress: string;
  companyIntegration: string;
  difficultiesIdentified: string;
  recommendations: string;
  isFinalized: boolean;
  finalizedAt?: string;
}

export interface Interview {
  id: string;
  title: string;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  conductedAt?: string;
  coordinatorId: string;
  coordinatorName: string;
  studentId?: string;
  studentName?: string;
  trainerId?: string;
  trainerName?: string;
  promotionId: string;
  promotionName: string;
  location: string;
  report?: InterviewReport;
}

export interface Meeting {
  id: string;
  title: string;
  promotionId: string;
  promotionName: string;
  organizerId: string;
  organizerName: string;
  scheduledAt: string;
  agenda: string;
  status: 'draft' | 'published' | 'archived';
  decisions: Array<{
    id: string;
    topic: string;
    decision: string;
    convertedToActionId?: string;
  }>;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  promotionId: string;
  promotionName: string;
  studentId?: string;
  studentName?: string;
  assigneeId: string;
  assigneeName: string;
  creatorId: string;
  creatorName: string;
  priority: ActionPriority;
  status: ActionStatus;
  dueDate: string;
  completedAt?: string;
  resultSummary?: string;
  sourceMeetingId?: string;
  sourceInterviewId?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  promotionId?: string;
  promotionName?: string;
  studentId?: string;
  studentName?: string;
  uploadedAt: string;
  uploadedByName: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string;
  isRead: boolean;
  createdAt: string;
}

