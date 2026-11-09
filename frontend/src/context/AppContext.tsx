import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, Promotion, Student, Trainer, CalendarEvent, 
  Interview, Meeting, ActionItem, DocumentItem, AppNotification, ActionStatus, ActionPriority, InterviewType
} from '../types';
import { 
  CURRENT_USER, INITIAL_PROMOTIONS, INITIAL_STUDENTS, INITIAL_TRAINERS,
  INITIAL_EVENTS, INITIAL_INTERVIEWS, INITIAL_MEETINGS, INITIAL_ACTIONS,
  INITIAL_DOCUMENTS, INITIAL_NOTIFICATIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserProfile['role']) => void;
  isDemoMode: boolean;
  promotions: Promotion[];
  students: Student[];
  trainers: Trainer[];
  events: CalendarEvent[];
  interviews: Interview[];
  meetings: Meeting[];
  actions: ActionItem[];
  documents: DocumentItem[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  
  // Actions Métier
  addInterview: (data: {
    title: string;
    type: InterviewType;
    scheduledAt: string;
    promotionId: string;
    studentId?: string;
    trainerId?: string;
    location: string;
  }) => void;
  
  updateInterviewReport: (interviewId: string, reportData: {
    summary: string;
    academicProgress: string;
    companyIntegration: string;
    difficultiesIdentified: string;
    recommendations: string;
    isFinalized: boolean;
  }) => void;

  updateActionStatus: (actionId: string, newStatus: ActionStatus) => void;
  
  addAction: (data: {
    title: string;
    description: string;
    promotionId: string;
    studentId?: string;
    assigneeId: string;
    priority: ActionPriority;
    dueDate: string;
    sourceMeetingId?: string;
    sourceInterviewId?: string;
  }) => void;

  convertDecisionToAction: (meetingId: string, decisionId: string, title: string, assigneeId: string, dueDate: string, priority: ActionPriority) => void;
  
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Command palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isDemoMode] = useState<boolean>(true);
  
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('aston_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('aston_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [trainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('aston_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('aston_interviews');
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('aston_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [actions, setActions] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('aston_actions');
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS;
  });

  const [documents] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('aston_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Persistence locale du state de démo
  useEffect(() => {
    localStorage.setItem('aston_actions', JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem('aston_interviews', JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem('aston_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('aston_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Command palette keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const switchRole = (newRole: UserProfile['role']) => {
    let name = 'Marc Lefèvre';
    if (newRole === 'direction') name = 'Claire Dubois';
    if (newRole === 'formateur') name = 'Thomas Moreau';
    if (newRole === 'admin_technique') name = 'Alexandre Admin';

    setCurrentUser({
      ...currentUser,
      role: newRole,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      email: `${name.toLowerCase().replace(' ', '.')}@aston-campus.demo`
    });
  };

  const addInterview: AppContextType['addInterview'] = (data) => {
    const promo = promotions.find(p => p.id === data.promotionId);
    const stu = students.find(s => s.id === data.studentId);
    const trn = trainers.find(t => t.id === data.trainerId);

    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      title: data.title,
      type: data.type,
      status: 'scheduled',
      scheduledAt: data.scheduledAt,
      coordinatorId: currentUser.id,
      coordinatorName: `${currentUser.firstName} ${currentUser.lastName}`,
      studentId: data.studentId,
      studentName: stu ? `${stu.firstName} ${stu.lastName}` : undefined,
      trainerId: data.trainerId,
      trainerName: trn ? `${trn.firstName} ${trn.lastName}` : undefined,
      promotionId: data.promotionId,
      promotionName: promo ? promo.name : 'Promotion',
      location: data.location
    };

    setInterviews(prev => [newInterview, ...prev]);

    // Ajouter l'événement au calendrier
    const endDate = new Date(new Date(data.scheduledAt).getTime() + 45 * 60000).toISOString();
    setEvents(prev => [{
      id: `evt-${Date.now()}`,
      title: data.title,
      description: `Entretien planifié avec ${stu ? stu.firstName + ' ' + stu.lastName : 'le formateur'}`,
      startTime: data.scheduledAt,
      endTime: endDate,
      promotionId: data.promotionId,
      promotionName: promo ? promo.name : 'Promotion',
      room: data.location,
      sourceType: 'aston_local',
      isReadonly: false
    }, ...prev]);

    // Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'interview_scheduled',
      title: 'Nouvel entretien planifié',
      message: `${data.title} fixé au ${new Date(data.scheduledAt).toLocaleDateString('fr-FR')}.`,
      actionUrl: '/entretiens',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateInterviewReport: AppContextType['updateInterviewReport'] = (interviewId, reportData) => {
    setInterviews(prev => prev.map(item => {
      if (item.id === interviewId) {
        return {
          ...item,
          status: 'completed',
          conductedAt: new Date().toISOString(),
          report: {
            id: `rep-${Date.now()}`,
            ...reportData,
            finalizedAt: reportData.isFinalized ? new Date().toISOString() : undefined
          }
        };
      }
      return item;
    }));
  };

  const updateActionStatus = (actionId: string, newStatus: ActionStatus) => {
    setActions(prev => prev.map(action => {
      if (action.id === actionId) {
        return {
          ...action,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return action;
    }));
  };

  const addAction: AppContextType['addAction'] = (data) => {
    const promo = promotions.find(p => p.id === data.promotionId);
    const stu = students.find(s => s.id === data.studentId);
    let assigneeName = `${currentUser.firstName} ${currentUser.lastName}`;
    if (data.assigneeId === 'tr-01') assigneeName = 'Thomas Moreau';
    if (data.assigneeId === 'tr-02') assigneeName = 'Julie Roux';

    const newAction: ActionItem = {
      id: `act-${Date.now()}`,
      title: data.title,
      description: data.description,
      promotionId: data.promotionId,
      promotionName: promo ? promo.name : 'Promotion',
      studentId: data.studentId,
      studentName: stu ? `${stu.firstName} ${stu.lastName}` : undefined,
      assigneeId: data.assigneeId,
      assigneeName,
      creatorId: currentUser.id,
      creatorName: `${currentUser.firstName} ${currentUser.lastName}`,
      priority: data.priority,
      status: 'todo',
      dueDate: data.dueDate,
      sourceMeetingId: data.sourceMeetingId,
      sourceInterviewId: data.sourceInterviewId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActions(prev => [newAction, ...prev]);
  };

  const convertDecisionToAction: AppContextType['convertDecisionToAction'] = (
    meetingId, decisionId, title, assigneeId, dueDate, priority
  ) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const actionId = `act-${Date.now()}`;
    const newAction: ActionItem = {
      id: actionId,
      title,
      description: `Issue de la décision du comité pédagogique : "${title}"`,
      promotionId: meeting.promotionId,
      promotionName: meeting.promotionName,
      assigneeId,
      assigneeName: assigneeId === 'tr-01' ? 'Thomas Moreau' : `${currentUser.firstName} ${currentUser.lastName}`,
      creatorId: currentUser.id,
      creatorName: `${currentUser.firstName} ${currentUser.lastName}`,
      priority,
      status: 'todo',
      dueDate,
      sourceMeetingId: meetingId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setActions(prev => [newAction, ...prev]);

    // Marquer la décision comme convertie
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return {
          ...m,
          decisions: m.decisions.map(d => d.id === decisionId ? { ...d, convertedToActionId: actionId } : d)
        };
      }
      return m;
    }));

    // Notification
    setNotifications(prev => [{
      id: `notif-${Date.now()}`,
      type: 'action_assigned',
      title: 'Nouvelle action créée depuis une réunion',
      message: `Action créée avec succès : "${title}" (Échéance: ${dueDate})`,
      actionUrl: '/actions',
      isRead: false,
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      isDemoMode,
      promotions,
      students,
      trainers,
      events,
      interviews,
      meetings,
      actions,
      documents,
      notifications,
      unreadNotificationsCount,
      addInterview,
      updateInterviewReport,
      updateActionStatus,
      addAction,
      convertDecisionToAction,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      isCommandPaletteOpen,
      setCommandPaletteOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
