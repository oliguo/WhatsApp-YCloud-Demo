# WhatsApp-YCloud-Demo Copilot Instructions

## Project overview
- This repo is a static HTML/CSS/JS template creator for WhatsApp message templates using the YCloud API concepts; there is no build system or package manager.
- The primary UI lives in [template/creation/index.html](template/creation/index.html) with styling in [template/creation/style.css](template/creation/style.css) and behavior in [template/creation/script.js](template/creation/script.js).
- The form submits to a placeholder PHP endpoint that just prints POST data: [template/creation/submit.php](template/creation/submit.php).
- The long-form YCloud WhatsApp template API reference is embedded in [template/creation/readme.md](template/creation/readme.md).

## Data flow & UI behavior
- Form inputs are wired by `id`/`name` attributes in the HTML and referenced directly by DOM selectors in `script.js`.
- Live preview is driven by `updatePreview()`; it reads the active language tab (`.lang-content.active`) and mirrors header/body/footer and buttons into the mock WhatsApp UI.
- Button limits and types are enforced by `buttonTypeLimits` and `buttonTypeCounts` in `script.js`; preview shows up to 3 buttons and then a “See all options” button.
- WhatsApp formatting toolbar inserts markers (e.g., `**bold**`, `_italic_`, `~strike~`, ```code```) into the textarea; preview converts those markers to HTML.

## Conventions specific to this repo
- Keep HTML structure and CSS selectors stable; JS relies on class names like `.lang-tab`, `.body-editor`, `.button-item`, and IDs like `templateForm`.
- Prefer editing the 4-part structure in `script.js` (Initialization, Toolbar, Buttons, Submission) to keep logic grouped as currently organized.
- Any backend integration should extend `submit.php` rather than replacing the form’s `action`, unless you also update the HTML.

## Developer workflow
- No build step: open [template/creation/index.html](template/creation/index.html) in a browser to test UI changes.
- Use a local PHP server if you need to exercise POST handling for `submit.php`.

## External references
- Base API documentation link: [README.md](README.md).