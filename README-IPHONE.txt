DAYMARK FINAL 1:1 UI BUILD

This package is the complete deployable Daymark web app.

ROOT FILES TO UPLOAD TO GITHUB:
- index.html
- manifest.json
- OneSignalSDKWorker.js
- icon-192.png
- icon-512.png

BACKEND FILES (do not upload as website files unless you want a backup):
- schedule-reminder-index.ts
- daymark_permissions.sql

RENDER:
- Static Site
- Branch: main
- Build Command: blank
- Publish Directory: .

SUPABASE:
- Authentication > URL Configuration:
  Site URL = your current Render URL
  Redirect URLs = your current Render URL + trailing slash
- Authentication > Providers > Google:
  Enable Google and save your Google Web Client ID + Client Secret.
- Google Cloud OAuth client:
  Authorized JavaScript origin = your current Render origin
  Authorized redirect URI = the exact callback URL shown on Supabase's Google provider page.

ONESIGNAL:
- Web configuration Site URL must equal your current Render origin exactly.
- Keep the service worker at /OneSignalSDKWorker.js.

EDGE FUNCTION:
- Replace schedule-reminder/index.ts with schedule-reminder-index.ts and deploy.
- Required secrets:
  ONESIGNAL_APP_ID
  ONESIGNAL_REST_API_KEY
- Optional but recommended secret:
  DAYMARK_APP_URL = your current Render URL (for notification click-through)

IPHONE:
- Remove any old Home Screen Daymark install after changing Render domains.
- Open the NEW Render URL in Safari.
- Share > Add to Home Screen.
- Open Daymark from the Home Screen icon.
- Sign in and enable notifications.
