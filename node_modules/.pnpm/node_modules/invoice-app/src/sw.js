import { precacheAndRoute } from "workbox-precaching";

// The `self.__WB_MANIFEST` is a placeholder that vite-plugin-pwa will
// replace with the list of all your app's files (JS, CSS, images, etc.)
// during the build process.
precacheAndRoute(self.__WB_MANIFEST);

// You can add other service worker logic here if you need it,
// like handling push notifications or background sync.
