// resume.yaml → dist/resume.html (+ dist/resume.pdf)
// 사용: node src/build.mjs [--html-only] [--input resume.yaml]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { render } from "./render.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const htmlOnly = args.includes("--html-only");
const inputIdx = args.indexOf("--input");
const input = resolve(root, inputIdx >= 0 ? args[inputIdx + 1] : "resume.yaml");

const data = YAML.parse(readFileSync(input, "utf8"));
const css = readFileSync(resolve(root, "src/style.css"), "utf8");
const html = render(data, css);

const dist = resolve(root, "dist");
mkdirSync(dist, { recursive: true });
const htmlPath = resolve(dist, "resume.html");
writeFileSync(htmlPath, html);
console.log("wrote", htmlPath);

if (!htmlOnly) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
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
