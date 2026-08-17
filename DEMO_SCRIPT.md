# EcoScan — Demo Video Script

**Target: 3:30. Hard limit 5:00.** Shorter and confident beats longer and padded.

**Before you record**
- Open https://ecoscan-oregon.vercel.app
- Have ready: the **ivy photo** (`public/samples/sample-1.jpg`) and the **car photo**
- Do one practice scan first — it warms things up and you'll know the timing
- Wait ~30 seconds between scans on camera (free-tier rate limit); or scan, then talk, then scan

---

## 0:00 – 0:35 · The problem

> "Oregon has a plant problem.
>
> English ivy climbs native trees and pulls them down. Japanese knotweed breaks apart the stream banks
> that salmon spawn in. Scotch broom changes the soil so native plants can't grow back.
>
> Thousands of people volunteer to pull these plants out every year. So why is it still getting worse?
>
> Because standing in front of a green tangle, most people can't tell which plant is which. Our state
> flower, Oregon grape, looks a lot like invasive English holly. Native blackberry looks like the
> invasive kind.
>
> Get it wrong, and you either leave the invader — or you rip out the native you came to protect."

*On screen: your face, or the two lookalike plants side by side.*

---

## 0:35 – 1:50 · Demo (screen recording)

> "This is EcoScan. I'll show you."

**Upload the ivy photo. Let it run.**

> "One photo. Under two seconds.
>
> English ivy. *Hedera helix.* The model is 95% sure — and it tells you why: glossy lobed leaves,
> pale veins, climbing growth.
>
> It's marked invasive, impact 8 out of 10, and here's how to remove it — cut at shoulder height and
> at the base, bag it, don't compost it.
>
> And look at the bottom: that advice comes from the Oregon Department of Agriculture. Not from the AI."

**Pause. Now upload the car photo.**

> "Now watch what happens when I give it something that isn't a plant."

**Let the refusal appear.**

> "It says no.
>
> It didn't guess. It didn't make something up. It told me there's no plant in this photo.
>
> That matters more than it sounds — and it's the reason I built it this way."

---

## 1:50 – 2:50 · How it works

*On screen: the diagram from the README, or just talk over the app.*

> "Here's the one decision the whole project is built on.
>
> A vision model — Qwen 3.6, running on Groq — answers one question: *what plant is this?* That's what
> models are good at.
>
> But it never writes the removal advice. That comes from a separate database I built, with fourteen
> Oregon species, every entry traced to the Oregon Department of Agriculture or OSU Extension.
>
> Why split it? Because if an AI invents herbicide instructions and someone follows them near a
> salmon stream, that's real damage. A made-up plant name is a bug. Made-up land advice is a hazard.
>
> So the model stops at the name. Everything after that is sourced.
>
> That's also why it can refuse. If the photo isn't a plant, or it's under 40% confident, it says so.
> If it knows the species but I don't have verified guidance, it shows the species and admits the gap —
> instead of guessing.
>
> Three honest answers instead of one confident guess."

---

## 2:50 – 3:20 · Built for real use

> "A few things because this gets used outdoors, on a phone:
>
> The API key stays on the server, never in the browser. Photos shrink before they upload, so it's
> fast on bad signal. On a phone it opens the back camera straight away.
>
> And it works with a keyboard and a screen reader — the upload is a real button, results are
> announced out loud, and invasive versus native is shown with an icon and a word, not just red
> and green, so it still works if you're colour blind."

---

## 3:20 – 3:35 · Close

> "Next: offline mode for canyons with no signal, a map of what people find, and one-tap reporting
> to county weed crews.
>
> Oregon doesn't need more people willing to help. It needs them to know what they're looking at.
>
> That's EcoScan. Thanks."

---

## Say it exactly like this

**Do say** — all verified true:
- "Under two seconds" (measured 0.8–1.7s)
- "Fourteen species with sourced guidance"
- "The model identifies; the database advises"
- "It refuses when it isn't sure"

**Don't say** — you can't back these up:
- Any accuracy percentage ("95% accurate") — you haven't tested a sample big enough
- "Works on any plant" — it's 14 species of *verified guidance*
- Any invasive-species cost figure unless you look it up and cite it on screen

If a scan misfires while recording, **keep it in and say "and that's why we show confidence."** Judges
have seen a hundred suspiciously perfect demos. A handled failure reads as real.

---

## Checklist before you submit

- [ ] Video under 5:00, uploaded, link set to public
- [ ] GitHub repo link: https://github.com/23f2001033/ecoscan
- [ ] Project link: https://ecoscan-oregon.vercel.app
- [ ] Devpost description mentions the prompt: *supports environmental health*
- [ ] AI use disclosed (it's in the README and the app footer)
