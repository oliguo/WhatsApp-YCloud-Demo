# WhatsApp-YCloud-Demo
Implement WhatsApp Functions via YCloud API.

## Program Details
- Frontend pages live under `template/` (list, view, creation) and use vanilla HTML/CSS/JS.
- Backend proxy at `template/api/proxy.php` sends requests to YCloud and logs to `template/logs/`.
- Deleting templates uses the YCloud path format: `/whatsapp/templates/{wabaId}/{name}/{language}`.

## Preview
![Preview 1](screenshots/preview-1.png)
![Preview 2](screenshots/preview-2.png)
![Preview 3](screenshots/preview-3.png)

## API Doc
https://docs.ycloud.com/reference/introduction