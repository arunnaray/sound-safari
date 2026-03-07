# 🚦 Sound Safari — PWA + GitHub Pages

Interactive toddler speech therapy game. Installable on any device. Works fully offline.

---

## 📁 Project Structure

```
soundsafari/
├── index.html                    ← Launcher + PWA install prompt
├── speech-therapy-game.html      ← The game
├── soundsafari-admin.html        ← Admin configuration panel
├── manifest.json                 ← PWA manifest
├── service-worker.js             ← Offline caching
├── favicon.ico
├── icons/                        ← App icons (72 → 512px)
├── server.js                     ← Local dev server (zero dependencies)
├── package.json
├── .github/workflows/deploy.yml  ← Auto-deploy to GitHub Pages
├── soundsafari-updates/          ← Version snapshots folder
└── README.md
```

---

## 🚀 Deploy to GitHub Pages

### Step 1 — Create GitHub repo
1. Go to github.com → New repository
2. Name it `sound-safari`
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload files
**Via website (easiest):**
1. Click "uploading an existing file"
2. Drag all files from this ZIP
3. Click **Commit changes**

**Via Git:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sound-safari.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Repo → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. Click Save

### Step 4 — Your live URL
```
https://arunnaray.github.io/sound-safari/
```
Check the **Actions** tab for deployment status (~1 minute).

---

## 📲 Install as PWA

**Android (Chrome):** Tap Install banner or menu → Add to Home Screen

**iPhone/iPad (Safari):** Share button → Add to Home Screen

**Desktop (Chrome/Edge):** Click install icon in address bar

Once installed: fullscreen, offline, home screen icon, instant launch.

---

## 🔄 Push Updates

```bash
git add .
git commit -m "Updated words"
git push
```
Auto-deploys in ~1 minute. To bust cache, increment version in service-worker.js:
```js
const CACHE_STATIC = 'soundsafari-static-v2';
```

---

## 🖥 Run Locally

```bash
node server.js
# Game  → http://localhost:3000/speech-therapy-game.html
# Admin → http://localhost:3000/soundsafari-admin.html
```

---

## 🔊 TTS Offline Setup

| Device | How |
|--------|-----|
| Android | Settings → Accessibility → Text-to-Speech → Download Google TTS |
| iPhone/iPad | Settings → Accessibility → Spoken Content → Voices → Download English |
| Windows | Settings → Time & Language → Speech → Offline voices |
| Mac | Works offline by default |

---

## 📄 License
MIT
