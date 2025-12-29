**chinatownrevita.ca**

This repository contains the public website for Re:VITA (熱鬧俱樂部), a grassroots, youth-driven community organization based in Edmonton’s Chinatown.

The site is a simple, static website designed to:

* showcase Re:VITA’s work and values
* invite community members to get involved
* share events, initiatives, and ways to connect

The site is intentionally lightweight and easy to maintain.

---

## Live site

🌐 **[https://chinatownrevita.ca](https://chinatownrevita.ca)**

---

## What this site is (and isn’t)

**This site is:**

* a public-facing introduction to Re:VITA
* primarily informational
* designed for community members, volunteers, partners, and funders

**This site is not:**

* a blog
* a CMS
* a place for frequent updates or announcements
  (Those happen on Instagram and in real-world gatherings.)

---

## Site structure

```
/
├─ index.html        # Main page content and structure
├─ styles.css        # All styling and layout
├─ script.js         # Interactive behaviour (slideshows, etc.)
├─ manifest.json     # Image lists for slideshows
└─ assets/
   ├─ logo.svg
   ├─ ctad/
   ├─ cleanups/
   ├─ mahjong/
   ├─ hope-stoves/
   ├─ housing/
   └─ get-involved/
```

---

## Updating text content

All public copy lives directly in `index.html`.

To update text:

1. Open `index.html`
2. Edit the relevant section
3. Commit and push changes
4. GitHub Pages will update the live site automatically

**Tip:** Please review changes in a browser before committing.

---

## Updating photos

Photos are organized by initiative inside the `assets/` folder.

To update photos:

1. Replace or add images in the appropriate folder
2. Keep filenames consistent (e.g. `01.jpg`, `02.jpg`)
3. Update `manifest.json` if adding new images
4. Commit and push

**Recommended photo specs:**

* Landscape orientation
* ~2500–3000px wide, 3:2 ratio for hero photos
* JPG format
* Optimized for web (not raw camera files)

---

## Image slideshows

Slideshows are controlled by `manifest.json`.

Each section reads from its corresponding list, for example:

```json
"ctad": [
  "assets/ctad/01.jpg",
  "assets/ctad/02.jpg"
]
```

Images rotate automatically and independently.

---

## Deployment & hosting

* Hosted using **GitHub Pages**
* Custom domain: **chinatownrevita.ca**
* HTTPS handled automatically by GitHub

No server maintenance is required.

---

## Making changes safely

For small edits:

* Use GitHub’s web editor
* Commit directly to `main`

For larger edits:

* Clone the repository locally
* Test changes in a browser
* Push when ready

---

## Accessibility & tone

When making changes, please keep in mind:

* Clear, plain language
* Community-centred tone
* Respectful representation of Chinatown and its people
* Avoid jargon or overly technical language

---

## Future work (planned, not active)

Ideas that may be explored in the future:

* bilingual (English / Traditional Chinese) toggle
* expanded accessibility features
* additional project pages if needed

These are **not active development priorities** unless explicitly agreed upon by the team.

---

## Contact

For questions about the website or updates:

* William Lau william@hotandnoisy.club

---

## Final note

This website is meant to support Re:VITA’s work — not replace real-world relationships.

If you’re reading this and want to get involved, please come meet us in person.
