<p align="center">
  <a href="../plugin-quick-reference.md">English</a> |
  <a href="../ko/plugin-quick-reference.md">한국어</a> |
  <a href="plugin-quick-reference.md">中文</a> |
  <a href="../ja/plugin-quick-reference.md">日本語</a> |
  <a href="../es/plugin-quick-reference.md">Español</a> |
  <a href="../pt-BR/plugin-quick-reference.md">Português</a>
</p>

# CodingBuddy 快速参考卡

命令、模式和常用工作流的快速参考。

## 工作流模式

| 模式 | 触发方式 | 用途 |
|------|---------|---------|
| **PLAN** | `PLAN <任务>` | 使用 TDD 设计实现方案 |
| **ACT** | `ACT` | 执行计划，进行更改 |
| **EVAL** | `EVAL` | 评估质量，提出改进建议 |
| **AUTO** | `AUTO <任务>` | 自动循环直到达到质量目标 |

### 模式流程

```
┌─────────────────────────────────────────────────────────────┐
│                        默认流程                               │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(用户: ACT)──> ACT ──(自动)──> PLAN                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       评估流程                                │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(用户: EVAL)──> EVAL ──> PLAN       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       自动流程                                │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(重复)──> 完成            │
│           └── 直到 Critical=0 且 High=0 ──┘                  │
└─────────────────────────────────────────────────────────────┘
```

## 命令

| 命令 | 描述 |
|---------|-------------|
| `/plan` | 进入 PLAN 模式 |
| `/act` | 进入 ACT 模式 |
| `/eval` | 进入 EVAL 模式 |
| `/auto` | 进入 AUTO 模式 |
| `/checklist` | 生成上下文检查清单 |

### 本地化关键词

| 英语 | 韩语 | 日语 | 中文 | 西班牙语 |
|---------|--------|----------|---------|---------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMATICO |

## 专家代理

### 规划专家
| 代理 | 专注领域 |
|-------|-------|
| 🏛️ architecture-specialist | 系统设计、层次布局 |
| 🧪 test-strategy-specialist | TDD 方法、覆盖率目标 |
| 📨 event-architecture-specialist | 消息队列、Saga、实时处理 |
| 🔗 integration-specialist | API 集成、外部服务 |
| 📊 observability-specialist | 日志、监控、追踪 |
| 🔄 migration-specialist | 数据迁移、版本管理 |

### 实现专家
| 代理 | 专注领域 |
|-------|-------|
| 📏 code-quality-specialist | SOLID、DRY、复杂度 |
| ⚡ performance-specialist | 包大小、性能优化 |
| 🔒 security-specialist | 认证、输入验证、XSS |
| ♿ accessibility-specialist | WCAG 2.1、ARIA、键盘 |
| 🔍 seo-specialist | 元数据、结构化数据 |
| 🎨 ui-ux-designer | 视觉层次、用户体验模式 |

### 开发者代理
| 代理 | 专注领域 |
|-------|-------|
| 🖥️ frontend-developer | UI 组件、状态管理 |
| ⚙️ backend-developer | API、数据库、认证 |
| 🔧 devops-engineer | CI/CD、基础设施 |
| 📱 mobile-developer | 移动应用开发 |

## 常用工作流

### 1. 实现新功能

```
您: PLAN implement user authentication with JWT

Claude: [创建带有 TDD 方法的结构化计划]

您: ACT

Claude: [按照红-绿-重构流程实现]

您: EVAL  (可选)

Claude: [审查代码质量、安全性，提出改进建议]
```

### 2. 修复 Bug

```
您: PLAN fix the login timeout issue in auth module

Claude: [分析问题，创建调试计划]

您: ACT

Claude: [实现修复并编写测试]
```

### 3. 自动开发

```
您: AUTO implement a complete REST API for user management

Claude: [循环执行 PLAN→ACT→EVAL 直到 Critical=0, High=0]
```

### 4. 生成检查清单

```
您: /checklist security performance

Claude: [生成安全和性能检查清单]
```

## 质量标准

### 覆盖率目标
- **核心逻辑**：90%+ 测试覆盖率
- **UI 组件**：关键交互已测试

### TDD 循环
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── 改进结构
 │         └── 编写最少代码使测试通过
 └── 编写失败的测试
```

### 代码质量
- 不使用 `any` 类型（TypeScript 严格模式）
- 纯函数/非纯函数分离
- SOLID 原则
- DRY（不要重复自己）

## 上下文管理

### 会话持久化
上下文存储在 `docs/codingbuddy/context.md`：
- 在会话压缩后仍然保留
- 跨模式追踪决策
- 保留推荐的代理

### 上下文命令
| 操作 | 方法 |
|--------|-----|
| 查看上下文 | 读取 `docs/codingbuddy/context.md` |
| 重置上下文 | 开始新的 PLAN 模式 |
| 更新上下文 | 模式完成时自动更新 |

## MCP 工具

| 工具 | 用途 |
|------|---------|
| `parse_mode` | 从提示中解析工作流模式 |
| `get_agent_details` | 获取专家代理信息 |
| `generate_checklist` | 生成领域特定的检查清单 |
| `read_context` | 读取当前上下文文档 |
| `update_context` | 更新上下文进度 |
| `get_project_config` | 获取项目配置 |

## 快速提示

1. **从 PLAN 开始** - 实现前始终先规划
2. **复杂功能使用 AUTO** - 让循环运行直到达到质量目标
3. **ACT 后请求 EVAL** - 合并前获取质量评估
4. **检查上下文** - 读取 `context.md` 查看之前的决策
5. **使用专家** - 他们能发现各自领域的特定问题

## 另请参阅

- [安装指南](./plugin-guide.md) - 设置和配置
- [架构](./plugin-architecture.md) - 工作原理
- [示例](./plugin-examples.md) - 真实工作流
- [故障排除](./plugin-troubleshooting.md) - 常见问题
- [常见问题](./plugin-faq.md) - 常见问题解答

---

<sub>🤖 本文档由AI辅助翻译。如有错误或改进建议，请在 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues) 中反馈。</sub>
