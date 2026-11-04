# TECH STACK

CloudCost Insight FE의 기술 스택과 선택 이유. 스택을 바꾸거나 새 라이브러리를 들일 때 이 문서를 먼저 고친다.

> 버전은 2026-11-05 기준 npm 최신. 실제 고정 버전은 `package.json`과 lockfile이 기준이다.

## 확정

| 영역 | 선택 | 버전 | 비고 |
|---|---|---|---|
| 프레임워크 | Next.js (App Router) | 16.x | Turbopack 기본 |
| UI 라이브러리 | React | 19.x | |
| 컴파일러 | React Compiler | `babel-plugin-react-compiler` 1.x | 자동 메모이제이션 |
| 스타일링 | Tailwind CSS | 4.x | CSS 우선 설정 (`@theme`) |
| 서버 상태 | TanStack Query | 5.x | BE API 조회·캐시 |
| 차트 | Recharts | 3.x | shadcn Chart 컴포넌트로 사용 |
| 린트·포맷 | ESLint + Prettier | | `eslint-plugin-react-hooks` 7.x 필수 |
| 언어 | TypeScript | | create-next-app 기본값 사용 (아래 참고) |
| 런타임 | Node.js | 20.9 이상 (권장 24 LTS) | Next 16 요구사항 |

### Next.js (App Router)

- 파일 기반 라우팅과 레이아웃으로 대시보드 화면(계정 목록 → 인스턴스 → 기간별 비용)을 나누기 쉽다.
- 데이터는 모두 BE(CLOUD-COST-BE)가 계산해서 준다. Next는 **화면 렌더링만** 맡고, Route Handler나 Server Action으로 비즈니스 로직을 만들지 않는다.
- API 호출은 브라우저에서 BE로 직접 보낸다 (`Authorization: Bearer <JWT>`). BFF가 필요해지면 그때 이 문서에 결정을 추가한다.

### React Compiler

- 컴파일러가 컴포넌트·훅을 자동 메모이제이션하므로 `useMemo` · `useCallback` · `React.memo`를 기본으로 쓰지 않는다. 측정으로 문제가 확인될 때만 예외로 쓴다.
- 컴파일러는 [Rules of React](https://react.dev/reference/rules)를 지키는 코드만 최적화한다. 렌더 중 ref 읽기, props·state 직접 변경 같은 코드는 건너뛴다.
- `eslint-plugin-react-hooks` 7.x의 recommended 설정에 컴파일러 규칙이 들어 있다. 경고를 끄지 말고 고친다.

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

```bash
npm install -D babel-plugin-react-compiler
```

### Tailwind CSS v4

- `tailwind.config.js` 대신 CSS 파일에서 `@theme`으로 토큰을 정의한다.
- 색·간격 등 디자인 토큰은 브랜드 확정안(민트→인디고)을 `@theme` 변수로 한 곳에 둔다. 컴포넌트에 hex 값을 직접 쓰지 않는다.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* 브랜드 토큰은 디자인 확정 후 채운다 */
}
```

```js
// postcss.config.mjs
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

### TanStack Query v5

- BE 응답(서버 상태)은 모두 TanStack Query로 다룬다. 서버 데이터를 `useState`나 전역 스토어에 복사하지 않는다.
- `QueryClientProvider`는 `"use client"` 컴포넌트(`app/providers.tsx`)에서 만들고 루트 레이아웃에서 감싼다. `QueryClient`는 컴포넌트 안에서 `useState`로 한 번만 만든다.
- `staleTime`은 0보다 크게 둔다. BE가 사용량을 계정당 1시간에 한 번만 AWS에서 다시 읽으므로 (BE `docs/ARCHITECTURE.md` 조회 시점 수집), 짧은 간격의 재요청은 같은 값을 받는다.
- query key는 기능별 팩토리 객체로 모아 둔다 (예: `ec2Keys.daily(accountId, range)`). 문자열을 화면마다 직접 쓰지 않는다.
- 응답의 `freshness.warnings`는 오류가 아니라 정상 응답의 일부다. 이전 데이터와 함께 경고로 보여 준다.
- 개발 중에는 `@tanstack/react-query-devtools`를 쓴다 (프로덕션 번들 제외).

```tsx
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000 } },
      }),
  );
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### Recharts

- 차트는 shadcn의 Chart 컴포넌트(`ChartContainer`, `ChartTooltip` 등, 내부는 Recharts)를 통해 쓴다. 색은 `ChartConfig`에서 Tailwind 테마 변수로 지정하고 hex를 직접 쓰지 않는다.
- 데이터 양이 적어(일별 최대 90일, 월별) SVG 기반 Recharts로 충분하다. 수천 개 이상의 점을 그려야 하는 화면이 생기면 다시 검토한다.
- 차트에 넘기는 값은 BE 응답 그대로 쓴다. 합계·환산을 프론트에서 계산하지 않는다. 툴팁·축의 금액에도 "추정"과 원화 표시를 지킨다.
- 검토한 대안: visx(자유도는 높지만 축·툴팁을 직접 조립해야 해서 MVP 일정에 부담), ECharts(대용량 데이터용, 번들이 크고 shadcn 스타일과 따로 맞춰야 함).

### ESLint + Prettier

- ESLint는 코드 규칙 검사, Prettier는 코드 정렬을 맡는다. 두 규칙이 겹치지 않게 `eslint-config-prettier`로 ESLint의 정렬 규칙을 끈다.
- Biome(린트와 정렬을 합친 Rust 기반 도구)은 빠르지만 ESLint 플러그인을 쓸 수 없다. 그래서 React Compiler 검사 규칙(`eslint-plugin-react-hooks` 7.x)을 쓰기 위해 ESLint를 택했다.

### TypeScript

- npm `latest`는 TypeScript 7(네이티브 컴파일러)이다. Next 16과의 호환은 아직 확인하지 않았으므로, 프로젝트 생성 시 create-next-app이 설치하는 버전을 그대로 쓰고 올릴 때 별도로 검증한다.
- `strict: true`. BE 응답 타입은 BE `docs/API.md`의 필드명을 그대로 따른다.

## 미정

정해지면 위 "확정" 표로 옮긴다.

| 영역       | 후보                                    | 메모                                                       |
| -------- | ------------------------------------- | -------------------------------------------------------- |
| 패키지 매니저  | pnpm                                  |                                                          |
| 폼        | React Hook Form + Zod                 | 계정 연결 화면 정도라 필요성부터 판단                                    |
| 클라이언트 상태 | 없음(URL·로컬 state) / Zustand            | 서버 상태는 TanStack Query가 맡으므로 우선 없이 시작, 필요한 경우에 Zustand 도입 |
| UI 컴포넌트  | shadcn                                | cn으로 컴포넌트 작성                                             |
| 테스트      | Vitest + Testing Library, Playwright  |                                                          |
| 배포       | Vercel / AWS (S3+CloudFront, Amplify) |                                                          |

## 프로젝트 생성 (참고)

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --react-compiler
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```
