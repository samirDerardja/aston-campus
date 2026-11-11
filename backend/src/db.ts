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
      neveaReference: 'NEVEA-DW-2025'
    },
    {
      id: '33333333-0000-0000-0000-000000000002',
      code: 'PROMO-TSRS-2025-A',
      name: 'TSRS 2025/2026 - Groupe A',
      cursus: 'Technicien Systèmes Réseaux & Sécurité',
      status: 'active',
      studentsCount: 18,
      startDate: '15 sept. 2025',
      endDate: '31 juil. 2026',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Thomas Moreau',
      neveaReference: 'NEVEA-PR-901'
    },
    {
      id: '33333333-0000-0000-0000-000000000003',
      code: 'PROMO-ESD-2025-P1',
      name: 'Expert Sécurité Digitale 2025/2027',
      cursus: 'Expert En Sécurité Digitale',
      status: 'active',
      studentsCount: 22,
      startDate: '01 oct. 2025',
      endDate: '30 sept. 2027',
      coordinator: 'Samir Derardja',
      referentTrainer: 'Thomas Moreau',
      neveaReference: 'NEVEA-PR-902'
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
      id: 'aaaaaaaa-0000-0000-0000-000000000004',
      firstName: 'Thomas',
      lastName: 'Moreau',
      email: 'thomas.moreau@aston.fr',
      phone: '01 45 67 89 13',
      specialties: ['React / TypeScript', 'Node.js', 'Bases de données SQL', 'Architecture Web'],
      assignedPromotions: ['DW2025', 'PROMO-TSRS-2025-A'],
      neveaReference: 'NEVEA-TR-04'
    },
    {
      id: 'aaaaaaaa-0000-0000-0000-000000000005',
      firstName: 'Julie',
      lastName: 'Roux',
      email: 'julie.roux@aston.fr',
      phone: '01 45 67 89 14',
      specialties: ['Product Design & UI/UX', 'Figma', 'No-Code / Low-Code'],
      assignedPromotions: ['DW2025'],
      neveaReference: 'NEVEA-TR-05'
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
  ]
};

