# 送禮大作戰

一款手機優先的情侶送禮選擇遊戲。玩家會在不同節日與紀念日挑選禮物，觀察女友反應、好感度變化與最後結局。

正式遊戲網址：<https://twomoregames.space/gift-game/>

## 目前版本

目前已完成可公開測試的 MVP，包含：

- 開始畫面、14 個事件與每題 4 個禮物選項
- 初始好感度 30 分，禮物會造成 `+10`、`+5`、`0`、`-10` 或 `-20` 的變化
- 一般禮物、東京出差專屬禮物與隨機出現的求婚戒指
- 好感度降到 0 時提前結束，以及完成全部事件後依分數判定的 6 種一般結局
- 求婚成功與求婚失敗 2 種特殊結局
- 踩雷次數、神級送禮次數、重新遊玩與複製遊戲連結
- 遊戲首頁、送禮研究所文章及工作室共用頁尾
- 玩家同意分析 Cookie 後，使用 GA4 統計遊戲開始、禮物選擇、結局、重玩與分享事件

遊戲進度目前只保存在開啟中的頁面記憶體；重新整理或關閉頁面會失去進度，尚未使用後端、登入或資料庫。全站 Cookie 同意工具會使用 `localStorage` 保存玩家的分析同意選擇。

詳細玩法與數值請見 [`docs/game-design.md`](docs/game-design.md)。

## 技術與專案結構

專案使用 HTML、CSS 與原生 JavaScript，沒有套件、框架或建置步驟。

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js       # 事件、禮物、反應與結局內容
│   └── game.js       # 遊戲流程與畫面互動
├── assets/           # 遊戲與社群分享圖片
├── articles/         # 送禮研究所文章
├── docs/
│   ├── game-design.md
│   └── prototype-versions.md
├── AGENTS.md
└── README.md
```

工作室首頁、隱私權政策與共用頁尾由另一個 Repository `tutu-playlab/tutu-playlab.github.io` 維護；本專案發布在 `/gift-game/` 路徑。

## 如何在本機執行

為了讓網站根目錄連結與共用頁尾正常載入，建議透過本機網站伺服器預覽，不要只用 `file://` 雙擊開啟。

如果電腦已有 Python，可在同時包含工作室網站與 `gift-game/` 的網站根目錄執行：

```bash
python3 -m http.server 4173
```

再開啟 `http://127.0.0.1:4173/gift-game/`。若只從本 Repository 啟動伺服器，遊戲本身仍可測試，但工作室共用頁尾可能因缺少根目錄 `/components/` 而無法載入。

## 團隊協作

1. 開始修改前先 Fetch／Pull 最新的 `main`。
2. 每項工作建立獨立的 `codex/` 或團隊功能 branch。
3. 修改後檢查主要遊戲流程、手機與桌面畫面及瀏覽器錯誤。
4. Commit、Push branch 並建立 Pull Request。
5. 由另一位成員確認後再合併到 `main`，等待 GitHub Pages 部署。

完整規則請閱讀 [`AGENTS.md`](AGENTS.md)。

## 文件

- [`AGENTS.md`](AGENTS.md)：技術方向、隱私提醒、Git 與發布流程
- [`docs/game-design.md`](docs/game-design.md)：目前玩法、資料規則、數值與待辦
- [`docs/prototype-versions.md`](docs/prototype-versions.md)：正式保存的 prototype 版本紀錄
