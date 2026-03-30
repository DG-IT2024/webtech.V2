# AIMS – Deployment Guide

**AIMS** is a full-stack document management system built with a React/Vite frontend and an Express/TypeScript backend. This guide covers deploying both parts, either locally or to production platforms.

**Production Domains:**
- Frontend: `https://raisesystemph.com`
- Backend API: `https://api.raisesystemph.com`

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Environment Variables](#3-environment-variables)
4. [Local Development Setup](#4-local-development-setup)
5. [Production Build](#5-production-build)
6. [Deploying the Server (Backend)](#6-deploying-the-server-backend)
7. [Deploying the Client (Frontend)](#7-deploying-the-client-frontend)
8. [Post-Deployment Configuration](#8-post-deployment-configuration)
9. [Deployment Checklist](#9-deployment-checklist)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

| Part   | Tech Stack                                         | Directory |
|--------|----------------------------------------------------|-----------|
| Client | React 19, TypeScript, Vite, Bootstrap, Firebase    | `client/` |
| Server | Node.js, Express 5, TypeScript, MongoDB, Firebase  | `server/` |

**External Services Required:**
- MongoDB Atlas (database)
- Firebase (file storage)
- Gmail SMTP (email notifications)
- Google OAuth (authentication)

---

## 2. Prerequisites

Make sure the following are installed on any machine used for deployment or development:

- **Node.js** v18 or later — https://nodejs.org *(this machine: v24.14.0)*
- **npm** v9 or later (comes with Node.js) *(this machine: v11.9.0)*
- **Git** — https://git-scm.com *(this machine: v2.44.0.windows.1)*

Verify installations:

```bash
node --version
npm --version
git --version
```

---

## 3. Environment Variables

Both the client and server require environment variable files. These are NOT committed to source control and must be created manually on each deployment environment.

---

### 3a. Server — `server/.env`

Create the file `server/.env` with the following variables:

```env
# Server
PORT=8080
NODE_ENV=production
CLIENT_URL=https://raisesystemph.com

# MongoDB Atlas connection string
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/AIMS_db?retryWrites=true&w=majority

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Password hashing
SALT_ROUNDS=10

# Firebase project config
API_KEY=your-firebase-api-key
AUTH_DOMAIN=your-project.firebaseapp.com
PROJECT_ID=your-firebase-project-id
STORAGE_BUCKET=your-project.firebasestorage.app
MESSAGING_SENDER_ID=your-sender-id
APP_ID=your-firebase-app-id
MEASURE_ID=G-XXXXXXXXXX
```

> **Note on Gmail SMTP:** Gmail requires an App Password when 2-Factor Authentication is enabled.
> Generate one at: Google Account → Security → App Passwords.

> **Note on MongoDB Atlas:** Ensure your Atlas cluster's Network Access list allows connections from your server's IP address (or `0.0.0.0/0` for all IPs in managed platforms).

---

### 3b. Client — `client/.env`

Create the file `client/.env` with:

```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:8080
```

> For production, replace `VITE_API_URL` with `https://api.raisesystemph.com`.

> The `VITE_` prefix is required. Vite only exposes variables prefixed with `VITE_` to browser code.

---

## 4. Local Development Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/DG-IT2024/webtech.V2.git
cd webtech.V2
```

---

### Step 2 — Set up and run the Server

```bash
cd server
npm install
```

Create `server/.env` as described in [Section 3a](#3a-server--serverenv).

```bash
npm run dev
```

The server starts at `http://localhost:8080`.
All API routes are prefixed with `/aims`.

---

### Step 3 — Set up and run the Client

Open a second terminal:

```bash
cd client
npm install
```

Create `client/.env` as described in [Section 3b](#3b-client--clientenv).

```bash
npm run dev
```

The client starts at `http://localhost:5173`.

---

### Step 4 — Verify the connection

Open your browser to `http://localhost:5173`. The login page should load and be able to communicate with the backend at `http://localhost:8080/aims`.

---

## 5. Production Build

### Server

The server uses **tsx** to run TypeScript directly at runtime — no separate compilation step is needed.

```bash
cd server
npm install
npm start
# Runs: npx tsx server.ts
```

For environments that prefer pre-compiled JavaScript:

```bash
cd server
npx tsc --outDir dist
node dist/server.js
```

---

### Client

The client must be built into static files before serving:

```bash
cd client
npm install
npm run build
```

This creates a `client/dist/` folder containing the compiled, production-ready static assets.

To preview the production build locally before deploying:

```bash
npm run preview
```

---

## 6. Deploying the Server (Backend) — Railway

The project includes a `server/railway.toml` config file for Railway.
The backend will be served at `https://api.raisesystemph.com`.

---

### Step 1 — Deploy to Railway

1. Create a free account at https://railway.app
2. From the Railway dashboard, click **New Project → Deploy from GitHub repo**
3. Select the `webtech.V2` repository
4. Set the **root directory** to `server`
5. Railway auto-detects Node.js. The `railway.toml` handles the build and start:
   ```toml
   [build]
   builder = "nixpacks"

   [deploy]
   startCommand = "./node_modules/.bin/tsx server.ts"
   ```
6. Go to the **Variables** tab and add all variables from [Section 3a](#3a-server--serverenv)
7. Click **Deploy**
8. Railway assigns a default URL (e.g., `https://webtech-production.railway.app`) — note this down

---

### Step 2 — Connect your custom domain

1. In Railway, go to **Settings → Networking → Custom Domain**
2. Add `api.raisesystemph.com`
3. Railway will show a target domain — go to **Namecheap → Advanced DNS** and add:

   | Type | Host | Value |
   |------|------|-------|
   | CNAME Record | `api` | the Railway-provided domain (e.g. `webtech-production.railway.app`) |

4. Railway will verify the domain automatically once DNS propagates

---

## 7. Deploying the Client (Frontend) — Vercel

The client produces static files (`client/dist/`) served via Vercel.
The frontend will be served at `https://raisesystemph.com`.

---

### Step 1 — Update the API URL

Before deploying, ensure `client/.env` points to the deployed backend:

```env
VITE_API_URL=https://api.raisesystemph.com
```

---

### Step 2 — Deploy to Vercel

1. Create an account at https://vercel.com
2. Click **Add New → Project** → import from GitHub
3. Select the `webtech.V2` repository
4. Set the **Root Directory** to `client`
5. Vercel auto-detects Vite. Confirm these settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Under **Environment Variables**, add:
   ```
   VITE_GOOGLE_CLIENT_ID=788681047720-0tb761l73j9i8k6sa4miqkva4vfsqeij.apps.googleusercontent.com
   VITE_API_URL=https://api.raisesystemph.com
   ```
7. Click **Deploy**

---

### Step 3 — Connect your custom domain

1. In the Vercel project dashboard, go to **Settings → Domains**
2. Add `raisesystemph.com`
3. Vercel will show you the DNS records to add — go to **Namecheap → Domain List → Manage → Advanced DNS** and add:

   | Type | Host | Value |
   |------|------|-------|
   | A Record | `@` | `76.76.21.21` *(Vercel's IP — confirm in dashboard)* |
   | CNAME Record | `www` | `cname.vercel-dns.com` |

4. Back in Vercel, click **Verify** — it turns green once DNS propagates (usually within 30 minutes)

---

## 8. Post-Deployment Configuration

### 8a. Update CORS in the Server

The server's CORS origin **must** be updated to match your deployed frontend URL.

Open `server/server.ts` and change:

```typescript
// Before (development only)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
```

```typescript
// After (production)
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://raisesystemph.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
```

The `CLIENT_URL` is already set to `https://raisesystemph.com` in `server/.env`.

---

### 8b. Google OAuth — Authorized Origins

In the Google Cloud Console (https://console.cloud.google.com):

1. Navigate to **APIs & Services → Credentials**
2. Open your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   - `https://raisesystemph.com`
   - `https://www.raisesystemph.com`
4. Under **Authorized redirect URIs**, add:
   - `https://raisesystemph.com`
   - `https://www.raisesystemph.com`
5. Save changes

---

### 8c. MongoDB Atlas — Network Access

1. Log in to https://cloud.mongodb.com
2. Go to **Network Access**
3. Click **Add IP Address**
4. Add your server's IP address, or use `0.0.0.0/0` to allow all (less secure, acceptable for managed platforms where IPs change)

---

### 8d. Firebase — Authorized Domains

1. Go to https://console.firebase.google.com → your project
2. Navigate to **Authentication → Settings → Authorized domains**
3. Add:
   - `raisesystemph.com`
   - `www.raisesystemph.com`

---

## 9. Deployment Checklist

Use this checklist before going live:

### Server
- [ ] `server/.env` created with all required variables
- [ ] `ATLAS_URI` updated with valid MongoDB Atlas credentials
- [ ] MongoDB Atlas Network Access includes server IP
- [ ] Gmail App Password configured for SMTP
- [ ] Firebase credentials are valid and project is active
- [ ] `CLIENT_URL=https://raisesystemph.com` set in environment
- [ ] CORS origin updated in `server/server.ts`
- [ ] `NODE_ENV=production` set in environment
- [ ] Server starts successfully with `npm start`
- [ ] DNS CNAME record for `api.raisesystemph.com` points to hosting platform
- [ ] Test: `GET https://api.raisesystemph.com/aims/employees/allEmployees`

### Client
- [ ] `client/.env` has `VITE_API_URL=https://api.raisesystemph.com`
- [ ] `npm run build` completes without errors
- [ ] `client/dist/` folder generated
- [ ] DNS A/CNAME records for `raisesystemph.com` point to hosting platform
- [ ] Google OAuth Authorized Origins includes `https://raisesystemph.com`
- [ ] Firebase Authorized Domains includes `raisesystemph.com`
- [ ] Login page loads at `https://raisesystemph.com`
- [ ] Test login with credentials and with Google OAuth

---

## 10. Troubleshooting

### "CORS error" in the browser console

The server is rejecting requests from the frontend origin. Verify:
- `CLIENT_URL` environment variable is exactly `https://raisesystemph.com` (no trailing slash)
- The CORS config in `server.ts` uses `process.env.CLIENT_URL`

---

### "Cannot connect to MongoDB"

- Confirm `ATLAS_URI` is correct in `server/.env`
- Check MongoDB Atlas → Network Access — your server IP must be whitelisted
- Verify the database user credentials in the connection string have read/write access

---

### "Firebase: Error (storage/unauthorized)"

- Check that Firebase Storage rules allow reads/writes for authenticated users
- Ensure all `API_KEY`, `PROJECT_ID`, `STORAGE_BUCKET`, and `APP_ID` values in `.env` match your Firebase project

---

### Google OAuth "Error 400: redirect_uri_mismatch"

- Go to Google Cloud Console → OAuth Credentials
- Add `https://raisesystemph.com` to **Authorized JavaScript origins** (no trailing slash)

---

### Email not sending

- Confirm `SMTP_USER` and `SMTP_PASS` are correct
- Use a Gmail App Password — the regular account password will not work if 2FA is enabled
- Check that "Less secure app access" is not required (App Passwords bypass this)

---

### Client shows blank page after deployment

- Confirm `npm run build` ran without TypeScript or ESLint errors
- If using Netlify, confirm the `_redirects` file is present in `client/public/`
- If using Vercel, check the **Output Directory** is set to `dist`

---

### Server not starting on Railway / Render

- Check platform logs for error messages
- Ensure all required environment variables are set in the platform dashboard
- Verify `npm start` works locally with the same environment variables

---

### `api.raisesystemph.com` not resolving

- DNS changes can take up to 24-48 hours to propagate globally
- Verify the CNAME record is correctly set in your domain registrar
- Use https://dnschecker.org to check propagation status

---

*Generated: 2026-03-30*
