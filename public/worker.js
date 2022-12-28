
async function checkClientIsVisible() {
    const windowClients = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
    });
    for (var i = 0; i < windowClients.length; i++) {
        if (windowClients[i].visibilityState === "visible") {
            return true;
        }
    }
    return false;
}

self.addEventListener('push', function (e) {
    checkClientIsVisible().then(isOpen => {
        if (!isOpen) {
            const data = e.data.json();
            self.registration.showNotification(
                'Cosmopole',
                {
                    body: data.message,
                    icon: 'ifi-coin.png'
                }
            );
        }
    });
});

self.addEventListener('notificationclick', function (event) {
    if (Notification.prototype.hasOwnProperty('data')) {
        event.notification.close();
        event.waitUntil(clients.openWindow('https://internal.cosmopole.cloud'));
    }
});

self.addEventListener("install", event => {
    console.log("Service worker installed");
    caches.open("v1")
        .then(cache => {
            cache.addAll([
                "/favicon.ico",
                "h/manifest.json",
                "/static/js/bundle.js"
            ]);
        });
});
