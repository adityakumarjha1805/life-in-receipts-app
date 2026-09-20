# 🧾 RECEIPTS — Your Life, In Receipts

> **One Dataset. Hundreds of Moments. Infinite Stories.**

RECEIPTS is a frontend-only interactive data storytelling application that transforms digital-life activity records into meaningful stories, relationships, and life chapters.

Instead of simply displaying thousands of records in a traditional timeline, RECEIPTS analyzes activities across music, places, purchases, photos, events, messages, searches, and other digital moments to discover meaningful connections.

---

## ✨ Overview

Our digital lives are made up of thousands of tiny moments:

- 🎵 A song played late at night
- 📍 A place visited
- 📸 A photo captured
- 🛍️ A purchase made
- 🎟️ An event attended
- 💬 A message sent
- 🔎 A search performed
- 📝 A personal note created

Individually, these records may not mean much.

But when connected together, they can tell a story.

RECEIPTS transforms these isolated activities into an interactive journey:

```text
RAW DATA
   ↓
NORMALIZATION
   ↓
INSIGHTS
   ↓
CONNECTIONS
   ↓
LIFE CHAPTERS
   ↓
INTERACTIVE STORY
```

## Deploy to Vercel

This is a Vite single-page application and is ready to deploy from the `app` directory.

### Vercel dashboard

1. Import the repository into Vercel.
2. Set the project root to `app` if the repository contains the parent `Hackathon` folder.
3. Use the default Vite settings, or confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
4. Deploy.

The included `vercel.json` rewrites client-side routes back to `index.html`, so direct links to routes such as `/life-map` and `/story/:chapterId` work after deployment.

### Vercel CLI

From this directory:

```bash
npm install -g vercel
vercel
```

For a production deployment:

```bash
vercel --prod
```