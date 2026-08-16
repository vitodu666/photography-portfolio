# EdgeOne Pages 部署 · 分步图文卡（照着点，不用懂代码）

> 你已完成：代码已推到 GitHub（`vitodu666/photography-portfolio`）。
> 本卡目标：把它挂到腾讯云 EdgeOne Pages，拿到 `xxx.edgeonepages.com` 公开网址。
> 全程免费、不用备案、国内访问快。

---

## ⚠️ 一个最容易错的点（先记住）

部署时要填一个**「输出目录 / Output Directory」**的框。
**这个框留空，不要填任何东西。**
（填了子目录会导致图片裂开，整个网站变成破图。留空 = 发布整个仓库，图片才找得到。）

---

## 第 1 步：登录腾讯云 + 实名

1. 浏览器打开：https://cloud.tencent.com
2. 右上角点 **「登录」** → 选 **微信扫码**（用你平时的微信扫）
3. 登录后，右上角头像旁边可能提示 **「实名认证」** → 点进去按提示做（免费，要填姓名+身份证，几分钟搞定）
   - 不做实名后面创建项目可能被拦。

## 第 2 步：进入 EdgeOne Pages

1. 浏览器打开：https://edgeone.cloud.tencent.com
2. 左侧菜单找 **「EdgeOne Pages」**（或顶部「产品」里搜 Pages）
3. 第一次会让你 **「开通/免费体验」**，点一下开通（0 元）

## 第 3 步：新建项目，连 GitHub

1. 点 **「创建项目」** 或 **「新建」** 按钮
2. 选择 **「从 Git 仓库导入」** / **「连接 Git 仓库」**
3. 点 **「授权 GitHub」** / **「Connect GitHub」**（这步会跳到 GitHub 网页，点绿色 **Authorize** 授权按钮，允许腾讯云读你的仓库）
4. 授权完回到腾讯云，在仓库列表里选 **`vitodu666/photography-portfolio`**
5. 点 **「下一步 / 确定」**

## 第 4 步：配置项目（重点！）

进入配置页，看到几个输入框，这样填：

| 输入框 | 填什么 |
|---|---|
| 项目名称 / 站点名 | 你自己起，比如 `duwentong-photo`（这是网址前缀，见下方说明） |
| 框架预设 / Framework | 选 **「无 / None / Other」** |
| 构建命令 / Build Command | **留空** |
| **输出目录 / Output Directory** | **留空**（不要填 prototypes/hero-options，重要！） |
| 节点版本 | 默认即可，不用管 |

> 域名前缀说明：你填的项目名称 `duwentong-photo` 会变成网址 `duwentong-photo.edgeonepages.com`。
> 如果提示"已被占用"，换一个（如 `dufan-photo`、`dw-photo`）。

6. 点 **「部署 / 开始部署」**

## 第 5 步：等部署 + 拿网址

1. 页面会显示构建进度，等 **2–5 分钟**（首次要传 95MB 图片，慢一点正常）
2. 状态变成 **「成功 / Active / 已部署」** 后，页面会显示一个网址，长得像：
   `https://duwentong-photo.edgeonepages.com`
3. **点这个网址打开**——注意：主页在子路径，完整地址是：
   `https://duwentong-photo.edgeonepages.com/prototypes/hero-options/index.html`
   （把这个完整地址发给朋友就能看）

## 第 6 步：复查

打开上面完整地址，确认：
1. 主页人像第一个是 **Blue Guard（蓝色护甲）**，Office Play 在第 8 位
2. 所有箭头是细线文本，不是彩色 emoji
3. 图片/视频 **右键存不了、拖不动、手机长按无保存菜单**
4. 系列页「上一组 / 下一组」顶部对齐

---

## 部署完之后

- 以后改网站：任何 AI 改完你电脑上的文件 → 双击 `推送更新.command`（或 GitHub Desktop 点 Push）→ 网站自动刷新。
- 网址是**你的**，账号是**你的**，换任何 AI 都能接管，不依赖 BB。

## 卡住了怎么办

某一步跟上面写的不一样、或报错了，把屏幕**截图发我**，我陪你一步步走，别自己琢磨。
