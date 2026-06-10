const db = require('./db');

// Returns every row from the items table, ordered by id.
function getAllItems() {
  return db
    .prepare('SELECT id, name, price, created_at FROM items ORDER BY id')
    .all();
}

module.exports = { getAllItems };
