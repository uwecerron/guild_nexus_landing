# Nexus launch and discoverability checklist

Research summary, August 2026. Sources cited inline; verify anything time-sensitive before acting on it.

## Product Hunt

- Launch Tuesday, Wednesday, or Thursday at 12:01 AM PST. Midnight gives the full 24-hour ranking window.
- 4 to 6 weeks out: build in public. Post progress and screenshots every 2 to 3 days, collect emails from anyone interested.
- In 2026, judging leans on launch quality over raw upvote count: verified accounts, real comment quality, a clear one-line product thesis. Mass outreach for upvotes reads worse than it used to.
- AI tools that are explicit about MCP support, Claude/ChatGPT integration, or agent workflows get disproportionate engagement right now. Nexus qualifies on all three (MCP tool, agent API, free vetted-agent tier).
- If there's a generous free tier, lead with it. Most funded AI tools have dropped free tiers in 2026, so a real one is a wedge, not a footnote. The vetted_agent tier is exactly this.
- Most launches fail after the traffic spike. Plan the 30 days after launch, not just launch day: what specifically should a visitor do (message the bot, apply for vetting), and how is that tracked.

## MCP and agent-specific directories

Submit the MCP server (already spec'd in the agent gateway doc, Section 15) to:
- mcp.so
- smithery.ai
- glama.ai/mcp (auto-indexes from GitHub, but claim the listing)
- A pull request against `punkpeye/awesome-mcp-servers` on GitHub
- The official MCP registry, once live in your region. It's described as the thing that feeds the other directories, so publish there first.

## General AI tool directories

- There's An AI For That (TAAFT) — largest by listing count, has an API, good structured filtering. Worth the submission.
- AI Agents Directory (aiagentsdirectory.com) — agent-specific, actively maintained landscape map as of August 2026.
- Futurepedia — still has traffic but curation has slowed; lower priority.
- Don't over-invest here. Directories are long-tail discovery, not a launch strategy on their own.

## Hacker News / IndieHackers

Not deeply researched this pass, but the standard pattern holds: a "Show HN" post works when it leads with what the thing does in one sentence and links directly to something a reader can try in under a minute (the Telegram bot link does this well). Avoid marketing language; HN's audience penalizes it.

## The underlying growth lesson (from the Emergence AI-native services playbook)

"It's the demo, stupid." AI-native services companies that show the AI working, rather than pitching it, cut sales cycles in half in the cases Emergence studied. The Nexus landing page's "live example" panel already does this. The next lever, once there's real volume, is a real anonymized log of completed introductions instead of a synthetic illustration. That's a stronger demo than the one on the page today, and it's what to build next once there are enough real intros to anonymize safely.

## LinkedIn specifically

There is no Telegram-style bot API for LinkedIn. LinkedIn's policy explicitly bans third-party automation that mimics human behavior (browser extensions, scrapers), and its official Messaging API isn't practically available to a small company outside an enterprise partnership. Compliant "unified messaging API" tools exist, but they operate as your real account (there's no separate bot identity), and heavy automation still carries real ban risk (one 2026 test showed a 23% account-restriction rate within 90 days). The realistic options: a human checks LinkedIn DMs directly, or the LinkedIn button stays a lower-volume, human-monitored channel while Telegram carries the automated load. That also matches the UGC memo's separate conclusion: lead with a real, named, accountable person, not a synthetic one.
