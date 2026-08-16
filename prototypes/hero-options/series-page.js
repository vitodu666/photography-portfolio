const params = new URLSearchParams(window.location.search);
const projectId = params.get("id") || "12";
const requestedKind = params.get("kind");
const returnParameter = params.get("from");

const allProjects = [...(window.portfolioProjects || []), ...(window.commercialProjects || [])];
const selectedProject = allProjects.find((item) => item.id === projectId) ?? allProjects[0];
const projectKind = requestedKind || selectedProject.kind;
const projects = allProjects.filter((item) => item.kind === projectKind);
const projectIndex = projects.findIndex((item) => item.id === selectedProject.id);
const project = projects[projectIndex] ?? selectedProject;
const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

function getReturnPage(kind) {
  if (kind === "place") return "journal.html";
  if (kind === "commercial") return "commercial.html";
  return "portraits.html";
}
const returnPage = getReturnPage(project.kind);

function getSafeReturnTarget(value) {
  if (!value) return null;
  const target = new URL(value, window.location.href);
  const currentDirectory = window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/") + 1);
  if (target.origin !== window.location.origin || !target.pathname.startsWith(currentDirectory)) return null;
  return `${target.pathname}${target.search}${target.hash}`;
}

const returnTarget = getSafeReturnTarget(returnParameter) ?? `./${returnPage}`;
const galleryLayouts = [
  "gallery-full",
  "gallery-left",
  "gallery-right gallery-lower",
  "gallery-center",
  "gallery-pair-left",
  "gallery-pair-right",
  "gallery-wide",
  "gallery-center",
  "gallery-left",
  "gallery-right gallery-lower",
  "gallery-wide",
  "gallery-center",
];

document.title = `${project.title} — DU WENTONG`;
document.querySelector(".series-close").href = returnTarget;
document.querySelector(".series-label").textContent = "Series / 组照";
document.querySelector("#series-title").innerHTML = project.title.split(" ").join("<br>");
document.querySelector(".series-category-en").textContent = project.categoryEn;
document.querySelector(".series-category-zh").textContent = project.categoryZh;

const coverImage = document.querySelector(".series-cover-image");
coverImage.src = project.cover;
coverImage.alt = project.coverAlt;

document.querySelector(".series-count").textContent = `${String(project.images.length).padStart(2, "0")} photographs / ${project.images.length} 张`;

const nav = document.querySelector(".series-nav");
const prevLink = document.querySelector(".series-prev");
if (prevProject && prevLink) {
  const prevParameters = new URLSearchParams({ id: prevProject.id, kind: project.kind });
  if (returnParameter) prevParameters.set("from", returnParameter);
  prevLink.href = `./series.html?${prevParameters.toString()}`;
} else if (prevLink) {
  prevLink.style.display = "none";
}

const nextLink = document.querySelector(".series-next");
if (nextProject && nextLink) {
  const nextParameters = new URLSearchParams({ id: nextProject.id, kind: project.kind });
  if (returnParameter) nextParameters.set("from", returnParameter);
  nextLink.href = `./series.html?${nextParameters.toString()}`;
  nextLink.querySelector(".series-next-title").textContent = nextProject.title;
} else if (nextLink) {
  nextLink.style.display = "none";
}

if (nav && !prevProject && !nextProject) {
  nav.style.display = "none";
}

const gallery = document.querySelector(".series-gallery");
project.images.forEach(([src, alt], index) => {
  const figure = document.createElement("figure");
  figure.className = galleryLayouts[index % galleryLayouts.length];
  if (index === project.images.length - 1) figure.classList.add("gallery-final");
  const button = document.createElement("button");
  button.className = "gallery-open";
  button.type = "button";
  button.setAttribute("aria-label", `放大查看第 ${index + 1} 张`);
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  button.append(image);
  figure.append(button);
  gallery.append(figure);
});

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

function updateLightbox(nextIndex, direction = 0) {
  currentIndex = (nextIndex + galleryButtons.length) % galleryButtons.length;
  const sourceImage = galleryButtons[currentIndex].querySelector("img");
  lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
  lightboxImage.alt = sourceImage.alt;
  lightboxCount.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryButtons.length).padStart(2, "0")}`;
  if (!prefersReducedMotion.matches && direction !== 0) {
    lightboxImage.animate([{ opacity: 0.25, transform: `translateX(${direction * 24}px)` }, { opacity: 1, transform: "translateX(0)" }], { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
  }
}

galleryButtons.forEach((button, index) => button.addEventListener("click", () => {
  lastTrigger = button;
  updateLightbox(index);
  lightbox.showModal();
}));
closeButton.addEventListener("click", () => lightbox.close());
previousButton.addEventListener("click", () => updateLightbox(currentIndex - 1, -1));
nextButton.addEventListener("click", () => updateLightbox(currentIndex + 1, 1));
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener("close", () => lastTrigger?.focus());
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") updateLightbox(currentIndex - 1, -1);
  if (event.key === "ArrowRight") updateLightbox(currentIndex + 1, 1);
});
lightbox.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) >= 48) updateLightbox(currentIndex + (distance < 0 ? 1 : -1), distance < 0 ? 1 : -1);
}, { passive: true });
