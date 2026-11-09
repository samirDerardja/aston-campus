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

export interface Cursus {
  id: string;
  code: string;
  title: string;
  rncpLevel: string;
}

export interface Promotion {
  id: string;
  code: string;
  name: string;
  cursusId: string;
  cursusName: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  coordinatorId: string;
  coordinatorName: string;
  referentTrainerId?: string;
  referentTrainerName?: string;
  studentsCount: number;
  status: PromotionStatus;
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
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  assignedPromotionIds: string[];
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
