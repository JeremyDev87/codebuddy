<p align="center">
  <a href="../plugin-guide.md">English</a> |
  <a href="plugin-guide.md">한국어</a> |
  <a href="../zh-CN/plugin-guide.md">中文</a> |
  <a href="../ja/plugin-guide.md">日本語</a> |
  <a href="../es/plugin-guide.md">Español</a> |
  <a href="../pt-BR/plugin-guide.md">Português</a>
</p>

# Claude Code 플러그인 설치 및 설정 가이드

**Codingbuddy는 29개의 전문 AI 에이전트를 조율하여** PLAN → ACT → EVAL 워크플로우를 통해 인간 전문가 팀 수준의 코드 품질을 제공합니다.

이 가이드는 CodingBuddy Claude Code 플러그인의 설치 및 설정 방법을 단계별로 안내합니다.

## 사전 요구사항

플러그인 설치 전에 다음 항목이 준비되어 있는지 확인하세요:

- **Node.js** 18.0 이상
- **Claude Code** CLI 설치 및 인증 완료
- **npm** 또는 **yarn** 패키지 매니저

환경 확인 방법:

```bash
# Node.js 버전 확인
node --version  # v18.0.0 이상이어야 합니다

# Claude Code 설치 확인
claude --version
```

## 설치 방법

### 방법 1: Claude Code 마켓플레이스를 통한 설치 (권장)

가장 간단한 설치 방법입니다:

```bash
# 1. 마켓플레이스 추가
claude marketplace add JeremyDev87/codingbuddy

# 2. 플러그인 설치
claude plugin install codingbuddy@jeremydev87
```

> **마이그레이션 안내**: 이전에 `claude marketplace add https://jeremydev87.github.io/codingbuddy` 명령을 사용하셨다면, 기존 마켓플레이스를 제거하고 위에 표시된 GitHub 저장소 형식을 사용해 주세요. URL 형식은 더 이상 지원되지 않습니다.

이 명령어는 자동으로:
- 최신 플러그인 버전 다운로드
- Claude Code에 플러그인 등록
- MCP 설정 구성

### 방법 2: npm을 통한 설치

설치를 더 세밀하게 제어하고 싶을 때:

```bash
# 전역 설치
npm install -g codingbuddy-claude-plugin

# 또는 yarn 사용
yarn global add codingbuddy-claude-plugin
```

## MCP 서버 설정 (필수)

플러그인의 모든 기능을 사용하려면 CodingBuddy MCP 서버가 필요합니다. MCP 서버는 다음을 제공합니다:

- 전문가 에이전트 및 스킬
- 워크플로우 모드 (PLAN/ACT/EVAL/AUTO)
- 상황별 체크리스트
- 세션 관리

### MCP 서버 설치

```bash
npm install -g codingbuddy
```

### Claude Code 설정

Claude Code 설정에 MCP 서버를 추가합니다:

**방법 A: 전역 설정**

`~/.claude/settings.json` 파일 편집:

```json
{
  "mcpServers": {
    "codingbuddy": {
      "command": "codingbuddy",
      "args": []
    }
  }
}
```

**방법 B: 프로젝트별 설정**

프로젝트 루트에 `.mcp.json` 파일 생성:

```json
{
  "mcpServers": {
    "codingbuddy": {
      "command": "codingbuddy",
      "args": []
    }
  }
}
```

## 설치 확인

### 1단계: 플러그인 등록 확인

```bash
claude plugin list
```

목록에 `codingbuddy`가 표시되어야 합니다.

### 2단계: MCP 연결 테스트

Claude Code를 시작하고 워크플로우 명령어를 테스트합니다:

```bash
claude

# Claude Code에서 다음을 입력:
PLAN 사용자 로그인 기능 구현
```

올바르게 설정되었다면 다음이 표시됩니다:
- 모드 표시기: `# Mode: PLAN`
- 에이전트 활성화 메시지
- 구조화된 계획 출력

### 3단계: MCP 도구 확인

Claude Code에서 사용 가능한 도구 확인:

```
/mcp
```

다음과 같은 CodingBuddy 도구가 표시되어야 합니다:
- `parse_mode`
- `get_agent_details`
- `generate_checklist`
- `read_context`
- `update_context`

## 설치 문제 해결

### 플러그인이 표시되지 않는 경우

**증상**: `claude plugin list`에 codingbuddy가 표시되지 않음

**해결 방법**:
1. 플러그인 재설치:
   ```bash
   claude plugin uninstall codingbuddy@jeremydev87
   claude plugin install codingbuddy@jeremydev87
   ```

2. Claude Code 버전 확인:
   ```bash
   claude --version
   # 필요시 업데이트
   npm update -g @anthropic-ai/claude-code
   ```

### MCP 서버 연결 실패

**증상**: 워크플로우 명령어가 작동하지 않고 에이전트가 활성화되지 않음

**해결 방법**:
1. codingbuddy 전역 설치 확인:
   ```bash
   which codingbuddy  # 경로가 표시되어야 함
   codingbuddy --version
   ```

2. MCP 설정 확인:
   ```bash
   cat ~/.claude/settings.json
   # mcpServers 섹션이 있는지 확인
   ```

3. Claude Code 재시작:
   ```bash
   # 종료 후 재시작
   claude
   ```

### 권한 오류

**증상**: EACCES 또는 permission denied 오류로 설치 실패

**해결 방법**:
1. npm 권한 수정:
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   ```

2. 또는 Node 버전 매니저(nvm, fnm) 사용

### 버전 불일치

**증상**: 기능이 예상대로 작동하지 않음

**해결 방법**:
1. 두 패키지 모두 업데이트:
   ```bash
   npm update -g codingbuddy codingbuddy-claude-plugin
   ```

2. 버전 일치 확인:
   ```bash
   codingbuddy --version
   # 플러그인 버전은 Claude Code 시작 시 표시됨
   ```

## 설정 옵션

### 프로젝트별 설정

프로젝트 루트에 `codingbuddy.config.js` 생성:

```javascript
module.exports = {
  // 응답 언어 (기본값: 자동 감지)
  language: 'ko',  // 'en', 'ko', 'ja', 'zh', 'es'

  // 기본 워크플로우 모드
  defaultMode: 'PLAN',

  // 활성화할 전문가 에이전트
  specialists: [
    'security-specialist',
    'accessibility-specialist',
    'performance-specialist'
  ]
};
```

### 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `CODINGBUDDY_LANGUAGE` | 응답 언어 | 자동 감지 |
| `CODINGBUDDY_DEBUG` | 디버그 로깅 활성화 | false |

## 다음 단계

설치 후 다음 문서를 확인하세요:

- [빠른 참조](./plugin-quick-reference.md) - 명령어와 워크플로우 한눈에 보기
- [플러그인 아키텍처](./plugin-architecture.md) - 플러그인 작동 방식
- [사용 예시](./plugin-examples.md) - 실제 워크플로우 예제
- [FAQ](./plugin-faq.md) - 자주 묻는 질문

## 플러그인 업데이트

### Claude Code를 통한 업데이트

```bash
claude plugin update codingbuddy
```

### npm을 통한 업데이트

```bash
npm update -g codingbuddy codingbuddy-claude-plugin
```

## 제거

### 플러그인 제거

```bash
claude plugin remove codingbuddy
```

### MCP 서버 제거

```bash
npm uninstall -g codingbuddy
```

### 설정 정리

다음 파일에서 `codingbuddy` 항목을 제거하세요:
- `~/.claude/settings.json` (전역)
- `.mcp.json` (프로젝트별)

---

<sub>🤖 이 문서는 AI의 도움을 받아 번역되었습니다. 오류나 개선 사항이 있으면 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues)에 알려주세요.</sub>
