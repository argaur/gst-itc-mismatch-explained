# Notice, Explained

A GST DRC-01C notice tells a taxpayer that their claimed input tax credit does not match what suppliers reported. It does not tell them why. This prototype adds that missing layer.

Live demo: https://prototype-blue-three.vercel.app
Repository: https://github.com/argaur/gst-itc-mismatch-explained

Built for **Build What Moves India**, a hackathon by Varun Mayya backed by OpenAI. The brief: pick a real problem on an Indian public-service platform and fix the failing moment in the process, not just the screen.

## Team

- Kriti Kandhari Kapoor
- Gaurav Gupta

## The problem

A GST DRC-01C notice shows one number: the gap between input tax credit claimed in GSTR-3B and input tax credit available in GSTR-2B. The government portal gives the taxpayer that gap and a form to reply to it. It does not show which invoice or supplier record caused the gap.

Most recipients do not have a retained accountant or a paid reconciliation tool on hand when the notice arrives, and the reply window is fixed. A missed or wrong reply can block a later GSTR-1 filing.

## What this prototype does

It sits between the notice and the reply. It takes the same aggregate mismatch, traces it row by row against a purchase and claim record, and shows the taxpayer the exact evidence behind the number before they write anything.

Round 1 shipped the core flow:
1. Show the notice and the aggregate ITC difference.
2. Run a deterministic reconciliation against source records and classify every row (`exact_match`, `missing_in_2b`, `possible_duplicate`, `later_period_match`).
3. Ask OpenAI to explain only the validated findings, grounded in that evidence, never left to guess.
4. Draft a neutral, review-only Part B response the taxpayer can copy, print, or discard.

Round 2 added two things a mentor asked for directly:
- A risk screen that flags supplier-filed bills the taxpayer must act on before the portal treats their silence as acceptance.
- A free-text question box, in Hindi or English, that answers a taxpayer's own question by citing real row IDs, not a canned FAQ.

The reconciliation math and the row classification are deterministic code, checked by tests. OpenAI only explains and drafts language around findings that code has already verified. It never invents a number.

## What is real and what is synthetic

Real: the reconciliation logic, the schema validation, the OpenAI call, the error handling, the deployed app.

Synthetic: the notice, the taxpayer, the source records, the amounts, and the IDs. No live GST system, GST API, PAN, Aadhaar, OTP, or payment data is used anywhere. The app discloses this on every screen: `INDEPENDENT SYNTHETIC PROTOTYPE · NOT GSTN · NOT TAX ADVICE`.

## Tech stack

- React 19 with TypeScript, built by Vite
- Vitest for tests
- Vercel serverless functions (Node runtime) for the OpenAI-backed endpoints
- OpenAI Responses API, called server-side only, with a strict JSON schema on the output

## Project structure

```
prototype/           the deployed app
  src/domain/         deterministic reconciliation and risk logic
  src/contracts/       frozen types for findings, evidence, and the explanation envelope
  src/views/           the four-step citizen flow (notice, evidence, explanation, review)
  api/                 Vercel functions: explain.ts, explain-risk.ts, ask.ts, supplier-filing.ts
  tests/               80 tests covering domain logic, validators, and the API layer
research/             secondary research on the 10 platforms in the hackathon brief
memory/               project decision log and session history
PRD.md                sealed product requirements for the DRC-01C problem and mechanism
IMPLEMENTATION_PLAN.md the agreed build plan and stage gates
```

## Running locally

```bash
cd prototype
npm install
npm run dev       # local dev server
npm test          # 80 tests
npm run build     # type-check and production build
```

The OpenAI-backed endpoints (`api/explain.ts`, `api/explain-risk.ts`, `api/ask.ts`) need an `OPENAI_API_KEY` environment variable to call the live model. Every deterministic path (reconciliation, risk classification, evidence display) works without it.

## Deployment

The `prototype/` directory is a standalone Vercel project (root directory set to `prototype`), deployed to production on every push to `main`.
