# 에이전트를 쓰는 개발자에게 요구하는 것

AI 코딩 에이전트(Claude Code, Codex, Cursor 같은 것)를 도구로 써서 개발하는 사람에게 회사와 현업이 무엇을 요구하는지, 그 역량을 이력서에서 어떤 근거로 보여야 하는지 정리했다. 에이전트를 만드는 쪽 역량은 쓰다 보면 자연히 생기는 것(스킬·컨텍스트 파일·워크플로)만 담았다.

인용의 원문·링크·날짜는 [ai-agent-developer-sources.md](ai-agent-developer-sources.md) 에 있다. 여기서는 출처를 이름으로만 부른다.

조사일 2026-09-10. 출처 91건, 2025-01 이후.

## 표기

| 표기 | 뜻 |
|---|---|
| 회사 | 서비스 운영사의 메모·기술 블로그·보고서·키노트 |
| 공고 | 채용 공고·채용 전형 |
| 개인 | 독립 개인의 블로그·뉴스레터·팟캐스트 |
| 발표 | 컨퍼런스 발표·인터뷰 |
| 둘 다 | 회사 자료와 개인 글이 같은 말을 한다. 채용에 이미 반영된 것 |
| 개인 앞섬 | 개인 글이 강하게 말하고 회사 자료는 약하다. 앞서가는 것 |
| 회사만 | 회사 자료에만 있다. 조직 운영과 평가에 굳어진 것 |

이력서 근거의 종류는 다섯이다.

| 근거 | 예 |
|---|---|
| 링크 | 리포·PR·이슈·배포 주소. 읽는 사람이 직접 확인할 수 있는 것 |
| 산출물 | 스킬·CLAUDE.md·테스트·린터·CI 설정처럼 파일로 남은 것 |
| 수치 | 테스트 수와 실행 시간, PR 수, 리드타임, 비용. 없으면 억지로 만들지 않는다 |
| 글 | 회고·블로그·발표. 판단 과정이 드러나는 것 |
| 한 줄 서술 | 문제 → 선택 → 결과. 이력서 bullet 그 자체 |

## 전제: AI 를 썼다는 것 자체는 변별력이 없다

| 사실 | 출처 |
|---|---|
| 신규 개발자 80%가 첫 주에 Copilot 사용 | GitHub Octoverse 2025 |
| 현업 95%가 매주 AI 사용, 55%가 에이전트 상시 사용 | Pragmatic Engineer 2026 설문 |
| AI 사용을 성과·동료 평가 항목에 넣음 | Shopify |
| AI 도구 온보딩 안 한 엔지니어 해고 | Coinbase |
| "Just knowing how to use the latest model or AI tool isn't enough anymore" | Palantir |

그래서 이력서에 "Claude Code 활용" 한 줄은 아무것도 말하지 않는다. 아래 역량 열 개는 전부 "썼다"가 아니라 "쓰면서 무엇을 사람이 맡았나"를 묻는다. 확신.

## 한눈에

| 역량 | 일치 | 이력서 근거 |
|---|---|---|
| [1. 위임하고 검증한다](#1-위임하고-검증한다) | 둘 다 | 검증 방법이 적힌 PR, 에이전트 실수를 잡은 사례 |
| [2. 테스트와 빠른 검증 루프가 전제다](#2-테스트와-빠른-검증-루프가-전제다) | 둘 다 | 테스트 수·실행 시간, TDD 흔적이 있는 커밋 |
| [3. 의도를 스펙으로 쓰고 작업을 자른다](#3-의도를-스펙으로-쓰고-작업을-자른다) | 둘 다 | 스펙·계획 문서, 작은 단위의 PR |
| [4. 방향·설계를 정하고 답을 고른다](#4-방향설계를-정하고-답을-고른다) | 둘 다 | 대안 비교와 선택 이유가 적힌 글 |
| [5. 에이전트가 쓸 환경을 만든다](#5-에이전트가-쓸-환경을-만든다) | 둘 다 | 스킬·CLAUDE.md·린터·훅 파일과 그 효과 |
| [6. 자율성을 조절하고 병렬로 지휘한다](#6-자율성을-조절하고-병렬로-지휘한다) | 규모는 회사만, 위험 판단은 개인 앞섬 | 위임 범위를 정한 기준, 병렬 운용 사례 |
| [7. 출력을 판단할 깊이를 유지한다](#7-출력을-판단할-깊이를-유지한다) | 둘 다 | AI 없이 디버깅·리팩토링한 사례, 손으로 하는 영역 |
| [8. 언제 안 쓸지 알고 책임진다](#8-언제-안-쓸지-알고-책임진다) | 개인 앞섬 | AI 를 안 쓴 결정, 되돌린 사례 |
| [9. 스스로 배우고 공유한다](#9-스스로-배우고-공유한다) | 둘 다 | 글·발표·팀에 퍼뜨린 도구 |
| [10. 비용과 지표를 의식한다](#10-비용과-지표를-의식한다) | 회사만 | 세션 비용, 활동 지표가 아닌 결과 지표 |

## 1. 위임하고 검증한다

코드를 쓰는 일이 에이전트로 넘어가고, 사람의 주 업무는 위임과 검증이 됐다. 검증 능력이 위임 규모의 상한이다.

| 출처 | 종류 | 원문 |
|---|---|---|
| GitHub 연구 글 | 회사 | "Delegation and verification became the primary activities" / "Strong verification practices are what make larger-scale delegation possible" |
| Google Pichai | 회사 | 새 코드 75%가 "AI-generated and approved by engineers" |
| Uber | 회사 | PR 70% 이상이 에이전트 것, 전부 "human reviews/escalations" |
| LY(라인) | 회사 | "AI 시대의 개발 능력은 검증력으로 결정된다" |
| Google 면접 파일럿, 무신사 2차 전형, 잡코리아 | 공고 | "output validation", "AI 출력을 그대로 쓰지 않고 테스트·엣지 케이스·복잡도를 확인하는가" |
| Karpathy | 개인 | "The AI generates ... The human verifies" |
| Böckeler | 개인 | "It's very rare that I do NOT find something to fix" |
| Willison | 개인 | "If you're fast and productive at code review you're going to have a much better time" |
| Shopify Thawar | 발표 | "I want you to be able to go in and look at the code and say, oh yeah, there's a line that's wrong" |
| Cognition/Murray | 발표 | "your code base regresses to your worst engineer, because that engineer ... is not auditing" |

그 밖에 Stripe, Airbnb, 컬리, 올리브영, 토스, Fowler, Ronacher, Osmani, 박종훈, DHH, 카카오 세미나.

이력서 근거:
- 링크: 검증 방법(수동 테스트 기록, 자동 테스트, 재현 절차)이 본문에 적힌 PR. Willison 의 "make sure you've included your evidence that it works" 가 기준이다.
- 한 줄 서술: 에이전트 출력에서 잘못을 잡아낸 사례. 무엇이 틀렸고 어떻게 알아챘는지.
- 수치: 리뷰한 에이전트 PR 수, 그중 되돌리거나 고친 비율. 있을 때만.

## 2. 테스트와 빠른 검증 루프가 전제다

검증을 사람 눈으로만 하면 에이전트 속도를 못 따라간다. 테스트는 선택이 아닌 전제가 됐고, 에이전트가 스스로 검증하게 만드는 것까지 포함한다.

| 출처 | 종류 | 원문 |
|---|---|---|
| LY(라인) | 회사 | "에이전트의 속도에 비해 ... 느린 단계가 ... 병목" / 테스트 2,754개를 로컬 15초에 |
| Duolingo | 회사 | PR 위험 점수로 10% 자동 승인 |
| Willison | 개인 | 자동 테스트는 "no longer optional when working with coding agents" / "Red/green TDD" |
| Beck | 개인 | "In augmented coding you care about the code, its complexity, the tests, & their coverage" |
| Böckeler | 개인 | "the minimum I want to still care about and be on top of is the test code" |
| Hashimoto | 개인 | "If you give an agent a way to verify its work, it more often or not fixes its own mistakes" |
| 박종훈 | 개인 | "그 해답은 테스트 코드를 통한 강제적인 검증이다" |
| 카카오 세미나 | 발표 | "오류 발생 시 즉시 롤백하고 다시 지시하는 과정이 필수" |

그 밖에 Uber(Autocover), 카카오뱅크(Kori), Ronacher(로그), Karpathy.

이력서 근거:
- 수치: 테스트 개수와 로컬 실행 시간. 리포에 있으면 한 줄로 쓸 수 있다.
- 산출물: 테스트 코드, CI 설정, 에이전트가 스스로 검증하게 만든 스크립트.
- 링크: 실패하는 테스트를 먼저 쓴 커밋 순서가 보이는 PR.

## 3. 의도를 스펙으로 쓰고 작업을 자른다

에이전트는 모르는 것을 모른다. 범위 안팎과 성공 판정을 스펙으로 쓰고, 리뷰할 수 있는 크기로 자르는 것이 사람의 일이다. 리뷰 시점은 코드 뒤에서 코드 앞으로 옮겨간다.

| 출처 | 종류 | 원문 |
|---|---|---|
| LinkedIn | 회사 | "An agent does not know what it does not know" / "Intent has to be very explicit. What's in scope? ... what's out of scope?" |
| Amazon | 회사 | Kiro 는 "spec-driven development, helping developers express their intent clearly" |
| LY(라인) | 회사 | "스펙 주도 개발은 ... 모호함을 줄이고 출력의 예측 가능성을 높입니다" |
| Zillow | 회사 | "The ticket ... is the work definition, precise enough that an automated coding agent can be assigned the task" |
| 카카오 CTO | 회사 | "내가 완전히 컨트롤할 수 있는 범위 내에서, 문제를 잘게 쪼개어" |
| 컬리 | 회사 | "작게 나누고, 자주 확인하고, 반복은 스킬로 만들어라" |
| Karpathy | 개인 | "Getting a 10,000 line code change isn't helpful if it takes me days to review it" |
| Hashimoto | 개인 | "Don't try to 'draw the owl' in one mega session" |
| Foxwell | 발표 | "engineers should review specifications, test strategies and architecture before any code is written" |

그 밖에 Stripe(계획 단계 협업), Osmani, Beck, Willison, Coinbase Moghe.

이력서 근거:
- 산출물: 에이전트에 넘긴 스펙·계획 문서. 범위 안팎과 성공 판정이 적힌 것.
- 링크: 작은 단위로 나뉜 PR 묶음. 하나가 스펙 한 항목에 대응하는 것.
- 한 줄 서술: 큰 일을 어떻게 잘랐고 그 결과 리뷰가 어떻게 달라졌는지.

## 4. 방향·설계를 정하고 답을 고른다

에이전트는 그럴듯한 답을 여럿 낸다. 고르는 기준, 설계 원칙, 도메인 이해는 사람 몫으로 남는다.

| 출처 | 종류 | 원문 |
|---|---|---|
| Shopify | 회사 | "There are an infinite number of bad solutions and probably 10,000 good ones. Your job is to find the best solution among the 10,000" |
| 토스 정세훈 | 회사 | 핵심 역량은 "취향과 판단 기준" / "AI 는 하나의 정답이 아니라 여러 개의 그럴듯한 답을 동시에 제시한다" |
| 토스페이먼츠 | 회사 | "도구는 바뀌었지만, 좋은 설계의 원칙(응집도, 결합도, 추상화)은 그대로입니다" |
| GitHub 연구 글 | 회사 | 사람이 "set direction, constraints, architecture, and standards" |
| 올리브영 | 회사 | "머릿속에 있는 그림이 명확했기 때문에 구현까지 가능했다" |
| 카카오 | 회사 | "기술 도메인 전문성과 AI 협업 마인드" |
| Palantir | 공고 | "connect that technical knowledge to a business problem" |
| 당근 | 공고 | "도구의 도움으로 한 사람이 더 큰 구조를 설계·실행할 수 있는 시대" |
| Karpathy | 개인 | "You are in charge of taste, engineering, design, and whether the system makes sense" |
| Osmani | 개인 | 마지막 30%는 "covering edge cases, refining the architecture, and ensuring maintainability" |
| Fowler | 개인 | "understanding the domain they are working with, collaborating with users and customers" |
| DHH | 발표 | "When something is beautiful, it's likely to be correct" |

이력서 근거:
- 글: 대안 둘 이상을 비교하고 하나를 고른 이유가 적힌 설계 문서·회고. 에이전트가 낸 후보를 왜 버렸는지가 있으면 더 좋다.
- 한 줄 서술: 문제 → 선택 → 결과에서 "선택" 칸이 비어 있지 않은 bullet.
- 링크: 추상화 경계를 정한 모듈 구조가 보이는 리포.

## 5. 에이전트가 쓸 환경을 만든다

프롬프트 한 번이 아니라 재사용되는 구조(스킬·컨텍스트 파일·린터·워크플로)를 만드는 것이 역량이 됐다. 개인 글은 이것을 하네스 엔지니어링이라 부른다.

| 출처 | 종류 | 원문 |
|---|---|---|
| Uber | 회사 | 엔지니어들이 스킬 3,600개를 만들어 하루 3만 번 실행 |
| Stripe | 회사 | 문서 트래픽의 40%가 에이전트 |
| LY(라인) | 회사 | "중요해질 역량은 단순한 프롬프트 작성이 아니라 컨텍스트 엔지니어링" |
| LinkedIn | 회사 | "context engineering a more critical investment than model selection" |
| 토스페이먼츠 | 회사 | "CLAUDE.md 를 자주 수정하고 있다면, 그 내용은 거기 있으면 안 되는 것일 가능성이 높습니다" / "Skill 이 20개면 20개의 Description 이 항상 Context 를 점유합니다" |
| 우아한형제들 | 회사 | "회사의 신규 입사자가 업무를 배우듯, AI 에게도 충분한 가이드와 컨텍스트를 제공해야 한다" |
| 당근 | 공고 | 우대: "Claude Code, Codex 같은 코딩 에이전트로 본인만의 AI 워크플로우를 만들어 일하시는 분" |
| Böckeler | 개인 | "designing environments, feedback loops, and control systems" |
| Fowler | 개인 | "Harness engineering, focusing on working on the guides and sensors around the LLM" |
| Hashimoto | 개인 | "Anytime you find an agent makes a mistake, you take the time to engineer a solution" |

그 밖에 컬리, GitHub(TypeScript 가드레일), 크래프톤, Ronacher, 박종훈, Booking, Coinbase Moghe.

이력서 근거:
- 산출물: 직접 만든 스킬·CLAUDE.md·훅·린터·워크플로 파일. 리포 경로로 가리킬 수 있는 것.
- 한 줄 서술: 에이전트가 반복하던 실수 → 어떤 장치를 넣었나 → 이후 얼마나 줄었나.
- 수치: 스킬 수, 컨텍스트 토큰 예산, 워크플로가 적용된 티켓 수. 있을 때만.

## 6. 자율성을 조절하고 병렬로 지휘한다

회사 자료는 병렬 운용의 규모를 말하고, 개인 글은 얼마나 맡길지의 판단을 말한다. 되돌릴 수 없는 행동은 아직 사람이 막는다.

| 출처 | 종류 | 원문 |
|---|---|---|
| Google | 회사 | "orchestrating fully autonomous digital task forces" |
| Airbnb | 회사 | "an engineer can now spin up agents to do a lot of work under supervision" |
| Uber Smith | 회사 | "Might as well kick off another background agent" |
| LinkedIn | 회사 | "give the agent freedom, but put guardrails in place to prevent escalation". 배포는 사람이 게이트 |
| Shopify | 회사 | "not yet at the place where we allow AI to check in code automatically" |
| Karpathy | 개인 | "thoughtfully, carefully slide that autonomy slider ... little by little" |
| Böckeler | 개인 | "If you were on call ... at which point would you be ok with deploying a 1,000 or 5,000 LOC change set?" |
| Willison | 개인 | "97% effectiveness is a failing grade" |
| Yegge | 발표 | 신뢰 8단계. "Level 8: you build your own orchestrator to coordinate more agents" |
| DHH | 발표 | "I don't just have two arms. I have 12" |

그 밖에 LY(멀티 에이전트), Stripe, Coinbase Moghe("five PRs open").

이력서 근거:
- 한 줄 서술: 어떤 일은 백그라운드로 맡기고 어떤 일은 붙어서 했는지, 그 기준.
- 링크: 병렬로 굴린 에이전트 결과를 합친 PR 묶음. 워크트리·브랜치 구조가 보이면 좋다.
- 글: 자율성을 올리다 실패한 경험과 되돌린 판단.

## 7. 출력을 판단할 깊이를 유지한다

깊은 이해는 코드를 쓰기 위해서가 아니라 출력을 평가하기 위해 필요하다. 경계는 디버깅·리팩토링에 그어지고, 위임하면 그 일의 숙련은 안 쌓이므로 손으로 하는 영역을 남긴다.

| 출처 | 종류 | 원문 |
|---|---|---|
| GitHub 연구 글 | 회사 | "deep technical understanding remains essential ... enables developers to evaluate complex output" |
| Microsoft Nadella | 회사 | 생성된 코드베이스가 "not black boxes" 여야 |
| 올리브영 | 회사 | "실제 서비스 내부에서 문제가 발생했을 때 디버깅하거나 리팩토링하는 것은 여전히 매우 어렵다" |
| Google 면접 파일럿 | 공고 | "reading, debugging, and optimizing real code" |
| Shopify | 공고 | 페어 코딩 면접. "The muscle memory of coding will come back in pairing interviews" |
| Willison | 개인 | "Hoard things you know how to do" |
| Hashimoto | 개인 | 손으로 한 커밋을 전부 에이전트로 재현해 보며 감을 익힘 |
| Osmani | 개인 | "Seniors use AI to accelerate what they already know how to do" |
| Shopify Thawar | 발표 | "They need to understand things two or three layers below the layer they're working at" |
| DHH | 발표 | "You should know the properties of gold. You should know how it bends" |

그 밖에 카카오("기술 도메인 전문성"), 무신사(코딩 테스트 유지), Beck, Böckeler, 카카오 세미나.

이력서 근거:
- 한 줄 서술: 에이전트가 못 푼 장애·버그를 직접 파고들어 고친 사례. 어느 층까지 내려갔는지.
- 링크: AI 없이 또는 AI 가 틀린 것을 잡아 고친 커밋.
- 글: 자기가 손으로 유지하는 영역이 무엇이고 왜 그런지.

## 8. 언제 안 쓸지 알고 책임진다

개인 글이 앞서는 항목이다. 안 쓸 때를 알고, 포기할 때를 알고, 결과의 책임은 사람이 진다. Shopify 메모의 "먼저 AI 로 시도하고 안 되는 이유를 설명하라"는 같은 역량의 반대 방향이다.

| 출처 | 종류 | 원문 |
|---|---|---|
| 우아한형제들 | 회사 | "'의무감'으로 인해 AI 가 필요 없는 부분도 억지로 AI 를 쓰는 ... 생산성 증대 효과는 미미했다" |
| Shopify 메모 | 회사 | "demonstrate why they cannot get what they want done using AI" |
| Hashimoto | 개인 | "Part of the efficiency gains here were understanding when not to reach for an agent" |
| Böckeler | 개인 | "I knew early when to give up" |
| Yegge | 개인 | "each and every one of us has to learn how to say 'no' real fast" |
| Karpathy | 개인 | "You are not allowed to introduce vulnerabilities because of vibe coding. You are still responsible" |
| Willison | 개인 | 남이 쓰는 소프트웨어를 바이브 코딩하는 것은 "grossly irresponsible" |
| 박종훈 | 개인 | "AI 는 책임을 지지 않는다. 오직 사람만이 책임을 지고 방향을 결정할 수 있다" |
| Shopify Thawar | 발표 | "You can use AI tools, but you still put your name on the PR" |

이력서 근거:
- 한 줄 서술: AI 를 쓰지 않기로 한 결정과 이유. 또는 에이전트 결과를 버리고 되돌린 사례.
- 글: 어디까지 맡기고 어디부터 직접 하는지 자기 기준.

## 9. 스스로 배우고 공유한다

회사는 이것을 제도로 만들었고, 확산은 동료를 보고 일어난다. 채용 기준은 보유 스킬에서 학습 능력으로 옮겨간다.

| 출처 | 종류 | 원문 |
|---|---|---|
| Shopify 메모 | 회사 | "Learning is self directed, but share what you learned" |
| Amazon Jassy | 회사 | "educate yourself, attend workshops and take trainings, use and experiment with AI whenever you can" |
| 토스 | 회사 | 주 1일 실험일. 클럽 200개, 에반젤리스트 142명 |
| 우아한형제들 | 회사 | "구성원 각자가 반복 업무를 개선하고, AI 동료를 이끄는 리더가 되는 문화" |
| Uber | 회사 | "The most successful tactic has been sharing wins" |
| Microsoft 사내 연구 | 회사 | "first use spread primarily through social networks" |
| Duolingo, Booking | 회사 | 라이선스보다 학습 프로그램이 도입을 만듦 |
| AWS Garman | 공고 | "not what skill set you have, but whether you have the ability to learn" |
| 당근 | 공고 | "AI 를 적극 활용하는 사례를 만들고 또 공유하며" |
| Willison | 개인 | "The only universal skill is being able to roll with the changes" |
| Coinbase Turakhia | 발표 | "identify and replicate the behaviors of AI power users" |

그 밖에 올리브영, Orosz, Yegge.

이력서 근거:
- 글: 블로그·발표·팀 위키. 배운 것을 남에게 옮긴 흔적.
- 링크: 남이 쓰는 스킬·플러그인·템플릿. 설치 수나 사용자가 있으면 수치로.
- 한 줄 서술: 팀이나 스터디에 도구를 들여온 사례와 그 뒤 변화.

## 10. 비용과 지표를 의식한다

회사만 말하는 항목이다. 비용을 상시 보고, 활동 지표(사용률·AI 코드 비율)와 성과를 구분한다. 얕게 쓰면 효과가 없다는 것도 회사 데이터다.

| 출처 | 종류 | 원문 |
|---|---|---|
| Uber | 회사 | "Running session cost is always visible in the terminal" / 세션당 비용 반년에 52% 감소 |
| Uber Chadha | 회사 | "These are activity metrics, not business outcomes" / "the cost of AI is too high" |
| 올리브영 | 회사 | "코드 생성 비율이나 커밋 수 같은 정량 지표만으로는 실제 변화의 양상을 설명하기 어렵다" |
| Airbnb | 회사 | 하루 4시간 이상 쓰는 사람에게서만 PR 산출 두 배 |
| Microsoft 사내 연구 | 회사 | "Retention was associated more with engineers' coding activity than with demographics" |
| 토스페이먼츠 | 회사 | "CLAUDE.md 약 500~2,000 토큰, Skill 하나 약 300~1,500 토큰" |
| Orosz 설문 | 개인 | "The cost trajectory of AI tools is generally considered unsustainable" |

이력서 근거:
- 수치: 세션·토큰 비용, 모델 등급 선택 기준, 리드타임 변화. 활동 지표는 단독으로 쓰지 않는다.
- 한 줄 서술: 비용 때문에 바꾼 선택.

## 신입에게 요구하는 것

신입은 필수 축이 아니라 덧붙임이다. 위 열 개는 그대로 요구되고, 여기에 시장 상황 때문에 더 세게 요구되는 것이 있다.

### 시장

신입 채용은 줄었고, 줄어든 방식은 해고가 아니라 안 뽑음이다.

| 사실 | 출처 |
|---|---|
| 22~25세 AI 노출 직종 고용이 기대치 대비 19% 아래. "reduced hiring of young workers rather than increased separations" | Stanford (2026-08) |
| 소프트웨어 개발 공고의 69.3%가 시니어 대상 | Indeed Hiring Lab (2026-07) |
| 대형 테크 신입 채용 2019년 대비 약 65% 감소 | SignalFire (2026-06) |
| 국내 기업 신입 선호 10.3%, 채용 시 AI 역량 고려 69.2% | 대한상공회의소 (2025-09) |
| 국내 신입 집중 채용 12.4%, 4~7년차 49.7% | 원티드랩 (2025-12) |

반대 사례는 개인 발언과 특정 회사에 몰려 있다.

| 누가 | 무엇 |
|---|---|
| AWS Garman | 주니어 대체는 "one of the dumbest things I've ever heard". 인턴·신입 11,000명 |
| Shopify | 인턴 1,000명. "they're the ones who are using AI in the most interesting ways" |
| 카카오 | 첫 그룹 신입 공채. "'주니어'와 '시니어'라는 연차 기반의 낡은 프레임은 중요하지 않다" |
| 무신사 | 신입 66명 선발 |
| Kent Beck | "The junior bet has gotten better" |

통계는 비관, 유력 개인과 일부 회사는 낙관이다. 확신.

토스 정세훈의 진단이 이 둘을 잇는다. "AI 는 주니어 업무를 자동화하고, 시니어 업무는 보조하는 형태로 발전하고 있습니다. 결과적으로 ... 견습 사다리를 제거하고 있습니다". 신입이 하던 일이 먼저 사라지므로, 신입은 견습 없이 시니어의 역량 축(검증·설계·판단)을 보여야 한다.

### 전형이 바뀌었다

| 회사 | 무엇이 바뀌었나 | 무엇을 보나 |
|---|---|---|
| Google | 주니어·미드 면접에 AI 허용 파일럿. 알고리즘 한 라운드를 기존 코드 읽고 고치기로 교체 | "AI fluency, including prompt engineering, output validation, and debugging skills" |
| 무신사 | 신입 전형에 AI 도구 활용 검증 2차 테스트를 따로 둠. 동일 에이전트 환경 제공 | "단순 코딩 실력을 넘어 AI 도구를 얼마나 능숙하게 활용해 실무 문제를 해결하는지" |
| 카카오 | 첫 그룹 공채 목적을 'AI 네이티브' 선발로 명시. 코딩 테스트는 유지 | "코딩 테스트 문제 풀이 능력만으로 인재를 판단하는 관행에서 벗어나야" |
| Shopify | 인턴십을 4개월 "two-way interview" 로. 페어 코딩 면접 | "The muscle memory of coding will come back in pairing interviews" |
| 크래프톤 | 코딩 에이전트 활용을 자격요건으로, 재학생 지원 허용 | "Claude Code, OpenAI Codex, Google Antigravity, Cursor 등 코딩 에이전트를 활용한 AI Native 개발 역량" |
| 국내 AI 허용 코딩테스트 (컬리·무신사 사례) | 구현 속도보다 검증과 설명 | "AI 가 이끄는 게 아니라 내가 이끄는가", "사고 과정을 면접관에게 설명하는가" |

토스·당근 신입 공고에는 AI 문구가 없다. 대신 토스는 "실제 본인이 참여한 프로젝트와 기여 정도, 어려운 과제를 극복한 과정" 과 운영·부하 테스트·개선 경험을 요구한다. AI 로 만든 것이라도 운영과 설명이 붙어야 한다는 뜻이다.

### 신입에게 더 세게 요구하는 것

| 요구 | 왜 신입에게 더 세게 | 출처 |
|---|---|---|
| 검증 없는 큰 PR 을 내지 않는다 | 신입의 대표적 실패 패턴으로 지목됨. "the junior engineer, empowered by some class of LLM tool, who deposits giant, untested PRs on their coworkers". Amazon 은 주니어의 에이전트 코드를 리뷰 없이 배포 못 하게 함 | Willison, DHH, Shopify Thawar |
| 왜 그렇게 했는지 설명한다 | AI 가 만든 것은 누구나 만든다. 가르는 것은 사고 과정·트레이드오프·대안. "설명할 수 없는 어려운 경험 나열" 이 함정 | Beck, 잡코리아, 토스 공고, 카카오 CTO |
| AI 를 학습 가속기로 쓴다 | 위임하면 숙련이 안 쌓인다는 우려가 신입에게 집중됨. 해법은 답을 해부하는 것. "How else could this have been done? Is there now a way to simplify the code? What are the tradeoffs?" | Beck, Osmani, Hashimoto, Böckeler |
| 기본기는 판단을 위해 필요하다 | 이유가 바뀌었다. 구현이 아니라 출력을 판단하기 위해. 교과서 지식만으로는 대체됨 | Osmani, Stanford, 코드트리, Shopify |
| 배포·운영해 본 것이 있다 | "Build something ... Now with AI, you have no excuse". 운영 중 장애·디버깅이 개발자를 가르는 선 | Shopify Thawar, SignalFire, 토스 공고, 올리브영 |
| 학습 능력과 적응력 | 채용 기준이 보유 스킬에서 학습 능력으로 이동. 2년 뒤 일은 "vastly different" | AWS Garman, 카카오 CTO, Willison |
| 허락 없이 증거를 쌓는다 | "demonstrating proof of work before anyone gives you permission". 신입을 "agent operators" 로 재정의 | SignalFire, Willison("invest in your own agency") |

조직적합성·소통은 국내 설문에서 여전히 1~2위(원티드랩 67%, 대한상의 55.4%)다. AI 역량은 필수이되 최우선은 아니다.

### 신입 이력서의 근거

| 근거 | 어떻게 |
|---|---|
| 링크 | 배포돼 돌아가는 것. 실제 사용자나 운영 기간이 있으면 적는다 |
| 링크 | 검증 방법이 적힌 PR. 코드보다 "어떻게 확인했나" 가 먼저 |
| 산출물 | 직접 만든 에이전트 워크플로·스킬·컨텍스트 파일. SignalFire 가 "custom agent workflows" 를 포트폴리오 항목으로 명시 |
| 글 | 대안과 트레이드오프를 적은 설계·회고. 면접에서 "왜" 를 받을 준비 |
| 한 줄 서술 | 에이전트가 틀린 것을 잡아 고친 사례. 장애를 직접 디버깅한 사례 |
| 피할 것 | 기여도 백분율, 설명 못 하는 경험 나열, "AI 활용" 만 적힌 줄 |

## 출처끼리 다른 곳

| 쟁점 | 한쪽 | 다른 쪽 |
|---|---|---|
| 신입 시장 | Stanford·Indeed·SignalFire·국내 설문: 축소 | AWS·Shopify·카카오·Beck: 지금이 베팅할 때 |
| 코딩 테스트 | 카카오 CTO: 그것만으로 판단하는 관행 탈피 | 코드트리: 가장 객관적 지표. 무신사·카카오는 유지 |
| 리뷰를 얼마나 줄이나 | Willison 2026: 더는 모든 줄을 안 읽는다고 고백 | Ronacher·Böckeler·Cognition: 리뷰를 안 떼면 안 된다 |
| 생산성 효과 | 카카오 98% 리드타임 단축 체감, Google 6배 | 우아한형제들: 외부 기대만큼 체감 못 함. Airbnb: 깊게 쓰는 사람만 두 배 |
| 평가 방법 | Google·무신사·컬리: 이미 AI 허용 전형 운영 | Shopify Thawar: "we don't know" |

## 다음

이 문서는 일반 리서치다. 다음 세션에서 할 일은 둘이다.

1. 내 리포에서 뽑은 재료(career-prep 의 extract-repo)를 위 근거 종류에 대조해, 항목마다 있는 근거·없는 근거를 표시한다.
2. APR 프로덕트 엔지니어 신입 공고의 줄과 이 문서의 항목을 대조한다.
