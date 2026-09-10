// 데이터(resume.yaml 파싱 결과) → HTML 문자열. 값이 비면 그 항목은 건너뛴다.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const has = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== "");
const section = (title, body) => (body ? `<section><h2>${esc(title)}</h2>${body}</section>` : "");
const link = (l) => (has(l.url) ? `<a href="${esc(l.url)}">${esc(l.label || l.url)}</a>` : "");
const url = (u) => (has(u) ? `<a href="${esc(u)}">${esc(String(u).replace(/^https?:\/\//, ""))}</a>` : "");

// 라벨을 작게 앞에 붙이고 값을 한 줄씩. 빈 칸은 줄째로 빠진다.
const fields = (pairs) => {
  const kept = pairs.filter(([, v]) => has(v));
  return kept.length
    ? `<dl class="fields">${kept.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join("")}</dl>`
    : "";
};

// 일급 칸 넷 중 하나라도 채워져야 항목이다. 다 비면 출력에서 빠진다 (docs/format.md#규약).
const judged = (j = {}) => [j.criterion, j.delegated, j.verification, j.discarded].some(has);

// 일급 칸 넷 + 선택 하나. 프로젝트와 경력이 같은 칸을 쓴다.
// 한 상자로 묶어 항목 맨 앞에 둔다. 판단을 앞세우는 장치는 이것 하나다 (docs/design.md#장치).
const judgment = (j = {}) => {
  const body = fields([
    ["기준", esc(j.criterion)],
    ["맡긴 것", esc(j.delegated)],
    ["확인", esc(j.verification)],
    ["버린 것", esc(j.discarded)],
    ["안 쓴 결정", esc(j.not_used)],
  ]);
  return body ? `<div class="judgment">${body}</div>` : "";
};

// 리포·주소·운영은 훑기의 넷째 단. 라벨을 떼고 설명 줄 아래 한 줄로 붙인다.
const meta = (pairs) => {
  const kept = pairs.filter(([, v]) => has(v));
  return kept.length
    ? `<p class="meta">${kept.map(([k, v]) => `<span class="k">${esc(k)}</span> ${v}`).join('<span class="sep">·</span>')}</p>`
    : "";
};

// 사진은 머리글 오른쪽, 3:4. 경로가 비면 자리째로 빠진다 (docs/design.md#색·글꼴·사진).
function header(b = {}) {
  const contact = [b.email, b.phone, b.location].filter(has).map(esc);
  const links = (b.links ?? []).map(link).filter(Boolean);
  return `<header>
  <div class="who">
    <h1>${esc(b.name)}</h1>
    ${has(b.title) ? `<p class="title">${esc(b.title)}</p>` : ""}
    <p class="contact">${[...contact, ...links].join('<span class="sep">·</span>')}</p>
    ${has(b.summary) ? `<p class="summary">${esc(b.summary.trim())}</p>` : ""}
  </div>
  ${has(b.photo) ? `<img class="photo" src="${esc(b.photo)}" alt="">` : ""}
</header>`;
}

const entry = ({ head, sub, period, body }) => `<article>
  <div class="row"><strong>${head}</strong>${has(period) ? `<span class="period">${esc(period)}</span>` : ""}</div>
  ${sub ? `<div class="sub">${sub}</div>` : ""}
  ${body}
</article>`;

const projects = (rows = []) =>
  section(
    "프로젝트",
    rows
      .filter((r) => judged(r.judgment))
      .map((r) =>
        entry({
          head: esc(r.name),
          sub: esc(r.description),
          period: r.period,
          body: meta([["리포", url(r.repo)], ["주소", url(r.live)], ["운영", esc(r.operation)]]) + judgment(r.judgment),
        })
      )
      .join("")
  );

const experience = (rows = []) =>
  section(
    "경력",
    rows
      .filter((r) => judged(r.judgment))
      .map((r) =>
        entry({
          head: esc(r.company),
          sub: [r.role, r.location].filter(has).map(esc).join(" · "),
          period: r.period,
          body: judgment(r.judgment),
        })
      )
      .join("")
  );

const environment = (rows = []) =>
  section(
    "만든 환경",
    rows
      .filter((r) => has(r.problem) || has(r.device))
      .map((r) =>
        entry({
          head: esc(r.name),
          sub: "",
          period: "",
          body: fields([["리포", url(r.repo)], ["문제", esc(r.problem)], ["장치", esc(r.device)]]),
        })
      )
      .join("")
  );

// 라벨이 길어(읽고 고칠 수 있는 것) 격자로 두면 값이 한참 오른쪽으로 밀린다.
// 두 줄뿐인 섹션이라 라벨을 값 앞에 붙여 흐르게 두고, 장이 넘어갈 때 둘이 갈라지지 않게 묶는다.
const skills = (s = {}) => {
  const rows = [
    ["직접 쓴 것", s.hands_on],
    ["읽고 고칠 수 있는 것", s.can_read],
  ].filter(([, v]) => has(v));
  return section(
    "기술",
    rows.length
      ? `<ul class="plain skills">${rows
          .map(([k, v]) => `<li><span class="k">${esc(k)}</span> ${v.map(esc).join(", ")}</li>`)
          .join("")}</ul>`
      : ""
  );
};

const writing = (rows = []) => {
  const kept = rows.filter((r) => has(r.title));
  return section(
    "배움과 공유",
    kept.length
      ? `<ul class="plain">${kept
          .map(
            (r) =>
              `<li>${has(r.url) ? `<a href="${esc(r.url)}">${esc(r.title)}</a>` : esc(r.title)}${
                has(r.note) ? ` <span class="muted">— ${esc(r.note)}</span>` : ""
              }</li>`
          )
          .join("")}</ul>`
      : ""
  );
};

const education = (rows = []) =>
  section(
    "학력",
    rows
      .filter((r) => has(r.school))
      .map((r) =>
        entry({
          head: esc(r.school),
          sub: [r.degree, r.note].filter(has).map(esc).join(" · "),
          period: r.period,
          body: "",
        })
      )
      .join("")
  );

const certificates = (rows = []) => {
  const kept = rows.filter((r) => has(r.name));
  return section(
    "자격증",
    kept.length
      ? `<ul class="plain">${kept
          .map(
            (r) =>
              `<li><span class="row"><span>${esc(r.name)}${
                has(r.issuer) ? ` <span class="muted">(${esc(r.issuer)})</span>` : ""
              }</span><span class="period">${esc(r.date)}</span></span></li>`
          )
          .join("")}</ul>`
      : ""
  );
};

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
${projects(data.projects)}
${experience(data.experience)}
${environment(data.environment)}
${skills(data.skills)}
${writing(data.writing)}
${education(data.education)}
${certificates(data.certificates)}
</body>
</html>`;
}
