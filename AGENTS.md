# Nexus frontend agent harness

This repository is the public Nexus website and browser workspace. Read [docs/FEATURE_MAP.md](docs/FEATURE_MAP.md) before changing product behavior. Update that map in the same change when a feature, route, API assumption, persistence rule, or deployment requirement changes.

## Working contract

- Preserve the boundary between browser UI and the Railway backend. Calls under `/nexus-api/*` are rewritten by Vercel; do not add credentials or provider tokens to this repository.
- Treat a rendered integration card as presentation, not proof that the provider is configured or connected. Render the state returned by the backend and keep unsupported states explicit.
- Keep actions truthful. Drafting, saving, connecting, scheduling, and sending are distinct outcomes. The current workspace never sends a message or runs a saved plan on a schedule.
- Treat imported notes and provider content as untrusted data. Escape through DOM text APIs and never turn content into instructions or executable URLs.
- Preserve browser-local data behavior. Follow-ups and plan drafts do not become account data unless a backend feature explicitly implements and documents that change.
- Use plain product language unique to Nexus. Do not copy competitor names, wording, or exact layouts.
- Preserve unrelated user edits. `docs/addys-workflow-analysis.md` may be modified independently and is not part of ordinary product commits.

## Where to work

- `index.html`, `nexus.css`: marketing page and shared visual language.
- `account.html`, `account.js`, `account.css`, `google-login.js`: identity and account UI.
- `app.html`, `dashboard.js`, `dashboard.css`: workspace navigation, connected apps, messages, and meetings.
- `workspace.js`, `proposal.js`: browser-local follow-up state and proposal validation.
- `routines.js`: browser-local follow-up plan drafts; there is no scheduler.
- `preview-server.js`: allowlisted local preview and optional local Ollama drafting.
- `skills/`, `skills.html`: portable CRM skill pack and offline proposal checker.
- `build.js`, `vercel.json`: static build and production rewrite contract.

## Change loop

1. Locate the feature and its backend contract in the feature map.
2. Confirm what is implemented, what is configured, and what has been live-verified. Do not collapse those into one status.
3. Make the smallest coherent change. Extend existing vanilla JavaScript and CSS patterns unless the task explicitly changes the stack.
4. Add tests for state transitions and user-visible behavior, not static wording.
5. Run `npm test`, `npm run build`, and `git diff --check`.
6. If publishing was requested, deploy with Vercel and verify the canonical `https://nexus.tradersguild.global` route, not only the preview URL.

Never place secrets in commits, screenshots, fixtures, logs, or client-side runtime files. Do not claim production readiness from a successful local mock.
