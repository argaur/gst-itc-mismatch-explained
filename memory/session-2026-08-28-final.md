---
name: Session 2026-08-28 final release handoff
description: Final implementation, deployment, OpenAI configuration, GitHub setup, and remaining submission work for GST ITC mismatch prototype
metadata:
  type: project
---

On 2026-08-28 the approved GST ITC mismatch solution was fully implemented through bounded Codex agents. Stages 0–3 are complete: deterministic ₹30 lakh reconciliation, canonical four-category evidence contracts, portal-native UI, grounded server-side OpenAI Responses API, strict model validation, typed failures, review-only Part B, copy/print/restart, and safety disclosures. Verification passed: 40/40 full tests, 15/15 focused API/validator tests, and local production build.

The prototype is deployed at https://prototype-blue-three.vercel.app. A live production `/api/explain` request for `DEMO-CASE-01` returned HTTP 200 with a grounded structured explanation. `OPENAI_API_KEY` is stored in gopass under `buildwhatmovesindia/OPENAI_API_KEY` and configured in Vercel Production as a sensitive variable; never record or print its value. The public repository is https://github.com/argaur/gst-itc-mismatch-explained, latest status commit `cf9ea39`. Kriti (`kritikandharikapoor`) was invited with write access and must accept the invitation.

The detailed implementation handoff is `HANDOFF.md`. Remaining work is rendered mobile/print QA, demo video, project summary, submission checklist, and confirmation that Kriti accepted the invitation. Do not add GST APIs or live government integrations; the approved build is synthetic and independent of GSTN.
