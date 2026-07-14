# Music Player Application

Full-stack music player web application scaffolded with:

- Angular 14 frontend
- Node.js + Express backend
- Knex query manager with MySQL configuration
- Factory API design pattern for controllers, services, and repositories

> Note: the requirements mention MongoDB once, but also require Knex. Knex is a SQL query builder, so this implementation uses MySQL-ready configuration.

## Run Locally

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:4200`  
Backend: `http://localhost:5000/api/health`

## Database

Copy `backend/.env.example` to `backend/.env`, update MySQL credentials, then run:

```bash
npm run migrate --prefix backend
npm run seed --prefix backend
```

