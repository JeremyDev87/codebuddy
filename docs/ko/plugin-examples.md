<p align="center">
  <a href="../plugin-examples.md">English</a> |
  <a href="plugin-examples.md">한국어</a> |
  <a href="../zh-CN/plugin-examples.md">中文</a> |
  <a href="../ja/plugin-examples.md">日本語</a> |
  <a href="../es/plugin-examples.md">Español</a> |
  <a href="../pt-BR/plugin-examples.md">Português</a>
</p>

# CodingBuddy 사용 예시

PLAN/ACT/EVAL 워크플로우를 효과적으로 사용하는 실제 예시입니다.

## 예시 1: REST API 엔드포인트 구현

### 시나리오
유효성 검사가 포함된 사용자 등록용 새 엔드포인트를 추가합니다.

### PLAN 단계

```
사용자: PLAN 이메일 유효성 검사가 포함된 POST /api/users 사용자 등록 엔드포인트 구현
```

**Claude 응답:**
```markdown
# Mode: PLAN
## Agent: backend-developer [주 에이전트]

## 📋 계획 개요
이메일 유효성 검사, 비밀번호 해싱, 적절한 오류 처리가 포함된
사용자 등록 엔드포인트를 구현합니다.

## ✅ 할 일 목록
- [ ] User 타입 및 유효성 검사 스키마 정의
- [ ] 등록 엔드포인트에 대한 실패 테스트 작성
- [ ] 등록 핸들러 구현
- [ ] 이메일 유효성 검사 유틸리티 추가
- [ ] 비밀번호 해싱 추가
- [ ] 통합 테스트 작성

## 🎯 구현 단계

### 핵심 로직 (TDD 접근법)
1. 테스트 작성: POST /api/users가 유효한 데이터로 201 반환
2. 테스트 작성: 잘못된 이메일에 400 반환
3. 테스트 작성: 약한 비밀번호에 400 반환
4. 유효성 검사 유틸리티 구현
5. 등록 핸들러 구현

### 🔒 보안 계획
- bcrypt로 비밀번호 해싱 (cost factor 12)
- XSS 방지를 위한 입력 살균
- 속도 제한 권장

## 📁 파일 구조
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**다음:** `ACT`를 입력하여 실행
```

### ACT 단계

```
사용자: ACT
```

**Claude 응답:**
```markdown
# Mode: ACT
## Agent: backend-developer [주 에이전트]

## 🚀 구현 진행 상황

### 1단계: 타입 정의
✅ 사용자 타입 생성 완료
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### 2단계: 실패 테스트 작성 (Red)
✅ 테스트 파일 생성 완료
- `src/entities/user/__tests__/user.api.test.ts`
- 테스트: "유효한 등록 시 201 반환" - 실패 ❌

### 3단계: 유효성 검사 구현 (Green)
✅ 유효성 검사 유틸리티 생성 완료
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### 4단계: 핸들러 구현 (Green)
✅ 등록 엔드포인트 생성 완료
- `src/entities/user/user.api.ts`: registerUser 핸들러
- 테스트 통과 ✅

### 5단계: 리팩토링
✅ 오류 응답 헬퍼 추출
✅ JSDoc 주석 추가

## ✅ 품질 검사
- ✅ 타입 안전성: 모든 타입 명시적
- ✅ 테스트: 4/4 통과 (커버리지: 94%)
- ✅ 보안: bcrypt로 비밀번호 해싱

**다음:** 품질 평가를 위해 `EVAL` 입력 또는 `PLAN`으로 계속
```

### EVAL 단계 (선택사항)

```
사용자: EVAL
```

**Claude 응답:**
```markdown
# Mode: EVAL
## Agent: code-reviewer [주 에이전트]

## 📊 코드 품질 평가

### 보안 분석 🔒
| 검사 | 상태 | 비고 |
|------|------|------|
| 비밀번호 해싱 | ✅ 통과 | bcrypt cost 12 |
| 입력 유효성 검사 | ✅ 통과 | 이메일 정규식, 비밀번호 규칙 |
| SQL 인젝션 | ✅ 통과 | 매개변수화된 쿼리 사용 |
| 속도 제한 | ⚠️ 중간 | 미구현 |

### 코드 품질 📏
| 지표 | 값 | 목표 |
|------|-----|------|
| 테스트 커버리지 | 94% | 90%+ ✅ |
| 복잡도 | 낮음 | 적절함 ✅ |
| 타입 안전성 | 100% | 100% ✅ |

### 권장 사항
1. **중간**: 브루트 포스 방지를 위한 속도 제한 추가
2. **낮음**: 이메일 인증 흐름 추가 고려

## 🔄 개선된 계획
발견 사항을 해결하려면:
- 속도 제한 미들웨어 추가
- 이메일 인증 토큰 구현
```

---

## 예시 2: 실패하는 테스트 디버깅

### 시나리오
테스트가 간헐적으로 실패하여 디버깅이 필요합니다.

### PLAN 단계

```
사용자: PLAN UserProfile.test.tsx에서 무작위로 실패하는 불안정한 테스트 디버깅
```

**Claude 응답:**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [주 에이전트]

## 📋 계획 개요
UserProfile 컴포넌트의 불안정한 테스트를 조사하고 수정합니다.

## 🔍 디버깅 전략
1. 테스트 파일과 실패하는 어설션 식별
2. 비동기 타이밍 문제 확인
3. 테스트 간 공유 상태 확인
4. 목 정리 확인
5. 적절한 waitFor 어설션 추가

## 🎯 조사 단계
1. 테스트 파일 읽고 실패 패턴 식별
2. 누락된 await 또는 act() 래퍼 확인
3. beforeEach/afterEach 정리 확인
4. 비동기 작업에 명시적 waitFor 추가

**다음:** `ACT`를 입력하여 디버깅 시작
```

### ACT 단계

```
사용자: ACT
```

**Claude 응답:**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [주 에이전트]

## 🚀 디버깅 진행 상황

### 1단계: 테스트 분석
✅ `UserProfile.test.tsx:45`에서 문제 발견
- 비동기 렌더에 `await` 누락
- 어설션 후 상태 업데이트 발생

### 2단계: 수정 적용
✅ 테스트 수정
```tsx
// 이전 (불안정)
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// 이후 (안정)
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### 3단계: 수정 검증
✅ 테스트 50회 실행 - 0회 실패

## ✅ 근본 원인
비동기 데이터 패치가 어설션 후에 완료되었습니다. 적절한 `waitFor`로 수정했습니다.
```

---

## 예시 3: 자율 기능 개발

### 시나리오
자율 품질 관리로 완전한 기능을 구현합니다.

### AUTO 모드

```
사용자: AUTO localStorage 저장이 되는 다크 모드 토글 구현
```

**Claude 응답:**
```markdown
# Mode: AUTO (반복 1/5)
## Agent: frontend-developer [주 에이전트]

## 📋 PLAN 단계
- ThemeContext 프로바이더 생성
- 토글 컴포넌트 구현
- localStorage 저장 추가
- 다크 모드 변형 스타일링

## 🚀 ACT 단계
✅ 다크/라이트 모드의 ThemeContext 생성
✅ DarkModeToggle 컴포넌트 구현
✅ 마운트/변경 시 localStorage 동기화 추가
✅ 다크 모드 변수로 전역 CSS 업데이트

## 📊 EVAL 단계
| 문제 | 심각도 | 상태 |
|------|--------|------|
| 키보드 접근성 누락 | 높음 | 발견 |
| 시스템 환경설정 감지 없음 | 중간 | 발견 |
| 테스트 커버리지 78% | 중간 | 발견 |

---

# Mode: AUTO (반복 2/5)

## 📋 PLAN 단계
반복 1에서 발견된 높음 및 중간 문제 해결

## 🚀 ACT 단계
✅ 키보드 지원 추가 (Enter/Space 토글)
✅ prefers-color-scheme 감지 추가
✅ 누락된 테스트 추가 (커버리지 현재 92%)

## 📊 EVAL 단계
| 문제 | 심각도 | 상태 |
|------|--------|------|
| 모든 이전 문제 | - | ✅ 해결됨 |

---

# Mode: AUTO - 완료 ✅

## 요약
- **반복 횟수**: 2
- **Critical 문제**: 0
- **High 문제**: 0
- **커버리지**: 92%

## 생성/수정된 파일
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css (다크 모드 변수)
- tests/ThemeContext.test.tsx
```

---

## 예시 4: 보안 감사

### 시나리오
기존 인증 코드의 보안 문제를 감사합니다.

### PLAN 단계

```
사용자: PLAN src/auth/의 인증 모듈 보안 감사
```

**Claude 응답:**
```markdown
# Mode: PLAN
## Agent: security-specialist [주 에이전트]

## 📋 감사 범위
다음에 초점을 맞춘 인증 모듈 보안 검토:
- 토큰 처리 (JWT)
- 비밀번호 저장
- 세션 관리
- 입력 유효성 검사
- OWASP Top 10 준수

## 🔍 감사 체크리스트
- [ ] JWT 시크릿 강도 및 로테이션
- [ ] 토큰 만료 및 갱신 로직
- [ ] 비밀번호 해싱 알고리즘 및 매개변수
- [ ] 브루트 포스 보호
- [ ] 인증 응답의 XSS 방지
- [ ] 인증 엔드포인트의 CSRF 보호
- [ ] 안전한 쿠키 설정
- [ ] 속도 제한

**다음:** `ACT`를 입력하여 감사 수행
```

### ACT 단계

```
사용자: ACT
```

**Claude 응답:**
```markdown
# Mode: ACT
## Agent: security-specialist [주 에이전트]

## 🔍 보안 감사 결과

### Critical 문제 🔴
| 문제 | 위치 | 위험 |
|------|------|------|
| 코드에 JWT 시크릿 | auth.config.ts:5 | 시크릿 노출 |
| 토큰 만료 없음 | jwt.utils.ts:12 | 세션 하이재킹 |

### High 문제 🟠
| 문제 | 위치 | 위험 |
|------|------|------|
| 약한 비밀번호 정책 | validation.ts:8 | 브루트 포스 |
| 속도 제한 누락 | login.handler.ts | 계정 열거 |

### Medium 문제 🟡
| 문제 | 위치 | 위험 |
|------|------|------|
| 쿠키에 Secure 플래그 누락 | session.ts:22 | MITM |
| 자세한 오류 메시지 | error.handler.ts | 정보 유출 |

## 📋 수정 계획
1. JWT 시크릿을 환경 변수로 이동
2. 토큰 만료 추가 (15분 액세스, 7일 리프레시)
3. 속도 제한 구현 (분당 5회 시도)
4. 쿠키에 Secure, HttpOnly, SameSite 플래그 추가

**다음:** 수정 구현을 위해 `ACT` 또는 상세 수정 계획을 위해 `PLAN` 입력
```

---

## 예시 5: 도메인 체크리스트 생성

### /checklist 명령어 사용

```
사용자: /checklist security accessibility
```

**Claude 응답:**
```markdown
## 🔒 보안 체크리스트

### 인증
- [ ] bcrypt/argon2로 비밀번호 해싱
- [ ] JWT 토큰에 만료 설정
- [ ] 리프레시 토큰 로테이션 구현
- [ ] 로그아웃 시 세션 무효화

### 입력 유효성 검사
- [ ] 모든 사용자 입력 살균
- [ ] SQL 인젝션 방지 (매개변수화된 쿼리)
- [ ] XSS 방지 (출력 인코딩)
- [ ] 파일 업로드 제한

### 권한 부여
- [ ] 역할 기반 접근 제어
- [ ] 리소스 소유권 확인
- [ ] API 속도 제한

---

## ♿ 접근성 체크리스트

### 키보드 내비게이션
- [ ] 모든 대화형 요소 포커스 가능
- [ ] 가시적인 포커스 표시기
- [ ] 내비게이션 건너뛰기 링크
- [ ] 키보드 트랩 없음

### 스크린 리더
- [ ] 시맨틱 HTML 구조
- [ ] 커스텀 컨트롤에 ARIA 레이블
- [ ] 이미지에 대체 텍스트
- [ ] 폼 레이블과 입력 연결

### 시각
- [ ] 색상 대비 최소 4.5:1
- [ ] 텍스트 200%까지 확대 가능
- [ ] 색상에만 의존하는 콘텐츠 없음
```

---

## 효과적인 사용을 위한 팁

### 1. PLAN에서 구체적으로 작성
```
# 좋음
PLAN 페이지당 20개 항목으로 사용자 목록 페이지네이션 구현

# 덜 효과적
PLAN 페이지네이션 추가
```

### 2. 품질 게이트를 위해 EVAL 사용
머지 전 EVAL을 요청하여 확인:
- 보안 문제 발견
- 접근성 검증
- 테스트 커버리지 기준 충족

### 3. 복잡한 기능에 AUTO 활용
AUTO 모드는 다음에 이상적:
- 여러 파일에 걸친 기능
- 여러 반복이 필요한 기능
- 높은 품질 기준이 있을 때

### 4. 심층 리뷰에 전문가 활용
집중 분석을 위해 특정 도메인 언급:
```
PLAN 결제 처리 모듈 보안 검토
EVAL 접근성에 초점을 맞춰서
```

## 관련 문서

- [빠른 참조](./plugin-quick-reference.md) - 명령어 한눈에 보기
- [아키텍처](./plugin-architecture.md) - 작동 원리
- [문제 해결](./plugin-troubleshooting.md) - 일반적인 문제
- [FAQ](./plugin-faq.md) - 자주 묻는 질문

---

<sub>🤖 이 문서는 AI의 도움을 받아 번역되었습니다. 오류나 개선 사항이 있으면 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues)에 알려주세요.</sub>
