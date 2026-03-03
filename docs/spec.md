# Time-Boxing Planner - 스펙 문서

## 1. 개요

엘론 머스크 스타일의 타임박싱 플래너. Brain Dump → Top 3 → Time Boxing 워크플로우로 하루를 설계한다.

### 1.1 핵심 원칙
- 모바일 우선 (390px 기준 최적화)
- 한국어 UI
- Brain Dump → Top 3 선정 → 시간 배정의 3단계 워크플로우
- 미완료 작업을 쉽게 재확인
- Top 3 달성 = 별(★), 연속 달성 = streak

### 1.2 마일스톤

| 단계 | 범위 | 상태 |
|------|------|------|
| M1: MVP | 타임박싱 기본 기능 (localStorage) | ✅ 완료 |
| M2+M3: 백엔드+인증 | Prisma + SQLite + Google OAuth | ✅ 완료 |
| M4: Brain Dump + Top 3 + Streak | 3단계 워크플로우 + 별 보상 + streak | ✅ 완료 |
| M5: 태그 | 작업 태그 시스템 + 설정에서 관리 | ✅ 완료 |

---

## 2. 데이터 모델

### 2.1 DB (Prisma + SQLite)

```prisma
model User        # NextAuth 표준 + tags 관계
model Account     # OAuth 계정 연결
model Session     # 서버 세션 관리
model UserSettings # 유저별 설정 (timeUnit, dayStart, dayEnd)
model Task        # 작업 항목
                  # category: "braindump" | "top3" | "timeboxed"
                  # blockTime: nullable (braindump/top3는 null)
                  # priority: 1|2|3 (top3만)
                  # @@index([userId, date])
model Tag         # 태그 (name, color) @@unique([userId, name])
model TaskTag     # 태그-작업 연결 (many-to-many)
```

### 2.2 ApiTask (프론트 공유 타입)
```typescript
interface ApiTask {
  id: string;
  date: string;
  blockTime: string | null;
  text: string;
  done: boolean;
  category: "braindump" | "top3" | "timeboxed";
  priority: number | null;
  createdAt: string;
  tags?: { tagId: string; tag: Tag }[];
}
```

### 2.3 DayData (프론트 변환)
- API에서 flat ApiTask[] 수신
- `category === "timeboxed"` → blockTime별 그룹핑 → DayData.blocks
- `category === "braindump"` → brainDumpTasks 배열
- `category === "top3"` → top3Tasks 배열 (priority 정렬)

---

## 3. API Routes

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/settings` | 유저 설정 조회 |
| PUT | `/api/settings` | 유저 설정 저장 (입력 검증) |
| GET | `/api/days/[date]` | 해당 날짜 전체 작업 (tags include) |
| POST | `/api/tasks` | 작업 추가 (category별 조건부 검증) |
| PATCH | `/api/tasks/[id]` | 작업 수정 (done, text, category, priority) |
| DELETE | `/api/tasks/[id]` | 작업 삭제 |
| GET | `/api/incomplete` | 오늘 이전 미완료 작업 |
| GET | `/api/streak` | currentStreak, longestStreak, todayStars |
| GET/POST | `/api/tags` | 태그 목록/생성 |
| DELETE | `/api/tags/[id]` | 태그 삭제 |
| POST/DELETE | `/api/tasks/[id]/tags` | 태그 할당/해제 |

모든 API는 NextAuth 세션 인증 필수. 미인증 시 401.
`ALLOWED_EMAILS` 환경변수로 이메일 화이트리스트 (미설정 시 전체 허용).

---

## 4. 인증

- **NextAuth.js v5** + `@auth/prisma-adapter` + Google OAuth
- `signIn` callback: ALLOWED_EMAILS 화이트리스트
- `redirect` callback: 같은 origin만 허용
- `middleware.ts`: `/login`, `/api/auth/*` 외 인증 필수

---

## 5. UI 구조

### 5.1 홈 페이지 (`/`) — 위에서 아래로

```
DayNavigator (sticky)
  날짜 + streak 표시 (연속 N일 ★★☆)
─────────────────────
Brain Dump 섹션
  작업 목록 (추가/완료/삭제)
  각 항목에 ★ 승격 버튼 → Top 3으로 이동
─────────────────────
오늘의 Top 3 섹션
  3개 고정 슬롯 (별 아이콘)
  완료 시 별 채움 (accent 색상)
  빈 슬롯: 인라인 입력
  ↓ 버튼으로 Brain Dump 강등
─────────────────────
타임블록 그리드
  기존 TimeBlock 컴포넌트
```

### 5.2 미완료 뷰 (`/incomplete`)
- 모든 카테고리(braindump/top3/timeboxed) 미완료 작업 표시
- blockTime null인 항목: "Top 3" 또는 "메모"로 라벨 표시

### 5.3 설정 뷰 (`/settings`)
- 시간 단위, 하루 시작/종료 시간
- **태그 관리**: 태그 목록 + 색상 선택(6색) + 추가/삭제

### 5.4 로그인 뷰 (`/login`)
- Google/Naver(준비중)/Kakao(준비중)

---

## 6. 핵심 로직

### 6.1 Streak 계산 (`GET /api/streak`)
- Top 3 작업 중 `done: true` 개수 = 별 (하루 최대 3개)
- 연속 streak: 오늘부터 역순으로 별 >= 1인 연속 일수
- 최장 streak: 전체 이력에서 가장 긴 연속

### 6.2 Top 3 제한
- `POST /api/tasks`에서 top3 category로 생성 시 기존 3개 체크
- 승격(PATCH category→top3)도 프론트에서 top3Tasks.length < 3 체크

### 6.3 데이터 흐름
- `useDayData`: 단일 API fetch → category별 분류 (memo) → 3개 파생 상태
- `useStreak`: streak API fetch → DayNavigator에서 표시
- `useTags`: 태그 CRUD → SettingsView에서 관리
- 낙관적 업데이트: toggle/delete/promote/demote 모두 UI 먼저

---

## 7. 스타일 시스템 (Sofia 테마)

### 7.1 색상
| 변수 | 값 | 용도 |
|------|----|------|
| `olive` | `#5C6B4F` | 강조, 완료 체크, 활성 버튼 |
| `olive-dark` | `#3D4A33` | 활성 탭, 호버 |
| `cream` | `#F5F0E8` | 카드/입력 배경 |
| `beige` | `#E8DFD0` | 보더, 빈 별 |
| `accent` | `#C4956A` | **채워진 별**, 미완료 점 |
| `danger` | `#C17B6E` | 삭제 |
| `warm-white` | `#FDFBF7` | 페이지 배경 |

### 7.2 디자인 패턴
- 섹션 구분: 그라데이션 구분선 `from-transparent via-sand to-transparent`
- Brain Dump / Top 3: `bg-cream/40 rounded-xl p-3`
- 별 아이콘: 채움=accent, 빈=beige
- 호버 액션 버튼: `opacity-0 group-hover:opacity-100`
