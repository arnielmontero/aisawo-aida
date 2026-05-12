# SAWO Chat Widget

An embeddable AI chat widget (Maya) for the SAWO Inc. website, powered by OpenRouter and backed by a Vercel serverless API with a Turso (libSQL) database.

---

## How it works

```
External site
  └── loads sawo-chat-widget.js from aisawo.vercel.app
        └── user sends message
              └── POST https://aisawo.vercel.app/api/chat
                    └── fetches system prompt + knowledge base from Turso
                          └── calls OpenRouter → returns reply to widget
```

The API key never touches the browser — it lives in Turso and is fetched server-side on every request.

---

## Project structure

```
├── api/
│   ├── chat.js                  # Public chat endpoint (called by the widget)
│   └── admin/
│       ├── config.js            # GET/PUT AI settings and system prompt
│       ├── knowledge.js         # GET/POST knowledge base sections
│       ├── knowledge/[id].js    # PUT/DELETE a single section
│       └── seed.js              # POST — reset DB to SAWO defaults
├── lib/
│   ├── db.js                    # Turso client + schema helpers
│   └── keyManager.js            # API key rotation logic
├── public/
│   ├── index.html               # Admin panel UI (/admin)
│   └── sawo-chat-widget.js      # Production widget (embed on any site)
├── sawo-chat-widget.js          # Dev/demo widget (calls OpenRouter directly)
├── sawo-demo.html               # Local demo page
├── vercel.json                  # Rewrites /admin → /public/index.html
├── .env                         # Local env vars (not deployed)
└── package.json
```

---

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables.

| Variable | Description |
|---|---|
| `TURSO_URL` | Turso database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `ADMIN_TOKEN` | Password for the admin panel |
| `OPENROUTER_BACKUP_KEY` | Fallback OpenRouter key if primary returns 401 |

> The **primary OpenRouter API key** is stored in Turso (set via the admin panel), not in env vars.

---

## Local development

```bash
npm install
vercel dev
```

Then open:
- `http://localhost:3000` → admin panel
- `http://localhost:3000/admin` → also admin panel (via rewrite)

The `.env` file is loaded automatically by `vercel dev`.

---

## Deploy

```bash
vercel --prod
```

Make sure all environment variables are set in Vercel before deploying.

---

## Admin panel

Go to `/admin` on the deployed URL (or `http://localhost:3000` locally).

- **Knowledge Base tab** — add, edit, delete sections Maya uses to answer questions
- **Config & Prompt tab** — set the OpenRouter API key, model, base URL, max tokens, and Maya's system prompt
- **Re-seed** — reset everything back to SAWO defaults

---

## Embedding the widget

Add this one line before `</body>` on any page:

```html
<script src="https://aisawo.vercel.app/sawo-chat-widget.js"></script>
```

No configuration needed — the widget calls back to the Vercel API automatically.

---

## API endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat` | None | Send a message, get Maya's reply |
| `GET` | `/api/admin/config` | Bearer token | Get current config |
| `PUT` | `/api/admin/config` | Bearer token | Update config / API key |
| `GET` | `/api/admin/knowledge` | Bearer token | List all knowledge sections |
| `POST` | `/api/admin/knowledge` | Bearer token | Add a new section |
| `PUT` | `/api/admin/knowledge/[id]` | Bearer token | Update a section |
| `DELETE` | `/api/admin/knowledge/[id]` | Bearer token | Delete a section |
| `POST` | `/api/admin/seed` | Bearer token | Reset to defaults |

Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Hosting | Vercel (serverless) |
| Database | Turso / libSQL |
| AI | OpenRouter (configurable model) |
| Widget | Vanilla JS, no dependencies |
| Admin UI | Vanilla HTML/CSS/JS |
