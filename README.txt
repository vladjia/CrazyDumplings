Crazy瘋水餃｜GitHub Pages PWA 外殼

檔案請全部放在 GitHub repo 根目錄：
- index.html
- manifest.webmanifest
- sw.js
- favicon.ico
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- icon-192.png
- icon-512.png
- icon-maskable-512.png
- gs-cover.png

index.html 已包含：
1. iframe 包 GAS
2. 固定 page=stock，只開 StockNotice.html
3. GS-COVER：將 iframe 往上裁 40px，遮掉 GAS 上方 Google 條
4. PWA manifest
5. Service Worker
6. Android / iOS PWA icon
7. favicon
8. 品牌 loading cover / gs-cover.png

你只要修改 index.html 這一行：
const GAS_WEB_APP_URL = "PASTE_YOUR_GAS_WEB_APP_EXEC_URL_HERE";

貼入 GAS 部署的 /exec 網址即可。

如果 Google 上方條未來高度有改：
index.html 搜尋：
--gs-cover-h:40px;
只改 40px 即可。
