/**
 * React Template
 */

import type { ConfigTemplate } from '../template.types';

export const reactTemplate: ConfigTemplate = {
  metadata: {
    id: 'react',
    name: 'React',
    description: 'React frontend application (Vite, CRA, etc.)',
    matchPatterns: ['react', 'react-dom'],
  },
  config: {
    language: 'ko',
    techStack: {
      languages: ['TypeScript'],
      frontend: ['React'],
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
// React 프로젝트용 설정 파일
//
// 이 파일은 AI 코딩 어시스턴트가 프로젝트 컨텍스트를 이해하는 데 사용됩니다.
// 프로젝트에 맞게 값을 수정하세요.
// ============================================================`,
    language: `// 🌍 언어 설정
  // AI 응답 언어를 지정합니다. ('ko', 'en', 'ja' 등)`,
    projectInfo: `// 📦 프로젝트 정보`,
    techStack: `// 🛠️ 기술 스택
  // 자동 감지된 값입니다. 상태관리, 스타일링 라이브러리 등을 추가하세요.
  // 예: frontend: ['React', 'Redux', 'Tailwind CSS']`,
    architecture: `// 🏗️ 아키텍처
  // pattern: 'feature-based' | 'atomic' | 'layered'
  // componentStyle: 'flat' | 'grouped' | 'feature-based'`,
    conventions: `// 📝 코딩 컨벤션`,
    testStrategy: `// 🧪 테스트 전략
  // React Testing Library와 함께 사용을 권장합니다.`,
    footer: `// ============================================================
  // 💡 TIP: MCP 사용 시 동기화
  //
  // codingbuddy MCP가 프로젝트를 분석하여 설정 업데이트를 제안합니다.
  // ============================================================`,
  },
};
