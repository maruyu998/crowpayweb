self.addEventListener('install', function(event) {});

self.addEventListener('fetch', function(event) {});

self.addEventListener('push', function(event) {
    const payload = event.data.json()
    console.log(payload)
    event.waitUntil(
      self.registration.showNotification(payload.title, {
          body: payload.body,
          icon: './icon192.png',
          tag: payload.tag,
          actions: payload.actions,
          vibrate: [10, 10],
      })
    )

})

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    if (event.action === 'openTransaction') {
        clients.openWindow("/#/transactions");
    }
    if (event.action === 'openUser') {
        clients.openWindow("/#/user");
    }
})