# Time-Boxing Planner

엘론 머스크 스타일의 타임박싱 플래너. Brain Dump → Top 3 선정 → Time Boxing 워크플로우로 하루를 설계합니다.

## 기능

- **Brain Dump** — 떠오르는 할 일을 빠르게 기록
- **Top 3** — 가장 중요한 3가지를 선정, 완료 시 별(★) 획득
- **Time Boxing** — 시간 블록에 작업 배정
- **Streak** — 매일 Top 3를 달성하면 연속 기록 표시
- **태그** — 작업에 태그를 부여하여 분류

## 기술 스택

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Prisma + SQLite
- NextAuth.js v5 (Google OAuth)

## 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

`.env.sample`을 복사하여 `.env`를 생성하고 값을 채웁니다.

```bash
cp .env.sample .env
```

- `AUTH_SECRET` — `openssl rand -base64 32`로 생성
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 OAuth 2.0 클라이언트 생성
- `ALLOWED_EMAILS` — (선택) 허용할 이메일 목록. 미설정 시 전체 허용

### 3. DB 초기화

```bash
npx prisma migrate dev
```

### 4. 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인합니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm test` | 테스트 실행 |
| `npx prisma studio` | DB 브라우저 |
