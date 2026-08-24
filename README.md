# MetroSync — Real-Time Metro Announcement Dashboard

MetroSync is a Node.js/Express + Socket.io backend for a real-time metro information system backed by MongoDB. It serves a passenger view and an admin panel.

## Rubric coverage

### Task 1 — Project Setup & Database
- MongoDB/Mongoose connection happens before the HTTP server starts.
- Connection success/failure is logged clearly.
- `.env.example` is provided; `.env` is ignored by Git.
- `npm run seed` inserts the station list and creates/updates the admin with a bcrypt password hash.
- `/health` returns a JSON status.

### Task 2 — Stations API
- `GET /api/v1/stations`
- Database access is kept in `services/stationService.js`.
- Stations are sorted by `line`, then `order`.

### Task 3 — Admin Authentication
- `POST /api/v1/auth/login`
- Admin is loaded from MongoDB.
- Password is verified with `bcrypt.compare` against the stored hash.
- JWT contains admin `id` and `role` and uses `JWT_SECRET` from `.env`.
- Login uses validation and a rate limiter.

### Task 4 — Auth Middleware & Protected Routes
- `requireAdmin` reads `Authorization: Bearer <token>`.
- Invalid/missing tokens are rejected.
- Only `role: admin` can create announcements.
- Station and announcement reads are public.

### Task 5 — Announcements API & Validation
- `GET /api/v1/stations/:stationId/announcements`
- Newest-first ordering with `page`, `limit`, and `search` query parameters.
- `POST /api/v1/stations/:stationId/announcements` is admin-only.
- Announcement contains `text`, `stationId`, and timestamps.
- `express-validator` validates request input and station IDs.
- A central error handler returns consistent JSON errors.

### Task 6 — Socket.io
- `joinStation` moves a passenger between station rooms.
- Viewer counts are maintained per station.
- `presenceUpdate` is emitted live.
- Successful announcement creation broadcasts to the station room.
- Admin presence watching does not increment the passenger viewer count.

### Task 7 — Testing & Deployment
- Jest + Supertest integration tests cover health, stations, login, validation, protected POST, and announcements.
- `render.yaml` is included for Render deployment.
- Render deployment still requires the student's own Render account and production environment variables.

### Task 8 — Verification & Demo
- `postman_collection.json` covers health, login, stations, announcement listing, and protected announcement creation.
- Passenger and admin browser pages are included for the two-tab real-time demo.

## Setup

1. Create a MongoDB Atlas cluster.
2. Copy `.env.example` to `.env`.
3. Set `MONGO_URI` to the Atlas connection string.
4. Set a strong `JWT_SECRET`.
5. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` for the admin account that will be seeded.
6. Install dependencies:

```bash
npm install
```

7. Seed stations and the admin account:

```bash
npm run seed
```

8. Start the server:

```bash
npm run dev
```

Passenger view: `http://localhost:3000/`

Admin panel: `http://localhost:3000/admin.html`

## Tests

Make sure `.env` points to a test-safe MongoDB database/cluster, then:

```bash
npm test
```

## API

- `GET /health`
- `POST /api/v1/auth/login`
- `GET /api/v1/stations`
- `GET /api/v1/stations/:stationId/announcements?page=1&limit=10&search=delay`
- `POST /api/v1/stations/:stationId/announcements` with `Authorization: Bearer <JWT>`

Create announcement body:

```json
{
  "text": "Service update at Central Station."
}
```

## Socket.io events

Passenger client -> server:
- `joinStation` with a station ID

Admin client -> server:
- `watchPresence` with a station ID

Server -> clients:
- `announcement`
- `presenceUpdate`

## Postman

Import `postman_collection.json` into Postman. Set the collection variables `baseUrl`, `adminEmail`, `adminPassword`, `stationId`, and `token` as needed. Save real responses/examples in Postman after running the requests against your local or deployed API.

## Render deployment

The included `render.yaml` defines the web service and `/health` health check. In Render, configure:

- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

After deployment, verify:

```text
https://YOUR-RENDER-SERVICE.onrender.com/health
```

The expected response is JSON with `status: "ok"`.

## Security notes

- Never commit `.env`.
- Never commit MongoDB credentials or JWT secrets.
- The seed script stores the admin password only as a bcrypt hash.
