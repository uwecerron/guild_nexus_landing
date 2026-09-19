# Nexus prompt workspace

Start locally: `node preview-server.js`, then open http://127.0.0.1:8791/app.html.
Requires Ollama at http://127.0.0.1:11434 with qwen2.5:7b-instruct for AI drafting. The manual workflow works without it.

The server binds only to loopback and serves an explicit public-file allowlist. The drafting endpoint accepts only the local page origin, bounds input, uses a timeout and one concurrent model request, and validates structured output and source excerpts. Model drafts still require human review; excerpt validation does not prove every sentence is correct.

Browser saving is opt-in. Existing v1 backups remain supported. Copying does not send; “I sent it” records the user's action. Follow-up dates do not schedule background reminders. No accounts, shared storage, or inbox connections are implemented.

Validation: `node --test tests/proposal.test.js tests/workspace.test.js`; with the preview running, `node --test tests/http.test.js`.

Browser verification: real prompt generation, explicit review/date entry, save, copy success, pin/unpin, sent/replied/reopen/done flow, filters, manual entry, edit/discard, persistence across reload, export control, and valid backup restore. Automated checks also cover invalid/duplicate backups, storage toggle, model failure recovery, output grounding and HTTP access restrictions.

Not deployable as static-only AI functionality: preview-server.js and a reachable model service are required. Public hosting needs authenticated workspaces, per-user limits, and a production model backend. Do not publish the private operator graph with this app.

## Hosted preview and authentication

Vercel publishes only the explicit build output. Hosted runtime.json disables AI drafting; the local server overrides that route to enable the local model. The hosted preview has no user authentication, cloud storage, or shared data. Browser saving is not account security. Production AI and data sync require an identity provider, server-side session verification, per-user storage authorization, model credentials, quotas, and revocation. No fake login is displayed.
