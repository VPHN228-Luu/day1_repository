# SPELIX Sample CRUD App (Claude Code Training — Day 1)

A minimal Node.js + Express + SQLite CRUD app used in the SPELIX Claude Code
5-day curriculum. Day 1 lab: explore the codebase with Claude Code, add a
`/healthz` endpoint, verify it, and make your first commit.

## Curriculum repositories

| Day | Lab | Repository |
| --- | --- | ---------- |
| 1–2 | Sample CRUD app (`/healthz`, CLAUDE.md, `/products`) | this repo |
| 3   | Brownfield refactor (legacy module) | [day3_repository](https://github.com/yic-mes/day3_repository) |
| 4   | Custom command + sub-agent + MCP (starter templates) | [day4_repository](https://github.com/yic-mes/day4_repository) |
| 5   | Capstone mini project (Option A/B/C specs) | [day5_repository](https://github.com/yic-mes/day5_repository) |

## Prerequisites

- No code from a previous day is required — this is the starting repo.
- Node.js 18+, npm 9+, Git configured
- Claude Code installed and logged in:
  `npm install -g @anthropic-ai/claude-code` → `claude --version` → `claude` + `/login`

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

Unit tests (Jest + Supertest, in-memory SQLite — tests live in `/tests`):

```bash
npm test
```

Manual API check — with the server running, open another terminal:

```bash
# list items
curl localhost:3000/items

# create an item
curl -X POST localhost:3000/items -H "Content-Type: application/json" -d '{"name":"Widget","price":9.99}'
```

> Windows PowerShell: `curl` is an alias of `Invoke-WebRequest` — use `curl.exe` instead:
>
> ```powershell
> curl.exe localhost:3000/items
> curl.exe -X POST localhost:3000/items -H "Content-Type: application/json" -d "{\"name\":\"Widget\",\"price\":9.99}"
> ```

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
