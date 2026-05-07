self.addEventListener("push", (event) => {
  console.log("[sw.js] Push event received!");
  let data = {};
  try {
    if (event.data) {
      const text = event.data.text();
      console.log("[sw.js] Raw payload:", text);
      data = text ? JSON.parse(text) : {};
    } else {
      console.log("[sw.js] Push event has no data payload.");
    }
  } catch (_error) {
    console.log("[sw.js] Failed to parse JSON, falling back.", _error);
    try {
      data = event.data ? event.data.json() : {};
    } catch (_e2) {
      data = {};
    }
  }
  console.log("[sw.js] Parsed push data:", data);

  const title = data.title || "Antivirus Scanner";
  const body =
    data.body || "Virus scan completed successfully.";
  const tag = data.tag || `scan-${Date.now()}`;

  const options = {
    body,
    tag,
    renotify: true,
    requireInteraction: true,
    silent: false,
  };
  if (data.icon) {
    options.icon = data.icon;
    options.badge = data.icon;
  }

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .catch((err) => {
        console.error("[sw.js] showNotification failed with options:", options, "Error:", err);
        return self.registration.showNotification(title, {
          body,
          tag,
          renotify: true,
        });
      })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});