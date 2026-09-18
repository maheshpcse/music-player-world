# Deploy to GitHub Pages

GitHub Pages hosts the Angular frontend. Host the Express API, MySQL database,
and uploaded music storage separately to support login, the library, and uploads.

## Backend setup

On your Node.js host, install with `npm ci --prefix backend`, configure the following
environment variables, run `npm run migrate --prefix backend`, then start with
`npm start --prefix backend`:

```dotenv
NODE_ENV=production
PORT=5000
JWT_SECRET=replace-with-a-long-random-secret
API_PUBLIC_URL=https://api.example.com
CLIENT_URL=https://YOUR-USERNAME.github.io
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=music_player
```

Use your provider's assigned port when required. `CLIENT_URL` must be the frontend
origin only, without a repository path or trailing slash. For custom domains, use
the custom HTTPS origin. `API_PUBLIC_URL` is the backend origin without `/api`;
uploaded audio links use it. Persist `backend/uploads` or use external media
storage. Existing song URLs must also be publicly reachable over HTTPS.
Keep database credentials and JWT secrets on the backend.

## GitHub setup

1. Push the project, including `.github/workflows/deploy-pages.yml`, to GitHub.
2. In **Settings > Pages > Build and deployment**, select **GitHub Actions**.
3. In **Settings > Secrets and variables > Actions > Variables**, add the repository
   variable `API_URL`, for example `https://api.example.com/api` (include `/api`).
   This is a public URL embedded in JavaScript; do not include secrets.
4. Push to `main`, or run **Deploy frontend to GitHub Pages** from the Actions tab.
   For another deployment branch, update the workflow branch filter and the
   `github-pages` environment's allowed branches.
5. Open the deployment URL shown by the workflow.

The workflow installs locked dependencies, builds the optimized frontend, and
publishes only `frontend/dist/music-player-frontend`. GitHub supplies the Pages
base path for project sites, account sites, and configured custom domains.
Configure custom domains in Settings > Pages before rebuilding. No personal access
token or `gh-pages` branch is needed.

Pages builds use hash routes such as `/repository/#/library`, so refreshes and
direct links work without server rewrites. Local development retains its existing
routing and localhost API. Missing or non-HTTPS `API_URL` values fail the Pages
build. Redeploy after changing repository variables.

## Local production build

From the repository root in PowerShell:

```powershell
npm.cmd ci --prefix frontend
$env:API_URL = 'https://api.example.com/api'
$env:PAGES_BASE_PATH = '/'
npm.cmd run build:pages --prefix frontend
```

Serve `frontend/dist/music-player-frontend` with a static HTTP server. To preview a
project site, build with `$env:PAGES_BASE_PATH = '/YOUR-REPOSITORY/'` and serve the
output at that same URL path. API calls require the backend CORS setting to allow
the preview origin. The generated environment file and build output are ignored
by Git.

The workflow uses Node.js 24. Angular 14 is a legacy version; plan an Angular and
dependency upgrade separately.

After deployment, check the landing page, refresh `#/library`, and verify login,
song listing, and audio playback against the live backend. If API calls fail,
check the configured API URL, HTTPS, backend availability, and `CLIENT_URL`.

Reference: [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).


For backend hosting on Railway, follow the [Railway deployment guide](railway-deployment.md).
