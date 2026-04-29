# Insighta Labs+ — Web Portal

The web interface for the **Insighta Labs+ Intelligence Platform**. Built with Next.js 16, this portal provides a secure, role-based dashboard for profile intelligence analysis, natural language search, and administrative controls.

## System Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Browser    │────▶│  Next.js Portal  │────▶│  Backend API  │
│  (Client)    │◀────│  (BFF / Proxy)   │◀────│  (Express)    │
└──────────────┘     └──────────────────┘     └───────────────┘
```

The web portal acts as a **Backend-for-Frontend (BFF)**, proxying all API requests to the backend through server-side route handlers. This architecture ensures:

- **Tokens never reach the browser** — access and refresh tokens are stored in `HttpOnly` cookies
- **CSRF protection** — a JS-readable `csrf_token` cookie is sent as `X-CSRF-Token` header on mutating requests
- **Session persistence** — middleware transparently refreshes expired access tokens using the refresh token

## Authentication Flow

### GitHub OAuth with PKCE

```
1. User clicks "Continue with GitHub"
2. GET /api/auth/login
   → Generates PKCE code_verifier + code_challenge
   → Stores code_verifier in HttpOnly cookie
   → Fetches GitHub auth URL from backend
   → Redirects user to GitHub with code_challenge
3. GitHub redirects back to /api/auth/callback?code=...
   → Reads code_verifier from cookie
   → POST /api/v1/auth/github/callback to backend with code + code_verifier
   → Backend validates PKCE, exchanges code for tokens
   → Sets HttpOnly cookies: access_token (15min), refresh_token (7 days)
   → Sets JS-accessible cookies: csrf_token, user_info (for UI rendering)
   → Redirects to /dashboard
```

### Token Handling

| Cookie | HttpOnly | Purpose | Expiry |
|--------|----------|---------|--------|
| `access_token` | Yes | Bearer token for API calls | 15 minutes |
| `refresh_token` | Yes | Silent token refresh | 7 days |
| `csrf_token` | No | CSRF protection header | 7 days |
| `user_info` | No | Client-side role/name display | 7 days |

**Silent Refresh**: The Next.js middleware intercepts all protected routes. If `access_token` is expired but `refresh_token` exists, it calls `POST /api/v1/auth/refresh` and sets new cookies transparently — the user never sees a login screen.

## Role Enforcement Logic

### Two Roles: `ADMIN` and `ANALYST`

| Feature | Admin | Analyst |
|---------|-------|---------|
| Dashboard (view profiles) | ✅ | ✅ |
| Natural language search | ✅ | ✅ |
| CSV profile export | ✅ | ❌ |
| Delete profiles | ✅ | ❌ |
| Admin panel (users/sessions/audit) | ✅ | ❌ |
| Admin sidebar link | ✅ | ❌ (hidden) |

**Enforcement layers:**
1. **Server-side** (middleware.ts): Auth guard on all `/dashboard`, `/search`, `/admin` routes
2. **Server-side** (page.tsx): Admin page checks `session.user.role === "ADMIN"` and redirects analysts
3. **Client-side** (Sidebar.tsx): Admin nav link conditionally rendered from `user_info` cookie
4. **Client-side** (ProfileTable.tsx): Export button and delete actions hidden for non-admins via `isAdmin` prop

## Features

### Dashboard (`/dashboard`)
- Real-time profile data grid with confidence bars, gender classification, and age tier
- Inline filtering by gender, age group, and sort order via command bar
- Full-text name/location search
- Admin-only CSV export and profile deletion
- Paginated results with total count

### Natural Language Search (`/search`)
- Plain English queries like "men from Nigeria over 30"
- Suggested query templates
- Results displayed in the same high-density data grid

### Admin Panel (`/admin`) — Admin Only
- **Users Tab**: Lists registered users with roles, fetched from `/api/v1/admin/users`
- **Sessions Tab**: Active session monitoring from `/api/v1/admin/sessions`
- **Audit Log Tab**: Request/action log from `/api/v1/admin/audit-logs`

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Styling**: Tailwind CSS 4 with custom design tokens
- **Icons**: lucide-react
- **Auth**: GitHub OAuth 2.0 with PKCE (S256)
- **Session**: HttpOnly cookies + middleware-based silent refresh
- **Security**: CSRF tokens, role-based access control

## Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL and GitHub client ID

# Run development server
pnpm dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL | `http://localhost:3110` |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth App client ID | — |
| `NEXT_PUBLIC_APP_URL` | This portal's public URL | `http://localhost:3000` |

## Project Structure

```
insighta-web/
├── app/
│   ├── page.tsx                    # Login page (GitHub OAuth)
│   ├── layout.tsx                  # Root layout with fonts
│   ├── globals.css                 # Design system tokens
│   ├── (portal)/
│   │   ├── layout.tsx              # Sidebar + main content layout
│   │   ├── dashboard/page.tsx      # Main intelligence dashboard
│   │   ├── search/page.tsx         # Natural language search
│   │   └── admin/page.tsx          # Admin panel (users/sessions/audit)
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # PKCE init → GitHub redirect
│       │   ├── callback/route.ts   # Token exchange → set cookies
│       │   └── logout/route.ts     # Clear all auth cookies
│       └── profiles/
│           ├── [id]/route.ts       # Profile proxy (GET/DELETE)
│           └── export/route.ts     # CSV export proxy
├── components/
│   ├── Sidebar.tsx                 # Navigation with role-based rendering
│   ├── ProfileTable.tsx            # Data grid with admin controls
│   ├── FilterPanel.tsx             # Command bar with custom dropdowns
│   ├── ExportButton.tsx            # CSV export (admin only)
│   ├── SearchBar.tsx               # Natural language search input
│   └── Pagination.tsx              # Page navigation
├── lib/
│   ├── api.ts                      # Server-side fetch with auth headers
│   ├── auth.ts                     # Session reading from cookies
│   ├── pkce.ts                     # PKCE code_verifier/challenge generation
│   └── utils.ts                    # cn() utility
└── middleware.ts                   # Auth guard + silent token refresh
```
