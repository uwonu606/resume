// resume.yaml → dist/resume.html (+ dist/resume.pdf)
// 사용: node src/build.mjs [--html-only] [--input resume.yaml]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import YAML from "yaml";
import { render } from "./render.mjs";

const has = (v) => v !== undefined && v !== null && String(v).trim() !== "";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const htmlOnly = args.includes("--html-only");
const inputIdx = args.indexOf("--input");
const input = resolve(root, inputIdx >= 0 ? args[inputIdx + 1] : "resume.yaml");

// A4 에서 여백 14mm 를 뺀 인쇄 본문. 96dpi 픽셀로 재야 브라우저 값과 견줄 수 있다.
const px = (mm) => Math.round(mm * (96 / 25.4));
const [pageW, pageH] = [px(210 - 28), px(297 - 28)];

// 따옴표 없는 값 뒤에 # 이 오면 YAML 이 그 뒤를 주석으로 먹는다. 값이 조용히 잘리므로 짚어 준다.
// 틀에 달아 둔 주석은 값이 "" 라 걸리지 않는다.
function warnTruncated(src) {
  YAML.visit(YAML.parseDocument(src), {
    Scalar(_, node) {
      const value = String(node.value ?? "").trim();
      if (node.type === "PLAIN" && value && node.comment)
        console.warn(`! 값이 잘렸다: "…${value.slice(-20)}" 뒤 "#${node.comment.trim().slice(0, 20)}" 를 주석으로 먹었다. 따옴표로 감싼다`);
    },
  });
}

const src = readFileSync(input, "utf8");
warnTruncated(src);
const data = YAML.parse(src);

// 내용 파일이 자기 옷을 고른다. theme 이 없거나 그 파일이 없으면 기본 모양으로 떨어진다.
const themed = has(data.theme) ? resolve(root, `src/style.${data.theme}.css`) : null;
const cssPath = themed && existsSync(themed) ? themed : resolve(root, "src/style.css");
if (themed && !existsSync(themed)) console.warn(`! theme "${data.theme}" 의 CSS 가 없다: ${themed}. 기본 모양으로 뽑는다`);
const css = readFileSync(cssPath, "utf8");
console.log("style", cssPath.slice(root.length + 1));

const dist = resolve(root, "dist");
mkdirSync(resolve(dist, "fonts"), { recursive: true });

// 글꼴·사진·마크는 HTML 이 상대 경로로 가리킨다. dist 에 같이 둬야 웹과 PDF 가 같은 파일을 본다.
copyFileSync(resolve(root, "assets/fonts/Pretendard.woff2"), resolve(dist, "fonts/Pretendard.woff2"));

// 없는 파일을 가리키면 자리째로 뺀다 — 깨진 그림 자리가 남는 것보다 낫다.
function stage(key, base) {
  const rel = data.basics?.[key];
  if (!rel) return;
  const from = resolve(dirname(input), rel);
  if (existsSync(from)) {
    const name = base + from.slice(from.lastIndexOf("."));
    copyFileSync(from, resolve(dist, name));
    data.basics[key] = name;
  } else {
    console.warn(`! ${key} 파일이 없다: ${from}. 자리째로 뺀다`);
    data.basics[key] = "";
  }
}
stage("photo", "photo");
stage("mark", "mark");

const html = render(data, css);
const htmlPath = resolve(dist, "resume.html");
writeFileSync(htmlPath, html);
console.log("wrote", htmlPath);

if (!htmlOnly) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: pageW, height: pageH } });
  // setContent 는 상대 경로를 못 푼다. 파일로 열어야 글꼴과 사진이 실린다.
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });

  // 한 장보다 긴 항목은 break-inside: avoid 로도 못 막고 장 경계에서 쪼개진다. 인쇄 폭으로 재야 줄바꿈이 PDF 와 같다.
  await page.emulateMedia({ media: "print" });
  const tall = await page.$$eval(
    "article",
    (els, limit) =>
      els
        .filter((el) => el.getBoundingClientRect().height > limit)
        .map((el) => [el.querySelector("strong")?.textContent, Math.round(el.getBoundingClientRect().height)]),
    pageH
  );
  for (const [name, height] of tall) console.warn(`! 항목이 한 장(${pageH}px)을 넘는다: "${name}" ${height}px. 장 경계에서 쪼개진다`);

  const pdfPath = resolve(dist, "resume.pdf");
  // 여백은 CSS @page 가 정한다. 첫 장만 위쪽 여백을 걷어 빨강 띠가 종이 끝에 닿는다.
  // 여기서 margin 을 주면 그 규칙이 덮여서 띠가 안쪽으로 밀린다.
  await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log("wrote", pdfPath);
}
