# 🌱 UW Plant Breeding Club Website

A static website for the UW–Madison Plant Breeding Club, built with plain HTML, CSS, and JavaScript. No frameworks, no build step — just open a file and it works.

## Files

```
plant-breeding-club/
├── index.html       ← Home page
├── about.html       ← About the club
├── events.html      ← Upcoming & past events
├── resources.html   ← Links & tools
├── style.css        ← All styles (edit colors/fonts here)
├── script.js        ← Nav toggle & scroll animations
└── README.md        ← You're here
```

---

## 🚀 How to Deploy on GitHub Pages

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up. Free account is all you need.

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `plant-breeding-club` (or anything you want)
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload the files
1. On your new repo page, click **Add file → Upload files**
2. Drag and drop ALL files from this folder (index.html, about.html, events.html, resources.html, style.css, script.js)
3. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to your repo → **Settings** tab
2. In the left sidebar, click **Pages**
3. Under "Branch", select **main** and **/root**, then click **Save**
4. Wait ~1 minute, then refresh the page
5. You'll see a green banner with your live URL: `https://YOUR-USERNAME.github.io/plant-breeding-club/`

### Step 5 — Connect your custom domain (optional)
1. Buy a domain from [Namecheap](https://namecheap.com) (e.g. `uwplantbreedingclub.org`)
2. In GitHub Pages settings, enter your domain under "Custom domain"
3. In Namecheap DNS settings, add a CNAME record:
   - Type: `CNAME`
   - Host: `www`
   - Value: `YOUR-USERNAME.github.io`
4. Also add these A records pointing to GitHub's IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
5. Check "Enforce HTTPS" in GitHub Pages settings

---

## ✏️ How to Update the Site

### Update events
Open `events.html` and find the event cards. Each event looks like this:
```html
<div class="event-card">
  <div class="event-date-box">
    <div class="event-month">Apr</div>   ← Change month
    <div class="event-day">25</div>      ← Change day
  </div>
  <div class="event-info">
    <span class="event-type-badge">Seminar</span>   ← Badge type
    <h3>Spring Kickoff Meeting</h3>                 ← Event title
    <p>Description here...</p>                       ← Description
    <div class="event-meta">
      <span>🕕 6:00 PM</span>           ← Time
      <span>📍 Russell Labs</span>      ← Location
    </div>
  </div>
  <a href="#" class="btn btn-green">RSVP →</a>      ← Replace # with RSVP link
</div>
```

### Update colors
Open `style.css` and look for the `:root` block at the top:
```css
:root {
  --green:  #2b5328;   /* Main dark green */
  --lime:   #9fd43a;   /* Bright accent */
  --cream:  #faf7f0;   /* Page background */
  --orange: #d96b2d;   /* Date/highlight color */
}
```
Change any hex value to update colors site-wide.

### Search for UPDATE comments
Every piece of placeholder text in the HTML is marked with a `<!--UPDATE: ... -->` comment.
Do a Find & Replace (Ctrl+F) for `UPDATE` to find everything that needs to be filled in.

---

## 🔧 Things to Update Before Launch

- [ ] Club email address (currently `uwplantbreedingclub@wisc.edu`)
- [ ] Member/event/department counts on the home page
- [ ] Founding year on the about page
- [ ] RSVP links for all events
- [ ] Join/signup link
- [ ] Mailing list signup link
- [ ] Actual past events
- [ ] Any club-specific description text

---

## 💡 Tips

- **Make edits on GitHub directly**: Click any file → pencil icon to edit in the browser. Changes go live in ~30 seconds.
- **Preview locally**: Just double-click `index.html` to open it in your browser — no server needed.
- **Add a logo**: Save your logo as `logo.png` in the folder and swap the 🌱 emoji in the nav for `<img src="logo.png" alt="Club logo" height="32">`.
