# Nexus launch pack

Everything to launch today, plus what to publish after. Drafts are starting points, not finished posts — the voice should be yours, and I've flagged where to swap in your own detail.

---

## BEFORE YOU POST ANYTHING — 3 blockers

These take about 30 minutes total and every one of them breaks the launch if skipped.

1. **DNS.** `nexus.tradersguild.global` and `api.tradersguild.global` do not resolve. Verified: only `tradersguild.global` has a DNS record. Right now your canonical URL, your OG preview image, and every agent-discovery URL point at nothing. A Product Hunt or LinkedIn post today sends people to a dead link.
   - Fix: add a CNAME for `nexus` → your Vercel deployment, and `api` → your Railway service. Or, faster: change Railway's `PUBLIC_URL` to `https://guildintelligence-production.up.railway.app` and the landing page's canonical/OG tags to the real Vercel URL.
2. **Telegram bot is dormant.** `TG_BOT_TOKEN` and `TG_OWNER_CHAT_ID` aren't set in Railway, so the bot doesn't answer. Every CTA on the landing page points at that bot. This is the single most visible failure mode: someone clicks through from your post, messages the bot, gets nothing.
3. **Production database is empty.** `/v1/coverage` returns `people: 0`. Payments work, but the free coverage check — the thing that hooks a skeptic — returns "nothing on file" for every query. Load the graph onto the Railway volume first.

**Recommendation:** fix 1 and 2 today, launch on LinkedIn/X today, and hold Product Hunt until 3 is done. PH is a one-shot: you get one launch per product, and the 24-hour ranking window rewards a working demo. Burning it on a version where the hook returns empty is the expensive mistake. LinkedIn and X are repeatable; PH isn't.

---

## Product Hunt

### Timing
Launch 12:01 AM PST on a Tuesday, Wednesday, or Thursday. Midnight gives the full 24-hour ranking window. Avoid Monday and Friday.

### Listing copy

**Name:** Traders Guild Nexus

**Tagline (60 char max):**
> Tell it who you need to reach. It gets you the intro.

Alternates:
> Warm intros into crypto and RWA, for humans and AI agents
> The introduction layer for crypto, RWA, and market making

**Description (260 char max):**
> Nexus opens a network of 9,000+ people and 3,000+ firms across crypto, RWA, and market making. Say who you need to reach; a human reviews it; the target opts in before anything is shared. Nobody gets contacted cold. Agents can use it directly, free.

**Topics:** Artificial Intelligence, Bots, Crypto, Sales, Productivity, API

**First comment (this matters more than the description — it's what people actually read):**

> I run Traders Guild, a crypto/RWA advisory. Over the years the most valuable thing I had wasn't research — it was knowing who to call.
>
> That doesn't scale, and it doesn't survive me being busy. So I built Nexus.
>
> You message it on Telegram and say who you need to reach and why. A human — me — reads every request. If it's a fit, the other side gets asked and has to say yes before either of you learns who the other is. If they pass, you're never told who declined. Nobody gets a cold DM out of this.
>
> The part I care about most: agents can use it directly. Not as a tool sitting behind someone's login — an autonomous agent can apply for access, get human-vetted, and request an introduction on its own initiative. There's an MCP endpoint, an OpenAPI spec, and an x402 payment rail. The free vetted tier is free because I want to see what agents actually ask for.
>
> Try it without paying: message the bot `check` and any company name. It'll tell you honestly whether there's a path there.
>
> Happy to answer anything. Especially interested in what breaks.

### Assets needed
- Thumbnail: 240×240
- Gallery: 3–5 images at 1270×760. Suggested: (1) the landing page hero, (2) a real Telegram exchange showing the check command, (3) the double opt-in flow, (4) the agent/MCP angle.
- A 30–60s screen recording of the actual Telegram conversation beats any static image.

### Day-of
- Reply to every comment within the hour. Comment quality is weighted in 2026 ranking, more than raw upvote count.
- Do not mass-DM for upvotes. It reads worse than it used to and can get you penalized.
- Post the PH link to LinkedIn and X the same morning, but frame it as "we're live" not "please upvote."

---

## LinkedIn post

> For years the most useful thing I owned wasn't a report. It was knowing who to call.
>
> A founder needs a market maker. An RWA issuer needs an allocator who actually understands the structure. A fund needs someone at an exchange who'll pick up. I'd make the introduction, both sides would get something out of it, and none of it was written down anywhere.
>
> That's a terrible way to run a business. It only works when I'm not busy.
>
> So I built Nexus. You tell it who you need to reach and why. I still read every request — that part I'm not automating. If it's a fit, the other side is asked and has to accept before either of you knows who the other is. If they pass, you're never told who declined.
>
> Nobody gets a cold message out of this. That's the whole design.
>
> One thing I'd flag for people building right now: I made it usable by AI agents directly, not just by people. An agent can apply for access, get vetted by a human, and request an introduction on its own. That sounded like a gimmick when I started and it doesn't anymore — the thing agents run out of isn't information, it's someone who'll take the call.
>
> Free to test: message it `check` and a company name, and it'll tell you whether there's a path.
>
> [link]

**Notes:** LinkedIn suppresses posts with links in the body — put the link in the first comment and say "link below" instead. Post Tuesday–Thursday, 8–10am in your audience's timezone. Swap in a real example if you have one you can share without naming anyone.

---

## X thread

**1/**
> For years the most valuable thing I had in crypto wasn't research.
>
> It was knowing who to call.
>
> Today I'm opening that up.

**2/**
> Nexus: tell it who you need to reach in crypto, RWA, or market making. It gets you the introduction.
>
> 9,000+ people. 3,000+ firms.

**3/**
> The rule that makes it work: nobody is contacted cold.
>
> A human reads every request. The target is asked and has to accept. Only then do the two sides learn who the other is.
>
> If they pass, you're never told who declined.

**4/**
> The part I think matters most:
>
> agents can use this directly. Not as a tool behind someone's login — an autonomous agent can apply, get human-vetted, and request an intro on its own initiative.
>
> MCP endpoint. OpenAPI. x402 payments.

**5/**
> The thing agents run out of isn't information.
>
> It's someone who'll take the call.

**6/**
> Test it free. Message the bot:
>
> `check <any company>`
>
> It'll tell you straight whether there's a path there. No card.
>
> [link]

**Notes:** post 9–11am ET Tue–Thu. Reply to your own thread with the PH link if launching same day. Quote-tweet yourself in 48h with the first real result.

---

## Follow-up content plan

The point of this list is to have something to publish while you wait for data. Build/measure/iterate only works if you're producing signal to measure.

### Week 1 — prove it's real
- **Day 2:** The first real (anonymized) introduction. "Someone needed X. Here's what happened." This is the single most persuasive thing you can post and it beats any feature description.
- **Day 4:** Short post on why double opt-in instead of a directory. The argument: a directory sells you names; the reason cold outreach fails isn't missing contact info, it's missing permission.
- **Day 7:** Week-one numbers, posted honestly, including the bad ones. "X checks, Y requests, Z introductions made, N declined." Publishing declines is what makes the rest credible.

### Weeks 2–4 — build the category
- **"What agents actually asked for."** You have the funnel logging this. The first genuinely novel dataset you'll own — what autonomous agents request when they can request anything.
- **The manifesto post.** You already have `/manifesto` written; turn it into a LinkedIn article on why an API should serve agents directly instead of treating them as a human's tool.
- **A teardown of your own funnel.** Where people dropped off, what you changed. Builders reshare this kind of thing.
- **One contrarian post.** Suggested: "Your network isn't an asset until someone else can use it." Ties the product to a real argument rather than a feature.

### Ongoing
- Monthly: anonymized network stats. Repeatable, no creative burden, compounds as proof.
- Any time an intro produces something notable and the parties agree: a short case note.

---

## What to measure, and what silence means

You have `/api/funnel` on the API (owner-only). It reports per-stage counts and unique chats: `page_view → cta_click → bot_start → message → paywall_shown → checkout_started → checkout_completed → intro_requested → introduced`, plus `coverage_check` and `referral_asked`.

Read it like this:

| Pattern | What it means | What to change |
|---|---|---|
| Low `page_view` | Distribution problem. Nobody saw it. | More/better posting; the product isn't the issue yet. |
| `page_view` high, `cta_click` low | The page isn't convincing. | Hero copy and the proof number. |
| `cta_click` high, `bot_start` low | People bounce at Telegram. | Telegram friction is real for non-crypto users; consider a web form. |
| `message` high, `paywall_shown → checkout_started` low | Price or trust objection. | This is where the free `check` should be doing work — is it being surfaced? |
| `checkout_started` high, `completed` low | Checkout friction or sticker shock at the last step. | The 2h abandoned-checkout reminder already fires; look at what the reminder converts. |
| `intro_requested` high, `introduced` low | Your own review bandwidth, or the graph can't actually deliver. | The honest one to watch. If the network can't serve requests, no amount of marketing fixes it. |
| **Total silence everywhere** | Not a product signal. A distribution signal. | Do not iterate on the product. Iterate on getting seen. |

That last row matters most. The common failure is reading zero traffic as "the product is wrong" and rebuilding, when nobody ever saw it. Distinguish those before changing anything.

**Set a decision date.** Two weeks from launch, look at `intro_requested`. If it's zero and `page_view` is meaningful, the offer is wrong. If both are near zero, the distribution is wrong. Different problems, opposite fixes.

---

## How agents find it, and why they'd use it

Three separate questions, and they need different answers.

### 1. How do agents *find* it?

Discovery files, now all served:

| Surface | Path | Purpose |
|---|---|---|
| llms.txt | `/llms.txt` | Human-readable-ish machine docs. Anthropic recommends it. |
| OpenAPI | `/openapi.json` | Full API description for tool generation. |
| MCP | `POST /mcp` | Live tool list — verified working, returns `get_score`, `get_company`, `ask_guild`, `apply_for_vetting`. |
| A2A agent card | `/.well-known/agent-card.json` | The A2A 1.0 standard path (`agent.json` is legacy — both served). |
| Google ARD | `/.well-known/ard.json` | New (June 2026). Crawled, not submitted to. Publishing it *is* the listing. |
| x402 | `/.well-known/x402` | Machine-readable payment offer. |

Plus active listings, in priority order:

1. **Official MCP Registry** — `registry.modelcontextprotocol.io`, free, live. Publish via `mcp-publisher` CLI with a DNS-verified `com.tradersguild` namespace. Remote-only servers supported; no npm package needed. This feeds the other directories, so do it first.
2. **x402 Bazaar / agentic.market** — 23,000+ resources indexed. No submission form: you declare `extensions.bazaar` metadata per route, validate against the CDP endpoint, and settle one real mainnet payment. That settlement is what triggers indexing. Warning: 30 days with no settlement and you're delisted.
3. **Smithery / mcp.so / Glama / PulseMCP** — free. Smithery can only display your tools if `tools/list` works without auth — yours does, so this will work.
4. **a2a-registry.org** — free, DNS-verified, ~10 minutes. Small (169 agents) but it's the only neutral A2A directory.
5. **awesome-agentic-commerce** and **punkpeye/awesome-mcp-servers** — GitHub PRs. The latter fast-tracks agent-authored PRs tagged `🤖🤖🤖`.

Not worth it: TAAFT ($49–347) and similar are human-traffic directories and do close to nothing for agent discovery.

### 2. How does an agent know *how* to use it?

This is what the MCP tool descriptions and `llms.txt` do, and it's worth being deliberate about. An agent decides whether to call a tool almost entirely from its description. The rewritten `llms.txt` now states explicitly what the service answers and — more useful — what it does *not*: "it is a relationship graph, not a data vendor. Do not use it for public company data, price feeds, or anything answerable from public sources." Negative examples prevent wasted calls and bad reviews.

The `representativeQueries` in `ard.json` do the same job for semantic matching. They're written as real requests ("find me an introduction to a crypto market maker") rather than feature names, because that's what gets vector-matched against an agent's actual task.

### 3. Why would an agent use it *at all*?

This is the strategic question and worth being clear-eyed about.

An agent doing diligence or sourcing hits walls that are **social, not informational**. It can read every filing and still be unable to get a market maker on a call. That gap isn't closable with better search — it needs someone with standing in the network to vouch.

So the pitch to an agent is: *this is the API for the part of your task that isn't information retrieval.* Nothing else in an agent's toolchain does this. That's a real wedge, and it's why the free vetted tier is worth keeping open — the first agents through will tell you, by what they ask for, what the actual demand looks like. That data doesn't exist anywhere yet.

The honest caveat: agent-initiated commerce is early. The x402 numbers are real but the ecosystem is young, and most "agents" transacting today are still fairly close to a human. Treat agent discovery as a cheap option on a real trend, not as this quarter's revenue. Humans on Telegram pay the bills now.
