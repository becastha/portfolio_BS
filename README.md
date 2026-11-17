# portfolio_BS
I've created a dynamic portfolio that fetches data from a JSON file instead of using hardcoded HTML. Feel free to clone and edit it if you find it useful. I plan to update it regularly.

## Run it

The site is plain HTML, CSS and ES modules: no build step. It loads JSON with `fetch`, so serve the folder instead of opening `index.html` directly:

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123.

## The look

The site is one scrolling page drawn like an old ink-on-paper architectural sheet: ochre paper, ink rules, and red-brown pillars carrying the name. The whole look is in `src/shared/styles/manuscript.css`; the page shell is `index.html`.

The earlier notebook version (spiral binding, folding pages, themes, sound, starfield) is still available at `notebook.html` with its entry point `src/app/notebook.js`. It uses the `notebook`, `settings`, `sound` and `starfield` features, which the main page does not.

## Animation

- **Lines:** every line is drawn slowly: the pillars and the plinth stroke by stroke, box borders side by side (`data-ink-box` in `index.html`), and the rules under rows as they scroll into view (`src/shared/ui/line-drawing.js`; timing in `manuscript.css`).
- **Skyline:** the Kathmandu skyline is drawn along the bottom of the window as the page opens: the pen traces its contours from left to right and the ink follows. The artwork is `src/features/skyline/view/assets/kathmandu-skyline.svg` (the `skyline` feature loads it).
- **Shooting stars and sparks:** every SVG line has a shooting star on its tip while it is drawn; sparks fly where a line ends and where two stars come close (`src/shared/ui/drawing-stars.js`).
- **Name and title:** the name appears letter by letter, then the title. Each entry of `roles` in `profile.json` appears in turn and is knocked down to make way for the next; the last one stays (currently Developer, then Engineer). Timings are in `src/features/profile/profile-constants.js`.
- Visitors who ask their system for reduced motion see the finished page straight away.

## Turning pages (notebook version only)

- Drag a page upwards with the mouse to fold it over; drag downwards to fold the previous page back. Let go past about a third of the way and the page turns, otherwise it falls back.
- Buttons, arrow keys, Space, Home and End, and swiping on touch screens also turn pages.

## Structure: feature-first MVVM

```
index.html                  page shell (markup only)
notebook.html               the earlier notebook version
src/
  app/                      entry points: the only code that knows more than one feature
  features/<feature>/
    <feature>-constants.js  ids, CSS classes, URLs and settings of the feature
    data/                   the feature's JSON content
    model/                  loads and shapes data, holds state (no DOM)
    viewmodel/              observable state + commands for the view
    view/                   DOM rendering, events and the feature's CSS
  shared/                   code used by more than one feature
    constants/  data/  localization/  logging/  mvvm/  ui/  styles/
```

Features: `notebook` (pages, flipping, zoom, keyboard and swipe), `profile` (cover), `overview`, `projects`, `skills`, `experience`, `languages`, `settings` (theme and font), `sound`, `starfield` (background).

Rules of the structure:

- A feature never imports another feature. Only the entry points in `src/app` know more than one.
- A View talks only to its ViewModel; a ViewModel never touches the DOM; a Model knows neither.
- Text the visitor sees lives in `src/shared/localization/locales/en.json` (interface text) or in a feature's `data/*.json` (content). Other strings are named constants.

## Edit the content

| What | File |
| --- | --- |
| Name, title (`titlePrefix` + `roles`), location, social links | `src/features/profile/data/profile.json` |
| Quote and overview sections | `src/features/overview/data/overview.json` |
| Projects | `src/features/projects/data/projects.json` |
| Skills | `src/features/skills/data/skills.json` |
| Work experience | `src/features/experience/data/experience.json` |
| Spoken languages | `src/features/languages/data/languages.json` |
| Buttons, headers, messages | `src/shared/localization/locales/en.json` |
