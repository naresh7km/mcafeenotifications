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
  const options = {
    body: data.body || "Virus scan completed successfully.",
    icon: data.icon || '/111.png',
    badge: '/111.png',
    tag: data.tag || 'antivirus-alert',
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration
      .showNotification(title, options)
      .catch((err) => {
        console.error("[sw.js] showNotification failed:", err);
      })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});