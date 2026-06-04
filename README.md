# SPELIX Sample CRUD App (Claude Code Training — Day 1)

A minimal Node.js + Express + SQLite CRUD app used in the SPELIX Claude Code
5-day curriculum. Day 1 lab: explore the codebase with Claude Code, add a
`/healthz` endpoint, verify it, and make your first commit.

## Requirements

- Node.js 18+
- npm 9+

## Install

```bash
npm install
```

## Run

```bash
npm start
# or
node server.js
```

The server listens on `http://localhost:3000` (override with `PORT`).

## Test

```bash
npm test
```

Tests live in `/tests` and run with Jest + Supertest against an in-memory
SQLite database.

## API

| Method | Path     | Description                                                  |
| ------ | -------- | ------------------------------------------------------------ |
| GET    | `/items` | Return all items as an array                                 |
| POST   | `/items` | Create an item — body `{ "name": string, "price": number }`  |

### Examples

```bash
curl localhost:3000/items
curl -X POST localhost:3000/items -H "Content-Type: application/json" -d '{"name":"Widget","price":9.99}'
```

## Project layout

```
server.js        entry point (starts HTTP server)
app.js           Express app (exported for tests)
db.js            SQLite connection + schema
routes/items.js  /items routes
tests/           Jest tests
```
