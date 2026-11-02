# TravelMate – Smart Travel Planning & Destination Discovery
*Explore the World, One Journey at a Time.*

A full-stack travel website: destination explorer, smart trip planner (no AI key needed), favorites, weather, and JWT login.
**Stack:** React + Vite · React Router · Axios · Lucide icons · Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs

## 1. Requirements
- **Node.js 18 or newer** (https://nodejs.org – choose LTS). Check with `node -v`.
- **VS Code** (https://code.visualstudio.com)
- **MongoDB is optional.** Without it the site runs in **demo mode** (see below).

## 2. Run it (VS Code)
1. Unzip `TravelMate.zip`.
2. In VS Code: **File → Open Folder…** and choose the `TravelMate` folder.
3. Open the terminal: **Terminal → New Terminal**.
4. (Optional, for MongoDB/weather) copy the env file:
   - Windows (PowerShell): `copy .env.example .env`
   - macOS / Linux: `cp .env.example .env`
5. Install everything (root + backend + frontend, one command):
   ```
   npm install
   ```
6. Start frontend and backend together:
   ```
   npm run dev
   ```
7. Open **http://localhost:5173** in your browser.

Other scripts: `npm run backend` (API only), `npm run frontend` (website only), `npm run build` (production build), `npm start` (serve API + built site on port 5000).

## 3. Demo mode vs. database mode
| | Demo mode (no MongoDB) | Database mode (MongoDB running) |
|---|---|---|
| Destinations | built-in data | MongoDB (auto-seeded on first start) |
| Accounts / login | saved in your browser (localStorage) | MongoDB, bcrypt-hashed passwords, JWT |
| Favorites & saved trips | localStorage | MongoDB |
| Itinerary generator | works | works |

The site switches automatically. If the backend or database is unreachable, nothing crashes.

**Demo login:** `demo@travelmate.com` / `Demo@123` (or press **Use demo account** on the login page).

## 4. MongoDB setup (optional)
**Option A – Local:** install *MongoDB Community Server* (https://www.mongodb.com/try/download/community), keep it running, and use the default in `.env`:
`MONGODB_URI=mongodb://127.0.0.1:27017/travelmate`

**Option B – Free cloud (Atlas):** create a free cluster at https://www.mongodb.com/atlas, add a database user, allow your IP under *Network Access*, copy the connection string into `MONGODB_URI` in `.env`.

Restart `npm run dev`. The terminal shows `✅ MongoDB connected`. Set `JWT_SECRET` in `.env` to any long random text.

## 5. Weather (optional)
Get a free key at https://openweathermap.org/api and set `OPENWEATHER_API_KEY` in `.env`. Without a key, friendly demo weather is shown.

## 6. Features
Home page · Destination explorer (search, country / budget / travel-type filters, sorting) · Destination details with weather and sample itinerary · Explore by travel type · Trip planner with itinerary and cost breakdown (transport, hotel, food, attractions) · Register / Login / Logout / Profile · Favorites · Saved trips · Responsive design.

## 7. Project structure
```
TravelMate/
├── package.json          root scripts (concurrently)
├── .env.example
├── backend/
│   ├── server.js         Express app
│   ├── config/db.js      MongoDB connection + seeding
│   ├── controllers/      auth, destinations, trips, favorites, weather
│   ├── routes/  middleware/  models/ (User, Trip, Destination)
│   └── data/             destinations.js, itinerary.js (rule-based planner)
└── frontend/
    ├── vite.config.js    dev proxy: /api → localhost:5000
    └── src/
        ├── pages/ components/ context/ services/ utils/
        └── data/         same destination + itinerary files for demo mode
```

## 8. API
`GET /api/health` · `GET /api/destinations` · `GET /api/destinations/:id` · `POST /api/trips/generate` · `GET /api/weather?city=` ·
`POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me` · `GET|POST|DELETE /api/favorites[/:id]` · `GET|POST|DELETE /api/trips[/:id]`
(auth, favorites and saved trips need MongoDB and a Bearer token).

## 9. Troubleshooting
- **Port in use:** change `PORT` in `.env` (and the proxy target in `frontend/vite.config.js`), or stop the other app.
- **`npm install` errors:** check `node -v` is 18+, then delete the `node_modules` folders and run `npm install` again.
- **“MongoDB not available”:** expected without MongoDB – the site still works in demo mode.
- **An image doesn’t load:** a colored placeholder appears automatically. Replace the image URL in `backend/data/destinations.js` **and** `frontend/src/data/destinations.js`.
- Changed destination data? Keep both `destinations.js` files identical (and both `itinerary.js` files).
- Prices are estimates in ₹ for learning and planning only.
