import { 
  UserProfile, Cursus, Promotion, Student, Trainer, 
  CalendarEvent, Interview, Meeting, ActionItem, DocumentItem, AppNotification 
} from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'usr-samir-01',
  email: 'samir.derardja@aston.fr',
  firstName: 'Samir',
  lastName: 'Derardja',
  role: 'coordinateur',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phone: '01 45 67 89 11'
};

export const INITIAL_CURSUS: Cursus[] = [
  { 
    id: 'cur-1', 
    code: 'TSN', 
    title: 'Technicien Support en Numérique', 
    shortName: 'Technicien Support',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 4 (Bac)', 
    totalHours: 420,
    totalDays: 60,
    status: 'active',
    description: 'Le cursus de Technicien support en numérique a pour objectif de vous permettre d acquérir l ensemble des compétences nécessaires pour assurer le support des utilisateurs en assurant l installation et le support technique d équipement numérique, ainsi que la mise en fonction de logiciels.',
    tags: ['#Support', '#Helpdesk', '#Hardware', '#AssistanceUtilisateurs'],
    skillBlocks: [
      { id: 'sb-1-1', blockNumber: 1, title: 'BLOC 1 - Assistance utilisateurs', description: 'Assurer l assistance auprès des utilisateurs des équipements numériques et logiciels associés' },
      { id: 'sb-1-2', blockNumber: 2, title: 'BLOC 2 - Déploiement matériels', description: 'Déploiement de matériels numériques et logiciels associés' },
      { id: 'sb-1-3', blockNumber: 3, title: 'BLOC 3 - Exploitation équipements', description: 'Exploitation d équipements numériques et logiciels associés' }
    ]
  },
  { 
    id: 'cur-2', 
    code: 'TSRS', 
    title: 'Technicien Systèmes Réseaux & Sécurité', 
    shortName: 'TSRS',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)', 
    totalHours: 910,
    totalDays: 130,
    status: 'active',
    description: 'Le titulaire du titre est acteur principal quant à la formation des utilisateurs sur l ensemble de leur poste de travail et sur les risques engendrés dans un environnement connecté.',
    tags: ['#Déploiement', '#Installation', '#Configuration', '#Sécurisation', '#Scripting'],
    skillBlocks: [
      { id: 'sb-2-1', blockNumber: 1, title: 'BLOC 1 - Déploiement matériels & réseau', description: 'Déployer les matériels, les systèmes et le réseau' },
      { id: 'sb-2-2', blockNumber: 2, title: 'BLOC 2 - Administration serveurs', description: 'Administrer des serveurs hétérogènes et un réseau multi-sites' },
      { id: 'sb-2-3', blockNumber: 3, title: 'BLOC 3 - Sécurisation environnement', description: 'Sécuriser l environnement numérique d exploitation' },
      { id: 'sb-2-4', blockNumber: 4, title: 'BLOC 4 - Entretien parc informatique', description: 'Entretenir un parc informatique et diagnostiquer les pannes' },
      { id: 'sb-2-5', blockNumber: 5, title: 'BLOC 5 - Support technique utilisateurs', description: 'Assurer le support technique auprès des utilisateurs' }
    ]
  },
  { 
    id: 'cur-3', 
    code: 'BTS-CIEL', 
    title: 'BTS CIEL Cybersécurité, Informatique, Électronique', 
    shortName: 'BTS CIEL',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)', 
    totalHours: 1351,
    totalDays: 219,
    status: 'active',
    description: 'Vous souhaitez participer au déploiement de l industrie 4.0, en intervenant sur les réseaux, la cybersécurité et la valorisation des données ?',
    tags: ['#BTS', '#CIEL', '#Cybersécurité', '#Informatique'],
    skillBlocks: [
      { id: 'sb-3-1', blockNumber: 1, title: 'BLOC 1 - Étude et conception réseaux', description: 'Étude et conception de réseaux informatiques' },
      { id: 'sb-3-2', blockNumber: 2, title: 'BLOC 2 - Exploitation et maintenance', description: 'Exploitation et maintenance de réseaux informatiques' },
      { id: 'sb-3-3', blockNumber: 3, title: 'BLOC 3 - Valorisation données & cybersécurité', description: 'Valorisation de la donnée et cybersécurité' }
    ]
  },
  { 
    id: 'cur-4', 
    code: 'PB-NCLC', 
    title: 'Product Builder No Code Low Code', 
    shortName: 'Product Builder',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)', 
    totalHours: 402,
    totalDays: 58,
    status: 'upcoming', // PROGRAMME GELÉ POUR L'ANNÉE PROCHAINE
    description: 'Le Product Builder No Code / Low Code conçoit des applications, des outils digitaux et des automatisations. (Programme gelé et en révision pour la prochaine rentrée académique).',
    tags: ['#NoCode', '#LowCode', '#ProductBuilder', '#Automatisation', '#InnovationDigitale'],
    skillBlocks: [
      { id: 'sb-4-1', blockNumber: 1, title: 'BLOC 1 - Cadrage & pilotage No Code', description: 'Cadrer et piloter les projets No code / Low Code' },
      { id: 'sb-4-2', blockNumber: 2, title: 'BLOC 2 - Développement & intégration', description: 'Développer et intégrer des applications No code' },
      { id: 'sb-4-3', blockNumber: 3, title: 'BLOC 3 - Qualité & sécurité production', description: 'Garantir la qualité, la sécurité et le déploiement' },
      { id: 'sb-4-4', blockNumber: 4, title: 'BLOC 4 - Maintenance évolutive', description: 'Accompagner les utilisateurs et assurer la maintenance' }
    ]
  },
  { 
    id: 'cur-5', 
    code: 'ASRBD', 
    title: 'Administrateur Systèmes, Réseaux et Bases de Données', 
    shortName: 'Admin Systèmes & BD',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)', 
    totalHours: 910,
    totalDays: 130,
    status: 'active',
    description: 'Les compétences acquises au cours de la formation permettent d administrer et sécuriser le système d information et les bases de données.',
    tags: ['#Architecture', '#Cloud', '#SI', '#Basesdedonnées', '#Infrastructure'],
    skillBlocks: [
      { id: 'sb-5-1', blockNumber: 1, title: 'BLOC 1 - Administrer le SI', description: 'Administrer le système d information' },
      { id: 'sb-5-2', blockNumber: 2, title: 'BLOC 2 - Gérer le SI', description: 'Gérer les systèmes d information' },
      { id: 'sb-5-3', blockNumber: 3, title: 'BLOC 3 - Sécurisation SI', description: 'Définir la politique de sécurisation du système d information' }
    ]
  },
  { 
    id: 'cur-6', 
    code: 'ESD', 
    title: 'Expert En Sécurité Digitale', 
    shortName: 'Expert Sécurité Digitale',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 7 - Mastère II', 
    totalHours: 560,
    totalDays: 80,
    status: 'active',
    description: 'Former des experts capables d anticiper les menaces, d auditer la sécurité des SI et de riposter face aux cyber-attaques.',
    tags: ['#Cybersécurité', '#Cyberdéfense'],
    skillBlocks: [
      { id: 'sb-6-1', blockNumber: 1, title: 'BLOC 1 - Prévention menaces cyber', description: 'Prévenir et anticiper les menaces cyber' },
      { id: 'sb-6-2', blockNumber: 2, title: 'BLOC 2 - Audit sécurité SI', description: 'Auditer la sécurité des systèmes d information' },
      { id: 'sb-6-3', blockNumber: 3, title: 'BLOC 3 - Remédiation après attaque', description: 'Analyser et sécuriser après une cyber-attaque' },
      { id: 'sb-6-4', blockNumber: 4, title: 'BLOC 4 - Sécurité organisationnelle', description: 'Piloter la sécurité organisationnelle' }
    ]
  },
  { 
    id: 'cur-7', 
    code: 'DPI', 
    title: 'Directeur De Projets Informatique', 
    shortName: 'Directeur de Projets',
    type: 'Cursus Diplômant',
    modality: 'Alternance',
    rncpLevel: 'Titre RNCP Niveau 7 - Mastère II', 
    totalHours: 490,
    totalDays: 70,
    status: 'active',
    description: 'Le cursus de Directeur de projets informatique permet d acquérir les compétences de gouvernance, pilotage de ressources et management des risques.',
    tags: ['#Digital', '#Agilité', '#UX/UI', '#DesignThinking', '#Chefferie de Projet'],
    skillBlocks: [
      { id: 'sb-7-1', blockNumber: 1, title: 'BLOC 1 - Gouvernance projets IT', description: 'Gouvernance des projets informatiques' },
      { id: 'sb-7-2', blockNumber: 2, title: 'BLOC 2 - Pilotage ressources', description: 'Piloter les ressources financières et humaines' },
      { id: 'sb-7-3', blockNumber: 3, title: 'BLOC 3 - Management risques', description: 'Manager les risques des Projets Informatiques' },
      { id: 'sb-7-4', blockNumber: 4, title: 'BLOC 4 - Qualité & processus', description: 'Manager les processus et la qualité' },
      { id: 'sb-7-5', blockNumber: 5, title: 'BLOC 5 - Communication', description: 'Communiquer avec les acteurs des projets' }
    ]
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-dw-2025',
    code: 'DW2025',
    name: 'Développeur Web - 2025',
    cursusId: 'cur-1',
    cursusName: 'BTS Développeur Web',
    academicYear: '2025-2026',
    startDate: '02 sept. 2025',
    endDate: '06 juin 2026',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'J. Martin (Coordinateur)',
    referentTrainerId: 'tr-01',
    referentTrainerName: 'Thomas Moreau',
    studentsCount: 24,
    status: 'active',
    totalHours: 910,
    totalDays: 130,
    rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
    neveaReference: 'NEVEA-DW-2025'
  },
  {
    id: 'promo-tsrs-2025',
    code: 'TSRS2025',
    name: 'Technicien Systèmes & Réseaux - 2025',
    cursusId: 'cur-2',
    cursusName: 'Technicien Systèmes Réseaux & Sécurité',
    academicYear: '2025-2026',
    startDate: '15 sept. 2025',
    endDate: '31 juil. 2026',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    referentTrainerId: 'tr-01',
    referentTrainerName: 'Thomas Moreau',
    studentsCount: 28,
    status: 'active',
    totalHours: 910,
    totalDays: 130,
    rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
    neveaReference: 'NEVEA-TSRS-901'
  },
  {
    id: 'promo-esd-2025',
    code: 'ESD2025',
    name: 'Expert Sécurité Digitale - Promo 1',
    cursusId: 'cur-6',
    cursusName: 'Expert En Sécurité Digitale',
    academicYear: '2025-2027',
    startDate: '01 oct. 2025',
    endDate: '30 sept. 2027',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    referentTrainerId: 'tr-01',
    referentTrainerName: 'Thomas Moreau',
    studentsCount: 32,
    status: 'active',
    totalHours: 560,
    totalDays: 80,
    rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
    neveaReference: 'NEVEA-ESD-902'
  },
  {
    id: 'promo-pb-2025',
    code: 'PB2025',
    name: 'Product Builder No-Code 2025',
    cursusId: 'cur-4',
    cursusName: 'Product Builder No Code Low Code',
    academicYear: '2025-2026',
    startDate: '03 nov. 2026',
    endDate: '31 oct. 2027',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Sophie Bernard',
    referentTrainerId: 'tr-02',
    referentTrainerName: 'Julie Roux',
    studentsCount: 0,
    status: 'upcoming', // GELÉ ET À REVOIR POUR LA PROCHAINE RENTRÉE (PROCHAINEMENT)
    isFrozen: true,
    totalHours: 402,
    totalDays: 58,
    rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)',
    neveaReference: 'NEVEA-PB-903'
  },
  {
    id: 'promo-dpi-2026',
    code: 'DPI2026',
    name: 'Directeur Projets Informatique 2026',
    cursusId: 'cur-7',
    cursusName: 'Directeur De Projets Informatique',
    academicYear: '2026-2027',
    startDate: '01 oct. 2026',
    endDate: '30 sept. 2027',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    studentsCount: 18,
    status: 'upcoming',
    totalHours: 490,
    totalDays: 70,
    rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
    neveaReference: 'NEVEA-DPI-904'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-thomas-dubois',
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.d.dubois@aston.fr',
    phone: '+33 6 12 34 56 78',
    companyName: 'Capgemini Digital',
    companyTutor: 'Laurent Petit',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    status: 'active',
    neveaReference: 'NEVEA-ST-101',
    attendanceRate: 92
  },
  {
    id: 'stu-sophie-martin',
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 'sophie.martin@aston.fr',
    phone: '+33 6 23 45 67 89',
    companyName: 'Sopra Steria',
    companyTutor: 'Émilie Renard',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    status: 'active',
    neveaReference: 'NEVEA-ST-102',
    attendanceRate: 88
  },
  {
    id: 'stu-julien-petit',
    firstName: 'Julien',
    lastName: 'Petit',
    email: 'julien.petit@aston.fr',
    phone: '+33 6 34 56 78 90',
    companyName: 'Orange Cyberdefense',
    companyTutor: 'Karim Saadi',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    status: 'active',
    neveaReference: 'NEVEA-ST-103',
    attendanceRate: 78
  },
  {
    id: 'stu-emma-leroy',
    firstName: 'Emma',
    lastName: 'Leroy',
    email: 'emma.leroy@aston.fr',
    phone: '+33 6 45 67 89 01',
    companyName: 'Thales Defence',
    companyTutor: 'Nicolas Meyer',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    status: 'active',
    neveaReference: 'NEVEA-ST-104',
    attendanceRate: 95
  },
  {
    id: 'stu-lucas-moreau',
    firstName: 'Lucas',
    lastName: 'Moreau',
    email: 'lucas.moreau@aston.fr',
    phone: '+33 6 56 78 90 12',
    companyName: 'Decathlon Digital',
    companyTutor: 'Sophie Durand',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    status: 'active',
    neveaReference: 'NEVEA-ST-105',
    attendanceRate: 91
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr-01',
    firstName: 'Thomas',
    lastName: 'Moreau',
    email: 'thomas.moreau@aston.fr',
    phone: '01 45 67 89 13',
    specialties: ['React / TypeScript', 'Node.js', 'Bases de données SQL', 'Architecture Web'],
    assignedPromotionIds: ['promo-dw-2025', 'promo-tsrs-2025'],
    neveaReference: 'NEVEA-TR-04'
  },
  {
    id: 'tr-02',
    firstName: 'Julie',
    lastName: 'Roux',
    email: 'julie.roux@aston.fr',
    phone: '01 45 67 89 14',
    specialties: ['Product Design & UI/UX', 'Figma', 'No-Code / Low-Code'],
    assignedPromotionIds: ['promo-dw-2025', 'promo-pb-2025'],
    neveaReference: 'NEVEA-TR-05'
  },
  {
    id: 'tr-03',
    firstName: 'Marc',
    lastName: 'Benoit',
    email: 'marc.benoit@aston.fr',
    phone: '01 45 67 89 15',
    specialties: ['Cybersécurité Web', 'DevSecOps', 'Docker & CI/CD'],
    assignedPromotionIds: ['promo-dw-2025', 'promo-esd-2025'],
    neveaReference: 'NEVEA-TR-06'
  }
];

export const INITIAL_ACTIONS: ActionItem[] = [
  // 7 À FAIRE (dont des actions en retard comme sur la maquette)
  {
    id: 'act-1',
    title: 'Renforcement français',
    description: 'Accompagnement méthodologique sur la rédaction des rapports de projet.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-sophie-martin',
    studentName: 'Sophie Martin',
    assigneeId: 'tr-01',
    assigneeName: 'Léa Moreau',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'high',
    status: 'todo',
    dueDate: '15 nov. 2025',
    createdAt: '2025-11-01'
  },
  {
    id: 'act-2',
    title: 'Manque de participation',
    description: 'Point de cadrage avec l apprenant concernant son implication en TP.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-julien-petit',
    studentName: 'Julien Petit',
    assigneeId: 'usr-samir-01',
    assigneeName: 'Samir Derardja',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'medium',
    status: 'todo',
    dueDate: '20 nov. 2025',
    createdAt: '2025-11-03'
  },
  {
    id: 'act-3',
    title: 'Renforcement en SQL',
    description: 'Module complémentaire sur les requêtes imbriquées et indexation PostgreSQL.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-thomas-dubois',
    studentName: 'Thomas Dubois',
    assigneeId: 'tr-01',
    assigneeName: 'Thomas Moreau',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'high',
    status: 'in_progress',
    dueDate: '20 nov. 2025',
    createdAt: '2025-11-04'
  },
  {
    id: 'act-4',
    title: 'Soutien en maths',
    description: 'Séance de révision sur la logique booléenne et les algorithmes de tri.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-lucas-moreau',
    studentName: 'Lucas Moreau',
    assigneeId: 'tr-01',
    assigneeName: 'Thomas Moreau',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'high',
    status: 'in_progress',
    dueDate: '25 nov. 2025',
    createdAt: '2025-11-05'
  },
  {
    id: 'act-5',
    title: 'Suivi individuel',
    description: 'Bilan d intégration en entreprise avec le tuteur Thales.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-emma-leroy',
    studentName: 'Emma Leroy',
    assigneeId: 'usr-samir-01',
    assigneeName: 'Samir Derardja',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'medium',
    status: 'in_progress',
    dueDate: '28 nov. 2025',
    createdAt: '2025-11-06'
  },
  {
    id: 'act-6',
    title: 'Remise à niveau',
    description: 'Remise à niveau JavaScript moderne (ES6+, Promises, async/await).',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-sophie-martin',
    studentName: 'Léa Moreau',
    assigneeId: 'tr-01',
    assigneeName: 'Thomas Moreau',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'medium',
    status: 'completed',
    dueDate: '05 nov. 2025',
    completedAt: '2025-11-05',
    resultSummary: 'Évalué avec succès à 16/20.',
    createdAt: '2025-10-25'
  },
  {
    id: 'act-7',
    title: 'Accompagnement stage',
    description: 'Validation du sujet de mémoire professionnel.',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    studentId: 'stu-thomas-dubois',
    studentName: 'Hugo Bernard',
    assigneeId: 'usr-samir-01',
    assigneeName: 'Samir Derardja',
    creatorId: 'usr-samir-01',
    creatorName: 'Samir Derardja',
    priority: 'low',
    status: 'completed',
    dueDate: '30 oct. 2025',
    completedAt: '2025-10-30',
    resultSummary: 'Convention et sujet validés.',
    createdAt: '2025-10-15'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    title: 'Suivi pédagogique',
    type: 'apprenant_individuel',
    status: 'scheduled',
    scheduledAt: '2025-11-12T14:00:00+01:00',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    studentId: 'stu-sophie-martin',
    studentName: 'Sophie Martin',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    location: 'Bureau Coordination B201'
  },
  {
    id: 'int-2',
    title: "Point d'étape",
    type: 'apprenant_individuel',
    status: 'scheduled',
    scheduledAt: '2025-11-13T10:00:00+01:00',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    studentId: 'stu-thomas-dubois',
    studentName: 'Thomas Dubois',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    location: 'Bureau Coordination B201'
  },
  {
    id: 'int-3',
    title: "Point équipe",
    type: 'formateur_point',
    status: 'completed',
    scheduledAt: '2025-11-05T15:00:00+01:00',
    conductedAt: '2025-11-05T15:45:00+01:00',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    trainerId: 'tr-01',
    trainerName: 'Julien Petit (Formateur)',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    location: 'Salle des formateurs'
  },
  {
    id: 'int-4',
    title: 'Difficultés',
    type: 'urgent',
    status: 'completed',
    scheduledAt: '2025-10-20T11:00:00+01:00',
    conductedAt: '2025-10-20T11:30:00+01:00',
    coordinatorId: 'usr-samir-01',
    coordinatorName: 'Samir Derardja',
    studentId: 'stu-emma-leroy',
    studentName: 'Emma Leroy',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    location: 'Visio Teams'
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Dév. Web DW2025',
    description: 'Cours officiel du cursus (lecture seule)',
    startTime: '2026-11-10T08:00:00+01:00',
    endTime: '2026-11-10T10:30:00+01:00',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    trainerName: 'Thomas Moreau',
    room: 'Salle 204',
    sourceType: 'nevea_readonly',
    isReadonly: true
  },
  {
    id: 'evt-2',
    title: 'Base de données DW2025',
    description: 'Cours officiel du cursus (lecture seule)',
    startTime: '2026-11-10T11:00:00+01:00',
    endTime: '2026-11-10T13:00:00+01:00',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    trainerName: 'Thomas Moreau',
    room: 'Lab B',
    sourceType: 'nevea_readonly',
    isReadonly: true
  },
  {
    id: 'evt-3',
    title: 'Atelier projet DW2025',
    description: 'Séance pratique',
    startTime: '2026-11-10T14:00:00+01:00',
    endTime: '2026-11-10T16:00:00+01:00',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    room: 'Salle Innovation',
    sourceType: 'aston_local',
    isReadonly: false
  },
  {
    id: 'evt-4',
    title: 'Réunion équipe Aston Campus',
    description: 'Synchronisation locale',
    startTime: '2026-11-11T16:00:00+01:00',
    endTime: '2026-11-11T17:30:00+01:00',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    room: 'Salle Réunion A',
    sourceType: 'aston_local',
    isReadonly: false
  },
  {
    id: 'evt-5',
    title: 'Entretien individuel',
    description: 'Point pédagogique avec Thomas Dubois',
    startTime: '2026-11-13T16:00:00+01:00',
    endTime: '2026-11-13T17:00:00+01:00',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    room: 'Bureau Samir',
    sourceType: 'aston_local',
    isReadonly: false
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-1',
    title: 'Synchronisation Dev Web',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    organizerId: 'usr-samir-01',
    organizerName: 'Samir Derardja',
    scheduledAt: 'Demain • 14:00',
    agenda: '1. Assiduité globale\n2. Rythme des livrables React\n3. Soutien SQL',
    status: 'published',
    decisions: [
      {
        id: 'dec-1',
        topic: 'Renforcement en SQL pour Thomas Dubois',
        decision: 'Mettre en place un plan de renforcement avant le 20 nov.',
        convertedToActionId: 'act-3'
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Programme pédagogique BTS DW 2025',
    fileName: 'Programme_DW2025_Aston.pdf',
    fileSizeBytes: 1820000,
    mimeType: 'application/pdf',
    promotionId: 'promo-dw-2025',
    promotionName: 'Développeur Web - 2025',
    uploadedAt: '2025-09-02T09:30:00+01:00',
    uploadedByName: 'Samir Derardja'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'action_overdue',
    title: 'Action en retard !',
    message: '7 actions nécessitent votre attention immédiate.',
    actionUrl: '/actions',
    isRead: false,
    createdAt: '2026-11-11T08:00:00+01:00'
  }
];
