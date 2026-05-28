import request from 'supertest';
import app from '../src/index';
import { prisma, closeDb } from '../src/db';

beforeEach(async () => {
  await prisma.measurement.deleteMany();
  await prisma.viewerState.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => { await closeDb(); });

describe('POST /auth/register', () => {
  it('creates a user and returns a JWT', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('returns 409 if email already exists', async () => {
    await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'password123' });
    const res = await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'other' });
    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/auth/register').send({ email: 'login@example.com', password: 'password123' });
  });

  it('returns a JWT for valid credentials', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'login@example.com', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'login@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
