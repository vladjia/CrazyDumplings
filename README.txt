Crazy瘋水餃｜專案進度 GitHub 包裝

用途：
- 主站根目錄 index.html：現貨公告產生器
- /progress/index.html：專案進度

使用方式：
把 progress 資料夾整個上傳到目前 GitHub Pages 專案根目錄。

GitHub 結構：
/
├─ index.html                  ← 現貨公告產生器（原本的，不要動）
├─ gs-cover.png               ← 原本已有
├─ favicon.ico                ← 原本已有
├─ favicon-32x32.png          ← 原本已有
├─ apple-touch-icon.png       ← 原本已有
└─ progress/
   └─ index.html              ← 新增這個

之後開：
https://你的GitHubPages網址/progress/

它會包住：
GAS /exec?page=progress

並用與現貨公告相同的方式裁掉 GAS 上方 Google 那一列。

若 Google 上方高度未來改變，只需修改 progress/index.html：
--gs-cover-h:40px;
