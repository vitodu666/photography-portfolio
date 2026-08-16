# 部署上线 · 腾讯云 EdgeOne Pages（最终方案）

> 适用对象：渡梵（不懂代码，只想把作品集挂到网上转发给别人看）
> 方案定位：**A 方案 = 你自己注册账号、自己掌控**。免费、国内快、换任何 AI 都能接管。

---

## 一、这是啥、花不花钱

- **托管**：EdgeOne Pages（腾讯云），**长期免费套餐**，不限流量/请求额度，自带国内边缘节点加速、免费 SSL。
- **域名**：用平台送的免费二级域名（你起前缀，平台定后缀），**零花费、免备案**。
- **总年成本：¥0**。

> 想用 `www.duwentong.com` 这种自己的名字？那要花钱买域名（≈¥73/年）+ ICP 备案（免费但 1–2 周）。本方案先不干这个。

---

## 二、域名怎么命名（你最关心的）

免费域名格式：`你起的前缀.edgeonepages.com`

- **后缀** `.edgeonepages.com`：平台固定，你没得选（像车牌"浙A"那段）。
- **前缀**：你自己起，规则 = 小写字母 `a-z`、数字 `0-9`、连字符 `-`、点 `.`；连字符不能开头/结尾/连续；长度 1–100。
- **不是摇号**：你输入一个前缀，平台查重，没人占就用。建议准备 2–3 个备选。

### 给渡梵的命名方案（挑一个，注册时填前缀）

| 方案 | 前缀 | 完整免费网址 |
|---|---|---|
| ① 全名直白（推荐） | `duwentong-photo` | `duwentong-photo.edgeonepages.com` |
| ② 网名调性 | `dufan-photo` | `dufan-photo.edgeonepages.com` |
| ③ 短好转发 | `dw-photo` | `dw-photo.edgeonepages.com` |
| ④ 工作室感 | `duwentong-studio` | `duwentong-studio.edgeonepages.com` |
| ⑤ 作品集直白 | `duwentong-portfolio` | `duwentong-portfolio.edgeonepages.com` |

> 注册时在 EdgeOne 控制台填「项目名称/站点名」即前缀。被占用就换备选。

---

## 三、你要做的两步（注册账号）

1. **注册腾讯云账号**：https://cloud.tencent.com → 微信扫码注册，**实名认证（免费，必做）**。
2. **进入 EdgeOne Pages 控制台**：https://edgeone.cloud.tencent.com → 找到「Pages」→ 开通免费套餐（一键开通，0 元）。

---

## 四、部署方式（二选一）

### 方式 A：Git 自动部署（★强烈推荐，治"换 AI 绑死"）

原理：把网站文件推到 GitHub（你的免费账号），EdgeOne 连 GitHub，以后**任何 AI 改完文件推一下就自动上线**，你和我都不用管。

前提：需要一个 **GitHub 账号**（免费，用邮箱注册 https://github.com）。

步骤：
1. BB 帮你把 `prototypes/hero-options/` 整理成干净部署目录，并初始化 Git 仓库、写好提交。
2. 你在 GitHub 建一个**私有仓库**（名字随意，如 `photo-site`）。
3. EdgeOne Pages 控制台 → 创建项目 → 「导入 Git 仓库」→ 绑定 GitHub → 选这个仓库 → 开始部署。
4. 以后更新：任何 AI 改完 → `git push` → 网站自动刷新。

> 这一步前期 BB 可以帮你搭好 Git 仓库和提交，你只需授权连接。部署后控制权 100% 在你。

### 方式 B：直接上传（零 Git 知识，但以后更新麻烦）

EdgeOne Pages 控制台 → 创建项目 → 「直接上传」→ 把部署目录拖进去 → 部署。
- 优点：不用懂 Git，点点就行。
- 缺点：以后每次更新得手动重新上传；换 AI 改完也得手动传，**不如方式 A 省心**。

---

## 五、为什么这方案"换谁都能接手"

- 文件在你电脑 + GitHub（都是你的账号）。
- 部署在 EdgeOne（你的账号）。
- 任何 AI 拿到文件夹 + 本指引 + `AGENT_HANDOFF.md`，改完 `git push` 或重新上传即上线。
- **不依赖 BB、不依赖 WorkBuddy 额度**。你额度花完？别的 AI 照常帮你推。

---

## 六、上线后复查

部署成功会给你一个 `xxx.edgeonepages.com` 链接，发给朋友即可。
复查要点：
1. 主页人像第一个是 Blue Guard，Office Play 在第 8 位。
2. 所有箭头是细线文本，不是 emoji。
3. 图片/视频右键存不了、拖不动、手机长按无保存菜单。
4. 系列页「上一组 / 下一组」顶部对齐。

---

⚠️ **旧方案已弃用**：`部署上线-腾讯云COS-极简指引.md` 是早期方案，现以本文为准（EdgeOne Pages 比 COS 域名更短、支持 Git 自动部署、更契合"换 AI 接管"诉求）。
