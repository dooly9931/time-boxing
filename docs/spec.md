# Time-Boxing Planner - 스펙 문서

## 1. 개요

엘론 머스크 스타일의 타임박싱 플래너. 하루를 설정 가능한 시간 단위로 나누고, 각 블록에 작업을 배치하여 시간을 관리한다.

### 1.1 핵심 원칙
- 모바일 우선 (390px 기준 최적화)
- 한국어 UI
- 최소한의 인터랙션으로 작업 추가/완료/삭제
- 미완료 작업을 쉽게 재확인

### 1.2 마일스톤

| 단계 | 범위 | 상태 |
|------|------|------|
| M1: MVP | 타임박싱 기본 기능 (localStorage) | ✅ 완료 |
| M2+M3: 백엔드+인증 | Prisma + SQLite + Google OAuth | ✅ 완료 |
| M4: Streak | 달성 보상 UI, streak 제도 | 예정 |
| M5: 소셜 | 컴포넌트 공개/비공개, 태그 시스템 | 예정 |

---

## 2. 데이터 모델

### 2.1 DB (Prisma + SQLite)

```prisma
model User        # NextAuth 표준 (id, name, email, image)
model Account     # OAuth 계정 연결 (provider, providerAccountId)
model Session     # 서버 세션 관리 (sessionToken, expires)
model UserSettings # 유저별 설정 (timeUnit, dayStart, dayEnd)
model Task        # 작업 항목 (date, blockTime, text, done)
                  # @@index([userId, date])
```

### 2.2 Settings (프론트)
```typescript
interface Settings {
  timeUnit: 5 | 10 | 15 | 30;  // 분 단위
  dayStart: string;              // "HH:MM" (예: "06:00")
  dayEnd: string;                // "HH:MM" (예: "23:00")
}
```
- API: `GET/PUT /api/settings`
- 기본값: `{ timeUnit: 30, dayStart: "06:00", dayEnd: "23:00" }`

### 2.3 Task (프론트)
```typescript
interface Task {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}
```

### 2.4 DayData (프론트 변환)
```typescript
interface DayData {
  date: string;
  blocks: Record<string, Task[]>; // 키: "HH:MM"
}
```
- API에서 flat Task[] 수신 → blockTime별로 그룹핑하여 DayData 구성
- 작업이 없는 블록은 blocks에 포함되지 않음

---

## 3. API Routes

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/settings` | 유저 설정 조회 |
| PUT | `/api/settings` | 유저 설정 저장 |
| GET | `/api/days/[date]` | 해당 날짜 작업 목록 |
| POST | `/api/tasks` | 작업 추가 (date, blockTime, text) |
| PATCH | `/api/tasks/[id]` | 작업 수정 (done toggle 등) |
| DELETE | `/api/tasks/[id]` | 작업 삭제 |
| GET | `/api/incomplete` | 오늘 이전 미완료 작업 목록 |

모든 API는 NextAuth 세션 인증 필수. 미인증 시 401.

---

## 4. 인증

- **NextAuth.js v5** (Auth.js) + `@auth/prisma-adapter`
- **Google OAuth** 활성화, Naver/Kakao 준비 중 (UI에 disabled 버튼)
- `middleware.ts`: `/login`, `/api/auth/*` 외 모든 경로에서 인증 필수
- 미인증 → `/login` 리다이렉트
- `/login` 페이지: Sofia 테마, Google/Naver/Kakao 3개 버튼

---

## 5. UI 구조

### 5.1 전체 레이아웃
- 최대 너비 `max-w-lg` (32rem), 중앙 정렬
- 하단 고정 네비게이션 바 (3개 탭)
- 콘텐츠 영역: 하단 네비 높이만큼 `pb-20` 패딩

### 5.2 하단 네비게이션 (BottomNav)
| 탭 | 경로 | 아이콘 |
|----|------|--------|
| 오늘 | `/` | SVG calendar |
| 미완료 | `/incomplete` | SVG clipboard |
| 설정 | `/settings` | SVG gear |

### 5.3 오늘 뷰 (`/`)
- **DayNavigator**: 날짜 표시 + 이전/다음 화살표 + "오늘로 이동" 링크
- **DayView**: 타임블록 그리드 (API에서 fetch)
- **TimeBlock**: 시간 라벨 + 작업 목록 + 인라인 입력
- **TaskItem**: 완료 토글 + 텍스트 + 삭제
- URL 파라미터 `?date=YYYY-MM-DD`로 특정 날짜 접근 가능

### 5.4 미완료 뷰 (`/incomplete`)
- API에서 오늘 이전의 `done: false` 작업 조회
- 날짜별 역순 그룹핑
- 날짜 클릭 시 해당 날짜 뷰로 이동

### 5.5 설정 뷰 (`/settings`)
- 시간 단위: 4개 버튼 (5/10/15/30분)
- 하루 시작/종료 시간: select 드롭다운
- 변경 즉시 API로 저장

### 5.6 로그인 뷰 (`/login`)
- Sofia 테마 (warm-white 배경)
- Google/Naver(준비중)/Kakao(준비중) 로그인 버튼
- 앱 타이틀 + 서브 카피

---

## 6. 핵심 로직

### 6.1 타임블록 생성 (`generateTimeBlocks`)
- dayStart부터 dayEnd 미만까지 timeUnit 간격으로 생성

### 6.2 현재 시간 블록 판별 (`getCurrentTimeBlock`)
- 현재 시각이 속하는 블록 반환, 해당 없으면 null

### 6.3 데이터 흐름
- hooks (`useSettings`, `useDayData`, `useIncomplete`) → fetch API → Prisma → SQLite
- 낙관적 업데이트: toggle/delete는 UI 먼저 반영 후 API 호출

---

## 7. 스타일 시스템 (Sofia 테마)

Pinterest "Sofia Social Media Kit" 디자인 기반. 올리브 그린 + 베이지/크림의 자연스러운 톤.

### 7.1 색상 (CSS 변수)
| 변수 | 값 | 용도 |
|------|----|------|
| `--color-olive` | `#5C6B4F` | 강조, 완료 체크, 활성 버튼 |
| `--color-olive-dark` | `#3D4A33` | 활성 탭 텍스트, 호버 |
| `--color-olive-light` | `#8A9A7B` | 호버 상태 |
| `--color-cream` | `#F5F0E8` | 카드/입력 배경 |
| `--color-beige` | `#E8DFD0` | 보더, 구분선 |
| `--color-sand` | `#D4C9B8` | 그라데이션 구분선 |
| `--color-warm-white` | `#FDFBF7` | 페이지 배경 |
| `--color-accent` | `#C4956A` | 미완료 표시 점 |
| `--color-danger` | `#C17B6E` | 삭제 버튼 |
| `--color-success` | `#7B9A6D` | (예비) |

### 7.2 디자인 패턴
- 그라데이션 구분선: `bg-gradient-to-r from-transparent via-sand to-transparent`
- 헤더 반투명: `bg-warm-white/95 backdrop-blur-sm`
- 현재 블록: `bg-cream/60 border-l-2 border-l-olive`
- 라운딩: `rounded-xl`
- SVG 아이콘 (이모지 대신)
