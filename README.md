# AI Progress Today

> From steam engines to AGI in one clean timeline. Because someone should track how we accidentally built ourselves into obsolescence.

**[aiprogress.today](https://aiprogress.today)** • *Refreshingly honest about humanity's sprint toward AGI*

[![Netlify Status](https://api.netlify.com/api/v1/badges/2f6877a9-7ba9-48af-ad80-0d10848ed985/deploy-status)](https://app.netlify.com/projects/ai-progress-today/deploys)

---

## What is this?

A hyper-minimal timeline tracking AI progress from the steam engine to today. No PhD required to understand how we went from mechanical looms to frontier language models in 300 years.

**Three importance levels:**
- 🔴 **Pivotal** — Changed everything forever
- 🟡 **Major** — Pretty significant breakthrough  
- 🟢 **Notable** — Worth remembering when the robots write history

**Features:**
- 60+ milestones from 1712 to 2025
- Includes foundational research papers and engineering breakthroughs
- Mobile-optimized with keyboard shortcuts (1-4 for filtering)
- Email subscriptions for new milestone updates

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

## Architecture

```
index.html              — Timeline interface
events.json             — All milestone data
style.css               — Dark mode design
script.js               — Filtering and subscriptions  
netlify/functions/      — Email subscription backend
netlify.toml            — Deployment config
package.json            — Dependencies
```

No build steps. No frameworks. Just vanilla web tech and serverless functions.

## Email Subscriptions

Users can subscribe to get notified when new AI milestones are added. The system uses:
- **Frontend**: Minimal form integrated into the timeline header
- **Backend**: Netlify Functions + Google Sheets API
- **Storage**: Google Sheets (acting as a simple database)

Subscribers are stored with email, timestamp, and IP address for basic analytics.

## Local Development

```bash
git clone https://github.com/kaushalvivek/ai-progress-today.git
cd ai-progress-today
python3 -m http.server 8000    # Or any HTTP server
open http://localhost:8000
```

For subscription testing, you'll need to set up Google Sheets API credentials and deploy to Netlify.

---

**Built by [vivek](https://vivekkaushal.com)** • [GitHub](https://github.com/kaushalvivek/ai-progress-today)  
*For people who appreciate clean design and mild gallows humor about our AI future.*