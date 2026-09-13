# 送禮大作戰

一款模擬情侶在節日與紀念日互送禮物的手機網頁小遊戲。玩家的禮物選擇會影響角色反應、關係發展與最終結局。

## 目前階段

已建立第一個可互動 prototype，用來測試固定節日順序、每回合四個隨機禮物選項、東京專屬清單，以及婚戒出現頻率。這一版不計分。

第一個 MVP 預計包含：

- 開始遊戲畫面
- 一名主要角色或一條關係路線
- 3～5 個節日
- 每個節日數個禮物選項
- 選擇後的角色反應與關係變化
- 至少一個分手結局與一個成功結局
- 重新遊玩

實際範圍以 [`docs/game-design.md`](docs/game-design.md) 的確認內容為準。

## 預計技術

- HTML
- CSS
- 原生 JavaScript
- `localStorage` 本機存檔
- GitHub Pages 發布
- Google Analytics 4 流量與遊戲事件分析

MVP 原則上不需要安裝套件或執行後端服務。

## 預計專案結構

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── game.js
│   └── analytics.js
├── data/
│   ├── holidays.js
│   └── gifts.js
├── assets/
│   ├── images/
│   └── icons/
├── docs/
│   └── game-design.md
├── AGENTS.md
└── README.md
```

資料檔的副檔名會在 prototype 階段確認。直接開啟 HTML 時，獨立 JSON 可能受到瀏覽器安全限制，因此初期也可能使用輸出 JavaScript 物件的 `.js` 資料檔。

## 如何執行

目前 prototype 沒有外部套件，可以直接雙擊 `index.html` 快速體驗。

正式測試或準備上傳 GitHub Pages 時，建議使用本機網站伺服器，讓測試環境更接近正式網站。後續會補上適合團隊的圖形介面操作方式。

## 團隊協作

1. 開始修改前，先在 GitHub Desktop 執行 **Fetch origin** 與 **Pull**。
2. 為每一項功能建立獨立 branch。
3. 完成一個清楚的小範圍修改後 commit。
4. Push branch，建立 Pull Request。
5. 由另一位成員確認畫面與流程後再合併。

更完整的開發規則請閱讀 [`AGENTS.md`](AGENTS.md)。

## 文件

- [`AGENTS.md`](AGENTS.md)：技術方向、協作方式與長期開發規則
- [`docs/game-design.md`](docs/game-design.md)：玩法、流程、數值與待決定事項
- [`docs/prototype-versions.md`](docs/prototype-versions.md)：正式保存的 prototype 版本紀錄
