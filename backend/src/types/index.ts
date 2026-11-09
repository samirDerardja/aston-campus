export type UserRole = 'direction' | 'coordinateur' | 'formateur' | 'admin_technique';

export interface Promotion {
  id: string;
  code: string;
  name: string;
  cursusId: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  coordinatorId: string;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  neveaReference?: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  promotionId: string;
  sourceType: 'nevea_readonly' | 'aston_local';
  isReadonly: boolean;
  neveaReference?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  promotionId: string;
  assigneeId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'waiting' | 'completed' | 'cancelled';
  dueDate: string;
  sourceMeetingId?: string;
}
