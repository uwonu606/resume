# resume

`resume.yaml` 하나를 고치면 HTML 과 PDF 이력서가 나온다.

AI 네이티브 신입 개발자를 위한 양식이다. 전통 이력서와 칸이 다르다 — 만든 것을 나열하는 대신 **무엇을 옳음으로 봤고 무엇을 맡겼고 어떻게 확인했고 무엇을 버렸나**를 묻는다. 왜 그런지는 [docs/format.md](docs/format.md).

## 구성

| 파일 | 역할 |
| --- | --- |
| `resume.yaml` | 이력서 내용. 고치는 건 이 파일뿐. 칸마다 무엇을 묻는지 주석에 한 줄 |
| `sample.filled.yaml` | 채워진 예시. 가상 인물이다. `node src/build.mjs --input sample.filled.yaml` |
| `docs/format.md` | 그 칸이 왜 있는지. 규약 다섯 줄과 버린 것 |
| `docs/design.md` | 그 칸이 왜 그 자리에 그 무게로 놓이는지. 위계·장치·길이 제약·판정 방법 |
| `resume.apr.yaml` | 에이피알 지원용 가지. `judgment` 를 주장·근거 두 층으로 가르고, `impact` 칸과 프로젝트별 `flow` 흐름도를 더하고, `theme: apr` 로 모양을 고른다 |
| `src/style.apr.css` | 그 가지의 모양. 빨강 머리글, CSS 로 그린 판정 흐름도, 프로젝트 하나가 한 장 |
| `docs/design.apr.md` | 그 가지가 범용 모양과 어긋나게 정한 자리와 이유 |
| `assets/apr/` | 에이피알 공식 로고의 흰 판. 출처와 만든 방법은 같은 폴더의 `SOURCE.md` |
| `docs/ai-agent-developer-competencies.md` | 근거가 된 리서치. 역량 열 개와 이력서 근거의 종류 |
| `src/render.mjs` | 데이터를 HTML 로 바꾼다. 비어 있는 항목은 자동으로 빠진다 |
| `src/style.css` | 모양. 판단 칸을 옅은 상자로 묶어 앞세우고, 여러 장을 흐르게 두되 항목 하나는 쪼개지지 않게 한다. 왜 이 모양인지는 `docs/design.md` |
| `assets/fonts/` | Pretendard 한글 서브셋. 빌드가 `dist/fonts/` 로 복사해 웹과 PDF 가 같은 글꼴을 쓴다 |
| `src/build.mjs` | 글꼴·사진·마크를 `dist/` 로 복사하고, `theme` 이 고른 CSS 를 싣고, HTML 을 쓰고, Chromium 으로 PDF 를 뽑는다. 값이 잘린 줄과 한 장을 넘는 항목을 경고한다 |
| `.github/workflows/build.yml` | main 에 push 하면 빌드해서 GitHub Pages 에 올린다 |

## 쓰는 법

```
npm install          # playwright 의 chromium 도 같이 받는다
npm run build        # dist/resume.html, dist/resume.pdf
npm run build:html   # PDF 없이 HTML 만 (브라우저 없을 때)
```

다른 내용으로 뽑고 싶으면 yaml 을 하나 더 두고 `node src/build.mjs --input resume.backend.yaml`.

모양은 내용 파일이 고른다. yaml 맨 위에 `theme: apr` 을 적으면 `src/style.apr.css` 로 뽑고, 비우거나 그 파일이 없으면 `src/style.css` 로 떨어진다.

빌드는 두 가지를 경고한다 — 따옴표를 안 쳐서 `#` 뒤가 주석으로 먹힌 값, 그리고 한 장(1017px)을 넘어 장 경계에서 쪼개질 항목. 둘 다 경고일 뿐 빌드는 멈추지 않는다.

## 배포

main 에 push 하면 GitHub Pages 에 자동으로 올라간다.

`apr` 가지는 합치지 않는다 — 남의 상표가 박힌 페이지를 공개하지 않으려는 것이다. 그쪽은 `dist/resume.pdf` 파일로 낸다.

- 웹: https://uwonu606.github.io/resume/
- PDF: https://uwonu606.github.io/resume/resume.pdf

## 내용 쓸 때

규약은 [docs/format.md#규약](docs/format.md#규약) 에 있다. 짧게는 이렇다.

- 요약 한 문장은 아래 항목 최소 둘로 증명돼야 한다.
- 판단 네 칸을 채울 수 없는 프로젝트는 항목이 아니다. 한 항목에 판단은 하나.
- 죽은 링크는 칸을 비운다.
- 항목을 비우면(`""` 또는 `[]`) 출력에서 빠지므로 틀을 지우지 않아도 된다.
- 사진은 `basics.photo` 에 3:4 파일 경로를 적는다. 비우면 자리째로 빠진다. `basics.mark` 와 `basics.target` 도 같다.
- 빈 칸은 게으름이 아니라 지금 없는 근거다. 그게 다음에 뭘 만들지의 입력이 된다.
