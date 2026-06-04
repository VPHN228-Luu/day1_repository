process.env.DB_PATH = ':memory:';

const request = require('supertest');
const app = require('../app');

describe('GET /items', () => {
  it('returns an array', async () => {
    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /items', () => {
  it('creates an item with name and price', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Widget', price: 9.99 });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Widget', price: 9.99 });
    expect(res.body.id).toBeDefined();
  });

  it('returns the created item in subsequent GET /items', async () => {
    await request(app).post('/items').send({ name: 'Gadget', price: 5 });
    const res = await request(app).get('/items');
    const names = res.body.map((i) => i.name);
    expect(names).toContain('Gadget');
  });

  it('rejects a missing name', async () => {
    const res = await request(app).post('/items').send({ price: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/name/);
  });

  it('rejects an empty name', async () => {
    const res = await request(app).post('/items').send({ name: '  ', price: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects a missing price', async () => {
    const res = await request(app).post('/items').send({ name: 'NoPrice' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/price/);
  });

  it('rejects a non-numeric price', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'BadPrice', price: 'free' });
    expect(res.status).toBe(400);
  });

  it('rejects a negative price', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Negative', price: -1 });
    expect(res.status).toBe(400);
  });
});
