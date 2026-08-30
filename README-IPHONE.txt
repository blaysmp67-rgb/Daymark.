DAYMARK FINAL UPDATE

This package adds:
- PWA notification-tap handling that focuses/open the installed Daymark app scope
- centered bottom + button
- countdown ring that drains toward the next reminder today
- All Reminders screen from the Today card
- calendar-only Calendar tab
- expired reminders automatically removed from Daymark
- compact iPhone date/time fields for New/Edit Reminder
- last page and reminder draft restored after app switching/relaunch
- accent transparency slider next to the color wheel
- persistent Supabase login with no sign-in flash on normal relaunch
- animated Welcome Back splash using the signed-in user's name

DEPLOY:
1. Run daymark_permissions.sql once in Supabase SQL Editor.
2. Replace schedule-reminder/index.ts in Supabase Edge Functions with schedule-reminder-index.ts and deploy.
3. Keep these Edge Function secrets:
   ONESIGNAL_APP_ID
   ONESIGNAL_REST_API_KEY
4. Upload these files to the ROOT of the GitHub repo:
   index.html
   manifest.json
   OneSignalSDKWorker.js
   icon-192.png
   icon-512.png
5. Render Static Site: Build Command blank, Publish Directory .
6. Deploy the latest commit.
7. Delete the old Home Screen Daymark icon and install the updated Render site again so iOS receives the new manifest/service worker.
8. Open Daymark from the Home Screen, sign in, and enable notifications.

NOTE ABOUT iPHONE NOTIFICATION TAPS:
The service worker now explicitly focuses an existing Daymark window or opens the root app scope. iOS controls the final launch surface, so this is the strongest PWA-side behavior available, but iOS may still choose Safari in some edge cases.
