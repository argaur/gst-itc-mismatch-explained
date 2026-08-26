---
name: codex-handoff-workflow
description: From 2026-08-26 on, Gaurav builds this project mostly through Codex, not Claude Code. Claude's role narrows to planning and occasional guidance, read from a status file.
metadata:
  type: feedback
---

Claude is used for planning only from now on for this project. Codex (via ChatGPT Go, or an upgraded plan) does the actual building.

**Why:** Gaurav wants a clean handoff so Codex can work independently without him re-explaining context every session, and so Claude can still be pulled in for guidance without re-deriving project state from scratch.

**How to apply:** Three files carry the handoff, all repo root:
- `AGENTS.md` — instructions Codex reads automatically every session (Codex CLI convention, equivalent to CLAUDE.md). Hard rules, quality bar, judging-criteria checklist, workflow expectations.
- `PROJECT_CONTEXT.md` — static-ish background Codex needs but won't rediscover on its own: brief extraction ([[brief-judging-criteria]]), PRD summary, chosen problem, team info, deadline.
- `STATUS.md` — living doc of current state, updated as work progresses. This is the file Claude reads first if pulled back in for guidance, instead of the full memory/ folder.

If this project's CLAUDE.md "Framework state" block or memory/ system stops being consulted session to session, check STATUS.md is being kept current before assuming the project went stale — Codex sessions won't touch memory/.
