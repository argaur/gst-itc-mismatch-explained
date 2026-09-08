---
name: gopass-path-fix
description: gopass was missing from Windows PATH, causing repeated secret-retrieval failures across sessions
metadata:
  type: feedback
---

gopass.exe (`C:\Users\Gaurav Gupta\AppData\Local\gopass\gopass.exe`) was never on the persistent Windows User PATH, so any fresh Claude Code or Codex session/terminal couldn't find it and secret retrieval failed every time.

**Why:** Gaurav flagged this as a recurring annoyance ("I have [to] remind about this all the time we have to do the secrets part") on 2026-08-28.

**Fix applied 2026-08-28:** Added `C:\Users\Gaurav Gupta\AppData\Local\gopass` to the User-level PATH via `[Environment]::SetEnvironmentVariable("PATH", ..., "User")`, which persists across reboots/new sessions in the registry.

**How to apply:** If gopass is reported as "not found" or "not in PATH" again in any future session (in this project or any other — this is machine-wide infra, not project-specific), this is a regression (new machine, profile reset, PATH got overwritten) — re-apply the same PowerShell fix rather than treating it as a one-off blocker to route around. Don't just work around it locally per-session again.
