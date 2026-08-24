# MetroSync Submission Checklist

The codebase is prepared for all eight rubric tasks. These items still require your own accounts/environment or live demonstration.

- [ ] Task 1: Create MongoDB Atlas cluster; copy `.env.example` to `.env`; set `MONGO_URI` and `JWT_SECRET`; keep `.env` out of Git.
- [ ] Task 1: Run `npm install` then `npm run seed`; confirm stations and admin are seeded.
- [ ] Task 1: Run `npm run dev`; confirm `GET /health` returns `{ "status": "ok" }`.
- [ ] Task 2: Verify `GET /api/v1/stations` returns 200 and is sorted by `line`, then `order`.
- [ ] Task 3: Verify admin login returns a JWT and that the database contains the admin with a bcrypt password hash.
- [ ] Task 4: Verify protected announcement creation returns 401 without a token and succeeds with an admin token.
- [ ] Task 5: Verify announcement GET is newest-first and supports `page`, `limit`, and `search`; verify invalid input returns the central JSON error format.
- [ ] Task 6: Open two passenger tabs, join the same station, and verify viewer count changes live. Switch one tab to another station and verify counts update.
- [ ] Task 6: Post an announcement from the admin panel and verify it appears in the passenger tab without refresh.
- [ ] Task 7: Run `npm test` and confirm every test passes.
- [ ] Task 7: Deploy the backend to Render using `render.yaml`; configure production environment variables; verify the public `/health` URL.
- [ ] Task 8: Import `postman_collection.json`, run the requests against the local/deployed API, set the real `stationId` and JWT, and save real examples in Postman.
- [ ] Task 8: Perform the final two-tab live demo.

## Required local `.env`

```env
PORT=3000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=<your admin email>
ADMIN_PASSWORD=<your admin password>
```

Do not commit this file.
