const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('supertest');

const testOrdersFile = path.join(os.tmpdir(), `orders-test-${Date.now()}.json`);

process.env.ORDERS_FILE = testOrdersFile;
process.env.NODE_ENV = 'test';

const app = require('../app');

const validOrder = {
  customerName: 'Jane Doe',
  phone: '(907) 222-1234',
  pickupTime: '6:00 PM',
  items: [{ id: 'pho-tai', name: 'Phở Tái', price: 14.95, quantity: 1 }],
};

beforeEach(() => {
  fs.writeFileSync(testOrdersFile, '[]');
});

afterAll(() => {
  if (fs.existsSync(testOrdersFile)) {
    fs.unlinkSync(testOrdersFile);
  }
});

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', restaurant: 'Gia Dinh Pho' });
  });
});

describe('GET /api/menu', () => {
  it('returns categories and items', async () => {
    const res = await request(app).get('/api/menu');

    expect(res.status).toBe(200);
    expect(res.body.categories).toBeInstanceOf(Array);
    expect(res.body.categories.length).toBeGreaterThan(0);
    expect(res.body.items).toBeInstanceOf(Array);
    expect(res.body.items[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });
});

describe('POST /api/orders', () => {
  it('creates an order with totals', async () => {
    const res = await request(app).post('/api/orders').send(validOrder);

    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^[A-F0-9]{8}$/);
    expect(res.body.customerName).toBe('Jane Doe');
    expect(res.body.subtotal).toBe(14.95);
    expect(res.body.tax).toBe(0.75);
    expect(res.body.total).toBe(15.7);
    expect(res.body.status).toBe('received');
  });

  it('returns validation errors for invalid payload', async () => {
    const res = await request(app).post('/api/orders').send({ customerName: '' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toContain('Customer name is required.');
    expect(res.body.errors).toContain('A valid phone number is required.');
    expect(res.body.errors).toContain('At least one menu item is required.');
  });
});

describe('GET /api/orders/:id', () => {
  it('returns an order by id', async () => {
    const created = await request(app).post('/api/orders').send(validOrder);
    const res = await request(app).get(`/api/orders/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('returns 404 when order not found', async () => {
    const res = await request(app).get('/api/orders/NOTFOUND');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Order not found.');
  });
});
