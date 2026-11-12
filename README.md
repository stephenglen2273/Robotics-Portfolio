# Robotics-Portfolio

Personal robotics portfolio site — plain HTML/CSS/JS, no build step, hosted on GitHub Pages.

Live at: https://stephenglen2273.github.io/Robotics-Portfolio/

## Editing content

All content lives in **`assets/js/data.js`**:

| Section    | Key                  |
|------------|----------------------|
| Name, intro, about, contact, social links | `profile` |
| Project cards + pop-up details | `projects` |
| Skills     | `skills`             |
| Experience / education | `timeline` |

### Adding a project

1. Drop an image (16:9 works best) in `assets/img/projects/`, e.g. `rover.jpg`.
2. Add an entry to `projects` in `data.js`:

```js
{
  title: "Mars Rover Prototype",
  year: "2025",
  summary: "One-line description for the card.",
  tags: ["ROS 2", "Mechanical"],
  image: "assets/img/projects/rover.jpg",
  featured: true,
  details: ["Longer paragraph shown in the pop-up."],
  highlights: ["Key result 1", "Key result 2"],
  links: { code: "https://github.com/...", video: "https://youtu.be/..." }
}
```

YouTube links in `links.video` are embedded in the project pop-up automatically. Projects without an image get a generated cover.

### Photo & résumé

- Photo: add `assets/img/me.jpg`, set `profile.photo: "assets/img/me.jpg"`.
- Résumé: add `assets/resume.pdf`, set `profile.resume: "assets/resume.pdf"` (button hides when empty).

## Preview locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploying (GitHub Pages)

Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Each push to `main` redeploys in about a minute.
