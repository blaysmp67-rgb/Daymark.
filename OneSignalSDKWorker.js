/* Daymark notification click handler: focus the installed PWA if it is already open,
   otherwise open the root of the installed app scope. Register this handler before
   OneSignal's worker so iOS gets the PWA-focused behavior first. */
self.addEventListener("notificationclick", (event) => {
  event.stopImmediatePropagation();
  event.notification.close();
  event.waitUntil((async () => {
    const scopeUrl = new URL(self.registration.scope);
    const windows = await clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = windows.find((client) => {
      try { return new URL(client.url).origin === scopeUrl.origin; } catch { return false; }
    });
    if (existing) {
      try {
        if ("navigate" in existing && new URL(existing.url).pathname !== "/") {
          await existing.navigate(scopeUrl.href);
        }
      } catch {}
      return existing.focus();
    }
    return clients.openWindow(scopeUrl.href);
  })());
});

importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
