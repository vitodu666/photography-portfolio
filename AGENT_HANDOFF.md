# 跨 Agent 接手指南（任何品牌的 AI 都能改这个站）

> 给"未来可能接手这个网站的 AI Agent"看的第一份文件。也给你自己看——你不需要懂技术，看最后一节就知道怎么考一个新 Agent 行不行。
> 配套必读：`HANDOFF.md`（工程决策与坑）、`网站维护说明.md`（日常换图流程）。

---

## 一、这个站是什么（30 秒定位）

- **纯静态站点**：HTML + CSS + 原生 JS，**无后端、无数据库、无构建步骤**。整站就是一堆文件 + 图片。
- **任何 Agent 改它的方式都一样**：读文件 → 改文件 → 重新发布。不认"谁写的"，只认"文件写没写清楚"。所以可移植性 = 文件清晰 + 有本文档。
- **入口目录**：`prototypes/hero-options/`（根目录 `index.html` 只是跳转壳，别动它）。
- **公开访问入口**：`prototypes/hero-options/index.html`。

---

## 二、接手第一步（必做，别跳过）

1. 读 `HANDOFF.md` 全文（架构、已确认的设计决策、踩过的坑）。
2. 读 `网站维护说明.md`（日常换图/加系列流程）。
3. 读 `prototypes/hero-options/sync-media-data.mjs`（数据是怎么从图片文件夹自动生成的——**这是理解全站内容来源的关键**）。
4. 本地起静态服务器预览：`python3 -m http.server 8123 --directory photography-portfolio`，访问 `http://localhost:8123/prototypes/hero-options/index.html`。

读完这 4 步，你就能继续开发，不用重新问用户已确认过的问题。

---

## 三、加一组新作品（精确文件级步骤）

### 人像 / 商业
1. 在 `图片/人像/`（或 `图片/产品/`）下新建一个**数字组号文件夹**，例如 `23`。
2. 里面新建 `网站展示` 文件夹。
3. 放一张命名 `封面` 的图（JPG/JPEG/PNG/WEBP/AVIF 均可）+ 其余组图。
4. 若这组有正式中英文名，在 `sync-media-data.mjs` 顶部的 `portraitMetadata`（或 `commercialMetadata`）表里加一行 `"23": ["English Name", "中文名"]`；不加则网页显示中性编号 `Portrait 23`。
5. 跑同步脚本（见第五节）→ 数据自动写入 `portfolio-data.js` / `commercial-data.js`。**不要手改这两个生成文件**，下次同步会被覆盖。

### 日常（风光/旅行）
1. 在 `图片/风光/` 下新建**地点文件夹**，例如 `北海`。
2. 里面建 `网站展示`，放 `封面` + 组图。
3. 在 `sync-media-data.mjs` 的 `journalMetadata` 加 `[地点, "id", "English", "中文"]`，并在 `journalOrder` 数组里排好顺序。
4. 跑同步脚本。

### 改排序 / 精选
- 人像首页精选顺序：改 `sync-media-data.mjs` 里的 `portraitFeaturedOrder` 数组（数组下标 = featuredRank）。
- 商业同理：`commercialFeaturedOrder`。

---

## 四、改文案 / 样式（注意坑）

- 所有页面结构、样式在 `prototypes/hero-options/` 的 `*.html` / `*.css` / `*.js`。
- **改完 CSS/JS 必须递增缓存戳**：文件引用带 `?v=YYYYMMDDx`，当前值见 `index.html` 等头部 `<script>/<link>` 标签，否则用户浏览器不刷新。
- 响应式改动务必 grep 桌面端同选择器的全部约束（`max-width`/`min-*`/`top`/`left`），媒体查询只覆盖记得的属性会跨断点泄漏（见 HANDOFF 坑 #8）。
- 已确认的设计决策（1:2 首屏、不用 GIF、导航格式、商业 L2 是独立页不是弹窗…）**不要推翻**，除非用户主动提。

---

## 五、同步与发布（两步，可重复）

### 步骤 1：同步数据（本地）
```
cd photography-portfolio/prototypes/hero-options
node sync-media-data.mjs
```
或双击 `同步图片.command`（macOS）。脚本扫描 `图片/` 目录，重建 `portfolio-data.js` / `commercial-data.js` / `hero-media.js`。

> ⚠️ **上线前压图**：`图片/*/网站展示/` 里的原图通常很大，直接上线加载极慢。发布前把组图导出为长边 ≤ 2000px、质量 ~82 的 JPG/WebP 覆盖进 `网站展示`（封面建议 2:3 竖图）。脚本只读取 `网站展示`，压过的即在线上。

### 步骤 2：发布（部署到正式域名 · 已锁定 EdgeOne Pages）
整目录 `prototypes/hero-options/` 作为静态站点发布（入口 `index.html`）。
- **最终方案：腾讯云 EdgeOne Pages（用户自己账号，A 方案）**。长期免费、国内边缘加速、自带免费二级域名 `前缀.edgeonepages.com`（前缀用户自定、免备案、零花费）。支持连 Git 仓库**自动部署**——任何 AI 改完 `git push` 即上线，**不依赖 BB / WorkBuddy 额度**。极简分步指引（含命名方案、注册、两种部署方式）见 `部署上线-EdgeOne-Pages-极简指引.md`。
- 两种部署方式：① Git 自动部署（推荐，治"换 AI 绑死"，任何 Agent push 即上线）；② 控制台直接上传（零 Git 知识，但更新需手动重传）。
- 备选：Cloudflare Pages（境外节点、`*.pages.dev` 免费域名）；自购 `.com`（≈¥73/年）+ ICP 备案后绑 EdgeOne 自定义域名。详见 `国内发布与域名建议.md`。
- 详细 SOP 见 `HANDOFF.md` 第八节。

### 步骤 3（已做，勿删）：防盗保护
`prototypes/hero-options/site-protect.js` 全局禁用图片/视频的**右键保存、拖拽、移动端长按保存、视频下载按钮**。用户明确选择「仅禁用右键、不打水印」，保持作品纯净观感。改全局防盗策略只动这一个文件，不要删。

---

## 六、禁止事项（动了会破坏可移植性）

- ❌ 手改 `portfolio-data.js` / `commercial-data.js` / `hero-media.js`（自动生成，下次同步覆盖）。
- ❌ 把站点拆成需要后端/数据库才能跑的架构（会丧失"纯静态、任何托管直接拷走"的优势）。
- ❌ 删掉 `HANDOFF.md` / `网站维护说明.md` / 本文件（这是接手方唯一上下文来源）。
- ❌ 推翻 HANDOFF 里"已确认的设计决策"列表，除非用户明确说要改。

---

## 七、给用户：怎么判断一个新 Agent 能不能接手（不用懂技术）

把下面这句话直接发给任何新 Agent，看它答得上来还是瞎编：

> "你先读 `HANDOFF.md`、`网站维护说明.md` 和 `prototypes/hero-options/sync-media-data.mjs`，告诉我：我要加一组新的人像作品，需要改哪几个文件、怎么让网页更新、怎么发布上线？"

- **答得上来、步骤对**（新建图片文件夹 → 跑同步脚本 → 部署）→ 它能接手。
- **答不上来 / 让你把图发它、它来手动改网页路径** → 它不懂这套架构，别让它碰，换一个。

你的照片只要按"放进 `图片/人像/组号/网站展示/`"的规矩放好，任何懂这套文档的 Agent 都能帮你加进网页——你不需要会代码。
