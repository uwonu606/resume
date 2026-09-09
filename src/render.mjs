// 데이터(resume.yaml 파싱 결과) → HTML 문자열. 값이 비면 그 항목은 건너뛴다.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const has = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== "");
const list = (items) => (has(items) ? `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : "");
const section = (title, body) => (body ? `<section><h2>${esc(title)}</h2>${body}</section>` : "");
const link = (l) => (has(l.url) ? `<a href="${esc(l.url)}">${esc(l.label || l.url)}</a>` : "");

function header(b = {}) {
  const contact = [b.email, b.phone, b.location].filter(has).map(esc);
  const links = (b.links ?? []).map(link).filter(Boolean);
  return `<header>
  <h1>${esc(b.name)}</h1>
  ${has(b.title) ? `<p class="title">${esc(b.title)}</p>` : ""}
  <p class="contact">${[...contact, ...links].join('<span class="sep">·</span>')}</p>
  ${has(b.summary) ? `<p class="summary">${esc(b.summary.trim())}</p>` : ""}
</header>`;
}

const skills = (rows = []) =>
  section(
    "기술",
    has(rows)
      ? `<table class="skills">${rows
          .filter((r) => has(r.items))
          .map((r) => `<tr><th>${esc(r.category)}</th><td>${r.items.map(esc).join(", ")}</td></tr>`)
          .join("")}</table>`
      : ""
  );

const entry = ({ head, sub, period, body }) => `<article>
  <div class="row"><strong>${head}</strong><span class="period">${esc(period)}</span></div>
  ${sub ? `<div class="sub">${sub}</div>` : ""}
  ${body}
</article>`;

const experience = (rows = []) =>
  section(
    "경력",
    rows
      .map((r) =>
        entry({
          head: esc(r.company),
          sub: [r.role, r.location].filter(has).map(esc).join(" · "),
          period: r.period,
          body: list(r.bullets),
        })
      )
      .join("")
  );

const projects = (rows = []) =>
  section(
    "프로젝트",
    rows
      .map((r) =>
        entry({
          head: has(r.url) ? `<a href="${esc(r.url)}">${esc(r.name)}</a>` : esc(r.name),
          sub: [r.description, has(r.stack) ? r.stack.map(esc).join(", ") : ""].filter(Boolean).map(esc).join(" — "),
          period: r.period,
          body: list(r.bullets),
        })
      )
      .join("")
  );

const education = (rows = []) =>
  section(
    "학력",
    rows
      .map((r) => entry({ head: esc(r.school), sub: [r.degree, r.note].filter(has).map(esc).join(" · "), period: r.period, body: "" }))
      .join("")
  );

const certificates = (rows = []) =>
  section(
    "자격증",
    has(rows)
      ? `<ul class="plain">${rows
          .map((r) => `<li><span class="row"><span>${esc(r.name)}${has(r.issuer) ? ` <span class="muted">(${esc(r.issuer)})</span>` : ""}</span><span class="period">${esc(r.date)}</span></span></li>`)
          .join("")}</ul>`
      : ""
  );

export function render(data, css) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${esc(data.basics?.name)} — 이력서</title>
<style>${css}</style>
</head>
<body>
${header(data.basics)}
${skills(data.skills)}
${experience(data.experience)}
${projects(data.projects)}
${education(data.education)}
${certificates(data.certificates)}
</body>
</html>`;
}
