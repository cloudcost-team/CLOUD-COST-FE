# App Router 구조

CloudCost Insight 프론트엔드의 목표 라우팅 구조다. 화면은 기능 단위가 아니라 **사용자에게 보이는 화면 단위**로 나누고, Route Group은 URL에 포함하지 않는다.

```text
src/app/
├── layout.tsx
├── providers.tsx
├── page.tsx                       # 세션 상태에 따라 /login 또는 /dashboard
├── loading.tsx
├── error.tsx
├── not-found.tsx
│
├── (public)/
│   └── login/
│       └── page.tsx
│
├── demo/
│   ├── layout.tsx                 # DemoHeader, 체험 모드 배지
│   ├── login/
│   │   └── page.tsx
│   ├── setup/
│   │   └── page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── loading.tsx
│       └── error.tsx
│
├── (authenticated)/
│   ├── layout.tsx                 # 인증 검사
│   ├── onboarding/
│   │   └── page.tsx               # AppShell 없이 연결 플로우만 표시
│   │
│   └── (app-shell)/
│       ├── layout.tsx             # AppHeader + Sidebar + main
│       ├── dashboard/
│       │   ├── page.tsx
│       │   ├── loading.tsx
│       │   └── error.tsx
│       ├── savings/
│       │   ├── waste/
│       │   │   └── page.tsx
│       │   └── simulator/
│       │       └── page.tsx
│       ├── benchmark/
│       │   └── page.tsx
│       ├── reports/
│       │   ├── page.tsx
│       │   └── [month]/
│       │       └── page.tsx
│       └── settings/
│           ├── connections/
│           │   ├── page.tsx
│           │   ├── new/
│           │   │   └── page.tsx
│           │   └── [accountId]/
│           │       └── page.tsx
│           └── alerts/
│               └── page.tsx
│
└── api/                            # BFF를 도입할 때만 Route Handler 배치
    ├── auth/
    │   ├── google/route.ts
    │   └── logout/route.ts
    └── backend/
        └── [...path]/route.ts
```

## 구현 원칙

- `(public)`과 `(authenticated)`는 URL에 노출되지 않는 Route Group이다.
- 체험 모드(`/demo/*`)는 실제 AWS 연결 화면과 상태·API 경로를 공유하지 않는다.
- 인증된 일반 화면만 `(app-shell)`의 `AppHeader`, `Sidebar`, `main` 레이아웃을 사용한다.
- 온보딩은 인증이 필요하지만 `AppShell`을 사용하지 않는다.
- 현재 기술 결정은 브라우저에서 백엔드 API를 직접 호출하는 방식이다. `app/api`는 BFF(Backend For Frontend) 도입이 결정된 뒤에 추가한다.
- 각 화면의 로딩·오류 상태는 해당 라우트 가까이에 `loading.tsx`, `error.tsx`로 둔다.

## 화면 구현 순서

1. AUTH: `/login`, `/demo/login`
2. 체험 설정: `/demo/setup`
3. 체험 대시보드: `/demo/dashboard`
4. 실제 AWS 연결: `/onboarding`, `/settings/connections/*`
5. 일반 대시보드와 나머지 AppShell 화면
