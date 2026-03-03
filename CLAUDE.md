# Time-Boxing Planner

## Project Overview
엘론 머스크 스타일 타임박싱 플래너 웹앱. Next.js App Router + TypeScript + Tailwind CSS. 모바일 우선 UI.

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 (via @tailwindcss/postcss)
- Prisma + SQLite (DB), NextAuth.js v5 (Google OAuth)
- Vitest + React Testing Library (단위/통합 테스트)

## Development Rules

### Spec & Test Co-location
- 모듈을 수정할 때 반드시 해당 스펙 문서(`docs/` 하위)와 테스트를 함께 수정할 것
- 새 모듈 추가 시 해당 스펙 섹션과 테스트 파일을 반드시 함께 생성
- 스펙은 현재 구현 상태를 반영 (과거 이력이 아닌 현재 기준)
- 테스트가 깨진 상태로 커밋하지 말 것

### File Structure
```
app/                    # Next.js 페이지 (App Router)
  api/                  # API Route Handlers
    auth/               # NextAuth 핸들러
    settings/           # 설정 CRUD
    days/[date]/        # 날짜별 작업 조회
    tasks/              # 작업 CRUD
    incomplete/         # 미완료 작업 조회
  login/                # 로그인 페이지
components/             # React 컴포넌트
hooks/                  # 커스텀 React 훅 (API fetch 기반)
lib/                    # 유틸리티 & 타입
  auth.ts               # NextAuth 설정
  prisma.ts             # Prisma client singleton
  apiAuth.ts            # API 인증 헬퍼
prisma/                 # Prisma 스키마 & 마이그레이션
docs/                   # 스펙 문서
  spec.md               # 전체 스펙 (계층화)
__tests__/              # 테스트 파일
```

### Commands
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm test` - 테스트 실행
- `npm run test:watch` - 테스트 watch 모드
- `npx prisma migrate dev` - DB 마이그레이션
- `npx prisma studio` - DB GUI

### Environment Variables (.env)
```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
ALLOWED_EMAILS="user1@gmail.com,user2@gmail.com"  # 선택. 미설정 시 모든 이메일 허용
```
