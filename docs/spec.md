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
| M2: 인증 | Google/Naver/Kakao 소셜 로그인 | 예정 |
| M3: 백엔드 | DB 연동 (Prisma + Supabase) | 예정 |
| M4: Streak | 달성 보상 UI, streak 제도 | 예정 |
| M5: 소셜 | 컴포넌트 공개/비공개, 태그 시스템 | 예정 |

---

## 2. 데이터 모델

### 2.1 Settings
```typescript
interface Settings {
  timeUnit: 5 | 10 | 15 | 30;  // 분 단위
  dayStart: string;              // "HH:MM" (예: "06:00")
  dayEnd: string;                // "HH:MM" (예: "23:00")
}
```
- localStorage 키: `tbp_settings`
- 기본값: `{ timeUnit: 30, dayStart: "06:00", dayEnd: "23:00" }`

### 2.2 Task
```typescript
interface Task {
  id: string;        // 8자리 랜덤 영숫자
  text: string;      // 작업 내용
  done: boolean;     // 완료 여부
  createdAt: string; // ISO 8601
}
```

### 2.3 DayData
```typescript
interface DayData {
  date: string;                    // "YYYY-MM-DD"
  blocks: Record<string, Task[]>; // 키: "HH:MM", 값: 해당 블록의 작업 배열
}
```
- localStorage 키: `tbp_day_{YYYY-MM-DD}`
- 블록 목록은 Settings에서 동적 생성 (저장하지 않음)
- 작업이 없는 블록은 blocks에 포함되지 않음

---

## 3. UI 구조

### 3.1 전체 레이아웃
- 최대 너비 `max-w-lg` (32rem), 중앙 정렬
- 하단 고정 네비게이션 바 (3개 탭)
- 콘텐츠 영역: 하단 네비 높이만큼 `pb-16` 패딩

### 3.2 하단 네비게이션 (BottomNav)
| 탭 | 경로 | 아이콘 |
|----|------|--------|
| 오늘 | `/` | 📅 |
| 미완료 | `/incomplete` | 📋 |
| 설정 | `/settings` | ⚙️ |

### 3.3 오늘 뷰 (`/`)
- **DayNavigator**: 날짜 표시 + 이전/다음 화살표 + "오늘로 이동" 링크
  - 날짜 형식: `YYYY년 M월 D일 (요일)`
  - sticky top, 반투명 배경
- **DayView**: 타임블록 그리드
  - 각 블록: 시간 라벨(왼쪽 64px) + 작업 영역
  - 정시(`:00`)는 `HH:MM` 표시, 그 외는 `:MM` 표시
  - 현재 시간 블록: 파란색 왼쪽 테두리 + 연한 파란 배경
  - 페이지 로드 시 현재 시간 블록으로 자동 스크롤
- **TimeBlock**: 시간 라벨 + 작업 목록 + "+ 추가" 버튼
- **TaskItem**: 완료 토글(원형 버튼) + 텍스트 + 삭제(텍스트 탭 후 노출)
  - 완료 시: 올리브 체크마크, 텍스트 취소선 + 회색
- **TaskInput**: "+ 추가" 클릭 시 인라인 텍스트 입력
  - Enter 또는 blur로 제출
- URL 파라미터 `?date=YYYY-MM-DD`로 특정 날짜 직접 접근 가능

### 3.4 미완료 뷰 (`/incomplete`)
- 오늘 이전 날짜의 `done: false` 작업을 역순으로 그룹핑
- 각 그룹: 날짜 헤더(클릭 시 해당 날짜로 이동) + 작업 목록
- 작업 항목: 엑센트 점 + 텍스트 + 블록 시간
- 미완료 없을 시 올리브 체크 아이콘 + "미완료 작업이 없습니다" 표시

### 3.5 설정 뷰 (`/settings`)
- **시간 단위**: 4개 버튼 (5/10/15/30분), 세그먼트 컨트롤 스타일
- **하루 시작/종료 시간**: select 드롭다운 (0~23시)
  - 표시 형식: "오전/오후 N시 (HH:00)"
- 변경 즉시 localStorage에 자동 저장

---

## 4. 핵심 로직

### 4.1 타임블록 생성 (`generateTimeBlocks`)
- 입력: dayStart, dayEnd, timeUnit
- 출력: `string[]` (예: `["06:00", "06:30", "07:00", ...]`)
- dayStart부터 dayEnd 미만까지 timeUnit 간격으로 생성

### 4.2 현재 시간 블록 판별 (`getCurrentTimeBlock`)
- 현재 시각이 `[blockStart, blockStart + timeUnit)` 범위에 속하는 블록 반환
- 해당 없으면 `null`

### 4.3 미완료 작업 수집 (`useIncomplete`)
- `tbp_day_*` 키를 모두 스캔
- 오늘 이전 날짜만 필터링
- `done: false`인 작업만 수집
- 날짜별 역순 그룹핑

### 4.4 데이터 저장 전략
- MVP: localStorage 직접 접근 (`lib/storage.ts`)
- 향후: `storage.ts` 내부를 API fetch로 교체 (인터페이스 유지)

---

## 5. 스타일 시스템 (Sofia 테마)

Pinterest "Sofia Social Media Kit" 디자인 기반. 올리브 그린 + 베이지/크림의 자연스러운 톤.

### 5.1 색상 (CSS 변수)
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

### 5.2 타이포그래피
- 본문: Pretendard (시스템 폰트 폴백), 13px
- 헤더: 15px + `font-semibold` + `tracking-tight`
- 보조 텍스트: 11px, `text-gray-300` ~ `text-gray-400`
- 보조 세리프: Georgia / Noto Serif KR (향후 장식용)

### 5.3 디자인 패턴
- 그라데이션 구분선: `bg-gradient-to-r from-transparent via-sand to-transparent`
- 헤더 반투명: `bg-warm-white/95 backdrop-blur-sm`
- 현재 블록: `bg-cream/60 border-l-2 border-l-olive`
- 라운딩: `rounded-xl` (카드, 버튼)
- SVG 아이콘 (이모지 대신) - 하단 네비, 미완료 빈 상태 등
