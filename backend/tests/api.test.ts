import test from 'node:test';
import assert from 'node:assert';
import server from '../src/server.js';

test('Backend Aston Campus - Test Suite', async (t) => {
  await t.test('GET /health retourne un statut ok', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/health',
    });
    assert.strictEqual(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.strictEqual(body.status, 'ok');
  });

  await t.test('GET /api/promotions retourne les promotions de référence', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/promotions',
    });
    assert.strictEqual(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);
  });

  await t.test('GET /api/students retourne les apprenants avec suivi assiduité', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/students',
    });
    assert.strictEqual(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.ok(Array.isArray(body));
    assert.strictEqual(body[0].firstName, 'Thomas');
  });

  await t.test('POST /api/actions crée et persiste une nouvelle action', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/actions',
      payload: {
        title: 'Atelier de révision algorithmique',
        studentName: 'Thomas Dubois',
        priority: 'high',
        dueDate: '2025-11-30',
      },
    });
    assert.strictEqual(response.statusCode, 201);
    const body = JSON.parse(response.body);
    assert.ok(body.id.startsWith('act-'));
    assert.strictEqual(body.title, 'Atelier de révision algorithmique');
  });

  await t.test('PATCH /api/sessions/:id REJETTE toute modification d un cours Nevea en lecture seule (Code 403 ASTON_ERR_READONLY)', async () => {
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/sessions/session-nevea-01',
      payload: {
        title: 'Tentative de modification cours Nevea',
      },
    });
    assert.strictEqual(response.statusCode, 403);
    const body = JSON.parse(response.body);
    assert.strictEqual(body.code, 'ASTON_ERR_READONLY');
  });

  await t.test('POST /api/actions valide les champs obligatoires avec Zod', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/actions',
      payload: {
        title: 'T', // Trop court (< 3 caractères)
      },
    });
    assert.strictEqual(response.statusCode, 400);
    const body = JSON.parse(response.body);
    assert.strictEqual(body.code, 'ASTON_ERR_VALIDATION');
  });
});
