# 🌿 EcoScan

**Photograph a plant. Find out if it belongs there.**

Built for **OregonHacks 2026** — *"technology that helps people reconnect with nature or supports
environmental health."*

🔗 **[Live demo](#)** · 🎥 **[Demo video](#)**

---

## The problem

Invasive plants are one of the largest ongoing threats to Oregon's ecosystems. English ivy pulls down
mature Douglas firs. Japanese knotweed destabilises the stream banks that salmon spawn along. Scotch broom
rewrites soil chemistry so thoroughly that natives can't return, while stacking up wildfire fuel.

Removing them is work that ordinary people can and do perform — park volunteers, watershed councils,
landowners clearing a back fence line. The bottleneck usually isn't willingness or tools.

**It's identification.** Standing in front of a green tangle, most people genuinely cannot tell Himalayan
blackberry from native salmonberry, or English holly from Oregon grape — our state flower. Get it wrong in
one direction and the invasive stays. Get it wrong in the other and you tear out the thing you were trying
to protect.

EcoScan closes that gap in about five seconds, from a phone, standing in the field.

## Who it's for

Volunteer restoration crews, watershed councils, and Oregon homeowners clearing their own property — people
who want to do the right thing on the land in front of them and need to know what they're looking at first.

---

## How it works — and the one design decision that matters

EcoScan splits the problem across two systems, deliberately:

| Question | Answered by | Why |
|---|---|---|
| *"What plant is this?"* | Llama 4 vision on Groq | Genuinely hard perception, and what a model is good at |
| *"Is it invasive? How do I remove it?"* | Curated Oregon dataset | Must be verifiable and traceable to a real source |

**We do not let a language model write removal instructions.** Herbicide guidance, disposal rules, and
"is this safe to pull" are advice with physical consequences for someone's land and health — a plausible
hallucination there is a genuine harm, not a glitch. So the model's job stops at the species name. Every
piece of guidance in the app is drawn from a curated dataset citing the **Oregon Department of Agriculture
noxious weed list** and **OSU Extension**, and each card shows its source.

This shapes the whole UX. There are three honest outcomes:

1. **Identified, and in our dataset** → full verdict: status, eco-impact score, sourced removal steps.
2. **Identified, but not in our dataset** → we show the species and say plainly that we won't guess at its
   status or invent guidance.
3. **Not a plant, or below 40% confidence** → we decline to name it, and explain how to retake the photo.

Refusing to answer is a feature. A confident wrong ID is how a native plant gets destroyed.

### Honest ML interface

Every result shows the model's **confidence**, the **runner-up species** it considered, and **what it
actually saw** — the specific leaf shape, margin, and growth-habit cues behind the call. The user is given
what they need to disagree with the machine.

---

## Architecture

```
Browser  ──POST /api/identify──▶  Serverless function  ──▶  Groq (Llama 4 vision)
   │                              (holds GROQ_API_KEY)         │
   │                                                            ▼
   │                                                  { species, confidence,
   │                                                    alternates, traits }
   ▼
lookupSpecies()  ──▶  curated Oregon dataset  ──▶  verified status + sourced guidance
```

- **`api/identify.js`** — serverless vision endpoint. Validates and size-caps the upload, calls Groq in JSON
  mode, falls back from Llama 4 Maverick to Scout on rate limits, normalises the model's output against a
  strict schema, and returns readable errors without leaking upstream detail.
- **`src/plantData.js`** — the curated dataset, keyed by scientific name, with a `lookupSpecies()` resolver
  that normalises binomials and maps outdated synonyms (models still return *Polygonum cuspidatum* for
  Japanese knotweed).
- **`vite.config.js`** — mounts the serverless handler into the dev server so `npm run dev` exercises the
  exact production code path, no Vercel CLI required.

**The API key never reaches the browser.** All inference is proxied server-side; a key in a client bundle is
one devtools click from being stolen.

## Accessibility

Treated as a requirement, not a polish pass:

- The drop zone is a real `<button>`, so the entire flow is keyboard-operable — the usual clickable-`<div>`
  pattern is invisible to keyboard and screen-reader users.
- Results are wrapped in `aria-live="polite"` with `aria-busy`, so they're announced as they arrive.
- Invasive/native status uses **icon + word**, never colour alone.
- Text colours are darkened variants meeting WCAG AA contrast (the bright brand green fails as body text).
- Visible focus rings throughout; `prefers-reduced-motion` respected.
- `capture="environment"` opens the rear camera on phones — this is a field tool.

## Tech stack

React 19 · Vite 8 · Tailwind CSS · Vercel serverless functions · Groq (`llama-4-maverick-17b-128e-instruct`)

## Running locally

```bash
npm install
cp .env.example .env        # add your free key from https://console.groq.com/keys
npm run dev
```

## Limitations

Honest about what this is:

- Identification is a best guess from a general-purpose vision model, not a botanical survey. Verify before
  irreversible action, especially near water or protected habitat.
- Verified guidance covers 14 high-priority Oregon species. Anything outside that returns "unlisted" by
  design rather than a guess.
- Status is Oregon/Pacific Northwest specific. "Invasive" is a statement about a place — several of these
  species are perfectly well-behaved natives elsewhere.

## What's next

Offline PWA for canyons with no signal · GPS-tagged sighting map · one-tap reporting into county weed
authority workflows · expanding the verified dataset to the full ODA list.

## Data sources

Oregon Department of Agriculture — Noxious Weed Policy & Classification System · OSU Extension Service —
Pacific Northwest native and invasive plant guides.

## AI-assisted development

Per OregonHacks rules, disclosed in full: this project was developed with **Claude Code** (Claude Opus)
assisting with implementation, refactoring, and documentation. Architecture decisions, the dataset-backed
guidance model, and all content review were directed by the author. Plant identification at runtime uses
Meta's Llama 4 vision models served by Groq.

Built during the OregonHacks 2026 event window and submitted exclusively to this hackathon.
