DAYMARK FINAL RENDER - GOOGLE SIGN-IN UPDATE

Upload the website files in this ZIP to the ROOT of your GitHub Daymark repository.
Render URL: https://daymark-3.onrender.com/

Included features:
- Email sign up / sign in / sign out
- Google sign in / sign up button through Supabase OAuth
- Cloud-saved reminders and settings
- OneSignal background push scheduling
- Smart reminder colors/icons
- Drag color wheel
- RGB mode
- Date and time stacked vertically
- PWA/Home Screen support
- Double-tap zoom prevention

IMPORTANT GOOGLE SETUP (one time):
The Google button is included in the app, but Google OAuth will only work after Google is enabled in Supabase Authentication -> Providers -> Google with a Google OAuth Client ID and Client Secret. Also add https://daymark-3.onrender.com/ to Supabase's allowed redirect URLs.

Do NOT put the Google client secret or OneSignal REST API key in index.html/GitHub.
