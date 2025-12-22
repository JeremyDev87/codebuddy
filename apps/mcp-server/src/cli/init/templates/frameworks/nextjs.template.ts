/**
 * Next.js Template
 */

import type { ConfigTemplate } from '../template.types';

export const nextjsTemplate: ConfigTemplate = {
  metadata: {
    id: 'nextjs',
    name: 'Next.js',
    description: 'Next.js fullstack React framework with App Router',
    matchPatterns: ['next', 'nextjs'],
  },
  config: {
    language: 'ko',
    techStack: {
      languages: ['TypeScript'],
      frontend: ['React', 'Next.js'],
    },
    architecture: {
      pattern: 'feature-based',
      componentStyle: 'grouped',
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
// Next.js 프로젝트용 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정
  // AI 응답 언어를 지정합니다. ('ko', 'en', 'ja' 등)`,
    projectInfo: `// 📦 프로젝트 정보
  // projectName, description은 자동 감지되며 필요시 수정하세요.`,
    techStack: `// 🛠️ 기술 스택
  // 자동 감지된 값입니다. 추가 기술이 있으면 배열에 추가하세요.
  // 예: backend: ['Prisma', 'tRPC'], database: ['PostgreSQL']`,
    architecture: `// 🏗️ 아키텍처
  // pattern: 'feature-based' | 'layered' | 'clean' | 'modular'
  // componentStyle: 'flat' | 'grouped' | 'feature-based'`,
    conventions: `// 📝 코딩 컨벤션
  // 프로젝트의 네이밍 규칙을 정의합니다.`,
    testStrategy: `// 🧪 테스트 전략
  // approach: 'tdd' (테스트 먼저) | 'test-after' | 'mixed'
  // coverage: 목표 테스트 커버리지 (%)
  // mockingStrategy: 'minimal' | 'no-mocks' | 'extensive'`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // 새로운 의존성 추가 시 'suggest_config_updates' 도구로 확인하세요.
  //
  // 📚 문서: https://github.com/anthropics/codingbuddy
  // ============================================================`,
  },
};
