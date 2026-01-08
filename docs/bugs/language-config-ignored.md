# Bug Ticket: Language 설정이 무시되는 버그

## 현상 (Symptom)

`codingbuddy.config.js`에 `language: 'ko'`로 설정되어 있음에도 불구하고, MCP 서버가 항상 기본값인 English(`en`)로 응답함.

**재현 환경:**
- Monorepo 구조의 프로젝트
- `codingbuddy.config.js`가 루트 디렉토리에 위치
- MCP 서버가 하위 패키지 디렉토리에서 실행

**기대 동작:**
```
languageInstruction: "Always respond in Korean (한국어)."
```

**실제 동작:**
```
languageInstruction: "Always respond in English."
```

---

## 원인 (Root Cause)

`config.loader.ts`의 `findProjectRoot()` 함수가 monorepo 환경에서 프로젝트 루트를 잘못 감지함.

**문제 코드:** `config.loader.ts:80-92`
```typescript
while (traversalCount < MAX_PARENT_TRAVERSAL) {
  if (findConfigFile(currentDir) !== null) {
    return currentDir;
  }
  if (existsSync(packageJsonPath)) {
    return currentDir;  // 🐛 package.json 발견 시 즉시 종료
  }
  // parent로 이동
}
```

**버그 발생 시나리오:**

```
/workspace/codebuddy/
├── codingbuddy.config.js    ← language: 'ko' 설정 있음
├── package.json
└── apps/
    └── mcp-server/
        ├── package.json     ← 여기서 탐색 종료됨
        └── src/             ← MCP 서버 실행 위치
```

1. MCP 서버가 `apps/mcp-server/` 디렉토리에서 시작
2. `findProjectRoot()`가 `apps/mcp-server/package.json` 발견
3. **config 파일 없이 즉시 반환** (부모 디렉토리 미탐색)
4. `loadConfig()`가 해당 경로에서 config 파일을 찾지 못함
5. 빈 설정 반환 → `language: undefined`
6. `mode.handler.ts`에서 `language || 'en'` fallback 적용

**결론:** `package.json`을 찾으면 `codingbuddy.config.*` 파일이 상위 디렉토리에 있어도 탐색을 중단하는 로직 결함.
