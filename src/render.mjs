// 데이터(resume.yaml 파싱 결과) → HTML 문자열. 값이 비면 그 항목은 건너뛴다.
const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const has = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== "");
const section = (title, body, id) =>
  body ? `<section${id ? ` id="${id}"` : ""}><h2>${esc(title)}</h2>${body}</section>` : "";
const link = (l) => (has(l.url) ? `<a href="${esc(l.url)}">${esc(l.label || l.url)}</a>` : "");
const url = (u) => (has(u) ? `<a href="${esc(u)}">${esc(String(u).replace(/^https?:\/\//, ""))}</a>` : "");

// 나란한 조각들. 가운뎃점으로 잇지 않고 간격으로 가른다 — 점은 읽는 데 보태는 게 없다.
const inline = (cls, parts) => {
  const kept = parts.filter(Boolean);
  return kept.length ? `<p class="${cls}">${kept.map((p) => `<span>${p}</span>`).join("")}</p>` : "";
};

// 라벨을 왼쪽 고정 열에 세우고 값을 오른쪽에. 빈 칸은 줄째로 빠진다.
// kind 가 라벨의 무게를 정한다 — 판단은 빨간 칩, 나머지는 회색 칩 (docs/design.apr.md#장치).
const fields = (pairs, kind = "grey") => {
  const kept = pairs.filter(([, v]) => has(v));
  return kept.length
    ? `<dl class="fields ${kind}">${kept.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join("")}</dl>`
    : "";
};

// 판단 칸 하나가 두 층이다 — 주장 한 줄과 그 아래 근거. 어디까지가 주장인지는 문장마다 다른
// 판단이라 기계가 첫 마침표로 자르지 않고 YAML 이 명시적으로 나눈다 (docs/design.apr.md#층).
// 범용 resume.yaml 은 아직 한 덩어리 문자열이라 그쪽도 그대로 받는다.
const layered = (v) =>
  v && typeof v === "object"
    ? [has(v.claim) ? `<b>${esc(v.claim)}</b>` : "", has(v.why) ? `<span>${esc(v.why)}</span>` : ""].join("")
    : esc(v);

const filled = (v) => (v && typeof v === "object" ? has(v.claim) || has(v.why) : has(v));

// 일급 칸 다섯 중 하나라도 채워져야 항목이다. 다 비면 출력에서 빠진다 (docs/format.md#규약).
// impact 는 이 가지에서 더한 칸이다 — 공고가 비즈니스 영향을 여섯 줄에 걸쳐 되묻는다.
const judged = (j = {}) => [j.criterion, j.delegated, j.verification, j.discarded, j.impact].some(filled);

// 일급 칸 다섯 + 선택 하나. 프로젝트와 경력이 같은 칸을 쓴다.
// 라벨은 칸에 ask 가 있으면 그 질문이고, 없으면 네 글자 명사구다. 에이피알 가지는 흐름도가 이미
// 말하는 칸을 빼고 남긴 칸마다 그 그림에서 이어지는 질문을 ask 로 단다 (docs/design.apr.md#층).
const LABEL = {
  criterion: "완료 기준",
  delegated: "위임 범위",
  verification: "검증 방법",
  discarded: "버린 선택",
  impact: "영향 대상",
  not_used: "예외 결정",
};
const judgment = (j = {}) => {
  const body = fields(
    Object.keys(LABEL).map((k) => [has(j[k]?.ask) ? j[k].ask : LABEL[k], layered(j[k])]),
    "accent"
  );
  return body ? `<div class="judgment">${body}</div>` : "";
};

// ── 흐름도 ────────────────────────────────────────────
// 상자 모양이 "누가 하나" 를 말한다 — LLM 은 윤곽선, 기계·실물은 채움, 판정 자리만 빨강.
// 상자 안에 꼬리표를 달아 범례 없이 스스로 읽히게 했다 (docs/design.apr.md#흐름도).
const BY = { llm: "LLM", machine: "실물" };

const cell = (n) => {
  const o = n && typeof n === "object" ? n : { step: n };
  const cls = ["node", BY[o.by] ? o.by : "", o.verdict ? "verdict" : ""].filter(Boolean).join(" ");
  const loop = o.retry ? `<span class="loop">재시도</span>` : "";
  const tag = BY[o.by] ? `<i>${BY[o.by]}</i>` : "";
  const note = has(o.note) ? `<em>${esc(o.note)}</em>` : "";
  return `<span class="cell"><span class="${cls}">${loop}${esc(o.step)}${tag}</span>${note}</span>`;
};

// 갈래는 흐름의 마지막에 한 번 갈리고 다시 안 합쳐진다. 갈래 하나면 초안 셋이 다 들어간다.
const lane = (steps = []) => `<span class="lane">${steps.map(cell).join("")}</span>`;
const branch = (lanes = []) => `<span class="branch">${lanes.map(lane).join("")}</span>`;

// 캡션은 그림의 주장이고 why 는 그 근거다. 판단 칸과 같은 두 층이라 그림 바로 밑에서 "왜?" 에 답한다.
const flow = (f) =>
  f && has(f.steps)
    ? `<figure class="flow">
    <div class="track">${f.steps.map((s) => (s && s.branch ? branch(s.branch) : cell(s))).join("")}</div>
    ${has(f.caption) || has(f.why) ? `<figcaption>${has(f.caption) ? `<b>${esc(f.caption)}</b>` : ""}${
        has(f.why) ? `<p>${esc(f.why)}</p>` : ""
      }</figcaption>` : ""}
  </figure>`
    : "";

// 리포·주소는 훑기의 넷째 단. 라벨을 작게 앞에 붙여 설명 줄 아래 한 줄로.
const meta = (pairs) =>
  inline(
    "meta",
    pairs.filter(([, v]) => has(v)).map(([k, v]) => `<span class="k">${esc(k)}</span>${v}`)
  );

// 웹에서는 빨강 면이 문구·로고·이름·직함을 품고, 인쇄에서는 띠만 남고 이름이 아래로 내려온다.
// 같은 물건이 얕아지는 것이라 두 매체가 다른 말을 하지 않는다 (docs/design.apr.md#머리글).
function header(b = {}) {
  const contact = [...[b.email, b.phone, b.location].filter(has).map(esc), ...(b.links ?? []).map(link)].filter(
    Boolean
  );
  const banner =
    has(b.target) || has(b.mark)
      ? `<div class="banner">
      ${has(b.target) ? `<p class="target">${esc(b.target)}</p>` : ""}
      ${has(b.mark) ? `<img class="mark" src="${esc(b.mark)}" alt="APR">` : ""}
    </div>`
      : "";
  return `<header>
  <div class="masthead">
    ${banner}
    <div class="who">
      <h1>${esc(b.name)}</h1>
      ${has(b.title) ? `<p class="title">${esc(b.title)}</p>` : ""}
    </div>
  </div>
  ${inline("contact", contact)}
  ${has(b.summary) ? `<p class="summary">${esc(b.summary.trim())}</p>` : ""}
  ${has(b.photo) ? `<img class="photo" src="${esc(b.photo)}" alt="">` : ""}
</header>`;
}

const entry = ({ head, sub, period, body, n }) => `<article>
  <div class="row"><strong>${n ? `<span class="n">${String(n).padStart(2, "0")}</span>` : ""}${head}</strong>${has(period) ? `<span class="period">${esc(period)}</span>` : ""}</div>
  ${sub ? `<div class="sub">${sub}</div>` : ""}
  ${body}
</article>`;

// 쓴 기술은 이름만 한 줄. "어디까지 아나" 는 기술 섹션이 말하고, 여기는 "무엇으로 만들었나" 다.
const stack = (v) => (has(v) ? `<p class="stack">${v.map(esc).join(", ")}</p>` : "");

// 프로젝트는 번호를 단다. 셋이라는 것과 어디서 다음이 시작하는지를 번호가 센다.
const projects = (rows = []) =>
  section(
    "프로젝트",
    kept(rows)
      .map((r, i) =>
        entry({
          n: i + 1,
          head: esc(r.name),
          sub: esc(r.description),
          period: r.period,
          body:
            stack(r.stack) +
            meta([["리포", url(r.repo)], ["주소", url(r.live)]]) +
            flow(r.flow) +
            judgment(r.judgment),
        })
      )
      .join(""),
    "projects"
  );
const kept = (rows = []) => rows.filter((r) => judged(r.judgment));

const experience = (rows = []) =>
  section(
    "경력",
    rows
      .filter((r) => judged(r.judgment))
      .map((r) =>
        entry({
          head: esc(r.company),
          sub: inline("parts", [r.role, r.location].filter(has).map(esc)),
          period: r.period,
          body: judgment(r.judgment),
        })
      )
      .join("")
  );

// 리포·문제·장치 세 칸은 실은 한 문장이었다 — 이런 문제가 반복돼서 이런 장치를 넣었다.
// 문제와 장치를 두 열로 마주 세우면 셋이 나란히 설 때 그 문장이 세 번 증명된 것으로 읽힌다.
// 리포는 칸에서 빼 제목 옆으로 올린다 — 그것은 판단이 아니라 주소다.
const environment = (rows = []) =>
  section(
    "에이전트 작업 환경",
    rows
      .filter((r) => has(r.problem) || has(r.device))
      .map(
        (r) => `<article class="tool">
  <div class="row"><strong>${esc(r.name)}</strong>${has(r.repo) ? url(r.repo) : ""}</div>
  <div class="pair">
    <div class="side"><span class="k">반복되던 문제</span><p>${esc(r.problem)}</p></div>
    <div class="side"><span class="k">넣은 장치</span><p>${esc(r.device)}</p></div>
  </div>
</article>`
      )
      .join(""),
    "environment"
  );

// 두 모양을 받는다. 범용은 hands_on 이름 나열, 에이피알 가지는 groups 로 묶음마다 깊이 한 줄.
// 묶음은 이름을 왼쪽 열에, 깊이를 오른쪽 열에 세운다. 이름 열이 곧 묶음 사이의 경계라
// 선을 안 긋는다 (docs/design.apr.md#장치). 라벨이 긴 줄(읽고 고칠 수 있는 것)은 작은 글자로 눕힌다.
const skills = (s = {}) => {
  const groups = (s.groups ?? []).filter((g) => has(g.names));
  const grid = groups.length
    ? `<dl class="skills">${groups
        .map((g) => `<dt>${g.names.map(esc).join(", ")}</dt><dd>${esc(g.depth)}</dd>`)
        .join("")}</dl>`
    : "";
  const rows = [
    ["직접 쓴 것", s.hands_on],
    ["읽고 고칠 수 있는 것", s.can_read],
  ]
    .filter(([, v]) => has(v))
    .map(([k, v]) => `<li><span class="k">${esc(k)}</span>${v.map(esc).join(", ")}</li>`);
  const list = rows.length ? `<ul class="plain skills">${rows.join("")}</ul>` : "";
  return section("기술", grid + list, "tail");
};

const writing = (rows = []) => {
  const kept = rows.filter((r) => has(r.title));
  return section(
    "쓴 글",
    kept.length
      ? `<ul class="plain notes">${kept
          .map(
            (r) =>
              `<li>${has(r.url) ? `<a href="${esc(r.url)}">${esc(r.title)}</a>` : esc(r.title)}${
                has(r.note) ? `<span class="muted">${esc(r.note)}</span>` : ""
              }</li>`
          )
          .join("")}</ul>`
      : ""
  );
};

// 학위와 과정을 가른다. 같은 모양이라 한 함수로 찍고 제목만 달리 준다.
const schooling = (title) => (rows = []) =>
  section(
    title,
    rows
      .filter((r) => has(r.school))
      .map((r) =>
        entry({
          head: esc(r.school),
          sub: inline("parts", [r.degree, r.note].filter(has).map(esc)),
          period: r.period,
          body: "",
        })
      )
      .join("")
  );

const training = schooling("교육");
const education = schooling("학력");

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
<meta name="viewport" content="width=device-width, initial-scale=1">
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
${training(data.training)}
${education(data.education)}
${certificates(data.certificates)}
</body>
</html>`;
}
