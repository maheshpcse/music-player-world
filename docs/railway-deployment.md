# Deploy the backend to Railway

The backend runs on Railway with MySQL; the Angular frontend runs on GitHub Pages.
The root `railway.json` selects `backend/Dockerfile`, runs migrations before
deployment, starts the API, and checks `/api/health` before routing traffic.

## Create the services

1. Create a Railway project and add a **MySQL** database service.
2. Add a service from this GitHub repository. Keep its **Root Directory** at the
   repository root (blank or `/`). Railway reads the root `railway.json`.
   Do not set the root directory to `backend`: the backend has a `file:..`
   dependency and the Docker build needs the root `package.json`.
3. In the API service's **Variables**, add the values from
   [backend/.env.production.example](../backend/.env.production.example).
   Railway resolves the database references; use the actual database service name
   if it is not `MySQL`. Keep MySQL on Railway's private network.
4. Generate a strong random `JWT_SECRET` and store it only in Railway Variables.
   Set `CLIENT_URL` to your Pages origin, such as `https://alice.github.io`,
   without the repository path or trailing slash.
5. Attach a Railway volume to the API service at **`/app/backend/uploads`**.
   This matches the paths used for uploads, playback, synchronization, and deletion.
   Use one API replica with this local-volume storage design.
6. Under **Settings > Networking**, generate a public HTTPS domain for the API.
   Set `API_PUBLIC_URL` to that origin, for example
   `https://music-api-production.up.railway.app`, without `/api` or a trailing slash.
   Leave `PORT` unset; Railway injects it and the server listens on it.
7. Deploy, or redeploy after changing variables. A failed migration blocks deployment.
   The production Knex configuration runs migrations; demo seeds are not run.

The Docker image installs only backend production dependencies and includes the
migration CLI. Its build context excludes local environment files, node_modules,
frontend files, logs, and uploaded music. Existing local music is not automatically
transferred: upload it through the app after deployment.

## Connect GitHub Pages

In the GitHub repository's **Settings > Secrets and variables > Actions > Variables**,
set `API_URL` to the public backend origin **with `/api`**, for example
`https://music-api-production.up.railway.app/api`. Rerun the Pages workflow.

| Setting | Example |
| --- | --- |
| Railway `CLIENT_URL` | `https://alice.github.io` |
| Railway `API_PUBLIC_URL` | `https://music-api-production.up.railway.app` |
| GitHub `API_URL` | `https://music-api-production.up.railway.app/api` |
| Browser frontend URL | `https://alice.github.io/music-player/#/library` |

For a custom frontend domain, update `CLIENT_URL` to its HTTPS origin.

## Verify the deployment

- Open `https://YOUR-BACKEND.up.railway.app/api/health`; expect HTTP 200 and status ok.
  This is a process health check, not a database availability check.
- Open `/api/songs` to verify database connectivity after migrations.
- In the Pages app, verify signup/login, upload a song, and play it.
- Redeploy the API and verify that the uploaded song still plays from the volume.

Back up the database and uploads separately. Railway pre-deploy commands have no
mounted volumes; migrations modify the database only. Changes to existing database
schemas should remain compatible with the previous app version during rollout.

## Optional local Docker check

From the repository root:

```sh
docker build -f backend/Dockerfile -t music-player-api .
docker run --rm --env-file backend/.env -p 5000:5000 -v music-player-uploads:/app/backend/uploads music-player-api
```

For this local check, use a database reachable from the container (localhost inside
the container is not your host). The Docker command does not run migrations; Railway
runs them through the configured pre-deploy step.

References: [Railway config as code](https://docs.railway.com/config-as-code),
[MySQL variables](https://docs.railway.com/databases/mysql),
[pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command).
