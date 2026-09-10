// resume.yaml → dist/resume.html (+ dist/resume.pdf)
// 사용: node src/build.mjs [--html-only] [--input resume.yaml]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import YAML from "yaml";
import { render } from "./render.mjs";

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
const css = readFileSync(resolve(root, "src/style.css"), "utf8");

const dist = resolve(root, "dist");
mkdirSync(resolve(dist, "fonts"), { recursive: true });

// 글꼴과 사진은 HTML 이 상대 경로로 가리킨다. dist 에 같이 둬야 웹과 PDF 가 같은 파일을 본다.
copyFileSync(resolve(root, "assets/fonts/Pretendard.woff2"), resolve(dist, "fonts/Pretendard.woff2"));
if (data.basics?.photo) {
  const src = resolve(dirname(input), data.basics.photo);
  if (existsSync(src)) {
    const name = "photo" + src.slice(src.lastIndexOf("."));
    copyFileSync(src, resolve(dist, name));
    data.basics.photo = name;
  } else {
    console.warn(`! 사진이 없다: ${src}. 자리째로 뺀다`);
    data.basics.photo = "";
  }
}

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
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
  });
  await browser.close();
  console.log("wrote", pdfPath);
}
