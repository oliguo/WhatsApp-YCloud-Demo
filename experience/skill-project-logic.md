## Program Logic Map
**Date:** 2026-02-22
**Skill:** project-logic
**Context:** Captured the program flow across list, view, creation, API, and proxy layers.
**Solution:**
- List page loads templates with `api.listTemplates` and navigates to view via `name` + `language` params.
- View page loads a template with `api.getTemplate`, renders components, and performs delete/recreate via `api.deleteTemplate` with `wabaId`.
- Creation page builds per-language payloads, validates, then posts each template via `api.createTemplate`.
- Proxy injects `wabaId`, normalizes variables and buttons, and logs requests/responses.
**Key Files/Paths:**
- /Applications/XAMPP/xamppfiles/htdocs/WhatsApp-YCloud-Demo/template/list/list.js
- /Applications/XAMPP/xamppfiles/htdocs/WhatsApp-YCloud-Demo/template/view/view.js
- /Applications/XAMPP/xamppfiles/htdocs/WhatsApp-YCloud-Demo/template/creation/creation.js
- /Applications/XAMPP/xamppfiles/htdocs/WhatsApp-YCloud-Demo/template/assets/js/api.js
- /Applications/XAMPP/xamppfiles/htdocs/WhatsApp-YCloud-Demo/template/api/proxy.php
**Keywords:** program logic, template flow, proxy, ycloud
