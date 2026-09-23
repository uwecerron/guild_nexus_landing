# Nexus frontend feature map

Last reviewed: 2026-09-22. This file describes the current repository, not the intended roadmap.

## Status vocabulary

- **Implemented**: code and tests exist.
- **Configured**: required production credentials or services are present.
- **Live-verified**: the production user flow was exercised successfully.
- **Planned**: UI, copy, or a draft may exist, but the capability is not operational.

Agents must state these separately. A card labeled “Connect” is not evidence of a configured integration.

## Product surfaces

| Surface | Entry point | Current behavior | Persistence / authority |
|---|---|---|---|
| Landing page | `/`, `index.html` | Explains Nexus and links to workspace, account, CRM skills, and agent docs | Static Vercel output |
| Account | `/account`, `account.js` | Google sign-in entry plus Nexus username fallback; lists legacy account authorizations | Session state comes from `/nexus-api/account` |
| Follow-ups | `/app#followups`, `workspace.js` | Manual or locally prepared draft, review, status tracking, import/export | Browser memory; optional local storage |
| Connected apps | `/app#apps`, `dashboard.js` | Renders backend-reported setup and connection state | `/nexus-api/apps`; never infer from UI alone |
| Messages | `/app#messages` | Loads a bounded provider result only after the user selects a connected source | Read-only provider adapters on backend |
| Meetings | `/app#meetings` | Loads bounded Calendar or Calendly context and can copy it into a follow-up | Read-only provider adapters on backend |
| Follow-up plans | `/app#routines`, `routines.js` | Creates and edits plan drafts | Browser local storage; no schedule or notifications |
| CRM skill pack | `/skills`, `skills/` | Downloadable assistant instructions and offline change-plan validation | Files only; no CRM credentials or execution service |
| Local AI preview | `preview-server.js` | Optional Ollama JSON proposal generation on localhost | Local process only; production drafting is not provided by Vercel |

## Identity presentation

Google sign-in is live on the backend, but the frontend currently receives and displays the internal Nexus username. Real Google display name, verified email fallback, and profile image are **planned**. Do not fake these fields from a provider connection card.

## Connected app presentation

`dashboard.js` recognizes Gmail, Google Calendar, Calendly, Telegram, Slack, and LinkedIn. The backend decides `configured` and `connection`; the frontend must retain these distinctions:

- Not signed in: invite the user to sign in.
- Signed in, not configured: setup required.
- Configured, not connected: offer provider authorization.
- Connected: show the returned account name and allow a deliberate disconnect.
- Read failure or revoked token: explain that reconnection may be required.

Discord exists in the backend's older identity-authorization layer and is not yet a workspace Connected App. Adding it requires an explicit API contract and capability wording; Discord identity does not grant message history.

## Data and action boundaries

- Provider content is loaded on demand and is not copied into browser storage until the user creates a follow-up from it.
- “Create follow-up” copies source context into a review form. It does not send a message.
- External URLs must be HTTPS and open with `noopener noreferrer`.
- The connected count includes backend-confirmed active connections only.
- Google sign-in authenticates Nexus; it does not authorize Gmail or Calendar access.
- Plans are drafts. Do not describe their time fields as active schedules.

## Backend contract

Production requests matching `/nexus-api/:path*` are rewritten by `vercel.json` to `https://guildintelligence-production.up.railway.app/nexus/:path*`.

Important reads and mutations:

- `GET /nexus-api/login/options`: identity-provider availability.
- `POST /nexus-api/login/google/start`: starts Google identity login.
- `GET /nexus-api/account`: current Nexus session and legacy authorizations.
- `GET /nexus-api/apps`: workspace app catalog and verified connection rows.
- `POST /nexus-api/apps/:provider/connect`: starts a workspace provider flow.
- `GET /nexus-api/apps/:provider/items`: reads bounded provider context.
- `POST /nexus-api/apps/:provider/disconnect`: removes the stored workspace connection.

Coordinate contract changes with the backend repository at `/Users/uwecerron/Desktop/home/nexus-auth-release` and update both feature maps.

## Verification

Run:

```sh
npm test
npm run build
git diff --check
```

Tests cover follow-up state, import/export, proposal grounding, account recovery UI, connection-state rendering, plan drafts, and CRM plan validation. Add tests when introducing a new state or backend response field. The build output is `dist/`; source files remain the edit targets.

Production is `https://nexus.tradersguild.global`, deployed through the existing Vercel project. Verify routes and downloads after deployment. Do not commit `.vercel` credentials or environment values.
