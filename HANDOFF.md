# 网站工程交接文档（HANDOFF）

> 最后更新：2026-08-14 晚。本文档是接手本项目的第一入口，读完即可继续开发，无需重新问用户已确认过的问题。
> 根目录里还有上一任 agent 留下的 `网站工程交接说明.md` 等文档，那些描述的是**改造前**的原始状态，以本文档为准。

---

## 一、项目现状一句话

摄影师（渡梵，DU WENTONG）的个人作品集网站，**纯静态站点**（HTML + CSS + 原生 JS，无框架、无构建步骤），已部署在国内可访问的 CloudStudio 临时分享链接。

- **当前线上地址**：https://eb93871a8c8b4420b2500446bde296c7.app.workbuddy.link
- **本地预览**：项目根目录起静态服务器（如 `python3 -m http.server 4174`），访问 `http://127.0.0.1:4174/prototypes/hero-options/index.html`
- **实际站点入口**：`prototypes/hero-options/` 目录（根目录的 `index.html` 只是跳转壳）

## 二、页面架构（三层）

```
L0  prototypes/hero-options/index.html      首页：首屏视频轮播 + 人像12图 + 商业 + 日常精选
L1  portraits.html / commercial.html / journal.html   三分类总览页
L2  series.html?kind=portrait|commercial|journal&id=xxx   系列详情页（所有 L2 共用这一个模板）
```

核心版式原则（用户明确拍板）：**所有 L1 共用一套模板结构，所有 L2 共用 series.html**，内容不同、骨架必须同构。商业页黑底通过 CSS 变量控制，不另起炉灶。

桌面端三列错速滚动（GSAP ScrollTrigger，本地打包在 `vendor/`，不走 CDN），手机端单列。

## 三、关键文件地图

| 文件 | 作用 |
|---|---|
| `prototypes/hero-options/index.html` | L0 首页结构 |
| `styles.css` | L0 专属样式（含首屏 1:2 画幅、视频过渡） |
| `foundation.css` | 全站共享样式（header/nav 统一在这里） |
| `script.js` | L0 逻辑：首屏视频轮播 + autoplay 三层兜底 |
| `hero-media.js` | 首屏 5 个视频的源路径配置 |
| `portfolio-data.js` | **全站内容数据源**：系列列表、图片路径、featuredRank 精选排序。加系列/换图基本只改这里 |
| `series.html` + `series-page.js` + `series.css` | L2 系列详情页模板及渲染逻辑（按 URL 参数区分人像/商业/日常） |
| `commercial.html` / `portraits.html` / `journal.html` | L1 三页（结构同构） |
| `archive.css` | L1 页面样式 |
| `图片/首屏视频/` | 首屏 5 个竖构图 MP4（2:3 原比例，约 14MB） |
| `图片/人像/` `图片/产品/` `图片/风光/` | 作品图库（326 张，路径已全量校验） |

## 四、已确认的设计决策（不要推翻，除非用户主动提出）

1. **首屏画幅 1:2**：纯 CSS 遮罩，视频文件一个字节没动。桌面端容器 `aspect-ratio: 1/2` + `height: min(72vh, 760px)`；手机端（≤900px）写死 `width: calc(min(58vh, 580px) / 2)` + `max-width: none` + `height: min(58vh, 580px)`（见坑 #8，宽度必须显式推导，不要依赖 `aspect-ratio` 在绝对定位下自动算宽）。视频原文件是 2:3 竖构图，用 `object-fit: cover` 裁左右、不压扁。
2. **不用 GIF**：画质差体积大，已论证并否决。保持 MP4。
3. **左上角品牌名格式**：所有页面统一为 `DU WENTONG <span>首页</span>`（wordmark 后加中文小字），点击回首页。样式与导航中文标注一致（`.wordmark span` 共用 `.site-nav span` 的样式）。
4. **导航格式**：英文 + 中文小字（`Portrait <span>人像</span>`）。
5. **视频过渡**：交叉淡化 + 柔焦缩放，出屏视频在 700ms 过渡期内继续播放（不立即 pause），切换触发点在片尾前 0.76s。手机端（≤900px）回退纯 opacity 过渡，避免 blur 掉帧。
6. **商业 L2 是独立页面**，不是弹窗（历史上是 dialog 弹窗，已重构掉，别改回去）。
7. **L0 人像区展示 12 张指定图片**（featuredRank 控制），人像/商业板块结尾有"更多"按钮跳 L1。
8. **L2 底部 Next series 整块可点击**（`<a>` 包裹，不是只有按钮可点）。
9. **L2 底部新增 Previous series / 上一组**：位于黑块左上角（ carve-out 小块，独立可点，只显示中英标签不加系列名）；Next series / 下一组 标签在黑块右上角；下面大字系列名保持为下一组主 CTA。首组不显示「上一组」，末组不显示「下一组」，不循环。
10. **L0 桌面端三列错速滚动倍速 = 1.8**：`script.js` 第 152 行 `const portraitMotionStrength = 1.8`，只影响桌面端（`min-width: 901px`）三列错速的位移幅度，手机端单列不受影响。用户从 1.5 调到 1.8 是因为原速度感不明显。**调这个值时注意**：它是位移倍数，不是跟手延迟；跟手延迟是另一个独立参数 `scrub: 0.65`。两者别搞混。

## 五、踩过的坑（前人用时间换来的，直接绕开）

1. **视频轮播不循环**：`<video>` 加 `loop` 属性后 `ended` 事件永远不触发。解法：不加 loop，用 `timeupdate` 在剩余 0.76s 时触发切换。
2. **手机端首屏字母 G 被截断**：`line-height: 0.77` 太紧 + overflow hidden，改 0.84 解决。
3. **手机端导航中文不显示**：`styles.css` 里曾有 `.site-nav span { display: none; }` 移动端规则，删除解决。改导航时注意别再引入。
4. **手机端视频不自动播**：根因是移动端浏览器 autoplay 策略（低电量模式 / 微信内置浏览器）。已做三层兜底：直接播 → 轻触/滚动即播（播成功才移除监听，不是 once）→ 微信等 `WeixinJSBridgeReady`。电脑端一直正常。
5. **macOS zip 解压中文乱码**：用 `ditto -x -k` 不用 `unzip`；注意清理 `._` 资源碎屑文件。
6. **缓存戳**：静态资源带 `?v=YYYYMMDDx` 版本号，每次改 CSS/JS 必须递增（当前 `20260814i`），否则 CloudStudio/浏览器缓存不刷新。
7. **上一任 agent 的教训**：把站点托管在被墙的 `.chatgpt.site`，国内完全无法访问。任何部署必须先确认国内可达。
8. **手机端 1:2 被桌面约束压扁**：桌面端 `.hero-ab-image { max-width: 28vw }` 漏进手机媒体查询（媒体查询没覆盖它），iPhone 上容器被压到约 100px 宽、比例变成 1:4.5。教训：**改响应式样式时，先 grep 桌面端同选择器的全部约束属性**（max-width/min-*/top/left 等），媒体查询只覆盖了自己记得的属性，漏掉的会跨断点泄漏。手机端最稳写法是把宽/高都显式写死，不依赖 aspect-ratio 推导。

## 六、用户工作方式（必须遵守，违反会被骂）

- **先论证，再动手**：改任何东西之前，先说方案、说理由，等用户明确说"开工/可以/做吧"才能改代码。用户多次强调，且我因抢先动手被批评过两次。
- 用户说"先回复/先别说/等我说完"→ 只给分析，一个文件都不要碰。
- 沟通风格：直接、不废话、不情绪按摩、不当老登。给方案要带 trade-off 和自己的推荐，但拍板权在用户。
- 用户是非程序员（摄影师），技术名词要解释人话（例如解释过 wordmark、fallback 图）。
- 每次整改要做**全站一致性自查**：改一个组件，grep 全站同类组件一起核对，不能只改看到的那一处（用户批评过"只调 close 按钮 gap 是自欺欺人"）。
- 产出文件放 `/Users/duwentong/Documents/BB/` 体系，不放桌面。
- HANDOFF.md 是活文档：每次改动涉及设计决策/调参（如倍速、画幅、导航文案、缓存戳）后，**必须同步更新本文档**，不能只改代码就完事。本次曾漏掉桌面端倍速 1.8 的同步——接手方若不知道这个值，可能误当祖传 1.5 改回去。

## 七、未完成 / 待定事项

1. **手机端视频播放待用户最终反馈**：三层兜底已上线，等用户手机实测结果。若仍不行，基本可断定需走正式部署。
2. **正式域名部署未启动**：用户已有意向（"不行我们买个域名做成真实网页"）。根目录 `国内发布与域名建议.md` 有初步分析。静态站可直接迁移到 COS/OSS + CDN 或 Vercel 等，autoplay 兜底代码零改动跟随迁移。
3. 缓存戳从 `20260814a` 已经迭代到 `20260814i`，下次改动从 `20260814j` 起。

## 八、部署方式（正式域名）

整目录 `photography-portfolio/` 作为静态站点发布，**公开入口 = `prototypes/hero-options/index.html`**（根目录 `index.html` 只是跳转壳，不要把根目录当入口发布）。

**缓存戳规则（每次改动必做）**：静态资源引用带 `?v=YYYYMMDDx` 版本号（当前 `20260814i`），改完 CSS/JS 必须递增末位字母，否则 CDN / 浏览器缓存不刷新。

**路线 A — Cloudflare Pages（推荐起步，免备案）**
- 把 `photography-portfolio` 文件夹拖到 Cloudflare Pages 项目，或连 Git 仓库自动部署。
- 绑定境外注册 `.com` 域名（≈ $10/年，Namecheap / Porkbun），Cloudflare 自动签发 SSL。
- 优点：免费、全球 CDN、免 ICP 备案、当天上线。缺点：国内访问速度一般。
- 全自动部署：连 GitHub 后，跑完 sync 脚本 → `git add -A && git commit && git push` → 自动构建上线。

**路线 B — 腾讯云 COS + CDN / CloudBase（国内快，需备案）**
- 绑定 `.cn` 域名前需完成 ICP 备案（免费，约 1–2 周，需合格云资源）。
- 优点：国内访问速度快。缺点：要备案、有云资源成本。详见 `国内发布与域名建议.md`。

**临时预览（非长期）**：WorkBuddy CloudStudio 分享链接可覆盖更新、链接不变，适合手机实测，不作正式域名。

## 九、跨 Agent 接手（任何品牌的 AI 都能改这个站）

详见 `AGENT_HANDOFF.md`。核心：接手方先读 `HANDOFF.md` + `网站维护说明.md` + `sync-media-data.mjs`；加作品 = 建图片文件夹 → 跑同步脚本 → 部署；`portfolio-data.js` 等三个数据文件是自动生成的，**禁止手改**；已确认的设计决策勿推翻。用户判断一个新 Agent 能否接手的方法见 `AGENT_HANDOFF.md` 第七节——直接把那道考题发给 Agent 即可，用户无需懂技术。
