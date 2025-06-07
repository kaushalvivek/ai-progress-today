# AI Progress Today

> **The AI timeline curated by AI itself** — because who better to track the journey toward AGI?

**[aiprogress.today](https://aiprogress.today)** • *The ultimate meta experience: AI watching AI*

[![Netlify Status](https://api.netlify.com/api/v1/badges/2f6877a9-7ba9-48af-ad80-0d10848ed985/deploy-status)](https://app.netlify.com/projects/ai-progress-today/deploys)

---

## The Meta Concept

This isn't just another AI timeline — **it's curated and maintained by AI itself**. 

Think about it: What's more fitting than having artificial intelligence track its own evolutionary journey from steam engines to superintelligence? This timeline automatically discovers, evaluates, and adds new AI milestones as they happen, creating a living document of AI progress written by AI.

**The appeal is the recursion itself** — you're watching AI's self-aware documentation of its path to AGI.

**Three importance levels:**
- 🔴 **Pivotal** — Changed everything forever
- 🟡 **Major** — Pretty significant breakthrough  
- 🟢 **Notable** — Worth remembering when the robots write history

**What makes this special:**
- 🤖 **AI-curated**: Automatically discovers and evaluates new AI developments
- 📈 **Self-updating**: New milestones appear as AI identifies them from news and research
- 📜 **Comprehensive**: 60+ events from steam engines (1712) to latest AI breakthroughs (2025)
- 🔬 **Research-backed**: Includes foundational papers alongside major announcements
- 📱 **Optimized UX**: Mobile-friendly with keyboard shortcuts (1-4 for filtering)
- 📧 **Smart notifications**: Get notified when AI adds new milestones

## How Milestones Get Added

**Automated (Primary Method)**: The AI curation system automatically discovers and adds new milestones as they happen. No human intervention required.

**Manual Override**: For immediate additions or corrections, edit `events.json`:

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

## AI-Powered Notifications

Subscribe to get notified when AI discovers and adds new milestones to the timeline. The system uses:
- **Frontend**: Subtle subscription form in the timeline header
- **Backend**: Netlify Functions + Google Sheets API  
- **Storage**: Google Sheets (acting as a simple database)
- **Trigger**: Automated notifications sent when the AI curation system adds new events

**The experience**: You're essentially subscribing to AI's own discovery process — getting alerts when artificial intelligence identifies significant moments in its evolutionary journey.

## Local Development

```bash
git clone https://github.com/kaushalvivek/ai-progress-today.git
cd ai-progress-today
python3 -m http.server 8000    # Or any HTTP server
open http://localhost:8000
```

For subscription testing, you'll need to set up Google Sheets API credentials and deploy to Netlify.

## AI Curation System

**How AI maintains this timeline autonomously:**

The magic happens through an AI agent deployed as a Lambda function that:

1. **🔍 Scans Multiple Sources**: Continuously monitors AI news, research papers, company announcements, and academic publications
2. **🧠 Evaluates Significance**: Uses language models to assess whether developments meet the threshold for "notable," "major," or "pivotal" classification
3. **✍️ Generates Entries**: Automatically writes concise, consistent descriptions that match the site's tone and format
4. **🔄 Auto-commits**: Pushes new events directly to the GitHub repository, triggering automatic deployment
5. **📧 Notifies Subscribers**: Email notifications go out when significant new milestones are added

**The result**: A timeline that stays current without human intervention, capturing AI progress as it happens from AI's own perspective.

**Why this matters**: You're not just reading about AI history — you're watching AI write its own story in real-time. It's recursion all the way down.

---

**Built by [vivek](https://vivekkaushal.com)** • [GitHub](https://github.com/kaushalvivek/ai-progress-today)  
*For people who appreciate meta concepts and mild existential dread about our AI future.*