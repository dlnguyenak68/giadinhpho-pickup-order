# Gia Dinh Pho — Online Pickup Orders

Online pickup ordering for **[Gia Dinh Pho](https://www.giadinhpho.com/)** — an extension of the restaurant’s existing website so customers can browse the menu and place pickup orders.

## Links

| | |
|---|---|
| **Place a pickup order (live app)** | **[https://giadinhpho-pickup-order-production.up.railway.app](https://giadinhpho-pickup-order-production.up.railway.app)** |
| Restaurant website | [https://www.giadinhpho.com](https://www.giadinhpho.com) |
| Source code | [https://github.com/dlnguyenak68/giadinhpho-pickup-order](https://github.com/dlnguyenak68/giadinhpho-pickup-order) |

| Layer | Tech |
|-------|------|
| Frontend | Create React App, React 18 |
| Backend | Node.js, Express |
| Styling | CSS aligned with the restaurant’s Wix site |
| Deploy | Railway (single service) |
| Tests | Jest, Supertest, React Testing Library |

---

## How I Built This App

This is a **monorepo** with a React client and Express API. The backend owns the menu; the frontend fetches it and only renders UI.

### Architecture

```
Browser  →  React (client/)     fetch /api/*
                ↓ proxy (dev) or same origin (prod)
           Express (server/)   menu.js + orders.json
```

1. **Menu** — Stored in `server/data/menu.js`. `GET /api/menu` returns categories and items. `App.js` loads this on mount with `fetch` and passes data to `MenuSection`.
2. **Cart** — Managed in React with `useState`. Subtotal/tax/total use `useMemo`. Adding items updates quantity in the cart array.
3. **Checkout** — `CartPanel` collects customer info. `POST /api/orders` validates on the server, calculates totals, saves to `orders.json`, and returns an order ID.
4. **Confirmation** — `OrderConfirmation` shows the response; user can start a new order.
5. **Production** — `npm run build` compiles React into `client/build`. Express serves the API and static files on one port (Railway’s `PORT`).

### Key design choices

- **Single source of truth for menu** — Only the backend defines items; avoids client/server drift.
- **Server-side validation & pricing** — Totals and tax are computed on the API, not trusted from the client.
- **Component-based UI** — `Header`, `MenuSection`, `CartPanel`, `OrderConfirmation`, `Footer` keep concerns separated.
- **Testable server** — Express app lives in `app.js`; `index.js` only starts the listener so tests can use Supertest without running a server.

---

## Features

- Menu loaded from `GET /api/menu` — frontend only renders it
- Browse menu by category (Phở, Bánh Mì, Appetizers, Drinks)
- Add items to cart with quantity controls
- Checkout with name, phone, pickup time, and special instructions
- Submit order to REST API with confirmation screen
- Orders saved to `server/data/orders.json`
- Deployed to Railway as one service (API + static React build)

---

## Project Structure

```
giadinhpho-pickup-order/
├── client/
│   └── src/
│       ├── components/       # UI components + *.test.js
│       ├── data/pickupTimes.js
│       └── App.js            # state, fetch menu, submit order
├── server/
│   ├── app.js                # Express routes (exported for tests)
│   ├── index.js              # starts server
│   ├── __tests__/api.test.js
│   └── data/
│       ├── menu.js           # menu source of truth
│       └── orders.json       # persisted orders (gitignored)
├── railway.toml
└── package.json              # build + start for deploy
```

---

## Setup

**Requirements:** Node.js 18+ and npm

```bash
git clone git@github.com:dlnguyenak68/giadinhpho-pickup-order.git
cd giadinhpho-pickup-order

npm install --prefix server
npm install --prefix client
```

**Terminal 1 — API (hot reload):**
```bash
npm run dev --prefix server
```

**Terminal 2 — React (hot reload):**
```bash
npm start --prefix client
```

Open [http://localhost:3000](http://localhost:3000). The dev server proxies `/api/*` to port 5001.

For the deployed app, use **[https://giadinhpho-pickup-order-production.up.railway.app](https://giadinhpho-pickup-order-production.up.railway.app)**.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | Menu categories and items |
| POST | `/api/orders` | Create a pickup order |
| GET | `/api/orders` | List all orders |
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

---

## Unit Tests

**16 tests** — run with `npm test` (server + client).

### Server — Jest + Supertest (`server/__tests__/api.test.js`)

| Test | Coverage |
|------|----------|
| `GET /api/health` | Returns `{ status: 'ok', restaurant: 'Gia Dinh Pho' }` |
| `GET /api/menu` | Returns non-empty `categories` and `items` with id, name, price |
| `POST /api/orders` (valid) | Creates order; verifies subtotal, tax (5%), total, status |
| `POST /api/orders` (invalid) | Returns 400 with validation errors (name, phone, items) |
| `GET /api/orders/:id` (found) | Returns the created order |
| `GET /api/orders/:id` (missing) | Returns 404 |

Orders are written to a **temp file** during tests so production data is not touched.

### Client — React Testing Library

| File | Tests | Coverage |
|------|-------|----------|
| `MenuSection.test.js` | 5 | Loading state, error state, renders items, Add button calls `onAddItem`, category tab switch |
| `CartPanel.test.js` | 3 | Empty cart message, cart lines and totals, checkout form submit |
| `OrderConfirmation.test.js` | 2 | Order details displayed, “Place Another Order” button |

### Commands

```bash
npm test              # all 16 tests
npm run test:server   # API only (6)
npm run test:client   # components only (10)
```

---

## Deploy to Railway

One Railway service runs the **API and built React app** together.

1. [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub** → `dlnguyenak68/giadinhpho-pickup-order`
2. Railway uses `railway.toml` (`npm run build` → `npm start`)
3. **Settings → Networking → Generate Domain**

**Live app:** [https://giadinhpho-pickup-order-production.up.railway.app](https://giadinhpho-pickup-order-production.up.railway.app)

**Production:** Express serves `/api/*` and `client/build` on Railway’s `PORT`. Health check: `GET /api/health`.

**Note:** Orders in `orders.json` reset on redeploy unless you add a [Railway Volume](https://docs.railway.com/guides/volumes).

---

## Interview Talking Points

1. **Full-stack flow** — React fetches menu → cart state → POST order → confirmation.
2. **REST API** — Clear routes, server validation, JSON persistence (file-based for now; database for production).
3. **React patterns** — `useState`, `useEffect`, `useMemo`, props, presentational components.
4. **Testing** — API integration tests with Supertest; component tests with RTL.
5. **Deploy** — Single-service Railway setup; same-origin API and UI in production.
6. **Next steps** — PostgreSQL, Stripe payments, kitchen dashboard, auth.

---

## Notes

- Update menu in `server/data/menu.js` only.
- Tax is 5% on the server (adjust for your demo narrative).
- `orders.json` is gitignored; not committed to the repo.
