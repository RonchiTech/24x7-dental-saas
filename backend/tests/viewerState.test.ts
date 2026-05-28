import request from 'supertest';
import app from '../src/index';
import { prisma, closeDb } from '../src/db';

let token: string;
const studyUID = '1.2.3.4.5';

beforeEach(async () => {
  await prisma.measurement.deleteMany();
  await prisma.viewerState.deleteMany();
  await prisma.user.deleteMany();
  const res = await request(app).post('/auth/register').send({ email: 'viewer@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => { await closeDb(); });

describe('GET /viewer-state/:studyUID', () => {
  it('returns 404 when no state exists', async () => {
    const res = await request(app).get(`/viewer-state/${studyUID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get(`/viewer-state/${studyUID}`);
    expect(res.status).toBe(401);
  });
});

describe('PUT /viewer-state/:studyUID', () => {
  const payload = {
    stateJson: { viewports: [{ seriesUID: 'abc', windowCenter: 40, windowWidth: 400, zoom: 1, pan: { x: 0, y: 0 } }], activeTool: 'Zoom' },
    measurements: [{ tooth: '14', type: 'paLength', label: 'PA length', value: 21.3, unit: 'mm' }],
  };

  it('upserts viewer state and returns it', async () => {
    const res = await request(app).put(`/viewer-state/${studyUID}`).set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toBe(200);
    expect(res.body.studyInstanceUID).toBe(studyUID);
  });

  it('GET returns saved state after PUT', async () => {
    await request(app).put(`/viewer-state/${studyUID}`).set('Authorization', `Bearer ${token}`).send(payload);
    const res = await request(app).get(`/viewer-state/${studyUID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.stateJson.activeTool).toBe('Zoom');
    expect(res.body.measurements).toHaveLength(1);
    expect(res.body.measurements[0].label).toBe('PA length');
  });
});

describe('GET /viewer-state/:studyUID/export', () => {
  it('returns measurements as a JSON download', async () => {
    await request(app)
      .put(`/viewer-state/${studyUID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ stateJson: { viewports: [], activeTool: 'Zoom' }, measurements: [{ tooth: '14', type: 'paLength', label: 'PA length', value: 21.3, unit: 'mm' }] });
    const res = await request(app).get(`/viewer-state/${studyUID}/export`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.body).toHaveLength(1);
    expect(res.body[0].label).toBe('PA length');
  });
});
