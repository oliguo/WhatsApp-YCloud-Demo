## WhatsApp Template Manager Logic
**Date:** 2026-02-22
**Context:** High-level flow and responsibilities across list, view, creation, and proxy modules.
**Best Practice:**
- Use list -> view -> creation flow; view relies on `name` + `language` query params and list uses client-side filters.
- Route all API calls through `template/api/proxy.php`, which injects `wabaId` and normalizes template payloads.
- Use YCloud delete path format: `/whatsapp/templates/{wabaId}/{name}/{language}` and pass `template.wabaId`.
- Keep i18n handled via `i18n.init()` and `t()`; update locale with the language selector to re-render text.
**Keywords:** program logic, template flow, ycloud api, proxy
