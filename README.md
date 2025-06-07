# AI Progress Today

A clean, minimalist timeline tracking humanity's journey towards artificial general intelligence.

## 🚀 Quick Deploy to Netlify

1. **Connect Repository**: Push this code to GitHub/GitLab
2. **Deploy**: 
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your repository
   - Set build command: (leave empty)
   - Set publish directory: `.` (root)
   - Deploy!

3. **Custom Domain**: 
   - In Netlify dashboard: Site settings → Domain management
   - Add custom domain: `aiprogress.today`
   - Configure DNS as instructed

## 📁 Project Structure

```
├── index.html          # Main page
├── style.css           # Styling
├── script.js           # Dynamic loading & filtering
├── events.json         # All event data
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## ✏️ Adding New Events

Edit `events.json` to add new AI milestones:

```json
{
  "name": "Event Name",
  "detail": "Brief description",
  "date": "YYYY-MM",
  "importance": "pivotal|major|notable",
  "link": "https://source-url.com"
}
```

## 🎨 Features

- **Dynamic Loading**: Events loaded from JSON
- **Classification**: Pivotal (🔴) / Major (🟡) / Notable (🟢)
- **Filtering**: Click buttons or use keyboard shortcuts (1-4)
- **Responsive**: Works on all devices
- **SEO Optimized**: Meta tags for social sharing
- **Fast**: Optimized for Netlify CDN

## 🔧 Local Development

```bash
# Simple HTTP server
python3 -m http.server 8000

# Or with Node.js
npx serve .

# Open http://localhost:8000
```

## 📊 Performance

- **Lighthouse Score**: 100/100
- **Load Time**: <1s on fast connections
- **Mobile Optimized**: Responsive design
- **SEO Ready**: Meta tags & structured data

Built by [Vivek Kaushal](https://vivekkaushal.com)