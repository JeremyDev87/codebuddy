/**
 * NestJS Template
 */

import type { ConfigTemplate } from '../template.types';

export const nestjsTemplate: ConfigTemplate = {
  metadata: {
    id: 'nestjs',
    name: 'NestJS',
    description: 'NestJS backend framework with dependency injection',
    matchPatterns: ['@nestjs/core', 'nestjs'],
  },
  config: {
    language: 'ko',
    techStack: {
      languages: ['TypeScript'],
      backend: ['NestJS'],
    },
    architecture: {
      pattern: 'layered',
      structure: ['modules', 'controllers', 'services', 'repositories'],
    },
    conventions: {
      naming: {
        files: 'kebab-case',
        components: 'PascalCase',
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
// NestJS 프로젝트용 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정`,
    projectInfo: `// 📦 프로젝트 정보`,
    techStack: `// 🛠️ 기술 스택
  // NestJS 모듈 및 데이터베이스를 추가하세요.
  // 예: backend: ['NestJS', 'TypeORM'], database: ['PostgreSQL']`,
    architecture: `// 🏗️ 아키텍처
  // NestJS는 모듈 기반 레이어드 아키텍처를 사용합니다.
  // structure: 프로젝트 레이어 구조`,
    conventions: `// 📝 코딩 컨벤션
  // NestJS 공식 스타일 가이드를 따릅니다.`,
    testStrategy: `// 🧪 테스트 전략
  // NestJS의 @nestjs/testing 모듈을 활용합니다.
  // e2e 테스트는 test/ 디렉토리에 위치합니다.`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // ============================================================`,
  },
};
