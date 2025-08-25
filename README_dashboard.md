## Clickbait Dashboard - Quickstart

### Run

```bash
npm install
npm run dev
```

### Environment (.env.local)

Create a `.env.local` file in the `clickbait_dashboard` folder with:

```
VITE_API_BASE_URL=http://localhost:3000
```

### Backend Requirements

- The backend must be running at `http://localhost:3000`.
- It must expose its endpoints under the `/api` prefix, e.g.:
  - `POST /api/auth/login`
  - `GET /api/urls`
  - `POST /api/urls`
  - `PATCH /api/urls/:id`
  - `DELETE /api/urls/:id`
  - `GET /api/url` (public)


