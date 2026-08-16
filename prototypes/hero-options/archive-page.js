const archiveKind = document.body.dataset.kind;
const allProjects = [...(window.portfolioProjects || []), ...(window.commercialProjects || [])];
const archiveProjects = allProjects.filter((project) => project.kind === archiveKind);
const archiveList = document.querySelector(".archive-list");

function getArchivePage(kind) {
  if (kind === "place") return "journal.html";
  if (kind === "commercial") return "commercial.html";
  return "portraits.html";
}

function createArchiveCard(project) {
  const link = document.createElement("a");
  link.className = "archive-card";
  link.id = `${archiveKind}-${project.id}`;
  const archivePage = getArchivePage(archiveKind);
  link.href = `./series.html?id=${project.id}&kind=${archiveKind}&from=${encodeURIComponent(`${archivePage}#${link.id}`)}`;

  const image = document.createElement("img");
  image.src = project.cover;
  image.alt = project.coverAlt;
  image.loading = "lazy";

  const copy = document.createElement("div");
  copy.className = "archive-card-copy";
  const number = document.createElement("p");
  const title = document.createElement("h2");
  const count = document.createElement("p");
  number.textContent = project.number;
  title.textContent = project.titleZh ? `${project.title} / ${project.titleZh}` : project.title;
  count.textContent = `${String(project.images.length).padStart(2, "0")} photographs / ${project.images.length} 张`;
  copy.append(number, title, count);
  link.append(image, copy);
  return link;
}

archiveList.append(...archiveProjects.map(createArchiveCard));
document.querySelector(".archive-count").textContent = `${String(archiveProjects.length).padStart(2, "0")} series / ${archiveProjects.length} 组`;

const requestedArchiveAnchor = window.location.hash.slice(1);
if (requestedArchiveAnchor) {
  requestAnimationFrame(() => {
    document.getElementById(requestedArchiveAnchor)?.scrollIntoView({ block: "center" });
  });
}
