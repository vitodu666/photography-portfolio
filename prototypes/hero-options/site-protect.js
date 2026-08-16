/*
 * 网站防盗保护（site-protect.js）
 * 作用：阻止图片/视频被右键保存、拖拽、移动端长按保存、视频下载。
 * 注意：网页上的图只要能显示，技术高手仍可能拿到原文件（这是 web 底层逻辑，无法 100% 防）。
 *       本脚本只提高普通人的门槛，不影响页面观感，不打水印。
 * 维护：任何 Agent 改这里即可全局调整保护策略。
 */
(function () {
  'use strict';

  // 1. 禁止图片/视频被拖拽
  document.addEventListener('dragstart', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) {
      e.preventDefault();
    }
  });

  // 2. 禁止在图片/视频上点右键（弹出的"图片另存为"菜单）
  document.addEventListener('contextmenu', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' ||
        (t.closest && t.closest('img, video')))) {
      e.preventDefault();
    }
  });

  // 3. 视频：去掉下载按钮、画中画，并禁用其右键/拖拽
  function hardenVideos() {
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      var v = videos[i];
      v.setAttribute('controlsList', 'nodownload noremoteplayback');
      v.setAttribute('disablePictureInPicture', '');
      v.addEventListener('contextmenu', function (e) { e.preventDefault(); });
      v.addEventListener('dragstart', function (e) { e.preventDefault(); });
    }
  }

  // 4. 样式：禁用长按保存菜单 + 元素选择（仅作用于图片和视频，不影响文字复制）
  var style = document.createElement('style');
  style.textContent = 'img,video{-webkit-user-drag:none;-webkit-touch-callout:none;user-select:none;}';
  if (document.head) {
    document.head.appendChild(style);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.head.appendChild(style);
    });
  }

  hardenVideos();
  // 处理后续动态加入的视频
  if (window.MutationObserver) {
    var obs = new MutationObserver(hardenVideos);
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
