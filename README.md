# Gia Dinh Pho — Pickup Order App

A simple full-stack demo for **online pickup orders** at [Gia Dinh Pho](https://www.giadinhpho.com/), built for interview demonstrations.

- **Frontend:** Create React App (`react-scripts`)
- **Backend:** Node.js + Express
- **Styling:** Matches the Wix site — pink accent (`#c2185b`), dark gray nav, script headings, typewriter body text

## Features

- Menu loaded from backend API (`GET /api/menu`) — frontend only renders it
- Browse menu by category (Phở, Bánh Mì, Appetizers, Drinks)
- Add items to cart with quantity controls
- Checkout with name, phone, pickup time, and special instructions
- Submit order to REST API
- Order confirmation with order ID
- Orders saved to `server/data/orders.json`

## Project Structure

```
giadinhpho-pickup-order/
├── client/          # React app (Create React App)
│   └── src/
│       ├── components/
│       └── App.js
├── server/          # Express API
│   ├── index.js
│   └── data/
└── README.md
```

## Setup

**Requirements:** Node.js 18+ and npm

### Option A — Use this project as-is (recommended)

```bash
cd /Users/dongnguyen/Documents/giadinhpho-pickup-order

# Install dependencies
npm install --prefix server
npm install --prefix client

# Terminal 1 — start API with hot reload (port 5001)
npm run dev --prefix server

# Or without hot reload:
# npm start --prefix server

# Terminal 2 — start React app (port 3000)
npm start --prefix client
```

Open [http://localhost:3000](http://localhost:3000). The React dev server proxies API calls to the backend.

### Option B — Regenerate client with create-react-app

If you prefer running the official CRA generator:

```bash
npx create-react-app client
# Then copy src/, public/index.html fonts link, and package.json proxy from this repo
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | Menu categories and items |
| POST | `/api/orders` | Create a pickup order |
| GET | `/api/orders` | List all orders (demo/admin) |
| GET | `/api/orders/:id` | Get one order |

### Example POST `/api/orders`

```json
{
  "customerName": "Jane Doe",
  "phone": "(907) 222-1234",
  "email": "jane@email.com",
  "pickupTime": "6:00 PM",
  "specialInstructions": "Extra lime",
  "items": [
    { "id": "pho-tai", "name": "Phở Tái", "price": 14.95, "quantity": 2 }
  ]
}
```

## Interview Talking Points

1. **Separation of concerns** — React UI vs Express API; menu data could later move to a database.
2. **REST API design** — POST for creating orders, GET for retrieval, validation on the server.
3. **React state** — Cart managed with `useState`; totals computed with `useMemo`.
4. **User experience** — Form validation, loading state, error messages, order confirmation.
5. **Styling** — CSS variables and fonts aligned with the existing Wix brand.
6. **Possible next steps** — Payment (Stripe), kitchen dashboard, email/SMS notifications, auth for staff.

## Deploy to Railway

One Railway service runs the **API and the built React app** together.

### Steps

1. Sign in at [railway.com](https://railway.com) and create a **New Project**.
2. Choose **Deploy from GitHub repo** → select `dlnguyenak68/giadinhpho-pickup-order`.
3. Railway detects the root `package.json` and `railway.toml` automatically.
4. Deploy. No extra environment variables are required for a basic deploy.
5. Open the generated **public URL** (Settings → Networking → Generate Domain).

### How production works

- **Build:** `npm run build` installs dependencies, builds the React app into `client/build`, and installs server dependencies.
- **Start:** `npm start` runs Express with `NODE_ENV=production`.
- Express serves `/api/*` and static files from `client/build` on the same port (Railway’s `PORT`).

### Health check

`GET /api/health` — used by Railway to verify the service is up.

### Notes on Railway

- **Orders** are stored in `server/data/orders.json` on the container disk. They reset when the service redeploys unless you add a [Railway Volume](https://docs.railway.com/guides/volumes) mounted at `/app/server/data`.
- For a real restaurant app, use a database (PostgreSQL on Railway) instead of a JSON file.

## Notes

- Menu data lives only on the backend — update `server/data/menu.js` to change what the app displays.
- Tax is calculated at 5% on the server (Alaska has no state sales tax; adjust as needed for your demo story).
