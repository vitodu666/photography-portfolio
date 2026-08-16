#!/bin/bash
# 推送网站更新到 GitHub → EdgeOne Pages 自动部署
cd "$(dirname "$0")/../.." || exit 1
git add -A
git commit -m "网站内容更新 $(date '+%Y-%m-%d %H:%M')" || echo "（无新改动，跳过提交）"
if git push origin main; then
  echo ""
  echo "✅ 已推送。EdgeOne Pages 会在几秒到一分钟内自动重新部署。"
else
  echo ""
  echo "❌ 推送失败：检查是否完成 GitHub 登录授权，或梯子/网络是否连上。上方红色报错就是原因。"
fi
read -p "按回车关闭窗口"
