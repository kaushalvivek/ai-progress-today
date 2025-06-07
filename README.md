# AI Progress Today

> From steam engines to AGI in one clean timeline. Because someone should track how we accidentally built ourselves into obsolescence.

**[aiprogress.today](https://aiprogress.today)** • *Refreshingly honest about humanity's sprint toward AGI*

[![Netlify Status](https://api.netlify.com/api/v1/badges/2f6877a9-7ba9-48af-ad80-0d10848ed985/deploy-status)](https://app.netlify.com/projects/ai-progress-today/deploys)

---

## What is this?

A hyper-minimal timeline that doesn't pretend AI started with ChatGPT. We begin with the steam engine (automation's patient zero) and chronicle every pivotal moment leading to today's "this seems fine" AI landscape.

Three simple buckets:
- 🔴 **Pivotal** — Changed everything forever
- 🟡 **Major** — Pretty significant, tbh  
- 🟢 **Notable** — Worth remembering when the robots write history

## Why this exists

Someone needs to document how we went from "mechanical looms" to "AGI by 2027" in a way that doesn't require a PhD to understand. Also, the internet needs more timelines that work on mobile.

## Deploy in 30 seconds

```bash
git clone [this-repo]
# Push to GitHub
# Connect to Netlify  
# Point aiprogress.today at it
# Profit (spiritually)
```

No build steps. No frameworks. No drama. Just HTML, CSS, and the mild existential dread of tracking humanity's obsolescence.

## Add new milestones

Edit `events.json` when the next breakthrough hits:

```json
{
  "name": "AGI achieved", 
  "detail": "Well, that escalated quickly",
  "date": "2027-03",
  "importance": "pivotal",
  "link": "https://example.com/we-did-it"
}
```

## Files that matter

```
index.html      — The timeline
events.json     — All the data
style.css       — Dark mode elegance
script.js       — Makes things clickable
netlify.toml    — Deploy config
```

That's it. Five files tracking 300+ years of automation.

## Local development

```bash
python3 -m http.server 8000    # Or any HTTP server
open http://localhost:8000     # Behold the timeline
```

---

**Built by [vivek](https://vivekkaushal.com)** • [GitHub](https://github.com/kaushalvivek/ai-progress-today) • [Edit](https://github.com/kaushalvivek/ai-progress-today/edit/main/README.md)  
*For people who appreciate clean design and mild gallows humor about our AI future.*