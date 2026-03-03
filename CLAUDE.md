# Time-Boxing Planner

## Project Overview
엘론 머스크 스타일 타임박싱 플래너 웹앱. Next.js App Router + TypeScript + Tailwind CSS. 모바일 우선 UI.

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 (via @tailwindcss/postcss)
- localStorage (MVP), 향후 Prisma + Supabase + next-auth 예정
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
components/             # React 컴포넌트
hooks/                  # 커스텀 React 훅
lib/                    # 유틸리티 & 타입
docs/                   # 스펙 문서
  spec.md               # 전체 스펙 (계층화)
__tests__/              # 테스트 파일
  lib/                  # lib/ 테스트
  hooks/                # hooks/ 테스트
  components/           # 컴포넌트 테스트
```

### Commands
- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm test` - 테스트 실행
- `npm run test:watch` - 테스트 watch 모드
