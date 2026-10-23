# 🎬 StreamPulse — Full-Stack MERN YouTube Clone

[![GitHub repo](https://img.shields.io/badge/GitHub-tamanna--tech--brain%2FMERN__YOUTUBE__CLONE-181717?style=for-the-badge&logo=github)](https://github.com/tamanna-tech-brain/MERN_YOUTUBE_CLONE.git)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> A high-performance, enterprise-ready **MERN Stack Video Streaming & Sharing Web Application** inspired by YouTube. Features custom HTML5 Pro Player controls, real-time Socket.io live comments, channel subscriptions, watch history tracking, offline downloads, Cloudinary cloud CDN integration, and production-grade security hardening.

---

## 🌟 Key Highlights & Features

- **⚡ Custom Pro Video Player**:
  - Fullscreen toggle, Theatre mode, and Picture-in-Picture (PiP).
  - Variable playback speed controls (`0.5x`, `1x`, `1.25x`, `1.5x`, `2x`).
  - Auto-resume saved playback timestamps via `localStorage`.
  - YouTube keyboard shortcuts: `Space`/`k` (play/pause), `f` (fullscreen), `m` (mute), `t` (theatre), `p` (PiP), `←`/`→` (seek 5s), `↑`/`↓` (volume).
- **💬 Real-Time Live Comments**:
  - Instant bi-directional messaging with **Socket.io** (`send_comment`, `new_comment`, `delete_comment`).
  - Real-time room joining scoped to specific videos (`join_video_room`).
- **🔔 Channel Subscriptions & Likes**:
  - One-click subscribe/unsubscribe toggle with live subscriber count updates.
  - Interactive Like and Dislike counters with state persistence.
- **🛡️ Production Security Architecture**:
  - **Helmet.js** protection with fine-tuned CORS and CSP headers.
  - **Express-Rate-Limit** on authentication routes to mitigate brute-force attacks.
  - **Joi** schema validation on request payloads.
  - HTTP-Only secure cookies and JWT bearer authorization.
- **☁️ Cloud CDN & Local Fallback**:
  - Hybrid asset pipeline: Uploads stream directly to **Cloudinary** when configured, with seamless automated fallback to local storage.
- **📱 YouTube-Class Modern Dark UI**:
  - Built with Tailwind CSS, custom glow effects, responsive collapsible sidebar, category filter pills, and Skeleton loaders.

---

## 🧭 Application Pages & Route Map

| Page | Route | Description | Protected |
|---|---|---|:---:|
| **Dashboard / Home** | `/` or `/dashboard` | Main home feed featuring category pills, recommended video cards, and channel info | No |
| **Explore Movies** | `/movie/get` | Search and browse catalog with server-side pagination | No |
| **Watch & Pro Player** | `/movie/:id` | Full video streaming page with custom player, comments, and recommendations | No |
| **Downloads** | `/download` | Personal library of videos saved for offline viewing | **Yes** |
| **Watch History** | `/history` | Interactive chronological list of previously viewed videos with one-click clear | **Yes** |
| **User Profile** | `/profile` | User channel dashboard displaying uploaded videos, join date, and subscriber count | **Yes** |
| **Create Video** | `/movie/create` | Upload video files and thumbnails, add title, description, tags, cast, and categories | **Yes** |
| **Update Video** | `/movie/update/:id` | Edit metadata, title, description, or thumbnail of an existing video | **Yes** |
| **Categories** | `/category` | Browse all video categories with custom banner cards | No |
| **Category Details**| `/category/:id` | Filter videos associated with a specific category | No |
| **Cast / Creators** | `/cast` | Browse featured creators and actors | No |
| **Cast Details** | `/cast/:id` | Filmography and videos featuring a specific creator or actor | No |
| **Login** | `/login` | Secure JWT authentication with session persistence | No |
| **Register** | `/register` | User sign-up with email OTP validation | No |

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **Library**: React 19 with Vite for ultra-fast HMR and building
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom YouTube dark theme tokens
- **Icons**: Lucide React
- **HTTP Client**: Axios with centralized request/response interceptors
- **Real-Time**: Socket.io Client for live comments without page polling

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.21
- **Database**: MongoDB Atlas via Mongoose 8 ODM
- **WebSockets**: Socket.io 4.8
- **File Uploads**: Multer with hybrid Cloudinary Cloud CDN integration
- **Security**: Helmet, Express-Rate-Limit, Bcrypt password hashing, JWT
- **Email Service**: Nodemailer for OTP account verification

```
┌────────────────────────────────────────────────────────┐
│               React 19 Frontend (Vite)                 │
│  - Pro Video Player  - Dynamic Sidebar  - Feed Grid   │
└───────────────┬────────────────────────▲───────────────┘
                │ HTTP REST API           │ Socket.io
                ▼                         ▼
┌────────────────────────────────────────────────────────┐
│               Express 4.21 Backend                     │
│  - JWT Auth Guard  - Rate Limiter  - Helmet Security   │
└───────┬──────────────────────┬─────────────────────────┘
        │ Mongoose ODM         │ Uploads
        ▼                      ▼
┌─────────────────┐    ┌─────────────────────────────────┐
│ MongoDB Atlas   │    │ Cloudinary CDN / Local Storage  │
│ (Cloud Cluster) │    └─────────────────────────────────┘
└─────────────────┘
```

---

## 📂 Clean Repository Structure

```
MERN_YOUTUBE_CLONE/
├── backend/
│   ├── config/              # Centralized environment config
│   ├── controller/          # Business logic (auth, movie, comment, user, etc.)
│   ├── middleware/          # JWT auth guard, validation, upload middleware
│   ├── models/              # Mongoose schemas (Movie, User, Comment, History, etc.)
│   ├── routes/              # Express API routers
│   ├── utils/               # Mailer, Cloudinary, pagination helpers
│   ├── validators/          # Joi payload validation schemas
│   ├── .env.example         # Backend environment variables template
│   ├── app.js               # Express application setup, security, and CORS
│   ├── db.js                # MongoDB Atlas connection handler
│   ├── package.json         # Backend dependencies & start scripts
│   ├── server.js            # HTTP & Socket.io server entry point
│   └── vercel.json          # Serverless routing config
├── frontend/
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── api/             # Centralized Axios client & API methods
│   │   ├── components/      # Navbar, Sidebar, VideoCard, AuthGuard
│   │   ├── context/         # AuthContext & global state
│   │   ├── pages/           # Application views (Dashboard, Watch, Profile, etc.)
│   │   ├── App.jsx          # Route configuration
│   │   ├── index.css        # Tailwind & global typography
│   │   └── main.jsx         # React DOM mounting
│   ├── .env.example         # Frontend environment variables template
│   ├── index.html           # HTML5 entry with dark theme styling
│   ├── package.json         # Frontend dependencies & build scripts
│   ├── tailwind.config.js   # Tailwind theme customization
│   ├── vercel.json          # SPA rewrite rules for zero-404 navigation
│   └── vite.config.js       # Vite configuration
├── .gitignore               # Comprehensive exclusion rules
├── package.json             # Root orchestration scripts
├── render.yaml              # 1-Click Render deployment blueprint
└── README.md                # Project documentation
```

---

## 📡 REST API Reference

### **Authentication**
- `POST /api/auth/register` — Register a new user account
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/send-otp` — Send email verification OTP
- `POST /api/auth/verify-otp` — Verify registration OTP code

### **Videos / Movies**
- `GET /api/movie/get` — Get all videos with pagination (`?page=1&limit=12&search=`)
- `GET /api/movie/get/:id` — Get single video details with creator metadata
- `POST /api/movie/create` — Upload and publish a video *(Auth required)*
- `PUT /api/movie/update/:id` — Update video metadata *(Auth required)*
- `DELETE /api/movie/delete/:id` — Delete a video *(Auth required)*
- `POST /api/movie/:id/like` — Toggle like status *(Auth required)*
- `POST /api/movie/:id/dislike` — Toggle dislike status *(Auth required)*
- `GET /api/movie/stream/:id` — Stream video file with HTTP range headers

### **Live Comments**
- `GET /api/comment/:movieId` — Fetch all comments for a video
- `POST /api/comment/:movieId` — Post a new comment *(Auth required)*
- `DELETE /api/comment/:id` — Delete user's comment *(Auth required)*

### **Subscriptions & Channels**
- `POST /api/subscription/toggle/:channelId` — Subscribe or unsubscribe *(Auth required)*
- `GET /api/subscription/status/:channelId` — Check current user's subscription status *(Auth required)*
- `GET /api/subscription/count/:channelId` — Get total subscriber count for a channel
- `GET /api/subscription/list` — List channels subscribed by current user *(Auth required)*

### **History & Downloads**
- `GET /api/history` — Get watch history with pagination *(Auth required)*
- `POST /api/history/watch/:movieId` — Log a video view to history *(Auth required)*
- `GET /api/downloads` — Get user's saved offline downloads *(Auth required)*
- `POST /api/downloads/:movieId` — Save video to downloads *(Auth required)*

---

## ⌨️ Pro Player Keyboard Shortcuts

| Shortcut | Action |
|:---:|---|
| <kbd>Space</kbd> or <kbd>K</kbd> | Play / Pause |
| <kbd>←</kbd> / <kbd>→</kbd> | Jump backward / forward 5 seconds |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Increase / decrease volume by 10% |
| <kbd>M</kbd> | Toggle Mute |
| <kbd>F</kbd> | Toggle Fullscreen |
| <kbd>T</kbd> | Toggle Theatre mode |
| <kbd>P</kbd> | Toggle Picture-in-Picture (PiP) |

---

## ⚙️ Environment Variables

### **Backend (`backend/.env`)**
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.d1xtk5s.mongodb.net/youtub_clone
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: Email Service for OTP
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=test@example.com
SMTP_PASS=testpassword
```

### **Frontend (`frontend/.env`)**
```env
# Production: https://your-backend-service.onrender.com/api
# Local Dev:   http://localhost:3000/api
VITE_API_URL=http://localhost:3000/api
```

---

## 💻 Local Quickstart

### 1. Clone the repository
```bash
git clone https://github.com/tamanna-tech-brain/MERN_YOUTUBE_CLONE.git
cd MERN_YOUTUBE_CLONE
```

### 2. Install dependencies
```bash
npm run install:all
```
*(Or install individually: `cd backend && npm install`, then `cd ../frontend && npm install`)*

### 3. Configure environment files
- Copy `backend/.env.example` to `backend/.env` and update your MongoDB URI.
- Copy `frontend/.env.example` to `frontend/.env`.

### 4. Run the application
In terminal 1 (Backend):
```bash
cd backend
npm run dev
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Open **`http://localhost:5173`** in your browser!

---

## 🚀 Production Deployment

### 1. Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and create a **New Web Service**.
2. Connect repository **`tamanna-tech-brain/MERN_YOUTUBE_CLONE`**.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *Your secret key*
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `*` *(or your Vercel URL)*
7. Click **Create Web Service**.

> **Note**: In MongoDB Atlas, verify that **Network Access** includes `0.0.0.0/0` (Allow from anywhere) so Render can connect.

### 2. Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and import **`tamanna-tech-brain/MERN_YOUTUBE_CLONE`**.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`
4. Click **Deploy**.

---

## 📄 License & Credits

Developed by [tamanna-tech-brain](https://github.com/tamanna-tech-brain).  
Licensed under the [MIT License](LICENSE).
