# CloudCost Insight FE

AWS EC2 사용량과 추정 비용을 보여 주는 CloudCost Insight의 프론트엔드.

## 시작하기

Node.js 24, pnpm 10이 필요하다.

```bash
git clone --recurse-submodules <이 레포 URL>
pnpm install
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 연다. 첫 화면은 `src/app/page.tsx`다.

## 스크립트

| 명령                                | 내용                 |
| ----------------------------------- | -------------------- |
| `pnpm dev`                          | 개발 서버            |
| `pnpm build`                        | 프로덕션 빌드        |
| `pnpm lint`                         | ESLint               |
| `pnpm typecheck`                    | 타입 검사            |
| `pnpm format` / `pnpm format:check` | Prettier 정렬 / 검사 |
| `pnpm test`                         | Vitest               |

## 문서

기술 스택·폴더 구조·디자인 토큰 규칙은 `.claude/docs/fe/TECH_STACK.md`, 기획·화면 문서는 `.claude/docs/README.md` (하네스 서브모듈 권한 필요).
