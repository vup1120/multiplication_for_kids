# 遊玩人數統計後端

自己的統計後端，跑在 Cloudflare Workers（免費方案就夠），資料存在 Cloudflare D1。

* 遊戲送出：開啟次數、開始／完成 10 題、開始／完成 60 秒挑戰，各分中文／德文。
* 不用 cookie、不在手機上存任何東西。伺服器只存每天的總數；「不重複訪客」用 IP＋瀏覽器＋每日更換的鹽做單向雜湊判斷，原始 IP 不會存，雜湊隔天由排程刪除。
* 只接受從 `ALLOWED_ORIGINS`（預設 `https://vup1120.github.io`）送來的資料，統計要用密碼才看得到。

## 第一次部署

需要 Node.js 和一個免費的 Cloudflare 帳號。

```sh
cd backend
npm install
npx wrangler login                          # 瀏覽器登入 Cloudflare
npx wrangler d1 create pig-home-stats       # 把印出的 database_id 貼到 wrangler.toml
npm run db:init                             # 建立資料表
npx wrangler secret put STATS_TOKEN         # 輸入看統計用的密碼
npx wrangler secret put HASH_SECRET         # 輸入一串隨機文字（例如 openssl rand -hex 32 的結果）
npm run deploy                              # 會印出網址，例如 https://pig-home-stats.<帳號>.workers.dev
```

最後把印出的網址填進根目錄 `stats.js` 的 `STATS_ENDPOINT`（不要加結尾的 `/`），推上 GitHub。

## 看統計

用瀏覽器開啟 Worker 網址（例如 `https://pig-home-stats.<帳號>.workers.dev/`），輸入 `STATS_TOKEN` 密碼。可以看最近 7／30／90 天和全部累計、每日明細、10 題完成率。

JSON：`curl -H "Authorization: Bearer <密碼>" "https://.../stats?days=30"`

## 本機測試

```sh
printf 'STATS_TOKEN=test-token\nHASH_SECRET=local\n' > .dev.vars
npm run db:init-local
npx wrangler dev --var ALLOWED_ORIGINS:http://localhost:8000
```
