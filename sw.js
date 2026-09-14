/* Crazy瘋水餃 PWA — Network First
   目的：
   1. 已安裝 PWA 不用重新安裝
   2. 每次有網路時優先抓最新檔案
   3. 離線時才回退快取
   4. GAS iframe 一律直通，不由這支 SW 快取

   注意：
   - 只改 index.html / 圖片 / manifest，也會在下一次開啟時抓新版。
   - 若改 sw.js 本身，瀏覽器會偵測位元組變化並更新 Worker。
*/
const CACHE = 'crazy-dumplings-shell-v2';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './gs-cover.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(
        SHELL.map(url =>
          cache.add(url).catch(err => {
            console.warn('[Crazy SW] 快取失敗:', url, err && err.message);
          })
        )
      )
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // 只處理 GitHub Pages 自己家的 GET。
  // script.google.com / GAS iframe 不快取、不干涉。
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation =
    req.mode === 'navigate' ||
    /\.html?($|\?)/i.test(url.pathname + url.search);

  // HTML / 導航：Network First + no-store，
  // 避免 GitHub / 瀏覽器 HTTP cache 卡住舊 index。
  const networkRequest = isNavigation
    ? fetch(req, { cache: 'no-store' })
    : fetch(req);

  event.respondWith(
    networkRequest
      .then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE)
            .then(cache => cache.put(req, copy))
            .catch(() => {});
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;

        // 頁面導航斷線時，最後回退到 index.html。
        if (isNavigation) {
          const fallback = await caches.match('./index.html');
          if (fallback) return fallback;
        }

        return Response.error();
      })
  );
});
