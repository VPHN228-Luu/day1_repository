process.env.DB_PATH = ':memory:';

const request = require('supertest');
const app = require('../app');

describe('GET /products', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /products', () => {
  describe('happy path', () => {
    it('creates a product with name and price and returns 201', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Widget', price: 9.99 });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Widget', price: 9.99 });
      expect(res.body.id).toBeDefined();
    });

    it('accepts a price of zero as a non-negative number', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Freebie', price: 0 });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Freebie', price: 0 });
    });

    it('trims surrounding whitespace from the name', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: '  Spaced  ', price: 1 });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Spaced');
    });

    it('assigns a numeric, auto-incrementing id', async () => {
      const first = await request(app)
        .post('/products')
        .send({ name: 'First', price: 1 });
      const second = await request(app)
        .post('/products')
        .send({ name: 'Second', price: 2 });
      expect(typeof first.body.id).toBe('number');
      expect(typeof second.body.id).toBe('number');
      expect(second.body.id).toBe(first.body.id + 1);
    });
  });

  describe('persistence', () => {
    it('returns the created product in a subsequent GET /products', async () => {
      await request(app).post('/products').send({ name: 'Gadget', price: 5 });
      const res = await request(app).get('/products');
      const names = res.body.map((p) => p.name);
      expect(names).toContain('Gadget');
    });

    it('exposes the created product with its assigned id in GET /products', async () => {
      const created = await request(app)
        .post('/products')
        .send({ name: 'Gizmo', price: 3 });
      const res = await request(app).get('/products');
      const found = res.body.find((p) => p.id === created.body.id);
      expect(found).toMatchObject({ id: created.body.id, name: 'Gizmo', price: 3 });
    });
  });

  describe('name validation', () => {
    it('rejects a missing name with 400 and a name error', async () => {
      const res = await request(app).post('/products').send({ price: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/);
    });

    it('rejects an empty-string name', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: '', price: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/);
    });

    it('rejects a whitespace-only name', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: '   ', price: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/);
    });

    it('rejects a non-string name', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 123, price: 1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/);
    });
  });

  describe('price validation', () => {
    it('rejects a missing price with 400 and a price error', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'NoPrice' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/price/);
    });

    it('rejects a non-numeric (string) price', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'BadPrice', price: 'free' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/price/);
    });

    it('rejects a negative price', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'Negative', price: -1 });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/price/);
    });

    it('rejects a NaN price', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: 'NaNPrice', price: 'NaN' });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/price/);
    });
  });

  describe('edge cases', () => {
    it('rejects an empty body with a name error first', async () => {
      const res = await request(app).post('/products').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/name/);
    });

    it('does not create a product when validation fails', async () => {
      const before = await request(app).get('/products');
      await request(app).post('/products').send({ name: '', price: 5 });
      const after = await request(app).get('/products');
      expect(after.body.length).toBe(before.body.length);
    });
  });
});
