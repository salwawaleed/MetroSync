require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('../app');
const Admin = require('../models/Admin');
const Station = require('../models/Station');

let stationId;
let token;

describe('MetroSync API integration', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required to run integration tests. Copy .env.example to .env first.');
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required for integration tests.');

    await mongoose.connect(process.env.MONGO_URI);
    await Station.deleteMany({});
    const stations = await Station.insertMany([
      { name: 'Central Station Test', line: 'Blue Line', order: 1 },
      { name: 'Park Street Test', line: 'Blue Line', order: 2 },
    ]);
    stationId = stations[0]._id.toString();

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL.toLowerCase() },
      { email: process.env.ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /api/v1/stations returns 200 and sorted array', async () => {
    const res = await request(app).get('/api/v1/stations');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].order).toBe(1);
  });

  test('valid admin login returns a JWT', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('invalid login is rejected', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: process.env.ADMIN_EMAIL,
      password: 'definitely-wrong',
    });
    expect(res.status).toBe(401);
  });

  test('login validation rejects malformed input before auth logic', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'not-an-email', password: '' });
    expect(res.status).toBe(400);
  });

  test('protected POST without token returns 401', async () => {
    const res = await request(app)
      .post(`/api/v1/stations/${stationId}/announcements`)
      .send({ text: 'Test announcement' });
    expect(res.status).toBe(401);
  });

  test('protected POST with admin token creates an announcement', async () => {
    const res = await request(app)
      .post(`/api/v1/stations/${stationId}/announcements`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Blue Line service update' });
    expect(res.status).toBe(201);
    expect(res.body.data.text).toBe('Blue Line service update');
  });

  test('public announcements GET supports pagination', async () => {
    const res = await request(app).get(`/api/v1/stations/${stationId}/announcements?page=1&limit=10`);
    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(1);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
