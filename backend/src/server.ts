import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { z } from 'zod';

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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };
});

// --- MODULE PROMOTIONS ---
server.get('/api/promotions', async () => {
  return [
    {
      id: '33333333-0000-0000-0000-000000000001',
      code: 'PROMO-TSRS-2025-A',
      name: 'TSRS 2025/2026 - Groupe A',
      cursus: 'Technicien Systèmes Réseaux & Sécurité',
      status: 'active',
      studentsCount: 18,
      neveaReference: 'NEVEA-PR-901',
    },
    {
      id: '33333333-0000-0000-0000-000000000002',
      code: 'PROMO-ESD-2025-P1',
      name: 'Expert Sécurité Digitale 2025/2027',
      cursus: 'Expert En Sécurité Digitale',
      status: 'active',
      studentsCount: 22,
      neveaReference: 'NEVEA-PR-902',
    },
  ];
});

// --- MODULE SESSIONS & PROTECTION NEVEA ---
const updateSessionSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
});

server.patch('/api/sessions/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  
  // Exemple de session protégée Nevea (lecture seule absolue)
  if (id === 'session-nevea-01' || id.startsWith('55555555')) {
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

// --- MODULE ACTIONS CORRECTIVES ---
const createActionSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  promotionId: z.string(),
  assigneeId: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
});

server.post('/api/actions', async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createActionSchema.parse(request.body);
  return reply.status(201).send({
    id: `act-${Date.now()}`,
    ...data,
    status: 'todo',
    createdAt: new Date().toISOString(),
  });
});

// --- MODULE NEVEA CSV IMPORT ASSISTANT ---
server.post('/api/nevea/preview-csv', async (request: FastifyRequest) => {
  return {
    rowsTotal: 4,
    validRows: 4,
    detectedDuplicates: 2,
    preview: [
      { neveaId: 'NEVEA-ST-101', nom: 'Martin', prenom: 'Alexandre', promo: 'PROMO-TSRS-2025-A', action: 'update' },
      { neveaId: 'NEVEA-ST-102', nom: 'Girard', prenom: 'Camille', promo: 'PROMO-TSRS-2025-A', action: 'update' },
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
