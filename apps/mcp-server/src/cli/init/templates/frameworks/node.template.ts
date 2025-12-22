/**
 * Node.js Template
 */

import type { ConfigTemplate } from '../template.types';

export const nodeTemplate: ConfigTemplate = {
  metadata: {
    id: 'node',
    name: 'Node.js',
    description: 'Generic Node.js project (CLI tools, libraries, etc.)',
    matchPatterns: ['node', 'nodejs'],
  },
  config: {
    language: 'ko',
    techStack: {
      languages: ['TypeScript'],
    },
    architecture: {
      pattern: 'modular',
    },
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
// Node.js 프로젝트용 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정`,
    projectInfo: `// 📦 프로젝트 정보`,
    techStack: `// 🛠️ 기술 스택
  // 사용하는 라이브러리를 추가하세요.
  // 예: tools: ['Commander', 'Chalk']`,
    architecture: `// 🏗️ 아키텍처
  // pattern: 'modular' | 'layered' | 'plugin-based'`,
    conventions: `// 📝 코딩 컨벤션`,
    testStrategy: `// 🧪 테스트 전략`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // ============================================================`,
  },
};
