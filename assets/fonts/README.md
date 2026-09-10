# Pretendard 서브셋

[Pretendard](https://github.com/orioncactus/pretendard) v1.3.9 가변 글꼴(SIL OFL 1.1)에서 KS X 1001 완성형 한글 2350자, 라틴, 문장부호만 남긴 것이다. 완성형 밖의 글자를 쓰면 그 글자만 대체 글꼴로 찍힌다.

다시 만들려면:

```
uvx --from fonttools --with brotli pyftsubset PretendardVariable.woff2 --flavor=woff2 \
  --unicodes-file=uni.txt --layout-features='*' --output-file=Pretendard.woff2
```

`uni.txt` 는 cp949 의 B0A1–C8FE 구간을 풀어 만든 코드포인트 목록에 라틴·기호 구간을 더한 것이다.
