# 用 GitHub Desktop 把网站推上 GitHub（中文界面 · 不用命令行）

> 适用：你不想碰命令行，想用图形界面把 `photography-portfolio` 推到 GitHub。
> 推上去之后，EdgeOne Pages 才能连这个仓库、自动部署出公开网址。

## 第 1 步：下载安装 GitHub Desktop
1. 打开浏览器访问 `desktop.github.com`，点下载（macOS 版）。
2. 安装完打开，界面是**中文**的（跟系统语言走）。

## 第 2 步：登录 GitHub 账号
1. 打开 GitHub Desktop，首次会让你 **「登录 GitHub.com」**（Sign in）。
2. 点它 → 会跳浏览器 → 用你 `vitodu666` 的账号授权登录一次。
3. 登录成功后回到桌面软件，以后不用再登。

## 第 3 步：把本地仓库加进来
1. 顶部菜单 **文件 → 添加本地仓库**（Add Local Repository）。
2. 在弹出的选文件夹窗口里，定位到：
   `Documents/BB/项目/设计一些好看的东西/photography-portfolio`
   （就是带 `.git` 的那个文件夹，里面是 `图片/`、`prototypes/`、各种 `.md` 等）
3. 选中它 → 点 **添加**。
4. 软件识别出这是已有 git 仓库，会显示当前分支 `main` 和一堆待推送的提交。

## 第 4 步：推送（Push）
1. 窗口**右上角**会出现一个 **「推送 origin」**（Push origin）按钮。
   - 首次可能是 **「发布」**（Publish）—— 点它就对，远程已经指向你的空仓库。
2. 点它 → 等进度条走完（95MB 图片会走一会儿，别关窗口）。
3. 按钮消失 / 变成「已是最新」= 成功。

## 第 5 步：去 GitHub 网页验证
打开 `github.com/vitodu666/photography-portfolio`，应该能看到 `图片/`、`prototypes/`、`各种.md` 都在里面了。

---

## 以后更新网站（日常动作，零命令行）
1. 新照片放进 `图片/人像/组号/网站展示/`
2. 双击 `prototypes/hero-options/同步图片.command` → 写进网页数据
3. 打开 GitHub Desktop → 左边会列出改动 → 底部写句说明 → 点 **「提交到 main」** → 点 **「推送 origin」**
4. EdgeOne Pages 几秒后自动重新部署，公开网址更新。

> 推完跟 BB 说一声，我接着帮你连 EdgeOne Pages、开免费套餐、拿到 `前缀.edgeonepages.com` 公开网址。
