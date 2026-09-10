# resume

`resume.yaml` 하나를 고치면 HTML 과 PDF 이력서가 나온다.

AI 네이티브 신입 개발자를 위한 양식이다. 전통 이력서와 칸이 다르다 — 만든 것을 나열하는 대신 **무엇을 옳음으로 봤고 무엇을 맡겼고 어떻게 확인했고 무엇을 버렸나**를 묻는다. 왜 그런지는 [docs/format.md](docs/format.md).

## 구성

| 파일 | 역할 |
| --- | --- |
| `resume.yaml` | 이력서 내용. 고치는 건 이 파일뿐. 칸마다 무엇을 묻는지 주석에 한 줄 |
| `sample.filled.yaml` | 채워진 예시. 가상 인물이다. `node src/build.mjs --input sample.filled.yaml` |
| `docs/format.md` | 그 칸이 왜 있는지. 규약 다섯 줄과 버린 것 |
| `docs/ai-agent-developer-competencies.md` | 근거가 된 리서치. 역량 열 개와 이력서 근거의 종류 |
| `src/render.mjs` | 데이터를 HTML 로 바꾼다. 비어 있는 항목은 자동으로 빠진다 |
| `src/style.css` | 모양. 여러 장을 흐르게 두고 항목 하나는 쪼개지지 않게 한다. 한 장보다 긴 항목은 쪼개지고, 한 장에 들어가도 남은 자리보다 크면 통째로 밀려 앞 장이 빈다 |
| `src/build.mjs` | HTML 을 쓰고, Chromium 으로 PDF 를 뽑는다 |
| `.github/workflows/build.yml` | main 에 push 하면 빌드해서 GitHub Pages 에 올린다 |

## 쓰는 법

```
npm install          # playwright 의 chromium 도 같이 받는다
npm run build        # dist/resume.html, dist/resume.pdf
npm run build:html   # PDF 없이 HTML 만 (브라우저 없을 때)
```

다른 내용으로 뽑고 싶으면 yaml 을 하나 더 두고 `node src/build.mjs --input resume.backend.yaml`.

## 배포

main 에 push 하면 GitHub Pages 에 자동으로 올라간다.

- 웹: https://uwonu606.github.io/resume/
- PDF: https://uwonu606.github.io/resume/resume.pdf

## 내용 쓸 때

규약은 [docs/format.md#규약](docs/format.md#규약) 에 있다. 짧게는 이렇다.

- 요약 한 문장은 아래 항목 최소 둘로 증명돼야 한다.
- 판단 네 칸을 채울 수 없는 프로젝트는 항목이 아니다. 한 항목에 판단은 하나.
- 죽은 링크는 칸을 비운다.
- 항목을 비우면(`""` 또는 `[]`) 출력에서 빠지므로 틀을 지우지 않아도 된다.
- 빈 칸은 게으름이 아니라 지금 없는 근거다. 그게 다음에 뭘 만들지의 입력이 된다.
