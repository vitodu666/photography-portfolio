#!/bin/bash
# 双击本文件即可把"图片"文件夹里的照片同步进网站数据。
# 同步完成后，去部署平台发布 photography-portfolio 整目录（入口 prototypes/hero-options/index.html）。
cd "$(cd "$(dirname "$0")" && pwd)"
echo "=== 同步网站图片数据 ==="
/Users/duwentong/.workbuddy/binaries/node/versions/22.22.2/bin/node sync-media-data.mjs
echo ""
echo "同步完成。下一步：去部署平台发布 photography-portfolio 整目录。"
echo "  - Cloudflare Pages：把 photography-portfolio 文件夹拖到 https://dash.cloudflare.com/pages"
echo "  - 或用任意静态托管，入口 prototypes/hero-options/index.html"
echo "  - 发布前请确认组图已压到长边 ≤ 2000px（见 网站维护说明.md 的压图提醒）"
echo ""
read -p "按回车关闭窗口"
