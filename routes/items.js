const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /items — return all items
router.get('/', (req, res) => {
  const items = db
    .prepare('SELECT id, name, price, created_at FROM items ORDER BY id')
    .all();
  res.json(items);
});

// POST /items — create an item { name, price }
router.post('/', (req, res) => {
  const { name, price } = req.body || {};

  if (typeof name !== 'string' || name.trim() === '') {
    return res
      .status(400)
      .json({ error: 'name is required and must be a non-empty string' });
  }
  if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
    return res
      .status(400)
      .json({ error: 'price is required and must be a non-negative number' });
  }

  const result = db
    .prepare('INSERT INTO items (name, price) VALUES (?, ?)')
    .run(name.trim(), price);

  const item = db
    .prepare('SELECT id, name, price, created_at FROM items WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(item);
});

module.exports = router;
