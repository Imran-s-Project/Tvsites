# Tech Verse — Setup Guide

## ফোল্ডার স্ট্রাকচার

```
tech-verse/
├── index.html                  ← একমাত্র HTML ফাইল
├── manifest.json               ← PWA manifest
├── sw.js                       ← Service Worker
├── style/
│   ├── main.css                ← Design tokens + সব layout
│   ├── components.css          ← Search, Toast
│   └── post.css                ← Post detail page
└── src/
    ├── app.js                  ← Router + App init
    ├── firebase/
    │   └── config.js           ← ⚠️ তোমার Firebase config এখানে
    ├── components/
    │   ├── navbar.js
    │   ├── footer.js
    │   ├── search.js
    │   ├── toast.js
    │   ├── auth.js
    │   └── postcard.js
    └── pages/
        ├── home.js
        ├── blog.js
        ├── post.js
        ├── auth.js
        ├── profile.js
        └── 404.js
```

---

## ধাপ ১ — Firebase সেটআপ

1. [firebase.google.com](https://firebase.google.com) → নতুন প্রোজেক্ট তৈরি করো
2. **Authentication** → Sign-in method → Google + Email/Password চালু করো
3. **Firestore** → Create database → Production mode
4. **Project Settings** → Your apps → Web app → SDK config কপি করো
5. `src/firebase/config.js` ফাইলে config বসাও

### Firestore Rules (Security)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /bookmarks/{id} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
    }
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## ধাপ ২ — প্রথম পোস্ট যোগ করা

Firestore → `posts` collection → Add document:
```json
{
  "title": "Tech Verse-এ স্বাগতম!",
  "excerpt": "আমাদের প্রথম পোস্ট।",
  "content": "# স্বাগতম\n\nটেক ভার্সে আপনাকে স্বাগতম।",
  "category": "সাধারণ",
  "readTime": "২ মিনিট",
  "createdAt": (Timestamp),
  "views": 0
}
```

---

## ধাপ ৩ — Deploy (Vercel)

```bash
# Vercel CLI দিয়ে
npm i -g vercel
cd tech-verse
vercel
```

### Vercel Settings (SPA routing এর জন্য)
`vercel.json` ফাইল তৈরি করো:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**অথবা Netlify:**
`_redirects` ফাইল তৈরি করো:
```
/*  /index.html  200
```

---

## ফেজ ২ — সম্পন্ন ✅
- [x] Learning Hub — Course listing + progress tracking
- [x] Course Detail — Lesson list, enroll, progress bar
- [x] Lesson Reader — Mark complete, sidebar navigation
- [x] Comments — Nested, Like, Reply, spam filter
- [x] Notifications — FCM push + in-app bell
- [x] Bookmark — Save/unsave posts (Firestore)
- [x] Tools Directory — Tech Verse projects catalog

## ফেজ ৩ তে যা আসছে
- [ ] Admin Dashboard (post/course management)
- [ ] AI-powered search & content suggestions
- [ ] Newsletter (EmailJS / Mailchimp)
- [ ] SEO — sitemap.xml, meta, Open Graph
- [ ] Firebase Analytics Dashboard

---

## Tech Stack
| অংশ | টেকনোলজি |
|---|---|
| Frontend | Vanilla JS (ES Modules) |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Hosting | Vercel / Netlify |
| Search | Fuse.js |
| PWA | Service Worker + Manifest |
