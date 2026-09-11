import { chromium } from "playwright";
const out = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:8787/resume.html", { waitUntil: "networkidle" });
const h = await p.evaluate(() => document.body.scrollHeight);
console.log("height", h);
// 섹션별로 자른다
const shots = [
  ["header", "header"],
  ["p1", "#projects article:nth-of-type(1)"],
  ["p2", "#projects article:nth-of-type(2)"],
  ["p3", "#projects article:nth-of-type(3)"],
  ["env", "#environment"],
  ["tail", "#tail"],
];
for (const [name, sel] of shots) {
  const el = await p.$(sel);
  if (el) await el.screenshot({ path: `${out}/${name}.png` });
}
await b.close();
