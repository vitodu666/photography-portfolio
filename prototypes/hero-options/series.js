const galleryButtons = [...document.querySelectorAll(".gallery-open")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCount = document.querySelector(".lightbox-count");
const closeButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentIndex = 0;
let touchStartX = 0;
let lastTrigger = null;

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function updateLightbox(nextIndex, direction = 0) {
  currentIndex = (nextIndex + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[currentIndex].querySelector("img");

  lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  const totalCount = String(galleryButtons.length).padStart(2, "0");
  lightboxCount.textContent = `${formatIndex(currentIndex)} / ${totalCount}`;

  if (!prefersReducedMotion.matches && direction !== 0) {
    lightboxImage.animate(
      [
        { opacity: 0.25, transform: `translateX(${direction * 24}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }
}

function openLightbox(index, trigger) {
  lastTrigger = trigger;
  updateLightbox(index);
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
}

galleryButtons.forEach((button, index) => {
  button.addEventListener("click", () => openLightbox(index, button));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => updateLightbox(currentIndex - 1, -1));
nextButton.addEventListener("click", () => updateLightbox(currentIndex + 1, 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("close", () => {
  lastTrigger?.focus();
});

lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") updateLightbox(currentIndex - 1, -1);
  if (event.key === "ArrowRight") updateLightbox(currentIndex + 1, 1);
});

lightbox.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0].clientX;
  },
  { passive: true },
);

lightbox.addEventListener(
  "touchend",
  (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 48) return;
    updateLightbox(currentIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
  },
  { passive: true },
);
