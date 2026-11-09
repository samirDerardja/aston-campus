import test from 'node:test';
import assert from 'node:assert';
import server from '../src/server';

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

