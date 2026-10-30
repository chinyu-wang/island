# 靜宜觀光島 V1（含三隻貓咪）

純 HTML / CSS / ES Modules / Three.js 的創意 3D 島嶼導覽網站；九個主題對應靜宜大學觀光事業學系官網，不是實際校園地圖。

## GitHub Pages

將本資料夾**內**全部檔案與資料夾放至 GitHub repository 的根目錄，從 repository `main` 的 `/ (root)` 發佈 Pages 即可。也可以直接放在其他公開靜態網站主機。`index.html` 使用相對路徑，因此支援 `/repo-name/` 子路徑。

> Three.js 透過 jsDelivr CDN 載入，訪客需連網。ES module 在一些瀏覽器不能從 `file://` 正常匯入，建議透過 GitHub Pages 預覽，或在本機執行 `python3 -m http.server 8000` 並開啟 `http://localhost:8000/`。

## 主要功能
- 拖曳轉動、滑鼠滾輪/觸控縮放、鳥瞰和全景視角
- 9 座主題地標、地標清單、資訊側欄、連到觀光系官方網站
- 清晨、白天、黃昏、夜晚四種燈光
- 3 隻 Low-poly 貓咪：散步、停下、坐著、轉向，點擊會說話
- 桌機和行動裝置相容
- 以幾何體即時生成場景，不需要額外 3D 模型檔案

## 如何修改
- `data/locations.js`：9 個主題資訊、建築位置、網址（網站更新後可改網址）
- `js/island.js`：地形、道路、樹木、海洋
- `js/buildings.js`：九座造型建築
- `js/cats.js`：貓咪外型、散步範圍、對話、速度
- `js/main.js`：鏡頭操作、點擊事件、日夜切換、介面
- `css/style.css`：畫面介面

## 注意
目前屬於第一版展示型原型。地標連結優先採官網已核對的深層網址，部分介紹入口會先連至官網首頁；正式公開前建議逐一點選確認。Three.js 固定版本 `0.170.0`。本作品與原「靜宜島」範例為不同實作。
