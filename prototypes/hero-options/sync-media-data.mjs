import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "../..");
const imageRoot = path.join(projectRoot, "图片");
const supportedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const supportedVideoExtensions = new Set([".mp4", ".webm"]);
const naturalCollator = new Intl.Collator("zh-CN", { numeric: true, sensitivity: "base" });

const portraitMetadata = {
  "01": ["Black Signal", "黑色信号"],
  "02": ["Office Play", "办公室游戏"],
  "04": ["Deep Blue", "深蓝"],
  "05": ["After Rose", "玫瑰之后"],
  "08": ["Quiet Tailoring", "静默剪裁"],
  "10": ["Red Hair", "红发"],
  "11": ["Soft Geometry", "柔软几何"],
  "13": ["Grey Studio", "灰色影棚"],
  "14": ["Blue Guard", "蓝色护甲"],
  "15": ["Still Bloom", "静止盛放"],
  "16": ["Refracted Hours", "折射时刻"],
  "22": ["Light in Motion", "流动之光"],
};

const portraitFeaturedOrder = ["04", "14", "01", "10", "08", "07", "11", "19", "02", "22", "05", "09"];

const commercialMetadata = {
  "01": ["Green Formula", "绿色配方"],
  "02": ["Junior Green", "儿童绿意"],
  "03": ["Blue Calcium", "蓝色钙线"],
  "04": ["Pink Calcium", "粉色钙线"],
  "05": ["Berry Focus", "莓果焦点"],
  "06": ["Daily Lactoferrin", "日常乳铁蛋白"],
  "07": ["Melon Pastels", "蜜瓜柔彩"],
  "08": ["Growing Up", "向上生长"],
  "09": ["Violet Berry", "紫色莓果"],
  "10": ["Whey Blue", "乳清蓝调"],
  "11": ["Laboratory Blue", "实验室蓝"],
  "12": ["Active Green", "活力青绿"],
};

const commercialFeaturedOrder = ["01", "02", "03", "04", "05", "06"];

const journalMetadata = {
  新疆: ["xinjiang", "Xinjiang", "新疆"],
  西藏: ["tibet", "Tibet", "西藏"],
  澳门: ["macau", "Macao", "澳门"],
  衢山岛: ["qushan-island", "Qushan Island", "衢山岛"],
  厦门: ["xiamen", "Xiamen", "厦门"],
  大理: ["dali", "Dali", "大理"],
  川西: ["western-sichuan", "Western Sichuan", "川西"],
  汽车博物馆: ["automobile-museum", "Automobile Museum", "汽车博物馆"],
  海南: ["hainan", "Hainan", "海南"],
  烟台: ["yantai", "Yantai", "烟台"],
  珠海长隆: ["zhuhai-chimelong", "Zhuhai Chimelong", "珠海长隆"],
  "随手记 1": ["notes-01", "Notes 01", "随手记 1"],
};

const journalOrder = ["新疆", "西藏", "澳门", "衢山岛", "厦门", "大理", "川西", "汽车博物馆", "海南", "烟台", "珠海长隆", "随手记 1"];

function isSupportedFile(fileName, supportedExtensions) {
  return !fileName.startsWith(".") && supportedExtensions.has(path.extname(fileName).toLowerCase());
}

function isCover(fileName) {
  return path.parse(fileName).name === "封面";
}

function toBrowserPath(filePath) {
  return path.relative(scriptDirectory, filePath).split(path.sep).join("/");
}

async function readDisplayFolders(sectionName) {
  const sectionDirectory = path.join(imageRoot, sectionName);
  const entries = await readdir(sectionDirectory, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).sort((left, right) => naturalCollator.compare(left.name, right.name));
  const groups = [];

  for (const folder of folders) {
    const displayDirectory = path.join(sectionDirectory, folder.name, "网站展示");
    let files;
    try {
      files = (await readdir(displayDirectory, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && isSupportedFile(entry.name, supportedImageExtensions))
        .map((entry) => entry.name)
        .sort(naturalCollator.compare);
    } catch {
      continue;
    }

    const coverFile = files.find(isCover);
    if (!coverFile) continue;
    groups.push({
      folder: folder.name,
      cover: path.join(displayDirectory, coverFile),
      images: files.filter((fileName) => !isCover(fileName)).map((fileName) => path.join(displayDirectory, fileName)),
    });
  }

  return groups;
}

function makeImageList(files, titleZh) {
  return files.map((filePath, index) => [toBrowserPath(filePath), `${titleZh}作品 ${String(index + 1).padStart(2, "0")}`]);
}

async function buildPortraitProjects() {
  const groups = await readDisplayFolders("人像");
  return groups
    .map((group) => {
      const id = String(Number.parseInt(group.folder, 10)).padStart(2, "0");
      const [title, titleZh] = portraitMetadata[id] ?? [`Portrait ${id}`, `人像 ${id}`];
      const featuredRank = portraitFeaturedOrder.indexOf(id);
      return {
        id,
        number: id,
        kind: "portrait",
        title,
        titleZh,
        categoryEn: "Portrait",
        categoryZh: "人像",
        featuredRank: featuredRank === -1 ? null : featuredRank,
        cover: toBrowserPath(group.cover),
        coverAlt: `${titleZh}系列封面`,
        images: makeImageList(group.images, titleZh),
      };
    })
    .sort((left, right) => Number.parseInt(right.id, 10) - Number.parseInt(left.id, 10));
}

async function buildCommercialProjects() {
  const groups = await readDisplayFolders("产品");
  return groups
    .map((group) => {
      const number = String(Number.parseInt(group.folder, 10)).padStart(2, "0");
      const [title, titleZh] = commercialMetadata[number] ?? [`Commercial ${number}`, `商业 ${number}`];
      const featuredRank = commercialFeaturedOrder.indexOf(number);
      return {
        id: `commercial-${number}`,
        number,
        kind: "commercial",
        title,
        titleZh,
        categoryEn: "Commercial",
        categoryZh: "商业",
        featuredRank: featuredRank === -1 ? null : featuredRank,
        cover: toBrowserPath(group.cover),
        coverAlt: `${titleZh}系列封面`,
        images: makeImageList(group.images, titleZh),
      };
    })
    .sort((left, right) => Number.parseInt(right.number, 10) - Number.parseInt(left.number, 10));
}

async function buildJournalProjects() {
  const groups = await readDisplayFolders("风光");
  return groups
    .map((group) => {
      const [id, title, titleZh] = journalMetadata[group.folder] ?? [group.folder, group.folder, group.folder];
      return {
        id,
        number: String(journalOrder.indexOf(group.folder) + 1).padStart(2, "0"),
        kind: "place",
        title,
        titleZh,
        categoryEn: "Journal",
        categoryZh: "日常",
        cover: toBrowserPath(group.cover),
        coverAlt: `${titleZh}日常记录封面`,
        images: makeImageList(group.images, titleZh),
      };
    })
    .sort((left, right) => journalOrder.indexOf(left.titleZh) - journalOrder.indexOf(right.titleZh));
}

async function buildHeroVideos() {
  const videoDirectory = path.join(imageRoot, "首屏视频");
  const entries = await readdir(videoDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isSupportedFile(entry.name, supportedVideoExtensions))
    .map((entry) => toBrowserPath(path.join(videoDirectory, entry.name)))
    .sort(naturalCollator.compare);
}

const [portraitProjects, commercialProjects, journalProjects, heroVideos] = await Promise.all([
  buildPortraitProjects(),
  buildCommercialProjects(),
  buildJournalProjects(),
  buildHeroVideos(),
]);

await Promise.all([
  writeFile(path.join(scriptDirectory, "portfolio-data.js"), `window.portfolioProjects = ${JSON.stringify([...portraitProjects, ...journalProjects], null, 2)};\n`),
  writeFile(path.join(scriptDirectory, "commercial-data.js"), `window.commercialProjects = ${JSON.stringify(commercialProjects, null, 2)};\n`),
  writeFile(path.join(scriptDirectory, "hero-media.js"), `window.heroVideos = ${JSON.stringify(heroVideos, null, 2)};\n`),
]);

console.log(`已同步：人像 ${portraitProjects.length} 组，商业 ${commercialProjects.length} 组，日常 ${journalProjects.length} 组，首屏视频 ${heroVideos.length} 段。`);
