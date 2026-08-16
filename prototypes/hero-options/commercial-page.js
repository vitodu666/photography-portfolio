const commercialSeries = document.querySelector(".commercial-series");
const lightbox = document.querySelector(".commercial-lightbox");
const lightboxImages = document.querySelector(".commercial-lightbox-images");
const lightboxTitle = document.querySelector(".commercial-lightbox-title");
const lightboxCategory = document.querySelector(".commercial-lightbox-category");
const lightboxCover = document.querySelector(".commercial-lightbox-cover");
const lightboxCount = document.querySelector(".commercial-lightbox-count");
const lightboxClose = document.querySelector(".commercial-lightbox-close");
const returnParameter = new URLSearchParams(window.location.search).get("from");
let lastSeriesTrigger = null;

function getSafeReturnTarget(value) {
  if (!value) return null;
  const target = new URL(value, window.location.href);
  const currentDirectory = window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/") + 1);
  if (target.origin !== window.location.origin || !target.pathname.startsWith(currentDirectory)) return null;
  return `${target.pathname}${target.search}${target.hash}`;
}

const returnTarget = getSafeReturnTarget(returnParameter);

function setMultilineTitle(element, title) {
  const words = title.split(" ");
  const nodes = words.flatMap((word, index) => (
    index === words.length - 1 ? [document.createTextNode(word)] : [document.createTextNode(word), document.createElement("br")]
  ));
  element.replaceChildren(...nodes);
}

function createSeriesCard(project) {
  const article = document.createElement("article");
  article.className = "commercial-series-card";
  article.id = project.id;

  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `查看 ${project.title} 商业组图`);

  const image = document.createElement("img");
  image.src = project.cover;
  image.alt = project.coverAlt;
  image.loading = "lazy";

  const caption = document.createElement("div");
  const number = document.createElement("p");
  const title = document.createElement("h2");
  const count = document.createElement("p");
  number.textContent = project.number;
  title.textContent = project.titleZh ? `${project.title} / ${project.titleZh}` : project.title;
  count.textContent = `${project.images.length} images / ${project.images.length} 张`;
  caption.append(number, title, count);
  button.append(image, caption);
  article.append(button);

  button.addEventListener("click", () => {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${project.id}`);
    openCommercialSeries(project, button);
  });
  return article;
}

function openCommercialSeries(project, trigger) {
  lastSeriesTrigger = trigger;
  setMultilineTitle(lightboxTitle, project.title);
  lightboxCategory.textContent = `${project.categoryEn} / ${project.categoryZh}`;
  lightboxCover.src = project.cover;
  lightboxCover.alt = project.coverAlt;
  lightboxCount.textContent = `${project.images.length} photographs / ${project.images.length} 张`;
  lightboxImages.replaceChildren(
    ...project.images.map(([src, alt]) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = alt;
      image.loading = "lazy";
      return image;
    }),
  );
  if (!lightbox.open) {
    lightbox.showModal();
    lightbox.scrollTop = 0;
    lightbox.focus({ preventScroll: true });
  }
}

commercialSeries.append(...window.commercialProjects.map(createSeriesCard));
document.querySelector(".commercial-count").textContent = `${String(window.commercialProjects.length).padStart(2, "0")} series / ${window.commercialProjects.length} 组`;
lightboxClose.addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("close", () => {
  if (returnTarget) {
    window.location.href = returnTarget;
    return;
  }
  if (window.location.hash.startsWith("#commercial-")) {
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  lastSeriesTrigger?.focus();
});

const requestedProjectId = window.location.hash.slice(1);
const requestedProject = window.commercialProjects.find(
  (project) => project.id === requestedProjectId,
);
if (requestedProject) {
  const requestedCard = document.querySelector(`#${CSS.escape(requestedProject.id)}`);
  const requestedTrigger = requestedCard?.querySelector("button");
  requestedCard?.scrollIntoView({ block: "center" });
  openCommercialSeries(requestedProject, requestedTrigger);
}
