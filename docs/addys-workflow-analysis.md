# Addys workflow → Nexus product explanation

Reviewed September 20, 2026. Evidence: official public guides and live sign-in page. Authenticated product has not yet been tested. The supplied code `460D-E9HM` is a referral code, not software source code. It has not yet been redeemed; the extra 30 days and 200+ users are claims in the supplied announcement, not independently verified results.

## Documented Addys workflow

1. Enter through web, Mac app or mobile home-screen app.
2. Create/sign into account. Quick Start advertises a seven-day Spark trial without a card. This is distinct from the supplied referral offer.
3. Connect work apps and explicitly grant scopes.
4. Describe recurring work once and choose a frequency.
5. Meeting context or a routine produces work without a new prompt each time.
6. A common queue combines after-meeting tasks, routines, manual daily tasks and pinned priorities.
7. Review prepared results. Work affecting other people waits for approval.

Telegram uses QR linked-device authorization with optional two-step-verification password. Our existing Telegram OIDC identity implementation is not an equivalent inbox connection.

Sources:
- https://addys.ai/docs/quick-start
- https://addys.ai/docs/how-addys-works
- https://addys.ai/docs/task-types
- https://addys.ai/docs/integrations/telegram

## What makes the explanation effective

One trigger, a concrete deliverable, a visible approval step, and a clear outcome. The page shows a follow-up being prepared rather than asking users to interpret an abstract 'workspace.' A persistent queue explains where work goes and what needs attention.

## Applied to the current Nexus landing page

Promise: Keep your business follow-ups moving.
Category: Business follow-ups, in one place.
Workflow: Add the context → prepare the message → track the reply.
Primary CTA: Create your first follow-up.
Example: partnership conversation → message to Maya → waiting for reply.
Audience: Guild members managing client, partner and event conversations.
Introductions are a secondary service, not a competing main call to action.

The public page explicitly says that writing/sending/status changes are manual today. Hosted AI drafting, connected inboxes, routines and cloud task sync are not available. No claims of automatic sending, reminders or recording.

## Authenticated trial checklist (pending access)

- Complete sign-in and apply the supplied referral; verify displayed plan and expiry rather than assuming the offer succeeded.
- Use synthetic meeting notes or a manually created task to test extraction, editing, provenance and approval.
- Inspect connected-app scope screens. Do not connect real inboxes, calendars or Telegram sessions without authorization for that access.
- Create a routine against synthetic content; inspect schedule, pause, failure and approval behavior before enabling any execution.
- Observe draft editing, cancellation and completion without sending messages to real recipients.
- Record visible behavior separately from marketing/documentation claims.

## Nexus implementation sequence suggested by this comparison

1. Make hosted drafting work against user-provided context, with editable results and source evidence.
2. Add per-user task persistence; browser-local notes are not protected or synchronized by account sign-in.
3. Implement one complete conversation connector before showing a unified inbox. Identity OAuth alone is insufficient.
4. Add a review queue with explicit recipient/channel, approval, send receipts and retry deduplication.
5. Add routines only after sync and approved sending are reliable; include pause, audit and failure states.

The Guild relationship graph could later support relevant introductions based on explicit needs and offers. It must preserve source visibility and permissions; shared group presence is not permission to disclose private conversations.
