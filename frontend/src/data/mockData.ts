import { 
  UserProfile, Cursus, Promotion, Student, Trainer, 
  CalendarEvent, Interview, Meeting, ActionItem, DocumentItem, AppNotification 
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr-coord-01',
  email: 'marc.lefevre@aston-campus.demo',
  firstName: 'Marc',
  lastName: 'Lefèvre',
  role: 'coordinateur',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phone: '01 45 67 89 11'
};

export const INITIAL_CURSUS: Cursus[] = [
  { id: 'cur-1', code: 'TSN', title: 'Technicien Support en Numérique', rncpLevel: 'Niveau 4 (Bac)' },
  { id: 'cur-2', code: 'TSRS', title: 'Technicien Systèmes Réseaux & Sécurité', rncpLevel: 'Niveau 5 (Bac+2)' },
  { id: 'cur-3', code: 'BTS-CIEL', title: 'BTS CIEL Cybersécurité, Informatique, Eléctronique', rncpLevel: 'Niveau 5 (Bac+2)' },
  { id: 'cur-4', code: 'PBNCLC', title: 'Product builder no code low code', rncpLevel: 'Niveau 6 (Bac+3)' },
  { id: 'cur-5', code: 'ASRBD', title: 'Administrateur systèmes, réseaux et bases de données', rncpLevel: 'Niveau 6 (Bac+3/4)' },
  { id: 'cur-6', code: 'ESD', title: 'Expert En Sécurité Digitale', rncpLevel: 'Niveau 7 (Bac+5)' },
  { id: 'cur-7', code: 'DPI', title: 'Directeur De Projets Informatique', rncpLevel: 'Niveau 7 (Bac+5)' }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    code: 'PROMO-TSRS-2025-A',
    name: 'TSRS 2025/2026 - Groupe A',
    cursusId: 'cur-2',
    cursusName: 'Technicien Systèmes Réseaux & Sécurité',
    academicYear: '2025-2026',
    startDate: '2025-09-15',
    endDate: '2026-07-31',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    referentTrainerId: 'tr-01',
    referentTrainerName: 'Thomas Moreau',
    studentsCount: 18,
    status: 'active',
    neveaReference: 'NEVEA-PR-901'
  },
  {
    id: 'promo-2',
    code: 'PROMO-ESD-2025-P1',
    name: 'Expert Sécurité Digitale 2025/2027',
    cursusId: 'cur-6',
    cursusName: 'Expert En Sécurité Digitale',
    academicYear: '2025-2027',
    startDate: '2025-10-01',
    endDate: '2027-09-30',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    referentTrainerId: 'tr-01',
    referentTrainerName: 'Thomas Moreau',
    studentsCount: 22,
    status: 'active',
    neveaReference: 'NEVEA-PR-902'
  },
  {
    id: 'promo-3',
    code: 'PROMO-PB-2025-NC',
    name: 'Product Builder No-Code 2025/2026',
    cursusId: 'cur-4',
    cursusName: 'Product builder no code low code',
    academicYear: '2025-2026',
    startDate: '2025-11-03',
    endDate: '2026-10-31',
    coordinatorId: 'usr-coord-02',
    coordinatorName: 'Sophie Bernard',
    referentTrainerId: 'tr-02',
    referentTrainerName: 'Julie Roux',
    studentsCount: 15,
    status: 'active',
    neveaReference: 'NEVEA-PR-903'
  },
  {
    id: 'promo-4',
    code: 'PROMO-DPI-2026-A',
    name: 'Directeur Projets Informatique 2026',
    cursusId: 'cur-7',
    cursusName: 'Directeur De Projets Informatique',
    academicYear: '2026-2027',
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    studentsCount: 0,
    status: 'upcoming',
    neveaReference: 'NEVEA-PR-904'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    firstName: 'Alexandre',
    lastName: 'Martin',
    email: 'alexandre.martin@apprenant-aston.demo',
    phone: '06 12 34 56 78',
    companyName: 'Capgemini',
    companyTutor: 'Laurent Petit',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    status: 'active',
    neveaReference: 'NEVEA-ST-101',
    attendanceRate: 98
  },
  {
    id: 'stu-2',
    firstName: 'Camille',
    lastName: 'Girard',
    email: 'camille.girard@apprenant-aston.demo',
    phone: '06 23 45 67 89',
    companyName: 'Sopra Steria',
    companyTutor: 'Émilie Renard',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    status: 'active',
    neveaReference: 'NEVEA-ST-102',
    attendanceRate: 81
  },
  {
    id: 'stu-3',
    firstName: 'Youssef',
    lastName: 'Benali',
    email: 'youssef.benali@apprenant-aston.demo',
    phone: '06 34 56 78 90',
    companyName: 'Orange Cyberdefense',
    companyTutor: 'Karim Saadi',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    status: 'active',
    neveaReference: 'NEVEA-ST-103',
    attendanceRate: 95
  },
  {
    id: 'stu-4',
    firstName: 'Emma',
    lastName: 'Dumont',
    email: 'emma.dumont@apprenant-aston.demo',
    phone: '06 45 67 89 01',
    companyName: 'Thales Defence',
    companyTutor: 'Nicolas Meyer',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    status: 'active',
    neveaReference: 'NEVEA-ST-104',
    attendanceRate: 99
  },
  {
    id: 'stu-5',
    firstName: 'Lucas',
    lastName: 'Mercier',
    email: 'lucas.mercier@apprenant-aston.demo',
    phone: '06 56 78 90 12',
    companyName: 'Decathlon Digital',
    companyTutor: 'Sophie Durand',
    promotionId: 'promo-3',
    promotionName: 'Product Builder No-Code 2025/2026',
    status: 'active',
    neveaReference: 'NEVEA-ST-105',
    attendanceRate: 92
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr-01',
    firstName: 'Thomas',
    lastName: 'Moreau',
    email: 'thomas.moreau@aston-campus.demo',
    phone: '01 45 67 89 13',
    specialties: ['Infrastructures Linux', 'Cisco CCNA', 'Sécurité des Réseaux', 'Ansible'],
    assignedPromotionIds: ['promo-1', 'promo-2'],
    neveaReference: 'NEVEA-TR-04'
  },
  {
    id: 'tr-02',
    firstName: 'Julie',
    lastName: 'Roux',
    email: 'julie.roux@aston-campus.demo',
    phone: '01 45 67 89 14',
    specialties: ['Product Management', 'Airtable / Make', 'Supabase & SQL', 'Figma'],
    assignedPromotionIds: ['promo-3'],
    neveaReference: 'NEVEA-TR-05'
  }
];

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: 'act-1',
    title: 'Contacter le tuteur Sopra Steria de Camille G.',
    description: 'Vérifier la concordance des relevés d assiduité du mois d octobre et planifier un point tripartite d urgence.',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    studentId: 'stu-2',
    studentName: 'Camille Girard',
    assigneeId: 'usr-coord-01',
    assigneeName: 'Marc Lefèvre',
    creatorId: 'usr-coord-01',
    creatorName: 'Marc Lefèvre',
    priority: 'urgent',
    status: 'todo',
    dueDate: '2026-11-08', // Volontairement en retard pour alerte Dashboard
    createdAt: '2026-11-02'
  },
  {
    id: 'act-2',
    title: 'Plan d aide rédactionnelle pour Alexandre M.',
    description: 'Fournir le template officiel Aston de mémoire technique et planifier un point de relecture avant fin novembre.',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    studentId: 'stu-1',
    studentName: 'Alexandre Martin',
    assigneeId: 'usr-coord-01',
    assigneeName: 'Marc Lefèvre',
    creatorId: 'usr-coord-01',
    creatorName: 'Marc Lefèvre',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2026-11-16',
    createdAt: '2026-11-04'
  },
  {
    id: 'act-3',
    title: 'Déploiement du cluster lab pentest',
    description: 'Mettre à disposition les 4 serveurs virtualisés dédiés aux épreuves de test d intrusion.',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    assigneeId: 'tr-01',
    assigneeName: 'Thomas Moreau',
    creatorId: 'usr-coord-01',
    creatorName: 'Marc Lefèvre',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-11-20',
    createdAt: '2026-11-05'
  },
  {
    id: 'act-4',
    title: 'Aménagement demi-journée partiels blancs',
    description: 'Bloquer le créneau du 18 décembre pour révisions suite à la décision prise en synchronisation pédagogique.',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    assigneeId: 'usr-coord-01',
    assigneeName: 'Marc Lefèvre',
    creatorId: 'usr-coord-01',
    creatorName: 'Marc Lefèvre',
    priority: 'medium',
    status: 'waiting',
    dueDate: '2026-11-25',
    sourceMeetingId: 'meet-1',
    createdAt: '2026-11-05'
  },
  {
    id: 'act-5',
    title: 'Validation convention alternance Youssef B.',
    description: 'Clôture de l enregistrement auprès de l OPCO et transmission de l avenant signé.',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    studentId: 'stu-3',
    studentName: 'Youssef Benali',
    assigneeId: 'usr-coord-01',
    assigneeName: 'Marc Lefèvre',
    creatorId: 'usr-coord-01',
    creatorName: 'Marc Lefèvre',
    priority: 'low',
    status: 'completed',
    dueDate: '2026-10-30',
    completedAt: '2026-10-28',
    resultSummary: 'Convention enregistrée et archive transmise à l entreprise.',
    createdAt: '2026-10-20'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    title: 'Bilan d intégration alternance',
    type: 'apprenant_individuel',
    status: 'completed',
    scheduledAt: '2026-11-04T10:00:00+01:00',
    conductedAt: '2026-11-04T10:45:00+01:00',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    studentId: 'stu-1',
    studentName: 'Alexandre Martin',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    location: 'Bureau Coordination B201',
    report: {
      id: 'rep-1',
      summary: 'Bilan très positif. L apprenant fait preuve de maturité et d une bonne régularité.',
      academicProgress: 'Maîtrise satisfaisante des fondamentaux TCP/IP et bash scripting.',
      companyIntegration: 'Très bien intégré dans l équipe d exploitation chez Capgemini.',
      difficultiesIdentified: 'Léger retard de méthodologie sur les livrables écrits.',
      recommendations: 'Transmission d un guide méthodologique et point intermédiaire prévu.',
      isFinalized: true,
      finalizedAt: '2026-11-04T11:15:00+01:00'
    }
  },
  {
    id: 'int-2',
    title: 'Point d alerte assiduité & cadrage',
    type: 'urgent',
    status: 'scheduled',
    scheduledAt: '2026-11-11T14:00:00+01:00',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    studentId: 'stu-2',
    studentName: 'Camille Girard',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    location: 'Bureau Coordination B201'
  },
  {
    id: 'int-3',
    title: 'Entretien de suivi semestriel',
    type: 'apprenant_individuel',
    status: 'scheduled',
    scheduledAt: '2026-11-13T16:00:00+01:00',
    coordinatorId: 'usr-coord-01',
    coordinatorName: 'Marc Lefèvre',
    studentId: 'stu-3',
    studentName: 'Youssef Benali',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    location: 'Visio Teams'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Comité Pédagogique TSRS - Mi-trimestre',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    organizerId: 'usr-coord-01',
    organizerName: 'Marc Lefèvre',
    scheduledAt: '2026-11-05T17:00:00+01:00',
    agenda: '1. Assiduité globale du mois d octobre\n2. Rythme d alternance et retour des tuteurs\n3. Calendrier des partiels blancs',
    status: 'published',
    decisions: [
      {
        id: 'dec-1',
        topic: 'Partiels blancs de décembre',
        decision: 'Aménagement d une demi-journée d étude le 18 décembre pour préparation autonome encadrée.',
        convertedToActionId: 'act-4'
      },
      {
        id: 'dec-2',
        topic: 'Remplacement de matériel lab',
        decision: 'Commander 2 switchs manageables supplémentaires pour le banc d essai.'
      }
    ]
  },
  {
    id: 'meet-2',
    title: 'Synchronisation Intervenants Cybersécurité',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    organizerId: 'usr-coord-01',
    organizerName: 'Marc Lefèvre',
    scheduledAt: '2026-11-12T18:00:00+01:00',
    agenda: 'Harmonisation des jalons de projet et cohérence des évaluations TP pentest.',
    status: 'draft',
    decisions: []
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Administration Avancée Linux',
    description: 'Cours officiel planifié sous Nevea. Gestion des services systemd, LVM et durcissement SSH.',
    startTime: '2026-11-10T09:00:00+01:00',
    endTime: '2026-11-10T12:30:00+01:00',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    trainerName: 'Thomas Moreau',
    room: 'Salle 302 (Lab Réseau)',
    sourceType: 'nevea_readonly',
    isReadonly: true
  },
  {
    id: 'evt-2',
    title: 'Sécurité des Systèmes d Information (ISO 27001)',
    description: 'Cours magistral et étude de cas d audit.',
    startTime: '2026-11-10T14:00:00+01:00',
    endTime: '2026-11-10T17:30:00+01:00',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    trainerName: 'Thomas Moreau',
    room: 'Amphi Aston B',
    sourceType: 'nevea_readonly',
    isReadonly: true
  },
  {
    id: 'evt-3',
    title: 'Point d alerte assiduité (Camille G.)',
    description: 'Entretien de coordination Aston Campus.',
    startTime: '2026-11-11T14:00:00+01:00',
    endTime: '2026-11-11T14:45:00+01:00',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    trainerName: 'Marc Lefèvre (Coordinateur)',
    room: 'Bureau Coordination B201',
    sourceType: 'aston_local',
    isReadonly: false
  },
  {
    id: 'evt-4',
    title: 'Synchronisation Intervenants Cybersécurité',
    description: 'Réunion d équipe locale Aston Campus.',
    startTime: '2026-11-12T18:00:00+01:00',
    endTime: '2026-11-12T19:00:00+01:00',
    promotionId: 'promo-2',
    promotionName: 'Expert Sécurité Digitale 2025/2027',
    room: 'Salle de réunion A104',
    sourceType: 'aston_local',
    isReadonly: false
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Règlement Pédagogique & Charte Informatique 2025-2026',
    fileName: 'Reglement_Pedagogique_Aston_2025.pdf',
    fileSizeBytes: 1420000,
    mimeType: 'application/pdf',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    uploadedAt: '2025-09-16T09:30:00+01:00',
    uploadedByName: 'Marc Lefèvre'
  },
  {
    id: 'doc-2',
    title: 'Compte Rendu Bilan Intégration - Alexandre Martin',
    fileName: 'CR_Entretien_Alexandre_Martin_04112026.pdf',
    fileSizeBytes: 245000,
    mimeType: 'application/pdf',
    promotionId: 'promo-1',
    promotionName: 'TSRS 2025/2026 - Groupe A',
    studentId: 'stu-1',
    studentName: 'Alexandre Martin',
    uploadedAt: '2026-11-04T11:20:00+01:00',
    uploadedByName: 'Marc Lefèvre'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'action_overdue',
    title: 'Action en retard !',
    message: 'L action "Contacter le tuteur Sopra Steria de Camille G." est en dépassement d échéance depuis le 08/11/2026.',
    actionUrl: '/actions',
    isRead: false,
    createdAt: '2026-11-09T08:00:00+01:00'
  },
  {
    id: 'notif-2',
    type: 'interview_scheduled',
    title: 'Entretien prioritaire programmé',
    message: 'Entretien urgent d assiduité planifié avec Camille Girard ce mercredi à 14h00.',
    actionUrl: '/entretiens',
    isRead: false,
    createdAt: '2026-11-09T09:15:00+01:00'
  },
  {
    id: 'notif-3',
    type: 'meeting_upcoming',
    title: 'Synchronisation pédagogique à venir',
    message: 'Comité de synchronisation Intervenants Cybersécurité prévu le 12/11/2026 à 18h00.',
    actionUrl: '/synchronisations',
    isRead: true,
    createdAt: '2026-11-08T16:00:00+01:00'
  }
];
