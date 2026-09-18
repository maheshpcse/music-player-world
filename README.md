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


## Deploy to GitHub Pages

See [the deployment guide](docs/github-pages-deployment.md) for the GitHub Actions
workflow, live API configuration, and local production build instructions.
GitHub Pages hosts the frontend; the backend and database need separate hosting.

## Deploy the backend to Railway

See [the Railway deployment guide](docs/railway-deployment.md) for Docker deployment,
MySQL variables, migrations, persistent uploads, and the GitHub Pages connection.
