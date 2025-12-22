/**
 * Default Template
 */

import type { ConfigTemplate } from '../template.types';

export const defaultTemplate: ConfigTemplate = {
  metadata: {
    id: 'default',
    name: 'Default',
    description: 'Generic project template',
    matchPatterns: [],
  },
  config: {
    language: 'ko',
    techStack: {},
    architecture: {},
    conventions: {
      naming: {
        files: 'kebab-case',
        functions: 'camelCase',
      },
    },
    testStrategy: {
      approach: 'tdd',
      coverage: 90,
      mockingStrategy: 'minimal',
    },
  },
  comments: {
    header: `// ============================================================
// CodingBuddy Configuration
// 프로젝트 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정
  // AI 응답 언어를 지정합니다. ('ko', 'en', 'ja' 등)`,
    projectInfo: `// 📦 프로젝트 정보
  // projectName: 프로젝트 이름
  // description: 프로젝트 설명`,
    techStack: `// 🛠️ 기술 스택
  // 프로젝트에서 사용하는 기술을 정의하세요.
  //
  // techStack: {
  //   languages: ['TypeScript', 'Python'],
  //   frontend: ['React', 'Next.js'],
  //   backend: ['NestJS', 'FastAPI'],
  //   database: ['PostgreSQL', 'Redis'],
  //   infrastructure: ['Docker', 'AWS'],
  //   tools: ['GitHub Actions', 'Sentry'],
  // }`,
    architecture: `// 🏗️ 아키텍처
  // 프로젝트 구조와 패턴을 정의합니다.
  //
  // architecture: {
  //   pattern: 'feature-based',  // 'layered', 'clean', 'modular'
  //   componentStyle: 'grouped', // 'flat', 'feature-based'
  //   structure: ['src', 'lib', 'tests'],
  // }`,
    conventions: `// 📝 코딩 컨벤션
  // 네이밍 규칙 및 코드 스타일을 정의합니다.`,
    testStrategy: `// 🧪 테스트 전략
  // approach: 'tdd' (테스트 먼저) | 'test-after' (구현 후 테스트) | 'mixed'
  // coverage: 목표 테스트 커버리지 (%)
  // mockingStrategy: 'minimal' (최소 모킹) | 'no-mocks' | 'extensive'`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // 프로젝트가 변경되면 'suggest_config_updates' 도구로 확인하세요.
  //
  // 📚 문서: https://github.com/anthropics/codingbuddy
  // ============================================================`,
  },
};
