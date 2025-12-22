/**
 * Express Template
 */

import type { ConfigTemplate } from '../template.types';

export const expressTemplate: ConfigTemplate = {
  metadata: {
    id: 'express',
    name: 'Express',
    description: 'Express.js backend API server',
    matchPatterns: ['express', 'fastify', 'koa'],
  },
  config: {
    language: 'ko',
    techStack: {
      languages: ['TypeScript'],
      backend: ['Express'],
    },
    architecture: {
      pattern: 'layered',
      structure: ['routes', 'controllers', 'services', 'models'],
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
// Express 프로젝트용 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정`,
    projectInfo: `// 📦 프로젝트 정보`,
    techStack: `// 🛠️ 기술 스택
  // 미들웨어 및 데이터베이스를 추가하세요.
  // 예: backend: ['Express', 'Passport'], database: ['MongoDB']`,
    architecture: `// 🏗️ 아키텍처
  // Express는 routes → controllers → services → models 패턴을 권장합니다.`,
    conventions: `// 📝 코딩 컨벤션`,
    testStrategy: `// 🧪 테스트 전략
  // supertest를 사용한 API 테스트를 권장합니다.`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // ============================================================`,
  },
};
