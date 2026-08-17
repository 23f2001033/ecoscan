# Devpost Submission — copy/paste

## Project name
```
EcoScan
```

## Tagline
```
Photograph a plant. Find out if it belongs there — and what to do about it.
```

## Links
| Field | Value |
|---|---|
| Try it out | `https://ecoscan-oregon.vercel.app` |
| GitHub repo | `https://github.com/23f2001033/ecoscan` |
| Video demo | `https://youtu.be/5oYIJvWcMqU` ✅ verified public |

## Built With
```
react, vite, tailwindcss, groq, qwen, vercel, javascript, serverless, computer-vision
```

---

## Description

**Inspiration**

Invasive plants are one of the biggest ongoing threats to Oregon's ecosystems. English ivy climbs native
trees and pulls them down. Japanese knotweed destabilises the stream banks salmon spawn along. Scotch broom
changes soil chemistry so natives can't return, and stacks up wildfire fuel.

Thousands of Oregonians volunteer to remove these plants every year. The bottleneck isn't willingness —
it's identification. Standing in front of a green tangle, most people genuinely can't tell invasive
Himalayan blackberry from native trailing blackberry, or English holly from Oregon grape, our state flower.
Get it wrong in one direction and the invader stays. Get it wrong in the other and you tear out the plant
you came to protect.

**What it does**

Take or upload a photo. In under two seconds EcoScan identifies the species, tells you whether it's
invasive or native *in Oregon*, scores its ecological impact, and gives removal instructions sourced from
the Oregon Department of Agriculture and OSU Extension.

It also tells you when it doesn't know — which turned out to be the most important feature.

**How we built it**

React + Vite + Tailwind on the front end, with a Vercel serverless function proxying a Qwen 3.6 vision
model on Groq. The API key stays server-side and never enters the browser bundle.

The core design decision: **the model identifies the species, but never writes the guidance.** Removal
advice comes from a curated 14-species Oregon dataset, and every card cites its source. Letting a language
model improvise herbicide instructions is a real-world hazard, not a glitch — so the model's job stops at
the name.

That produces three honest outcomes instead of one confident guess:
1. Identified and in the dataset → full verdict with sourced removal steps
2. Identified but not in the dataset → shows the species, states plainly that we won't invent guidance
3. Not a plant, or below 40% confidence → declines to name it, and explains how to retake the photo

Every result also shows confidence, the runner-up species considered, and the specific visual traits behind
the call — so the user has what they need to disagree with the machine.

**Challenges we ran into**

The free tier allows 8,000 tokens per minute, and Groq counts *reserved output tokens* against that quota —
so an over-generous `max_tokens` alone consumed half the budget per scan. Fixing it meant suppressing the
model's thinking trace, capping output, and downscaling photos to 768px in the browser before upload. Scans
now land in 0.8–1.7 seconds and comfortably fit the budget.

We also hit a model that wasn't enabled on our account, and found our own fallback logic treated the
resulting 404 as fatal instead of trying the next candidate.

**Accomplishments we're proud of**

Building an AI feature that says "I don't know." It would have been easier to always return an answer, and
it would have been worse — a confident wrong ID is how a native plant gets destroyed.

Accessibility was treated as a requirement, not a polish pass: the whole flow is keyboard-operable, results
are announced via `aria-live`, invasive/native status uses icon plus word rather than colour alone, and
text colours meet WCAG AA contrast.

**What we learned**

Where to draw the line between what a model should decide and what it shouldn't. Perception — "what plant
is this?" — is a great fit. Advice with physical consequences for someone's land is not. Splitting those
two made the product both safer and more trustworthy.

**What's next**

Offline PWA for canyons with no signal · GPS-tagged sighting map · one-tap reporting into county weed
authority workflows · expanding the verified dataset to the full ODA noxious weed list.

---

## AI disclosure (required by the rules — include it)
```
Developed with AI assistance (Claude Code) for implementation, refactoring, and documentation.
Architecture decisions and content review were directed by the author. Runtime plant identification
uses a Qwen 3.6 vision model served by Groq. Built during the OregonHacks 2026 event window and
submitted exclusively to this hackathon.
```

---

## Final checks
- [ ] Video link is **public or unlisted**, not private — the single most common submission failure
- [ ] Video is under 5:00
- [ ] Live link opens without a login wall (verified working)
- [ ] Repo is public (verified)
- [ ] Hit **Submit**, not just Save — a saved draft is not a submission
