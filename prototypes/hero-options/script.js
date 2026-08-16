const combinedHero = document.querySelector(".hero-ab");
const portraitStream = document.querySelector(".portrait-stream");
const commercialPreview = document.querySelector(".commercial-preview");
const commercialCurrent = document.querySelector(".commercial-current");
const commercialTotal = document.querySelector(".commercial-total");
const commercialPrevious = document.querySelector(".commercial-prev");
const commercialNext = document.querySelector(".commercial-next");
const journalEntryImage = document.querySelector(".journal-entry-image img");
const journalCount = document.querySelector(".journal-count");
const heroVideoSlots = [...document.querySelectorAll(".hero-video")];
const heroVideoFallback = document.querySelector(".hero-video-fallback");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let isScrollUpdateQueued = false;
let isCommercialUpdateQueued = false;

function updateCombinedHero() {
  const scrollProgress = Math.min(window.scrollY / (window.innerHeight * 0.72), 1);
  combinedHero?.style.setProperty(
    "--slide-progress",
    String(prefersReducedMotion.matches ? 0 : scrollProgress),
  );
  isScrollUpdateQueued = false;
}

function queueCombinedHeroUpdate() {
  if (isScrollUpdateQueued) return;
  isScrollUpdateQueued = true;
  requestAnimationFrame(updateCombinedHero);
}

function createProjectCard(project, index) {
  const article = document.createElement("article");
  const layoutPattern = ["shift-small", "shift-large", "", "shift-large", "shift-small", ""];
  const layoutClass = layoutPattern[index % layoutPattern.length];
  article.className = `work-card work-card-tall ${layoutClass}`.trim();
  article.id = `home-portrait-${project.id}`;
  article.dataset.scrollColumn = String(index % 3);

  const link = document.createElement("a");
  link.className = "work-link";
  link.href = `./series.html?id=${project.id}&from=${encodeURIComponent(`index.html#${article.id}`)}`;

  const image = document.createElement("img");
  image.src = project.cover;
  image.alt = project.coverAlt;
  image.loading = "lazy";

  const caption = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("p");
  title.textContent = project.title;
  meta.textContent = `${project.categoryEn} / ${project.categoryZh} ${project.number} · View / 查看`;

  caption.append(title, meta);
  link.append(image, caption);
  article.append(link);
  return article;
}

const allPortraitProjects = window.portfolioProjects.filter((project) => project.kind === "portrait");
const portraitProjects = allPortraitProjects
  .filter((project) => Number.isInteger(project.featuredRank))
  .sort((left, right) => left.featuredRank - right.featuredRank);
portraitStream?.append(...portraitProjects.map(createProjectCard));
document.querySelector(".section-count").textContent = `View all ${allPortraitProjects.length} series / 查看全部 ${allPortraitProjects.length} 组 ↗︎`;

function createCommercialCard(project) {
  const link = document.createElement("a");
  link.className = "commercial-card";
  link.id = `home-${project.id}`;
  link.href = `./series.html?id=${project.id}&kind=commercial&from=${encodeURIComponent(`index.html#${link.id}`)}`;

  const image = document.createElement("img");
  image.src = project.cover;
  image.alt = project.coverAlt;
  image.loading = "lazy";

  const caption = document.createElement("div");
  const number = document.createElement("p");
  const title = document.createElement("h3");
  number.textContent = project.number;
  title.textContent = project.title;
  caption.append(number, title);
  link.append(image, caption);
  return link;
}

const featuredCommercialProjects = (window.commercialProjects ?? [])
  .filter((project) => Number.isInteger(project.featuredRank))
  .sort((left, right) => left.featuredRank - right.featuredRank);
commercialPreview?.append(...featuredCommercialProjects.map(createCommercialCard));
if (commercialTotal) {
  commercialTotal.textContent = String(featuredCommercialProjects.length).padStart(2, "0");
}

function updateCommercialCounter() {
  if (!commercialPreview || !commercialCurrent) return;
  const cards = [...commercialPreview.querySelectorAll(".commercial-card")];
  const firstCard = cards[0];
  if (!firstCard) return;
  const gap = Number.parseFloat(getComputedStyle(commercialPreview).columnGap) || 0;
  const step = firstCard.clientWidth + gap;
  const activeIndex = Math.min(Math.round(commercialPreview.scrollLeft / step), cards.length - 1);

  commercialCurrent.textContent = String(activeIndex + 1).padStart(2, "0");
  isCommercialUpdateQueued = false;
}

function queueCommercialCounterUpdate() {
  if (isCommercialUpdateQueued) return;
  isCommercialUpdateQueued = true;
  requestAnimationFrame(updateCommercialCounter);
}

function moveCommercialRail(direction) {
  if (!commercialPreview) return;
  const firstCard = commercialPreview.querySelector(".commercial-card");
  const gap = Number.parseFloat(getComputedStyle(commercialPreview).columnGap) || 0;
  const distance = (firstCard?.clientWidth ?? commercialPreview.clientWidth * 0.75) + gap;
  commercialPreview.scrollBy({
    left: direction * distance,
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
  });
}

commercialPreview?.addEventListener("scroll", queueCommercialCounterUpdate, { passive: true });
commercialPrevious?.addEventListener("click", () => moveCommercialRail(-1));
commercialNext?.addEventListener("click", () => moveCommercialRail(1));

const placeProjects = window.portfolioProjects.filter((project) => project.kind === "place");
const featuredJournalProject = placeProjects[0];
if (journalEntryImage && featuredJournalProject) {
  journalEntryImage.src = featuredJournalProject.cover;
  journalEntryImage.alt = featuredJournalProject.coverAlt;
  journalEntryImage.loading = "eager";
}
if (journalCount) {
  journalCount.textContent = `${String(placeProjects.length).padStart(2, "0")} ongoing chapters / ${placeProjects.length} 组持续更新`;
}

const requestedHomeAnchor = window.location.hash.slice(1);
if (requestedHomeAnchor.startsWith("home-")) {
  requestAnimationFrame(() => {
    document.getElementById(requestedHomeAnchor)?.scrollIntoView({ block: "center" });
  });
}

function setupPortraitColumnMotion() {
  if (!portraitStream || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  const portraitMotionStrength = 1.8;
  const motionRanges = [
    { from: -32, to: 78 },
    { from: 52, to: -48 },
    { from: -18, to: 38 },
  ].map(({ from, to }) => ({
    from: from * portraitMotionStrength,
    to: to * portraitMotionStrength,
  }));
  const motionMatch = window.gsap.matchMedia();

  motionMatch.add(
    "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
    () => {
      motionRanges.forEach(({ from, to }, columnIndex) => {
        const cards = portraitStream.querySelectorAll(
          `[data-scroll-column="${columnIndex}"]`,
        );

        window.gsap.fromTo(
          cards,
          { y: from },
          {
            y: to,
            ease: "none",
            scrollTrigger: {
              trigger: portraitStream,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
  );
}

function setupHeroVideoRotation() {
  const videoSources = window.heroVideos ?? [];
  if (heroVideoSlots.length < 2 || videoSources.length === 0 || prefersReducedMotion.matches) return;

  const TRANSITION_MS = 700;
  const TRANSITION_S = TRANSITION_MS / 1000;
  const TRIGGER_LEAD_S = TRANSITION_S + 0.06;
  const savedStartIndex = Number.parseInt(sessionStorage.getItem("hero-video-index") ?? "0", 10);
  let currentSourceIndex = Number.isFinite(savedStartIndex) ? savedStartIndex % videoSources.length : 0;
  let activeSlotIndex = 0;
  let isSwitching = false;
  let transitionTimer = null;

  function loadVideo(video, sourceIndex) {
    video.src = videoSources[sourceIndex];
    video.load();
  }

  function queueFollowingVideo() {
    const followingSourceIndex = (currentSourceIndex + 1) % videoSources.length;
    loadVideo(heroVideoSlots[1 - activeSlotIndex], followingSourceIndex);
  }

  async function playVideo(video) {
    try {
      if (video.paused) {
        await video.play();
      }
      return true;
    } catch {
      return false;
    }
  }

  async function playCurrentVideo() {
    const ok = await playVideo(heroVideoSlots[activeSlotIndex]);
    heroVideoFallback?.classList.toggle("is-hidden", ok);
  }

  async function switchToNextVideo() {
    if (isSwitching) return;
    isSwitching = true;
    const outgoingVideo = heroVideoSlots[activeSlotIndex];
    const incomingSlotIndex = 1 - activeSlotIndex;
    const incomingVideo = heroVideoSlots[incomingSlotIndex];
    const nextSourceIndex = (currentSourceIndex + 1) % videoSources.length;

    if (!incomingVideo.src || !incomingVideo.src.endsWith(videoSources[nextSourceIndex])) {
      loadVideo(incomingVideo, nextSourceIndex);
    }

    const ok = await playVideo(incomingVideo);
    if (ok) {
      incomingVideo.classList.add("is-active");
      outgoingVideo.classList.remove("is-active");

      clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        outgoingVideo.pause();
      }, TRANSITION_MS);

      activeSlotIndex = incomingSlotIndex;
      currentSourceIndex = nextSourceIndex;
      sessionStorage.setItem("hero-video-index", String((currentSourceIndex + 1) % videoSources.length));
      queueFollowingVideo();
      heroVideoFallback?.classList.add("is-hidden");
    } else {
      outgoingVideo.currentTime = 0;
      await playCurrentVideo();
    }
    isSwitching = false;
  }

  const interactionEvents = ["touchstart", "touchend", "click", "scroll", "keydown"];

  function removeInteractionListeners() {
    interactionEvents.forEach((type) => {
      document.removeEventListener(type, tryResumeAfterInteraction);
    });
  }

  function tryResumeAfterInteraction() {
    const active = heroVideoSlots[activeSlotIndex];
    if (!active || !active.paused) return;
    playCurrentVideo().then((ok) => {
      if (ok) removeInteractionListeners();
    });
  }

  function onCanPlay(event) {
    const video = event.target;
    if (video !== heroVideoSlots[activeSlotIndex] || isSwitching) return;
    if (video.paused) {
      tryResumeAfterInteraction();
    }
  }

  // 第3层：微信内置浏览器需等 WeixinJSBridge 就绪后才放行播放
  function setupWeixinFallback() {
    if (!/MicroMessenger/i.test(navigator.userAgent)) return;
    document.addEventListener("WeixinJSBridgeReady", () => {
      tryResumeAfterInteraction();
    }, false);
    if (typeof window.WeixinJSBridge !== "undefined" && typeof window.WeixinJSBridge.invoke === "function") {
      tryResumeAfterInteraction();
    }
  }

  function onVideoEnded(event) {
    const video = event.target;
    if (video !== heroVideoSlots[activeSlotIndex] || !video.duration || isSwitching) return;
    switchToNextVideo();
  }

  function onTimeUpdate(event) {
    const video = event.target;
    if (video !== heroVideoSlots[activeSlotIndex] || !video.duration || isSwitching) return;
    if (video.duration - video.currentTime <= TRIGGER_LEAD_S) {
      switchToNextVideo();
    }
  }

  heroVideoSlots.forEach((video) => {
    video.addEventListener("ended", onVideoEnded);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("canplay", onCanPlay);
  });

  // 第2层：任意用户交互（触摸/点击/滚动/按键）立即尝试播放
  interactionEvents.forEach((type) => {
    document.addEventListener(type, tryResumeAfterInteraction, { passive: true });
  });

  setupWeixinFallback();

  // 第1层：直接尝试自动播放，成功则不再需要交互兜底
  loadVideo(heroVideoSlots[activeSlotIndex], currentSourceIndex);
  queueFollowingVideo();
  playCurrentVideo().then((ok) => {
    if (ok) removeInteractionListeners();
  });
}

setupHeroVideoRotation();
setupPortraitColumnMotion();

window.addEventListener("scroll", queueCombinedHeroUpdate, { passive: true });
window.addEventListener("resize", () => {
  queueCombinedHeroUpdate();
  queueCommercialCounterUpdate();
});
prefersReducedMotion.addEventListener("change", queueCombinedHeroUpdate);
updateCombinedHero();
updateCommercialCounter();
