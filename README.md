# 小豬快回家！九九乘法

小朋友的九九乘法練習遊戲。

線上玩：https://vup1120.github.io/multiplication_for_kids/

## 加到手機主畫面（可離線玩）

用手機瀏覽器開啟上面的網址，第一次開啟後遊戲會自動存到手機裡。

* **iPhone / iPad（Safari）**：點下方「分享」按鈕 →「加入主畫面」。
* **Android（Chrome）**：點右上角「⋮」→「加到主畫面」或「安裝應用程式」。

之後從主畫面的小豬圖示開啟，就像 App 一樣全螢幕，沒有網路也能玩。遊戲更新後，下次開啟會在背景下載，再下一次開啟就是新版本。

更新素材檔清單時（例如新增錄音檔想預先存好），記得把 `sw.js` 裡的 `VERSION` 改一個新名字。

## 遊玩人數統計

使用 [GoatCounter](https://www.goatcounter.com)：免費、不用 cookie、不收集個人資料，不需要 cookie 同意視窗。

1. 到 goatcounter.com 註冊，取一個代號（例如 `pig-home`，後台網址就是 `https://pig-home.goatcounter.com`）。
2. 把代號填進 `stats.js` 的 `GOATCOUNTER_CODE`。
3. 到後台看數字：
   * 頁面瀏覽次數、不重複訪客、國家、裝置
   * 事件：`start-normal`（開始 10 題）、`start-challenge`（開始 60 秒挑戰）、`finish-normal`（完成 10 題）、`finish-challenge`（60 秒挑戰結束），後面的 `-zh` / `-de` 代表語言
