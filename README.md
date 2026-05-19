# Less Zero Calculator

A premium-looking web calculator with support for custom units:
- `H` = 100
- `K` = 1,000
- `L` = 100,000

Example inputs:
- `5K` → 5000
- `2L` → 200000
- `3H` → 300

## Features
- Clean glassmorphism-inspired UI
- Keyboard support for numbers, operators, Enter, Esc, Backspace, and H/K/L unit keys
- Smart result formatting: 164 stays `164`, 157000 becomes `157K`, 520000 becomes `5L 20K`, 1500000 becomes `1M 500K`
- Toggle result display between units and digits with the display button
- Custom unit expansion before evaluation
- Mobile-friendly responsive layout

## Local preview
1. Open `index.html` in your browser.
2. Click buttons or type in the keyboard.

## Publish live with GitHub Pages
1. Create a GitHub repository and push this folder.
2. In GitHub repository settings, enable GitHub Pages for the `main` branch.
3. Set the site folder to `/` and save.
4. Your calculator will be available at `https://<your-username>.github.io/<repo-name>`.

## Files
- `index.html` — markup and page layout
- `styles.css` — premium UI
- `script.js` — calculator logic and custom units
