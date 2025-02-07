
self.addEventListener('push', (event:any) => {
  const payload = event.data.json()
  event.waitUntil(
    (self as any).registration.showNotification(payload.title, {
        body: payload.body,
        icon: '/logo192.png',
        tag: payload.tag,
        actions: payload.actions,
        vibrate: [10, 10],
    })
  )

})

self.addEventListener('notificationclick', (event:any) => {
  event.notification.close();
  if (event.action === 'openTransaction') {
      clients.openWindow("/transactions");
  }
  if (event.action === 'openUser') {
      clients.openWindow("/user");
  }
})

export {}