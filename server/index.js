const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const menu = require('./data/menu');

const app = express();
const PORT = process.env.PORT || 5001;
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

app.use(cors());
app.use(express.json());

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function validateOrder(body) {
  const errors = [];
  if (!body.customerName || !body.customerName.trim()) {
    errors.push('Customer name is required.');
  }
  if (!body.phone || !/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(body.phone.trim())) {
    errors.push('A valid phone number is required.');
  }
  if (!body.pickupTime) {
    errors.push('Pickup time is required.');
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one menu item is required.');
  }
  return errors;
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', restaurant: 'Gia Dinh Pho' });
});

app.get('/api/menu', (req, res) => {
  res.json(menu);
});

app.get('/api/orders', (req, res) => {
  res.json(readOrders());
});

app.get('/api/orders/:id', (req, res) => {
  const order = readOrders().find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const errors = validateOrder(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const subtotal = req.body.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const order = {
    id: uuidv4().slice(0, 8).toUpperCase(),
    customerName: req.body.customerName.trim(),
    phone: req.body.phone.trim(),
    email: req.body.email ? req.body.email.trim() : '',
    pickupTime: req.body.pickupTime,
    specialInstructions: req.body.specialInstructions
      ? req.body.specialInstructions.trim()
      : '',
    items: req.body.items,
    subtotal,
    tax,
    total,
    status: 'received',
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);

  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`Gia Dinh pickup API running on http://localhost:${PORT}`);
});
