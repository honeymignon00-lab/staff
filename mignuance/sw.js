/* ホーム画面のアイコンのバッジ（通知の許可）のための最小限の仕組み。通信の中身には触らない（2026-10-30） */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
