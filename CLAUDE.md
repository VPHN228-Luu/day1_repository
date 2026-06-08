# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Node.js + Express + SQLite CRUD sample app used for the SPELIX Claude Code training (Day 1–2 labs).

## Tech Stack

- **Runtime:** Node.js 18+, npm 9+
- **Web framework:** Express `^4.21.2`
- **Database:** SQLite via `better-sqlite3` `^11.10.0` (synchronous API — no callbacks/promises)
- **Testing:** Jest `^29.7.0` + Supertest `^7.1.0`

## Commands

- `npm install` — install dependencies
- `npm start` (or `node server.js`) — run the server on port 3000 (override with `PORT`)
- `npm test` — run all Jest tests
- `npx jest tests/items.test.js` — run a single test file
- `npx jest -t "rejects a negative price"` — run tests matching a name

## Architecture

- **`server.js` vs `app.js` are deliberately split.** `app.js` builds and exports the Express app *without* binding a port; `server.js` is the only place that calls `listen()`. Tests import `app.js` directly and drive it with Supertest, so no port is opened during `npm test`. Add routes/middleware in `app.js`, not `server.js`.
- **`db.js` exports a single shared `better-sqlite3` connection** (synchronous API — `.prepare().all()/.get()/.run()`, no callbacks/promises). Every route `require('../db')` gets the same instance. The schema (`items` table) is created at module load via `db.exec(CREATE TABLE IF NOT EXISTS ...)`.
- **Test isolation via `DB_PATH=':memory:'`.** `db.js` reads `process.env.DB_PATH` (defaults to `data.db` on disk). Test files set `process.env.DB_PATH = ':memory:'` **before** requiring `app`/`db` (see top line of `tests/items.test.js`) so each run gets a fresh in-memory database. Setting it after the require has no effect.
- **Routes** live in `routes/` and are mounted under a base path in `app.js` (e.g. `app.use('/items', itemsRouter)`); the router itself uses relative paths (`router.get('/')`). Input validation happens inline in the handler, returning `400` with `{ error }` on bad input.

## Naming Conventions

- **Variables / functions:** `camelCase` (`itemsRouter`, `dbPath`, `lastInsertRowid`)
- **File names:** lowercase (`app.js`, `db.js`, `server.js`, `routes/items.js`)
- **Route paths:** lowercase (`/items`, `/healthz`)
- **DB columns:** `snake_case` (`created_at`); JSON response fields mirror the column names

## Conventions

- **Test location:** all tests live in `tests/`, named `*.test.js`. Run all with `npm test`, a single file with `npx jest tests/items.test.js`, or by name with `npx jest -t "..."`.
- Set `process.env.DB_PATH = ':memory:'` at the top of a test file **before** requiring `app`/`db` for a fresh in-memory database.
- Money/price stored as SQLite `REAL`; ids are auto-increment integers.
