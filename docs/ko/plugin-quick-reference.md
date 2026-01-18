<p align="center">
  <a href="../plugin-quick-reference.md">English</a> |
  <a href="plugin-quick-reference.md">한국어</a> |
  <a href="../zh-CN/plugin-quick-reference.md">中文</a> |
  <a href="../ja/plugin-quick-reference.md">日本語</a> |
  <a href="../es/plugin-quick-reference.md">Español</a> |
  <a href="../pt-BR/plugin-quick-reference.md">Português</a>
</p>

# CodingBuddy 빠른 참조 카드

명령어, 모드, 일반적인 워크플로우를 빠르게 확인할 수 있는 참조 가이드입니다.

## 워크플로우 모드

| 모드 | 트리거 | 목적 |
|------|--------|------|
| **PLAN** | `PLAN <작업>` | TDD 방식으로 구현 방향 설계 |
| **ACT** | `ACT` | 계획 실행, 코드 변경 |
| **EVAL** | `EVAL` | 품질 평가, 개선점 제안 |
| **AUTO** | `AUTO <작업>` | 품질 목표 달성까지 자율 순환 |

### 모드 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      기본 흐름                               │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(사용자: ACT)──> ACT ──(자동)──> PLAN               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    평가 흐름                                 │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(사용자: EVAL)──> EVAL ──> PLAN    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    자율 흐름                                 │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(반복)──> 완료          │
│           └── Critical=0 AND High=0 될 때까지 ──┘           │
└─────────────────────────────────────────────────────────────┘
```

## 명령어

| 명령어 | 설명 |
|--------|------|
| `/plan` | PLAN 모드 진입 |
| `/act` | ACT 모드 진입 |
| `/eval` | EVAL 모드 진입 |
| `/auto` | AUTO 모드 진입 |
| `/checklist` | 상황별 체크리스트 생성 |

### 다국어 키워드

| 영어 | 한국어 | 일본어 | 중국어 | 스페인어 |
|------|--------|--------|--------|----------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMATICO |

## 전문가 에이전트

### 기획 전문가
| 에이전트 | 전문 분야 |
|----------|-----------|
| 🏛️ architecture-specialist | 시스템 설계, 레이어 배치 |
| 🧪 test-strategy-specialist | TDD 접근법, 커버리지 목표 |
| 📨 event-architecture-specialist | 메시지 큐, 사가, 실시간 처리 |
| 🔗 integration-specialist | API 통합, 외부 서비스 |
| 📊 observability-specialist | 로깅, 모니터링, 추적 |
| 🔄 migration-specialist | 데이터 마이그레이션, 버전 관리 |

### 구현 전문가
| 에이전트 | 전문 분야 |
|----------|-----------|
| 📏 code-quality-specialist | SOLID, DRY, 복잡도 |
| ⚡ performance-specialist | 번들 크기, 최적화 |
| 🔒 security-specialist | 인증, 입력 검증, XSS |
| ♿ accessibility-specialist | WCAG 2.1, ARIA, 키보드 |
| 🔍 seo-specialist | 메타데이터, 구조화된 데이터 |
| 🎨 ui-ux-designer | 시각적 계층, UX 패턴 |

### 개발자 에이전트
| 에이전트 | 전문 분야 |
|----------|-----------|
| 🖥️ frontend-developer | UI 컴포넌트, 상태 관리 |
| ⚙️ backend-developer | API, 데이터베이스, 인증 |
| 🔧 devops-engineer | CI/CD, 인프라 |
| 📱 mobile-developer | 모바일 앱 개발 |

## 일반적인 워크플로우

### 1. 새 기능 구현

```
사용자: PLAN JWT를 사용한 사용자 인증 구현

Claude: [TDD 접근법으로 구조화된 계획 생성]

사용자: ACT

Claude: [Red-Green-Refactor 따라 구현]

사용자: EVAL  (선택사항)

Claude: [코드 품질, 보안 검토, 개선점 제안]
```

### 2. 버그 수정

```
사용자: PLAN auth 모듈의 로그인 타임아웃 문제 수정

Claude: [문제 분석, 디버깅 계획 수립]

사용자: ACT

Claude: [테스트와 함께 수정 구현]
```

### 3. 자율 개발

```
사용자: AUTO 사용자 관리를 위한 완전한 REST API 구현

Claude: [Critical=0, High=0 될 때까지 PLAN→ACT→EVAL 순환]
```

### 4. 체크리스트 생성

```
사용자: /checklist security performance

Claude: [보안 및 성능 체크리스트 생성]
```

## 품질 기준

### 커버리지 목표
- **핵심 로직**: 90% 이상 테스트 커버리지
- **UI 컴포넌트**: 주요 인터랙션 테스트

### TDD 사이클
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── 구조 개선
 │         └── 통과하는 최소한의 코드
 └── 실패하는 테스트 작성
```

### 코드 품질
- `any` 타입 금지 (TypeScript strict 모드)
- 순수/비순수 함수 분리
- SOLID 원칙
- DRY (Don't Repeat Yourself)

## 컨텍스트 관리

### 세션 유지
컨텍스트는 `docs/codingbuddy/context.md`에 저장됩니다:
- 대화 컴팩션에서도 유지됨
- 모드 간 결정사항 추적
- 추천 에이전트 보존

### 컨텍스트 명령어
| 동작 | 방법 |
|------|------|
| 컨텍스트 보기 | `docs/codingbuddy/context.md` 읽기 |
| 컨텍스트 초기화 | 새 PLAN 모드 시작 |
| 컨텍스트 업데이트 | 모드 완료 시 자동 |

## MCP 도구

| 도구 | 목적 |
|------|------|
| `parse_mode` | 프롬프트에서 워크플로우 모드 파싱 |
| `get_agent_details` | 전문가 에이전트 정보 조회 |
| `generate_checklist` | 도메인별 체크리스트 생성 |
| `read_context` | 현재 컨텍스트 문서 읽기 |
| `update_context` | 진행 상황으로 컨텍스트 업데이트 |
| `get_project_config` | 프로젝트 설정 조회 |

## 빠른 팁

1. **PLAN으로 시작** - 항상 구현 전에 계획 수립
2. **복잡한 기능에 AUTO 사용** - 품질 목표 달성까지 자동 순환
3. **ACT 후 EVAL 요청** - 머지 전 품질 평가 받기
4. **컨텍스트 확인** - `context.md`에서 이전 결정사항 확인
5. **전문가 활용** - 각 도메인에 특화된 이슈를 찾아냄

## 관련 문서

- [설치 가이드](./plugin-guide.md) - 설정 및 구성
- [아키텍처](./plugin-architecture.md) - 작동 원리
- [예시](./plugin-examples.md) - 실제 워크플로우
- [문제 해결](./plugin-troubleshooting.md) - 일반적인 문제
- [FAQ](./plugin-faq.md) - 자주 묻는 질문

---

<sub>🤖 이 문서는 AI의 도움을 받아 번역되었습니다. 오류나 개선 사항이 있으면 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues)에 알려주세요.</sub>
