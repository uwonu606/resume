# resume

`resume.yaml` 하나를 고치면 HTML 과 PDF 이력서가 나온다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `resume.yaml` | 이력서 내용. 고치는 건 이 파일뿐 |
| `src/render.mjs` | 데이터를 HTML 로 바꾼다. 비어 있는 항목은 자동으로 빠진다 |
| `src/style.css` | 모양. A4 한 장 기준 |
| `src/build.mjs` | HTML 을 쓰고, Chromium 으로 PDF 를 뽑는다 |
| `.github/workflows/build.yml` | main 에 push 하면 PDF 를 만들어 artifact 로 올린다 |

## 쓰는 법

```
npm install          # playwright 의 chromium 도 같이 받는다
npm run build        # dist/resume.html, dist/resume.pdf
npm run build:html   # PDF 없이 HTML 만 (브라우저 없을 때)
```

다른 내용으로 뽑고 싶으면 yaml 을 하나 더 두고 `node src/build.mjs --input resume.backend.yaml`.

## 내용 쓸 때

- 경력·프로젝트의 bullet 은 문제 → 선택 → 결과 순서로 한 줄.
- 수치가 있으면 붙이고, 없으면 억지로 만들지 않는다.
- 항목을 비우면(`""` 또는 `[]`) 출력에서 빠지므로 틀을 지우지 않아도 된다.
