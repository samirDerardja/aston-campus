import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, UserRole, Promotion, Student, Trainer, CalendarEvent, 
  Interview, Meeting, ActionItem, DocumentItem, AppNotification, ActionStatus, ActionPriority, InterviewType,
  Cursus, StudentAlert, Partner, AlertStatus
} from '../types';
import { 
  CURRENT_USER, INITIAL_PROMOTIONS, INITIAL_STUDENTS, INITIAL_TRAINERS,
  INITIAL_EVENTS, INITIAL_INTERVIEWS, INITIAL_MEETINGS, INITIAL_ACTIONS,
  INITIAL_DOCUMENTS, INITIAL_NOTIFICATIONS, INITIAL_CURSUS,
  INITIAL_ALERTS, INITIAL_PARTNERS
} from '../data/mockData';
import { api } from '../services/api';

interface AppContextType {
  currentUser: UserProfile;
  switchRole: (role: UserProfile['role']) => void;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  isDemoMode: boolean;
  isBackendConnected: boolean;
  promotions: Promotion[];
  cursusList: Cursus[];
  students: Student[];
  trainers: Trainer[];
  events: CalendarEvent[];
  interviews: Interview[];
  meetings: Meeting[];
  actions: ActionItem[];
  documents: DocumentItem[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  alerts: StudentAlert[];
  partners: Partner[];
  
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
  
  // CRUD Complet Promotions, Apprenants, Actions, Entretiens, Réunions, Documents, Planning
  addPromotion: (data: Partial<Promotion>) => Promise<void>;
  updatePromotion: (id: string, data: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;

  addStudent: (data: Partial<Student>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  updateAction: (id: string, data: Partial<ActionItem>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;

  updateInterview: (id: string, data: Partial<Interview>) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;

  addMeeting: (data: { title: string; promotionId: string; scheduledAt: string; agenda: string }) => Promise<void>;
  updateMeeting: (id: string, data: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  addMeetingDecision: (meetingId: string, topic: string, decision: string) => Promise<void>;

  addDocument: (data: { title: string; fileName: string; fileSizeBytes?: number; mimeType?: string; promotionId?: string }) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  addEvent: (data: { title: string; description?: string; startTime: string; endTime: string; promotionId?: string; room?: string }) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Alertes Assiduité (Retards, Absences répétées, Décrochage)
  convertAlertToAction: (alertId: string) => Promise<void>;
  dismissAlert: (alertId: string) => Promise<void>;
  updateAlertStatus: (alertId: string, status: AlertStatus) => Promise<void>;
  importAttendanceData: (rows?: any[]) => Promise<any>;

  // Command palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);
  const [isDemoMode] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('aston_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [cursusList, setCursusList] = useState<Cursus[]>(INITIAL_CURSUS);

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

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('aston_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('aston_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [alerts, setAlerts] = useState<StudentAlert[]>(() => {
    const saved = localStorage.getItem('aston_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('aston_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Synchronisation backend Fastify & Base de données
  useEffect(() => {
    const syncWithBackend = async () => {
      const isAlive = await api.checkHealth();
      setIsBackendConnected(isAlive);

      if (isAlive) {
        const [
          remotePromos, remoteStudents, remoteActions, remoteInterviews,
          remoteCursus, remoteAlerts, remotePartners, remoteMeetings, remoteDocs, remoteEvents
        ] = await Promise.all([
          api.getPromotions(),
          api.getStudents(),
          api.getActions(),
          api.getInterviews(),
          api.getCursus(),
          api.getAlerts(),
          api.getPartners(),
          api.getMeetings(),
          api.getDocuments(),
          api.getEvents(),
        ]);

        if (remotePromos && remotePromos.length > 0) setPromotions(remotePromos);
        if (remoteStudents && remoteStudents.length > 0) setStudents(remoteStudents as any);
        if (remoteActions && remoteActions.length > 0) setActions(remoteActions as any);
        if (remoteInterviews && remoteInterviews.length > 0) setInterviews(remoteInterviews as any);
        if (remoteCursus && remoteCursus.length > 0) setCursusList(remoteCursus);
        if (remoteAlerts && remoteAlerts.length > 0) setAlerts(remoteAlerts);
        if (remotePartners && remotePartners.length > 0) setPartners(remotePartners);
        if (remoteMeetings && remoteMeetings.length > 0) setMeetings(remoteMeetings);
        if (remoteDocs && remoteDocs.length > 0) setDocuments(remoteDocs);
        if (remoteEvents && remoteEvents.length > 0) setEvents(prev => {
          const existingIds = new Set(prev.map(e => e.id));
          const merged = [...remoteEvents.filter((e: any) => !existingIds.has(e.id)), ...prev];
          return merged;
        });
      }
    };

    syncWithBackend();
  }, []);

  const switchRole = (newRole: UserProfile['role']) => {
    let name = 'Samir Derardja';
    if (newRole === 'direction') name = 'Claire Dubois';
    if (newRole === 'assistante_admin') name = 'Sarah Martin';
    if (newRole === 'formateur') name = 'Thomas Moreau';
    if (newRole === 'admin_technique') name = 'Alexandre Admin';

    setCurrentUser({
      ...currentUser,
      role: newRole,
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1] || '',
      email: `${name.toLowerCase().replace(' ', '.')}@aston.fr`
    });
  };

  const login = (role: UserRole) => {
    switchRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Filtrage par rôle (Cloisonnement formateur)
  const accessiblePromotions = currentUser.role === 'formateur'
    ? promotions.filter(p => p.referentTrainerId === 'tr-01' || p.id === 'promo-dw-2025' || p.id === 'promo-tsrs-2025')
    : promotions;

  const accessibleStudents = currentUser.role === 'formateur'
    ? students.filter(s => accessiblePromotions.some(p => p.id === s.promotionId))
    : students;

  const accessibleActions = currentUser.role === 'formateur'
    ? actions.filter(a => a.assigneeId === 'tr-01' || accessiblePromotions.some(p => p.id === a.promotionId))
    : actions;

  // Persistence locale du state de démo
  useEffect(() => {
    localStorage.setItem('aston_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('aston_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('aston_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('aston_events', JSON.stringify(events));
  }, [events]);

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

  useEffect(() => {
    localStorage.setItem('aston_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('aston_partners', JSON.stringify(partners));
  }, [partners]);

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

    // Synchronisation backend Fastify / Base de données
    api.createInterview({
      title: data.title,
      studentName: stu ? `${stu.firstName} ${stu.lastName}` : undefined,
      date: data.scheduledAt,
      type: data.type,
      location: data.location,
    }).catch(() => {});

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

    // Synchronisation backend Fastify / Base de données
    api.updateActionStatus(actionId, newStatus).catch(() => {});
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

    // Synchronisation backend Fastify / Base de données
    api.createAction({
      title: data.title,
      description: data.description,
      studentName: stu ? `${stu.firstName} ${stu.lastName}` : undefined,
      assigneeName,
      priority: data.priority,
      dueDate: data.dueDate,
      status: 'todo',
    }).catch(() => {});
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

  const updateAlertStatus = async (alertId: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status } : a));
    await api.updateAlertStatus(alertId, status);
  };

  const dismissAlert = async (alertId: string) => {
    await updateAlertStatus(alertId, 'dismissed');
  };

  const convertAlertToAction = async (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    // Appel API backend
    const res = await api.convertAlertToAction(alertId);
    if (res && res.action) {
      setActions(prev => [res.action, ...prev]);
    } else {
      // Repli local en mode autonome
      const newAction: ActionItem = {
        id: `act-${Date.now()}`,
        title: `Suivi d'assiduité : ${alert.title}`,
        description: `${alert.description} (Généré automatiquement depuis l'alerte d'assiduité temps réel)`,
        promotionId: alert.promotionId,
        promotionName: alert.promotionName || 'Promotion',
        studentId: alert.studentId,
        studentName: alert.studentName,
        assigneeId: currentUser.id,
        assigneeName: `${currentUser.firstName} ${currentUser.lastName}`,
        creatorId: currentUser.id,
        creatorName: `${currentUser.firstName} ${currentUser.lastName}`,
        priority: alert.severity === 'critical' ? 'urgent' : alert.severity === 'high' ? 'high' : 'medium',
        status: 'todo',
        dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      setActions(prev => [newAction, ...prev]);
    }

    // Basculer l'alerte en 'in_progress'
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'in_progress' } : a));

    // Notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'action_assigned',
      title: 'Action corrective créée',
      message: `Action de suivi créée pour ${alert.studentName || 'l\'apprenant'} (${alert.title}).`,
      actionUrl: '/actions',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const importAttendanceData = async (rows?: any[]) => {
    const result = await api.importAttendanceCsv(rows);
    if (result && result.alertsCreated && result.alertsCreated.length > 0) {
      setAlerts(prev => [...result.alertsCreated, ...prev]);
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'action_assigned',
        title: 'Import Émargements Nevea synchronisé',
        message: `${result.alertsCreated.length} alertes d'assiduité générées suite à l'importation Nevea.`,
        actionUrl: '/dashboard',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    return result;
  };

  // --- CRUD COMPLET PROMOTIONS ---
  const addPromotion = async (data: Partial<Promotion>) => {
    const created = await api.createPromotion(data);
    const newPromo: Promotion = created || {
      id: `promo-${Date.now()}`,
      code: (data.code || 'PROMO').toUpperCase(),
      name: data.name || 'Nouvelle promotion',
      cursusId: data.cursusId || 'cursus-tsrs',
      cursus: data.cursus || 'Technicien Systèmes Réseaux & Sécurité',
      status: data.status || 'active',
      studentsCount: data.studentsCount ?? 0,
      startDate: data.startDate || '01 oct. 2026',
      endDate: data.endDate || '30 sept. 2027',
      coordinator: data.coordinator || `${currentUser.firstName} ${currentUser.lastName}`,
      referentTrainer: data.referentTrainer || 'Mourad',
      schedulePace: data.schedulePace || '1 sem. école / 3 sem. entreprise',
    };
    setPromotions(prev => [newPromo, ...prev]);
  };

  const updatePromotion = async (id: string, data: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    await api.updatePromotion(id, data);
  };

  const deletePromotion = async (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    await api.deletePromotion(id);
  };

  // --- CRUD COMPLET APPRENANTS ---
  const addStudent = async (data: Partial<Student>) => {
    const created = await api.createStudent(data);
    const newStudent: Student = created || {
      id: `stu-${Date.now()}`,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '06 00 00 00 00',
      promotionId: data.promotionId || promotions[0]?.id || '',
      promotionName: data.promotionName || promotions[0]?.name || 'Helpline 40',
      attendanceRate: data.attendanceRate ?? 100,
      status: data.status || 'active',
      companyName: data.companyName || 'Helpline',
      companyTutor: data.companyTutor || 'Tuteur ESN',
      alertsCount: 0,
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    await api.updateStudent(id, data);
  };

  const deleteStudent = async (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    await api.deleteStudent(id);
  };

  // --- CRUD COMPLET ACTIONS ---
  const updateAction = async (id: string, data: Partial<ActionItem>) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    await api.updateAction(id, data);
  };

  const deleteAction = async (id: string) => {
    setActions(prev => prev.filter(a => a.id !== id));
    await api.deleteAction(id);
  };

  // --- CRUD COMPLET ENTRETIENS ---
  const updateInterview = async (id: string, data: Partial<Interview>) => {
    setInterviews(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    await api.updateInterview(id, data);
  };

  const deleteInterview = async (id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
    await api.deleteInterview(id);
  };

  // --- CRUD COMPLET RÉUNIONS ---
  const addMeeting = async (data: { title: string; promotionId: string; scheduledAt: string; agenda: string }) => {
    const promo = promotions.find(p => p.id === data.promotionId);
    const payload = {
      title: data.title,
      promotionId: data.promotionId,
      promotionName: promo ? promo.name : 'Promotion',
      organizerName: `${currentUser.firstName} ${currentUser.lastName}`,
      scheduledAt: data.scheduledAt,
      agenda: data.agenda,
      status: 'published' as const,
      decisions: [],
    };
    const created = await api.createMeeting(payload);
    const newMeeting: Meeting = created || {
      id: `meet-${Date.now()}`,
      organizerId: currentUser.id,
      ...payload,
    };
    setMeetings(prev => [newMeeting, ...prev]);
  };

  const updateMeeting = async (id: string, data: Partial<Meeting>) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    await api.updateMeeting(id, data);
  };

  const deleteMeeting = async (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
    await api.deleteMeeting(id);
  };

  const addMeetingDecision = async (meetingId: string, topic: string, decision: string) => {
    const newDec = { id: `dec-${Date.now()}`, topic, decision };
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        const updatedDecisions = [...m.decisions, newDec];
        api.updateMeeting(meetingId, { decisions: updatedDecisions }).catch(() => {});
        return { ...m, decisions: updatedDecisions };
      }
      return m;
    }));
  };

  // --- CRUD COMPLET DOCUMENTS ---
  const addDocument = async (data: { title: string; fileName: string; fileSizeBytes?: number; mimeType?: string; promotionId?: string }) => {
    const promo = promotions.find(p => p.id === data.promotionId);
    const payload = {
      title: data.title,
      fileName: data.fileName,
      fileSizeBytes: data.fileSizeBytes ?? 512000,
      mimeType: data.mimeType || 'application/pdf',
      promotionId: data.promotionId,
      promotionName: promo ? promo.name : 'Global Campus',
      uploadedByName: `${currentUser.firstName} ${currentUser.lastName}`,
    };
    const created = await api.createDocument(payload);
    const newDoc: DocumentItem = created || {
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      ...payload,
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const deleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    await api.deleteDocument(id);
  };

  // --- CRUD COMPLET PLANNING ÉVÉNEMENTS ---
  const addEvent = async (data: { title: string; description?: string; startTime: string; endTime: string; promotionId?: string; room?: string }) => {
    const promo = promotions.find(p => p.id === data.promotionId);
    const payload = {
      title: data.title,
      description: data.description || '',
      startTime: data.startTime,
      endTime: data.endTime,
      promotionId: data.promotionId || promotions[0]?.id || '',
      promotionName: promo ? promo.name : 'Campus Aston',
      room: data.room || 'Salle Coordination',
    };
    const created = await api.createEvent(payload);
    const newEvt: CalendarEvent = created || {
      id: `evt-${Date.now()}`,
      ...payload,
      sourceType: 'aston_local',
      isReadonly: false,
    };
    setEvents(prev => [newEvt, ...prev]);
  };

  const deleteEvent = async (id: string) => {
    const evt = events.find(e => e.id === id);
    if (evt?.isReadonly || evt?.sourceType === 'nevea_readonly') return;
    setEvents(prev => prev.filter(e => e.id !== id));
    await api.deleteEvent(id);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      switchRole,
      isAuthenticated,
      login,
      logout,
      isDemoMode,
      isBackendConnected,
      promotions: accessiblePromotions,
      cursusList,
      students: accessibleStudents,
      trainers,
      events,
      interviews,
      meetings,
      actions: accessibleActions,
      documents,
      notifications,
      unreadNotificationsCount,
      alerts,
      partners,
      addInterview,
      updateInterviewReport,
      updateActionStatus,
      addAction,
      convertDecisionToAction,
      addPromotion,
      updatePromotion,
      deletePromotion,
      addStudent,
      updateStudent,
      deleteStudent,
      updateAction,
      deleteAction,
      updateInterview,
      deleteInterview,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      addMeetingDecision,
      addDocument,
      deleteDocument,
      addEvent,
      deleteEvent,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      convertAlertToAction,
      dismissAlert,
      updateAlertStatus,
      importAttendanceData,
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

