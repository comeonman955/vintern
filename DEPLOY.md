# Vintern — Deployment Guide
## Backend → Render.com · Frontend → Vercel.com

---

## Step 1 — Push to GitHub

Both Render and Vercel deploy from GitHub. Your repo must have this structure:

```
vintern/
├── client/         ← React frontend
├── server/         ← Node.js backend
├── render.yaml
└── package.json
```

Create a repo on github.com, then in your project folder:

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vintern.git
git push -u origin main
```

---

## Step 2 — Deploy Backend on Render.com

### 2.1 Create the service

1. Go to [render.com](https://render.com) → **New +** → **Web Service**
2. Connect your GitHub account and select your `vintern` repo
3. Fill in the settings:

| Field | Value |
|---|---|
| **Name** | `vintern-backend` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

### 2.2 Add Environment Variables

In the Render dashboard → **Environment** tab, add these:

| Key | Value |
|---|---|
| `MONGO_URI` | `mongodb+srv://230008:aqa7kenzhebek@cluster0.q3n2c.mongodb.net/vijmp?appName=Cluster0` |
| `JWT_SECRET` | `internhub_super_secret_jwt_key_2024` |
| `ANTHROPIC_API_KEY` | your key from console.anthropic.com |
| `CLIENT_URL` | *(leave blank for now — fill in after Vercel deploy)* |
| `NODE_ENV` | `production` |

### 2.3 Deploy

Click **Deploy Web Service**. Wait ~2 minutes. When it says **Live**, copy your backend URL:
```
https://vintern-backend.onrender.com
```
You'll need this for the frontend.

> ⚠️ Free Render instances spin down after 15 min of inactivity. First request after idle takes ~30s.

---

## Step 3 — Deploy Frontend on Vercel.com

### 3.1 Create the project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Configure:

| Field | Value |
|---|---|
| **Root Directory** | `client` |
| **Framework Preset** | `Vite` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 3.2 Add Environment Variable

In **Environment Variables** section before deploying:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://vintern-backend.onrender.com` |

> Must start with `VITE_` for Vite to expose it to the browser.

### 3.3 Deploy

Click **Deploy**. Wait ~1 minute. Copy your frontend URL:
```
https://vintern.vercel.app
```

---

## Step 4 — Connect them together

### 4.1 Update CLIENT_URL on Render

Go back to Render → your service → **Environment** → update:

| Key | Value |
|---|---|
| `CLIENT_URL` | `https://vintern.vercel.app` |

Click **Save Changes** — Render will redeploy automatically.

### 4.2 Verify it works

Open your Vercel URL in the browser. Test:
- Register a new account
- Login works
- Jobs load
- AI Assistant responds

---

## Environment Variables Summary

### Server (Render)
```
PORT=5000                          ← set automatically by Render
MONGO_URI=mongodb+srv://...        ← your Atlas connection string
JWT_SECRET=some_long_secret_key
ANTHROPIC_API_KEY=sk-ant-...
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Client (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## Troubleshooting

**CORS errors in browser console**
→ Make sure `CLIENT_URL` on Render exactly matches your Vercel URL (no trailing slash)

**"Failed to fetch" / API not responding**
→ Check Render logs. Free tier may be spinning up — wait 30s and retry.

**Socket.io not connecting**
→ Render free tier supports WebSockets. Make sure `VITE_API_URL` is set correctly on Vercel.

**Build fails on Vercel**
→ Make sure Root Directory is set to `client`, not the repo root.

**MongoDB connection error on Render**
→ In MongoDB Atlas → Network Access → Add `0.0.0.0/0` to allow Render's IPs.
