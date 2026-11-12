import { createClient, SupabaseClient } from '@supabase/supabase-js';

try {
  // Chargement automatique des fichiers .env en Node 20+
  (process as any).loadEnvFile?.();
} catch {}

// Configuration Supabase si variables d'environnement présentes
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

export const isDbConnected = Boolean(supabase);

// Données initiales reflétant fidèlement le référentiel Aston Campus (et la seed SQL)
export let inMemoryDb = {
  promotions: [
    {
      id: '33333333-0000-0000-0000-000000000010',
      code: 'HELPLINE-40',
      name: 'Helpline 40',
      cursus: 'Technicien Support en Numérique',
      cursusId: '22222222-0000-0000-0000-000000000001',
      partnerName: 'Helpline (ESN Partenaire Historique)',
      status: 'active',
      studentsCount: 14,
      startDate: '17 nov. 2025',
      endDate: '23 oct. 2026',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Mourad (Formateur Référent Helpline)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 420,
      totalDays: 60,
      rncpLevel: 'Titre RNCP Niveau 4 (Bac)',
      neveaReference: 'NEVEA-HL-40'
    },
    {
      id: '33333333-0000-0000-0000-000000000011',
      code: 'HELPLINE-42',
      name: 'Helpline 42',
      cursus: 'Technicien Support en Numérique',
      cursusId: '22222222-0000-0000-0000-000000000001',
      partnerName: 'Helpline (ESN Partenaire Historique)',
      status: 'upcoming',
      studentsCount: 12,
      startDate: '13 avr. 2026',
      endDate: '26 mars 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Mourad (Formateur Référent Helpline)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 420,
      totalDays: 60,
      rncpLevel: 'Titre RNCP Niveau 4 (Bac)',
      neveaReference: 'NEVEA-HL-42'
    },
    {
      id: '33333333-0000-0000-0000-000000000013',
      code: 'XEFI-01',
      name: 'Promotion XEFI',
      cursus: 'Technicien Systèmes Réseaux & Sécurité',
      cursusId: '22222222-0000-0000-0000-000000000002',
      partnerName: 'XEFI (Partenaire Informatique)',
      status: 'active',
      studentsCount: 11,
      startDate: '01 sept. 2025',
      endDate: '29 oct. 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Mourad & Christelle',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 910,
      totalDays: 130,
      rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
      neveaReference: 'NEVEA-XEFI-01'
    },
    {
      id: '33333333-0000-0000-0000-000000000014',
      code: 'TSRS61',
      name: 'TSRS 61',
      cursus: 'Technicien Systèmes Réseaux & Sécurité',
      cursusId: '22222222-0000-0000-0000-000000000002',
      status: 'active',
      studentsCount: 29,
      startDate: '22 sept. 2025',
      endDate: '27 août 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Christelle (Formatrice Référente TSAS)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 910,
      totalDays: 130,
      rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
      neveaReference: 'NEVEA-TSRS-61'
    },
    {
      id: '33333333-0000-0000-0000-000000000015',
      code: 'TSAS-09',
      name: 'TSAS 09',
      cursus: 'Technicien Systèmes Réseaux & Sécurité',
      cursusId: '22222222-0000-0000-0000-000000000002',
      status: 'active',
      studentsCount: 20,
      startDate: '27 oct. 2025',
      endDate: '04 déc. 2026',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Christelle (Formatrice Référente TSAS)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 910,
      totalDays: 130,
      rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
      neveaReference: 'NEVEA-TSAS-09'
    },
    {
      id: '33333333-0000-0000-0000-000000000016',
      code: 'ESD56',
      name: 'ESD 56',
      cursus: 'Expert En Sécurité Digitale',
      cursusId: '22222222-0000-0000-0000-000000000006',
      status: 'active',
      studentsCount: 23,
      startDate: '29 sept. 2025',
      endDate: '30 oct. 2026',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Mehdi (Formateur Référent ESD)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 560,
      totalDays: 80,
      rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
      neveaReference: 'NEVEA-ESD-56'
    },
    {
      id: '33333333-0000-0000-0000-000000000017',
      code: 'ESD57',
      name: 'ESD 57',
      cursus: 'Expert En Sécurité Digitale',
      cursusId: '22222222-0000-0000-0000-000000000006',
      status: 'upcoming',
      studentsCount: 14,
      startDate: '04 mai 2026',
      endDate: '02 juil. 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Mehdi (Formateur Référent ESD)',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 560,
      totalDays: 80,
      rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
      neveaReference: 'NEVEA-ESD-57'
    },
    {
      id: '33333333-0000-0000-0000-000000000001',
      code: 'DW2025',
      name: 'Développeur Web - 2025',
      cursus: 'BTS Développeur Web',
      status: 'active',
      studentsCount: 24,
      startDate: '02 sept. 2025',
      endDate: '06 juin 2026',
      coordinator: 'J. Martin (Coordinateur)',
      referentTrainer: 'Thomas Moreau',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      neveaReference: 'NEVEA-DW-2025'
    },
    {
      id: '33333333-0000-0000-0000-000000000004',
      code: 'PROMO-PB-2025-NC',
      name: 'Product Builder No-Code 2025/2026',
      cursus: 'Product Builder No Code Low Code',
      cursusId: '22222222-0000-0000-0000-000000000004',
      status: 'upcoming', // Gelé et à revoir l'année prochaine / Prochainement
      isFrozen: true,
      studentsCount: 0,
      startDate: '01 nov. 2026',
      endDate: '31 oct. 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Thomas Moreau',
      schedulePace: '1 sem. école / 3 sem. entreprise',
      totalHours: 402,
      totalDays: 58,
      rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)',
      neveaReference: 'NEVEA-PR-903'
    }
  ],
  cursus: [
    {
      id: '22222222-0000-0000-0000-000000000001',
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
        { blockNumber: 1, title: 'BLOC 1 - Assistance utilisateurs', description: 'Assurer l assistance auprès des utilisateurs des équipements numériques et logiciels associés' },
        { blockNumber: 2, title: 'BLOC 2 - Déploiement matériels', description: 'Déploiement de matériels numériques et logiciels associés' },
        { blockNumber: 3, title: 'BLOC 3 - Exploitation équipements', description: 'Exploitation d équipements numériques et logiciels associés' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000002',
      code: 'TSRS',
      title: 'Technicien Systèmes Réseaux & Sécurité',
      shortName: 'TSRS',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
      totalHours: 910,
      totalDays: 130,
      status: 'active',
      description: 'Le titulaire du titre est acteur principal quant à la formation des utilisateurs sur l ensemble de leur poste de travail et sur les risques engendrés dans un environnement connecté. Pour ce faire, il doit disposer de solides compétences techniques dans son domaine, ainsi que d un bon relationnel.',
      tags: ['#Déploiement', '#Installation', '#Configuration', '#Sécurisation', '#Scripting'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Déploiement matériels & réseau', description: 'Déployer les matériels, les systèmes et le réseau' },
        { blockNumber: 2, title: 'BLOC 2 - Administration serveurs', description: 'Administrer des serveurs hétérogènes et un réseau multi-sites' },
        { blockNumber: 3, title: 'BLOC 3 - Sécurisation environnement', description: 'Sécuriser l environnement numérique d exploitation' },
        { blockNumber: 4, title: 'BLOC 4 - Entretien parc informatique', description: 'Entretenir un parc informatique et diagnostiquer les pannes matérielles/logicielles' },
        { blockNumber: 5, title: 'BLOC 5 - Support technique utilisateurs', description: 'Assurer le support technique auprès des utilisateurs' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000003',
      code: 'BTS-CIEL',
      title: 'BTS CIEL Cybersécurité, Informatique, Électronique',
      shortName: 'BTS CIEL',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 5 (Bac+2)',
      totalHours: 1351,
      totalDays: 219,
      status: 'active',
      description: 'Vous souhaitez participer au déploiement de l industrie 4.0, en intervenant sur les réseaux, la cybersécurité et la valorisation des données ? Les métiers de l informatique, des réseaux et de l électronique se déploient aujourd hui dans la plupart des secteurs d activité.',
      tags: ['#BTS', '#CIEL', '#Cybersécurité', '#Informatique'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Étude et conception réseaux', description: 'Étude et conception de réseaux informatiques et architectures distribuées' },
        { blockNumber: 2, title: 'BLOC 2 - Exploitation et maintenance', description: 'Exploitation et maintenance de réseaux informatiques' },
        { blockNumber: 3, title: 'BLOC 3 - Valorisation données & cybersécurité', description: 'Valorisation de la donnée et cybersécurité' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000004',
      code: 'PB-NCLC',
      title: 'Product Builder No Code Low Code',
      shortName: 'Product Builder',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)',
      totalHours: 402,
      totalDays: 58,
      status: 'upcoming', // Programme gelé et en révision pour l'année prochaine (Prochainement)
      description: 'Le Product Builder No Code / Low Code conçoit des applications, des outils digitaux et des automatisations pour répondre aux besoins des entreprises, sans développement informatique traditionnel. (Programme actuellement gelé et en cours de révision pour la prochaine rentrée académique).',
      tags: ['#NoCode', '#LowCode', '#ProductBuilder', '#Automatisation', '#InnovationDigitale'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Cadrage & pilotage No Code', description: 'Cadrer et piloter les projets de développement No code / Low Code' },
        { blockNumber: 2, title: 'BLOC 2 - Développement & intégration', description: 'Développer et intégrer des applications No code et automatiser les flux métiers' },
        { blockNumber: 3, title: 'BLOC 3 - Qualité, sécurité & déploiement', description: 'Garantir la qualité, la sécurité et le déploiement des applications en production' },
        { blockNumber: 4, title: 'BLOC 4 - Conduite du changement', description: 'Accompagner les utilisateurs et assurer la maintenance évolutive des solutions' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000005',
      code: 'ASRBD',
      title: 'Administrateur Systèmes, Réseaux et Bases de Données',
      shortName: 'Admin Systèmes & BD',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 6 (Bac+3/4)',
      totalHours: 910,
      totalDays: 130,
      status: 'active',
      description: 'Les compétences acquises au cours de la formation permettent d administrer le système d information, gérer les systèmes et définir la politique de sécurisation du système d information.',
      tags: ['#Architecture', '#Cloud', '#SI', '#Basesdedonnées', '#Infrastructure'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Administration SI', description: 'Administrer le système d information et services cloud' },
        { blockNumber: 2, title: 'BLOC 2 - Gestion des systèmes', description: 'Gérer les systèmes d information, sauvegardes et haute disponibilité' },
        { blockNumber: 3, title: 'BLOC 3 - Politique de sécurisation', description: 'Définir la politique de sécurisation du système d information' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000006',
      code: 'ESD',
      title: 'Expert En Sécurité Digitale',
      shortName: 'Expert Sécurité Digitale',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
      totalHours: 560,
      totalDays: 80,
      status: 'active',
      description: 'Former des experts capables d anticiper les menaces, d auditer la sécurité des systèmes d information, de riposter face aux cyber-attaques et de piloter la sécurité organisationnelle.',
      tags: ['#Cybersécurité', '#Cyberdéfense'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Anticipation menaces cyber', description: 'Prévenir et anticiper les menaces cyber pesant sur les systèmes d information' },
        { blockNumber: 2, title: 'BLOC 2 - Audit & déploiement défenses', description: 'Auditer la sécurité des systèmes d information et conduire le déploiement des mesures de défenses' },
        { blockNumber: 3, title: 'BLOC 3 - Analyse & remédiation', description: 'Analyser et sécuriser les systèmes d information après une cyber-attaque' },
        { blockNumber: 4, title: 'BLOC 4 - Sécurité organisationnelle', description: 'Piloter la sécurité organisationnelle et la gouvernance RSSI' }
      ]
    },
    {
      id: '22222222-0000-0000-0000-000000000007',
      code: 'DPI',
      title: 'Directeur De Projets Informatique',
      shortName: 'Directeur de Projets',
      type: 'Cursus Diplômant',
      modality: 'Alternance',
      rncpLevel: 'Titre RNCP Niveau 7 - Mastère II',
      totalHours: 490,
      totalDays: 70,
      status: 'active',
      description: 'Le cursus de Directeur de projets informatique a pour objectif de vous faire acquérir les compétences de gouvernance, pilotage de ressources, gestion des risques et management de la qualité sur les projets IT stratégiques.',
      tags: ['#Digital', '#Agilité', '#UX/UI', '#DesignThinking', '#Chefferie de Projet'],
      skillBlocks: [
        { blockNumber: 1, title: 'BLOC 1 - Gouvernance projets IT', description: 'Gouvernance des projets informatiques et alignement stratégique' },
        { blockNumber: 2, title: 'BLOC 2 - Pilotage des ressources', description: 'Piloter les ressources financières, humaines et techniques des projets informatiques' },
        { blockNumber: 3, title: 'BLOC 3 - Management des risques', description: 'Manager les risques des Projets Informatiques et plans de mitigation' },
        { blockNumber: 4, title: 'BLOC 4 - Qualité et processus', description: 'Manager les processus et la qualité dans le périmètre des projets informatiques' },
        { blockNumber: 5, title: 'BLOC 5 - Communication parties prenantes', description: 'Communiquer avec les acteurs des projets informatiques et négociation' }
      ]
    }
  ],
  students: [
    {
      id: '44444444-0000-0000-0000-000000000001',
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 'thomas.d.dubois@aston.fr',
      phone: '+33 6 12 34 56 78',
      companyName: 'Capgemini Digital',
      companyTutor: 'Laurent Petit',
      promotionCode: 'DW2025',
      promotionName: 'Développeur Web - 2025',
      status: 'active',
      attendanceRate: 92,
      averageGrade: 14.2,
      neveaReference: 'NEVEA-ST-101'
    },
    {
      id: '44444444-0000-0000-0000-000000000002',
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 'sophie.martin@aston.fr',
      phone: '+33 6 23 45 67 89',
      companyName: 'Sopra Steria',
      companyTutor: 'Émilie Renard',
      promotionCode: 'DW2025',
      promotionName: 'Développeur Web - 2025',
      status: 'active',
      attendanceRate: 88,
      averageGrade: 15.0,
      neveaReference: 'NEVEA-ST-102'
    },
    {
      id: '44444444-0000-0000-0000-000000000003',
      firstName: 'Julien',
      lastName: 'Petit',
      email: 'julien.petit@aston.fr',
      phone: '+33 6 34 56 78 90',
      companyName: 'Orange Cyberdefense',
      companyTutor: 'Karim Saadi',
      promotionCode: 'DW2025',
      promotionName: 'Développeur Web - 2025',
      status: 'active',
      attendanceRate: 78,
      averageGrade: 12.5,
      neveaReference: 'NEVEA-ST-103'
    },
    {
      id: '44444444-0000-0000-0000-000000000004',
      firstName: 'Emma',
      lastName: 'Leroy',
      email: 'emma.leroy@aston.fr',
      phone: '+33 6 45 67 89 01',
      companyName: 'Thales Defence',
      companyTutor: 'Nicolas Meyer',
      promotionCode: 'DW2025',
      promotionName: 'Développeur Web - 2025',
      status: 'active',
      attendanceRate: 95,
      averageGrade: 16.8,
      neveaReference: 'NEVEA-ST-104'
    }
  ],
  trainers: [
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000010',
      firstName: 'Mourad',
      lastName: 'Référent',
      email: 'mourad.referent@aston.fr',
      phone: '+33 6 11 22 33 44',
      isLead: true,
      poleSpecialty: 'Pôle ESN Helpline & Partenaires',
      specialties: ['Helpline', 'Support Utilisateur', 'Helpdesk N2', 'ITSM', 'Coordination Formateurs'],
      assignedPromotions: ['HELPLINE-40', 'HELPLINE-42', 'HELPLINE-43', 'XEFI-01'],
      neveaReference: 'NEVEA-TR-10'
    },
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000011',
      firstName: 'Christelle',
      lastName: 'Référente',
      email: 'christelle.referente@aston.fr',
      phone: '+33 6 22 33 44 55',
      isLead: true,
      poleSpecialty: 'Pôle Systèmes & TSAS',
      specialties: ['TSAS', 'Systèmes & Réseaux', 'Linux', 'Virtualisation', 'Coordination Formateurs'],
      assignedPromotions: ['TSRS61', 'TSAS-09', 'XEFI-01'],
      neveaReference: 'NEVEA-TR-11'
    },
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000012',
      firstName: 'Mehdi',
      lastName: 'Référent',
      email: 'mehdi.referent@aston.fr',
      phone: '+33 6 33 44 55 66',
      isLead: true,
      poleSpecialty: 'Pôle Sécurité Digitale & ESD',
      specialties: ['ESD', 'Cybersécurité', 'Pentest', 'Gouvernance Sécurité', 'Coordination Formateurs'],
      assignedPromotions: ['ESD56', 'ESD57'],
      neveaReference: 'NEVEA-TR-12'
    },
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000004',
      firstName: 'Thomas',
      lastName: 'Moreau',
      email: 'thomas.moreau@aston.fr',
      phone: '01 45 67 89 13',
      isLead: false,
      leadTrainerName: 'Mourad & Christelle',
      specialties: ['React / TypeScript', 'Node.js', 'Bases de données SQL', 'Architecture Web'],
      assignedPromotions: ['DW2025', 'HELPLINE-40'],
      neveaReference: 'NEVEA-TR-04'
    },
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000005',
      firstName: 'Julie',
      lastName: 'Roux',
      email: 'julie.roux@aston.fr',
      phone: '01 45 67 89 14',
      isLead: false,
      leadTrainerName: 'Mehdi',
      specialties: ['Product Design & UI/UX', 'Figma', 'No-Code / Low-Code'],
      assignedPromotions: ['DW2025'],
      neveaReference: 'NEVEA-TR-05'
    }
  ],
  partners: [
    {
      id: '55555555-0000-0000-0000-000000000001',
      code: 'HELPLINE',
      name: 'Helpline',
      type: 'ESN Partenaire Historique',
      leadTrainer: 'Mourad (Formateur Référent)',
      notes: 'Partenaire historique Aston - Cohortes dédiées Helpline 40/42/43 prises en charge directement pour l alternance.'
    },
    {
      id: '55555555-0000-0000-0000-000000000002',
      code: 'XEFI',
      name: 'XEFI',
      type: 'Partenaire IT & Services',
      leadTrainer: 'Mourad & Christelle',
      notes: 'Partenaire IT réseau et infogérance - Cohorte dédiée XEFI.'
    },
    {
      id: '55555555-0000-0000-0000-000000000003',
      code: 'CAPGEMINI',
      name: 'Capgemini',
      type: 'ESN Partenaire',
      notes: 'Pôle Développement & Architecture Cloud.'
    },
    {
      id: '55555555-0000-0000-0000-000000000004',
      code: 'SOPRA',
      name: 'Sopra Steria',
      type: 'ESN Partenaire',
      notes: 'Pôle Systèmes d information & Cybersécurité.'
    }
  ],
  alerts: [
    {
      id: 'alt-01',
      studentId: '44444444-0000-0000-0000-000000000001',
      studentName: 'Alexandre Martin',
      promotionId: '33333333-0000-0000-0000-000000000010',
      promotionName: 'Helpline 40',
      partnerName: 'Helpline',
      type: 'retard_repetition',
      severity: 'high',
      delayMinutes: 85,
      title: 'Retards répétés : Alexandre Martin (Helpline 40)',
      description: '4 retards enregistrés sur la semaine de cours en centre (cumul 85 min). Contacter le tuteur Helpline.',
      status: 'open',
      triggeredAt: 'Aujourd hui à 09:15'
    },
    {
      id: 'alt-02',
      studentId: '44444444-0000-0000-0000-000000000002',
      studentName: 'Camille Girard',
      promotionId: '33333333-0000-0000-0000-000000000013',
      promotionName: 'Promotion XEFI',
      partnerName: 'XEFI',
      type: 'absence_repetition',
      severity: 'critical',
      unexcusedDays: 3,
      title: 'Absences répétées non justifiées : Camille Girard (XEFI)',
      description: '3 demi-journées d absence consécutives sans arrêt de travail ni justificatif sous 48h. Risque rupture contrat.',
      status: 'open',
      triggeredAt: 'Aujourd hui à 08:30'
    },
    {
      id: 'alt-03',
      studentId: '44444444-0000-0000-0000-000000000003',
      studentName: 'Youssef Benali',
      promotionId: '33333333-0000-0000-0000-000000000016',
      promotionName: 'ESD 56',
      partnerName: 'Orange Cyberdefense',
      type: 'justificatif_manquant',
      severity: 'medium',
      title: 'Justificatif manquant : Youssef Benali (ESD 56)',
      description: 'Absence du mardi déclarée pour motif médical mais certificat employeur non transmis sous 48h.',
      status: 'open',
      triggeredAt: 'Hier à 16:45'
    },
    {
      id: 'alt-04',
      studentId: '44444444-0000-0000-0000-000000000004',
      studentName: 'Emma Leroy',
      promotionId: '33333333-0000-0000-0000-000000000014',
      promotionName: 'TSRS 61',
      partnerName: 'Thales Defence',
      type: 'decrochage_general',
      severity: 'high',
      title: 'Alerte assiduité sous le seuil Qualiopi (74%) : Emma Leroy (TSRS 61)',
      description: 'Baisse continue de présence constatée sur les deux dernières semaines. Entretien de recadrage recommandé.',
      status: 'in_progress',
      triggeredAt: 'Hier à 11:20'
    }
  ],
  actions: [
    {
      id: '99999999-0000-0000-0000-000000000001',
      title: 'Renforcement français',
      description: 'Accompagnement méthodologique sur la rédaction des rapports de projet.',
      promotionName: 'Développeur Web - 2025',
      studentName: 'Sophie Martin',
      assigneeName: 'Léa Moreau',
      priority: 'high',
      status: 'todo',
      dueDate: '15 nov. 2025',
      createdAt: '2025-11-01'
    },
    {
      id: '99999999-0000-0000-0000-000000000002',
      title: 'Manque de participation',
      description: 'Point de cadrage avec l apprenant concernant son implication en TP.',
      promotionName: 'Développeur Web - 2025',
      studentName: 'Julien Petit',
      assigneeName: 'Samir Derardja',
      priority: 'medium',
      status: 'todo',
      dueDate: '20 nov. 2025',
      createdAt: '2025-11-03'
    },
    {
      id: '99999999-0000-0000-0000-000000000003',
      title: 'Renforcement en SQL',
      description: 'Module complémentaire sur les requêtes imbriquées et indexation PostgreSQL.',
      promotionName: 'Développeur Web - 2025',
      studentName: 'Thomas Dubois',
      assigneeName: 'Thomas Moreau',
      priority: 'high',
      status: 'in_progress',
      dueDate: '20 nov. 2025',
      createdAt: '2025-11-04'
    },
    {
      id: '99999999-0000-0000-0000-000000000004',
      title: 'Soutien en maths',
      description: 'Séance de révision sur la logique booléenne et les algorithmes de tri.',
      promotionName: 'Développeur Web - 2025',
      studentName: 'Lucas Moreau',
      assigneeName: 'Thomas Moreau',
      priority: 'high',
      status: 'in_progress',
      dueDate: '25 nov. 2025',
      createdAt: '2025-11-05'
    },
    {
      id: '99999999-0000-0000-0000-000000000005',
      title: 'Remise à niveau',
      description: 'Remise à niveau JavaScript moderne (ES6+, Promises, async/await).',
      promotionName: 'Développeur Web - 2025',
      studentName: 'Léa Moreau',
      assigneeName: 'Thomas Moreau',
      priority: 'medium',
      status: 'completed',
      dueDate: '05 nov. 2025',
      createdAt: '2025-10-25'
    }
  ],
  interviews: [
    {
      id: '66666666-0000-0000-0000-000000000001',
      title: 'Suivi pédagogique',
      type: 'apprenant_individuel',
      status: 'scheduled',
      date: '12 nov. 2025 à 14:00',
      studentName: 'Sophie Martin',
      role: 'Apprenante',
      location: 'Bureau Coordination B201'
    },
    {
      id: '66666666-0000-0000-0000-000000000002',
      title: "Point d'étape",
      type: 'apprenant_individuel',
      status: 'scheduled',
      date: '13 nov. 2025 à 10:00',
      studentName: 'Thomas Dubois',
      role: 'Apprenant',
      location: 'Bureau Coordination B201'
    },
    {
      id: '66666666-0000-0000-0000-000000000003',
      title: 'Point équipe',
      type: 'formateur_point',
      status: 'completed',
      date: '05 nov. 2025 à 15:00',
      studentName: 'Julien Petit',
      role: 'Formateur',
      location: 'Salle des formateurs'
    }
  ],
  meetings: [
    {
      id: 'meet-1',
      title: 'Synchronisation Dev Web',
      promotionId: '33333333-0000-0000-0000-000000000001',
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
          convertedToActionId: '99999999-0000-0000-0000-000000000003'
        }
      ]
    }
  ],
  documents: [
    {
      id: 'doc-1',
      title: 'Programme pédagogique BTS DW 2025',
      fileName: 'Programme_DW2025_Aston.pdf',
      fileSizeBytes: 1820000,
      mimeType: 'application/pdf',
      promotionId: '33333333-0000-0000-0000-000000000001',
      promotionName: 'Développeur Web - 2025',
      uploadedAt: '2025-09-02T09:30:00+01:00',
      uploadedByName: 'Samir Derardja'
    }
  ],
  events: [
    {
      id: 'evt-4',
      title: 'Comité pédagogique TSRS / Helpline',
      description: 'Point d\'étape assiduité et suivis entreprise',
      startTime: '2026-11-12T14:00:00+01:00',
      endTime: '2026-11-12T15:30:00+01:00',
      promotionId: '33333333-0000-0000-0000-000000000010',
      promotionName: 'Helpline 40',
      room: 'Salle Réunion A',
      sourceType: 'aston_local',
      isReadonly: false
    }
  ]
};

