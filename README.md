# Azeem Naveed — Video Editor Portfolio

Full-stack portfolio website with React frontend and Express API backend.

## Features

- Single-page portfolio with portfolio filters, showreel, and video modal
- AI chatbot with pricing FAQ and project estimate generator
- Contact form and review submission with backend moderation
- Light/dark theme, legal pages, SEO, and cookie consent

## Quick Start (Development)

```bash
# Install dependencies
npm run install:all

# Terminal 1 — backend API
npm run dev:backend

# Terminal 2 — frontend dev server
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173). API requests are proxied to `http://localhost:3001`.

## Environment Variables

Copy `.env.example` to `.env` in the project root and configure:

| Variable | Description |
|----------|-------------|
| `PORT` | Backend port (default: 3001) |
| `SMTP_*` | Email delivery for contact notifications and estimates |
| `ADMIN_API_KEY` | Required to access review moderation API |
| `CORS_ORIGINS` | Allowed frontend origins in production |
| `VITE_API_URL` | Frontend API base URL (leave empty in dev) |
| `VITE_SITE_URL` | Public site URL for meta tags |

## Production Build

```bash
# Build frontend
npm run build

# Start unified server (serves API + static frontend)
npm run start:prod
```

The backend serves `frontend/dist` when `NODE_ENV=production`.

### Deploy Options

**Option A — Single server (recommended)**
Deploy the whole repo to Railway, Render, or a VPS. Run `npm run build` then `npm run start:prod`.

**Option B — Split deployment**
- Frontend: Vercel/Netlify (set `VITE_API_URL` to your API host)
- Backend: Railway/Render (set `CORS_ORIGINS` to your frontend URL)

## Admin — Review Moderation

```bash
# List all reviews (including pending)
curl -H "x-admin-key: YOUR_ADMIN_KEY" http://localhost:3001/api/reviews/admin

# Approve a review
curl -X PATCH -H "x-admin-key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status":"approved"}' \
  http://localhost:3001/api/reviews/admin/REVIEW_ID
```

## Project Structure

```
├── frontend/          React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── config/    site.js, api.js
│   │   ├── data/      projects, pricing, reviews
│   │   └── pages/
│   └── public/
├── backend/           Express API
│   ├── server.js
│   ├── routes/
│   └── data/          JSON storage (reviews, contacts)
└── package.json       Root scripts
```

## Customization

- **Projects**: Edit `frontend/src/data/projects.js`
- **Showreel**: Update `showreel` in `frontend/src/config/site.js`
- **Social links**: Update `social` in `frontend/src/config/site.js`
- **Profile photo**: Replace `frontend/public/assets/images/profile_azeem.svg` with your photo
- **OG image**: Replace `frontend/public/og-image.svg` with a 1200×630 PNG/JPG for best social sharing

## License

© Azeem Naveed. All rights reserved.
