try {
  (process as any).loadEnvFile?.();
} catch {}

import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { z } from 'zod';
import { inMemoryDb, supabase, isDbConnected } from './db.js';

const server: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          remoteAddress: req.socket?.remoteAddress,
        };
      },
    },
  },
});

// Middleware de sécurité
server.register(helmet, { contentSecurityPolicy: false });
server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

// Gestionnaire d'erreurs centralisé
server.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error);

  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      code: 'ASTON_ERR_VALIDATION',
      message: 'Données de requête invalides',
      details: error.errors,
    });
  }

  if (error.code === 'ASTON_ERR_READONLY') {
    return reply.status(403).send({
      code: 'ASTON_ERR_READONLY',
      message: error.message,
    });
  }

  const statusCode = error.statusCode || 500;
  return reply.status(statusCode).send({
    code: error.code || 'ASTON_ERR_INTERNAL',
    message: statusCode === 500 ? 'Erreur interne du serveur' : error.message,
  });
});

// Health check endpoint
server.get('/health', async () => {
  return {
    status: 'ok',
    service: 'aston-campus-backend',
    databaseConnected: isDbConnected,
    mode: isDbConnected ? 'supabase_postgres' : 'in_memory_synchronized',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };
});

// --- MODULE CURSUS (RÉFÉRENTIEL FORMATIONS & BLOCS DE COMPÉTENCES) ---
server.get('/api/cursus', async (request: FastifyRequest<{ Querystring: { status?: string } }>) => {
  const { status } = request.query;

  if (supabase) {
    try {
      let query = supabase.from('cursus').select('*, skill_blocks:cursus_skill_blocks(*)');
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
          id: c.id,
          code: c.code,
          title: c.title,
          shortName: c.short_name || c.title,
          type: c.type || 'Cursus Diplômant',
          modality: c.modality || 'Alternance',
          rncpLevel: c.rncp_level,
          totalHours: c.total_hours || (c.code === 'BTS-CIEL' ? 1351 : (c.code === 'PBNCLC' ? 402 : (c.code === 'DPI' ? 490 : (c.code === 'ESD' ? 560 : 910)))),
          totalDays: c.total_days || (c.code === 'BTS-CIEL' ? 219 : (c.code === 'PBNCLC' ? 58 : (c.code === 'DPI' ? 70 : (c.code === 'ESD' ? 80 : 130)))),
          status: c.status || (c.code === 'PBNCLC' ? 'upcoming' : 'active'),
          description: c.description,
          tags: c.tags || [],
          skillBlocks: (c.skill_blocks || []).map((b: any) => ({
            id: b.id,
            blockNumber: b.block_number,
            title: b.title,
            description: b.description
          }))
        }));
      }
    } catch {}
  }

  let list = inMemoryDb.cursus || [];
  if (status) {
    list = list.filter(c => c.status === status);
  }
  return list;
});

server.get('/api/cursus/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const list = inMemoryDb.cursus || [];
  const found = list.find(c => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  if (!found) {
    return reply.status(404).send({ code: 'ASTON_ERR_NOT_FOUND', message: 'Cursus introuvable' });
  }
  return found;
});

// --- MODULE PROMOTIONS ---
server.get('/api/promotions', async () => {
  if (supabase) {
    const { data, error } = await supabase.from('promotions').select('*');
    if (!error && data && data.length > 0) {
      return data.map((p: any) => {
        const isPB = p.code?.includes('PB') || p.cursus_id === '22222222-0000-0000-0000-000000000004';
        const isTSRS = p.code?.includes('TSRS') || p.cursus_id === '22222222-0000-0000-0000-000000000002';
        const isESD = p.code?.includes('ESD') || p.cursus_id === '22222222-0000-0000-0000-000000000006';
        const isDPI = p.code?.includes('DPI') || p.cursus_id === '22222222-0000-0000-0000-000000000007';

        return {
          id: p.id,
          code: p.code,
          name: p.name,
          cursusId: p.cursus_id,
          cursus: isPB ? 'Product Builder No Code Low Code' : (isTSRS ? 'Technicien Systèmes Réseaux & Sécurité' : (isESD ? 'Expert En Sécurité Digitale' : (isDPI ? 'Directeur De Projets Informatique' : 'BTS Développeur Web'))),
          status: isPB ? 'upcoming' : p.status, // Product Builder est gelé pour révision / Prochainement
          isFrozen: isPB,
          studentsCount: isPB ? 0 : (p.studentsCount || 24),
          totalHours: isPB ? 402 : (isTSRS ? 910 : (isESD ? 560 : (isDPI ? 490 : 910))),
          totalDays: isPB ? 58 : (isTSRS ? 130 : (isESD ? 80 : (isDPI ? 70 : 130))),
          rncpLevel: isPB ? 'Niveau 6 (Bac+3/4)' : (isTSRS ? 'Niveau 5 (Bac+2)' : (isESD ? 'Niveau 7 - Mastère II' : 'Niveau 5 (Bac+2)')),
          startDate: p.start_date || '02 sept. 2025',
          endDate: p.end_date || '06 juin 2026',
          coordinator: 'Samir Derardja',
          referentTrainer: 'Thomas Moreau',
          neveaReference: p.nevea_reference,
        };
      });
    }
  }
  return inMemoryDb.promotions;
});

server.get('/api/promotions/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const promo = inMemoryDb.promotions.find(p => p.id === id || p.code === id);
  if (!promo) {
    return reply.status(404).send({ code: 'ASTON_ERR_NOT_FOUND', message: 'Promotion introuvable' });
  }
  return promo;
});

// --- MODULE APPRENANTS (STUDENTS) ---
server.get('/api/students', async () => {
  if (supabase) {
    const { data, error } = await supabase.from('students').select('*');
    if (!error && data && data.length > 0) {
      return data.map((s: any, idx: number) => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        email: s.email,
        phone: s.phone || '06 12 34 56 78',
        promotionId: '33333333-0000-0000-0000-000000000001',
        promotionName: 'Développeur Web - 2025',
        attendanceRate: 90 + (idx % 8),
        averageGrade: 14 + (idx % 4),
        status: 'active',
        companyName: s.company_name || 'Capgemini',
        tutorName: s.company_tutor || 'Laurent Petit',
        alertCount: idx % 3 === 0 ? 1 : 0,
      }));
    }
  }
  return inMemoryDb.students;
});

server.get('/api/students/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const student = inMemoryDb.students.find(s => s.id === id || s.firstName.toLowerCase() === id.toLowerCase());
  if (!student) {
    return reply.status(404).send({ code: 'ASTON_ERR_NOT_FOUND', message: 'Apprenant introuvable' });
  }
  return student;
});

// --- MODULE PARTENAIRES ENTREPRISES (ESN) ---
server.get('/api/partners', async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('partners').select('*');
      if (!error && data && data.length > 0) return data;
    } catch {}
  }
  return inMemoryDb.partners || [];
});

// --- MODULE ALERTES ASSIDUITÉ EN TEMPS RÉEL ---
server.get('/api/alerts', async (request: FastifyRequest<{ Querystring: { status?: string; type?: string } }>) => {
  const { status, type } = request.query;

  if (supabase) {
    try {
      let query = supabase.from('student_alerts').select('*, students(first_name, last_name, company_name), promotions(name)');
      if (status) query = query.eq('status', status);
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((a: any) => ({
          id: a.id,
          studentId: a.student_id,
          studentName: a.students ? `${a.students.first_name} ${a.students.last_name}` : 'Apprenant',
          partnerName: a.students?.company_name || 'Helpline',
          promotionId: a.promotion_id,
          promotionName: a.promotions?.name || 'Promotion',
          type: a.type,
          severity: a.severity,
          title: a.title,
          description: a.description,
          status: a.status,
          triggeredAt: a.triggered_at?.split('T')[0] || 'Récemment'
        }));
      }
    } catch {}
  }

  let list = inMemoryDb.alerts || [];
  if (status) list = list.filter((a: any) => a.status === status);
  if (type) list = list.filter((a: any) => a.type === type);
  return list;
});

server.patch('/api/alerts/:id/status', async (request: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const { status } = request.body || {};

  if (supabase) {
    try {
      await supabase.from('student_alerts').update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null }).eq('id', id);
    } catch {}
  }

  const alert = inMemoryDb.alerts.find((a: any) => a.id === id);
  if (alert) {
    (alert as any).status = status;
  }
  return { success: true, id, status };
});

server.post('/api/alerts/:id/convert-to-action', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const alert = inMemoryDb.alerts.find((a: any) => a.id === id);
  if (!alert) {
    return reply.status(404).send({ code: 'ASTON_ERR_NOT_FOUND', message: 'Alerte introuvable' });
  }

  // Création automatique de l'action corrective liée
  const newAction = {
    id: `act-${Date.now()}`,
    title: `[Alerte Assiduité] ${alert.title}`,
    description: `Action générée automatiquement depuis l alerte : ${alert.description}`,
    promotionName: alert.promotionName || 'Promotion Aston',
    studentName: alert.studentName,
    assigneeName: 'Samir Derardja',
    priority: alert.severity === 'critical' ? 'urgent' : (alert.severity === 'high' ? 'high' : 'medium'),
    status: 'todo',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
  };

  inMemoryDb.actions.unshift(newAction as any);
  (alert as any).status = 'in_progress';
  (alert as any).actionId = newAction.id;

  return reply.status(201).send({ success: true, action: newAction, alert });
});

// --- MODULE FORMATEURS (TRAINERS) ---
server.get('/api/trainers', async () => {
  if (supabase) {
    const { data, error } = await supabase.from('trainers').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return inMemoryDb.trainers;
});

// --- MODULE ACTIONS CORRECTIVES (KANBAN) ---
server.get('/api/actions', async () => {
  if (supabase) {
    const { data, error } = await supabase.from('action_items').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        promotionName: 'Développeur Web - 2025',
        studentName: a.student_id ? 'Alexandre Martin' : 'Promotion DW2025',
        assigneeName: 'Samir Derardja',
        priority: a.priority,
        status: a.status,
        dueDate: a.due_date,
        createdAt: a.created_at?.split('T')[0],
      }));
    }
  }
  return inMemoryDb.actions;
});

const createActionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  studentName: z.string().optional(),
  assigneeName: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
  status: z.enum(['todo', 'in_progress', 'waiting', 'completed', 'cancelled']).optional(),
});

server.post('/api/actions', async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createActionSchema.parse(request.body);
  const newAction = {
    id: `act-${Date.now()}`,
    title: data.title,
    description: data.description || `Action pédagogique pour ${data.studentName || 'l apprenant'}`,
    promotionName: 'Développeur Web - 2025',
    studentName: data.studentName || 'Sophie Martin',
    assigneeName: data.assigneeName || 'Samir Derardja',
    priority: data.priority,
    status: data.status || 'todo',
    dueDate: data.dueDate,
    createdAt: new Date().toISOString().split('T')[0],
  };

  if (supabase) {
    try {
      await supabase.from('action_items').insert({
        title: newAction.title,
        description: newAction.description,
        priority: newAction.priority,
        status: newAction.status,
        due_date: newAction.dueDate,
      });
    } catch {}
  }

  inMemoryDb.actions.unshift(newAction as any);
  return reply.status(201).send(newAction);
});

server.patch('/api/actions/:id/status', async (request: FastifyRequest<{ Params: { id: string }; Body: { status: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  const { status } = request.body || {};

  if (supabase) {
    try {
      await supabase.from('action_items').update({ status }).eq('id', id);
    } catch {}
  }

  const action = inMemoryDb.actions.find(a => a.id === id);
  if (action) {
    action.status = status as any;
  }

  return { success: true, id, status };
});

// --- MODULE ENTRETIENS ---
server.get('/api/interviews', async () => {
  if (supabase) {
    const { data, error } = await supabase.from('interviews').select('*');
    if (!error && data) return data;
  }
  return inMemoryDb.interviews;
});

const createInterviewSchema = z.object({
  title: z.string().min(3),
  studentName: z.string().optional(),
  date: z.string(),
  type: z.string().optional(),
  location: z.string().optional(),
});

server.post('/api/interviews', async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createInterviewSchema.parse(request.body);
  const newInterview = {
    id: `int-${Date.now()}`,
    title: data.title,
    studentName: data.studentName || 'Thomas Dubois',
    role: 'Apprenant',
    date: data.date,
    type: data.type || 'apprenant_individuel',
    status: 'scheduled',
    location: data.location || 'Bureau Coordination B201',
  };

  inMemoryDb.interviews.unshift(newInterview as any);
  return reply.status(201).send(newInterview);
});

// --- MODULE SESSIONS & PROTECTION STRICTE NEVEA ---
const updateSessionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

server.patch('/api/sessions/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  
  // Exemple de session protégée Nevea (lecture seule absolue)
  if (id === 'session-nevea-01' || id.startsWith('55555555') || id.includes('nevea')) {
    const error: any = new Error('ASTON_ERR_READONLY: Les cours officiels issus de Nevea sont strictement en lecture seule et ne peuvent pas être modifiés depuis Aston Campus.');
    error.code = 'ASTON_ERR_READONLY';
    error.statusCode = 403;
    throw error;
  }

  const payload = updateSessionSchema.parse(request.body);
  return {
    success: true,
    message: 'Séance locale mise à jour avec succès',
    session: { id, ...payload },
  };
});

// --- MODULE NEVEA CSV IMPORT ASSISTANT ---
// --- MODULE NEVEA CSV IMPORT & ANALYSE D'ALERTES EN TEMPS RÉEL ---
server.post('/api/attendance/import-nevea-csv', async (request: FastifyRequest<{ Body: { rows?: any[] } }>) => {
  const incomingRows = request.body?.rows || [
    { studentName: 'Alexandre Martin', promo: 'Helpline 40', date: '2026-11-11', status: 'late', lateMinutes: 25 },
    { studentName: 'Camille Girard', promo: 'Promotion XEFI', date: '2026-11-11', status: 'absent', justified: false },
    { studentName: 'Lucas Mercier', promo: 'DW2025', date: '2026-11-11', status: 'present' },
  ];

  const generatedAlerts: any[] = [];
  
  for (const r of incomingRows) {
    if (r.status === 'absent' && !r.justified) {
      const alert = {
        id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentName: r.studentName,
        promotionName: r.promo,
        type: 'absence_repetition',
        severity: 'critical',
        title: `Absence non justifiée : ${r.studentName} (${r.promo})`,
        description: `Absence enregistrée via export Nevea. Aucun justificatif sous 48h.`,
        status: 'open',
        triggeredAt: 'À l instant',
      };
      generatedAlerts.push(alert);
      inMemoryDb.alerts.unshift(alert as any);
    } else if (r.status === 'late' && (r.lateMinutes || 0) >= 15) {
      const alert = {
        id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        studentName: r.studentName,
        promotionName: r.promo,
        type: 'retard_repetition',
        severity: 'high',
        delayMinutes: r.lateMinutes,
        title: `Retard répété (+${r.lateMinutes} min) : ${r.studentName} (${r.promo})`,
        description: `Retard consécutif détecté. Signalement tuteur recommandé.`,
        status: 'open',
        triggeredAt: 'À l instant',
      };
      generatedAlerts.push(alert);
      inMemoryDb.alerts.unshift(alert as any);
    }
  }

  return {
    success: true,
    processedCount: incomingRows.length,
    alertsCreated: generatedAlerts.length,
    newAlerts: generatedAlerts
  };
});

server.post('/api/nevea/preview-csv', async () => {
  return {
    rowsTotal: 4,
    validRows: 4,
    detectedDuplicates: 2,
    preview: [
      { neveaId: 'NEVEA-ST-101', nom: 'Dubois', prenom: 'Thomas', promo: 'DW2025', action: 'update' },
      { neveaId: 'NEVEA-ST-102', nom: 'Martin', prenom: 'Sophie', promo: 'DW2025', action: 'update' },
      { neveaId: 'NEVEA-ST-106', nom: 'Belkacem', prenom: 'Sami', promo: 'PROMO-ESD-2025-P1', action: 'insert' },
      { neveaId: 'NEVEA-ST-107', nom: 'Faure', prenom: 'Inès', promo: 'PROMO-ESD-2025-P1', action: 'insert' },
    ],
  };
});

// Démarrage du serveur si exécuté directement
const PORT = Number(process.env.PORT) || 3001;

export const startServer = async () => {
  try {
    await server.listen({ port: PORT, host: '0.0.0.0' });
    server.log.info(`API Aston Campus démarrée sur http://localhost:${PORT}`);
    return server;
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test' && !process.env.TEST_MODE) {
  startServer();
}

export default server;
