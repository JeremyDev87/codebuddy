<p align="center">
  <a href="../plugin-examples.md">English</a> |
  <a href="../ko/plugin-examples.md">한국어</a> |
  <a href="plugin-examples.md">中文</a> |
  <a href="../ja/plugin-examples.md">日本語</a> |
  <a href="../es/plugin-examples.md">Español</a> |
  <a href="../pt-BR/plugin-examples.md">Português</a>
</p>

# CodingBuddy 使用示例

展示如何有效使用 PLAN/ACT/EVAL 工作流的真实示例。

## 示例 1：实现 REST API 端点

### 场景
添加一个带有验证功能的用户注册新端点。

### PLAN 阶段

```
您: PLAN implement a POST /api/users endpoint for user registration with email validation
```

**Claude 响应：**
```markdown
# Mode: PLAN
## Agent: backend-developer [Primary Agent]

## 📋 计划概述
实现带有邮箱验证、密码哈希和适当错误处理的用户注册端点。

## ✅ 待办事项
- [ ] 定义 User 类型和验证模式
- [ ] 为注册端点编写失败测试
- [ ] 实现注册处理器
- [ ] 添加邮箱验证工具
- [ ] 添加密码哈希
- [ ] 编写集成测试

## 🎯 实现步骤

### 核心逻辑（TDD 方法）
1. 编写测试：POST /api/users 在有效数据时返回 201
2. 编写测试：无效邮箱时返回 400
3. 编写测试：弱密码时返回 400
4. 实现验证工具
5. 实现注册处理器

### 🔒 安全规划
- 使用 bcrypt 进行密码哈希（成本因子 12）
- 输入清理以防止 XSS
- 速率限制建议

## 📁 文件结构
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**下一步：** 输入 `ACT` 执行
```

### ACT 阶段

```
您: ACT
```

**Claude 响应：**
```markdown
# Mode: ACT
## Agent: backend-developer [Primary Agent]

## 🚀 实现进度

### 步骤 1：定义类型
✅ 创建了用户类型
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### 步骤 2：编写失败测试（红色）
✅ 创建了测试文件
- `src/entities/user/__tests__/user.api.test.ts`
- 测试："returns 201 on valid registration" - 失败 ❌

### 步骤 3：实现验证（绿色）
✅ 创建了验证工具
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### 步骤 4：实现处理器（绿色）
✅ 创建了注册端点
- `src/entities/user/user.api.ts`: registerUser 处理器
- 测试现在通过 ✅

### 步骤 5：重构
✅ 提取了错误响应辅助函数
✅ 添加了 JSDoc 注释

## ✅ 质量检查
- ✅ 类型安全：所有类型显式声明
- ✅ 测试：4/4 通过（覆盖率：94%）
- ✅ 安全：密码使用 bcrypt 哈希

**下一步：** 输入 `EVAL` 进行质量评估或继续 `PLAN`
```

### EVAL 阶段（可选）

```
您: EVAL
```

**Claude 响应：**
```markdown
# Mode: EVAL
## Agent: code-reviewer [Primary Agent]

## 📊 代码质量评估

### 安全分析 🔒
| 检查项 | 状态 | 备注 |
|-------|--------|-------|
| 密码哈希 | ✅ 通过 | bcrypt，成本因子 12 |
| 输入验证 | ✅ 通过 | 邮箱正则、密码规则 |
| SQL 注入 | ✅ 通过 | 使用参数化查询 |
| 速率限制 | ⚠️ 中等 | 未实现 |

### 代码质量 📏
| 指标 | 值 | 目标 |
|--------|-------|--------|
| 测试覆盖率 | 94% | 90%+ ✅ |
| 复杂度 | 低 | 可接受 ✅ |
| 类型安全 | 100% | 100% ✅ |

### 建议
1. **中等**：添加速率限制以防止暴力破解
2. **低**：考虑添加邮箱验证流程

## 🔄 改进计划
如果您想解决这些发现：
- 添加速率限制中间件
- 实现邮箱验证令牌
```

---

## 示例 2：调试失败的测试

### 场景
一个测试间歇性失败，您需要进行调试。

### PLAN 阶段

```
您: PLAN debug the flaky test in UserProfile.test.tsx that fails randomly
```

**Claude 响应：**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [Primary Agent]

## 📋 计划概述
调查并修复 UserProfile 组件中的不稳定测试。

## 🔍 调试策略
1. 识别测试文件和失败的断言
2. 检查异步时序问题
3. 查找测试间共享状态
4. 验证 mock 清理
5. 添加适当的 waitFor 断言

## 🎯 调查步骤
1. 读取测试文件并识别失败模式
2. 检查是否缺少 await 或 act() 包装
3. 验证 beforeEach/afterEach 清理
4. 为异步操作添加显式 waitFor

**下一步：** 输入 `ACT` 开始调试
```

### ACT 阶段

```
您: ACT
```

**Claude 响应：**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [Primary Agent]

## 🚀 调试进度

### 步骤 1：分析测试
✅ 在 `UserProfile.test.tsx:45` 发现问题
- 异步渲染缺少 `await`
- 状态更新在断言之后发生

### 步骤 2：应用修复
✅ 修改了测试
```tsx
// 修改前（不稳定）
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// 修改后（稳定）
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### 步骤 3：验证修复
✅ 运行测试 50 次 - 0 次失败

## ✅ 根本原因
异步数据获取在断言后完成。使用适当的 `waitFor` 修复。
```

---

## 示例 3：自动化功能开发

### 场景
使用自动质量控制实现完整功能。

### AUTO 模式

```
您: AUTO implement a dark mode toggle with localStorage persistence
```

**Claude 响应：**
```markdown
# Mode: AUTO（迭代 1/5）
## Agent: frontend-developer [Primary Agent]

## 📋 PLAN 阶段
- 创建 ThemeContext 提供者
- 实现切换组件
- 添加 localStorage 持久化
- 设置深色模式样式变体

## 🚀 ACT 阶段
✅ 创建了带有深色/浅色模式的 ThemeContext
✅ 实现了 DarkModeToggle 组件
✅ 添加了挂载/更改时的 localStorage 同步
✅ 更新了全局 CSS 深色模式变量

## 📊 EVAL 阶段
| 问题 | 严重程度 | 状态 |
|-------|----------|--------|
| 缺少键盘无障碍支持 | 高 | 发现 |
| 无系统偏好检测 | 中等 | 发现 |
| 测试覆盖率为 78% | 中等 | 发现 |

---

# Mode: AUTO（迭代 2/5）

## 📋 PLAN 阶段
解决迭代 1 中的高和中等问题

## 🚀 ACT 阶段
✅ 添加了键盘支持（Enter/空格切换）
✅ 添加了 prefers-color-scheme 检测
✅ 添加了缺失的测试（覆盖率现在为 92%）

## 📊 EVAL 阶段
| 问题 | 严重程度 | 状态 |
|-------|----------|--------|
| 所有之前的问题 | - | ✅ 已解决 |

---

# Mode: AUTO - 完成 ✅

## 摘要
- **迭代次数**：2
- **严重问题**：0
- **高优先级问题**：0
- **覆盖率**：92%

## 创建/修改的文件
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css（深色模式变量）
- tests/ThemeContext.test.tsx
```

---

## 示例 4：安全审计

### 场景
审计现有认证代码的安全问题。

### PLAN 阶段

```
您: PLAN security audit the authentication module in src/auth/
```

**Claude 响应：**
```markdown
# Mode: PLAN
## Agent: security-specialist [Primary Agent]

## 📋 审计范围
认证模块的安全审查，重点关注：
- 令牌处理（JWT）
- 密码存储
- 会话管理
- 输入验证
- OWASP Top 10 合规性

## 🔍 审计检查清单
- [ ] JWT 密钥强度和轮换
- [ ] 令牌过期和刷新逻辑
- [ ] 密码哈希算法和参数
- [ ] 暴力破解防护
- [ ] 认证响应中的 XSS 防护
- [ ] 认证端点的 CSRF 防护
- [ ] 安全 Cookie 设置
- [ ] 速率限制

**下一步：** 输入 `ACT` 执行审计
```

### ACT 阶段

```
您: ACT
```

**Claude 响应：**
```markdown
# Mode: ACT
## Agent: security-specialist [Primary Agent]

## 🔍 安全审计发现

### 严重问题 🔴
| 问题 | 位置 | 风险 |
|-------|----------|------|
| JWT 密钥在代码中 | auth.config.ts:5 | 密钥泄露 |
| 无令牌过期 | jwt.utils.ts:12 | 会话劫持 |

### 高优先级问题 🟠
| 问题 | 位置 | 风险 |
|-------|----------|------|
| 弱密码策略 | validation.ts:8 | 暴力破解 |
| 缺少速率限制 | login.handler.ts | 账户枚举 |

### 中等问题 🟡
| 问题 | 位置 | 风险 |
|-------|----------|------|
| Cookie 缺少 Secure 标志 | session.ts:22 | 中间人攻击 |
| 错误消息过于详细 | error.handler.ts | 信息泄露 |

## 📋 修复计划
1. 将 JWT 密钥移至环境变量
2. 添加令牌过期（15 分钟访问令牌，7 天刷新令牌）
3. 实现速率限制（每分钟 5 次尝试）
4. 为 Cookie 添加 Secure、HttpOnly、SameSite 标志

**下一步：** 输入 `ACT` 实现修复或 `PLAN` 进行详细修复方案
```

---

## 示例 5：生成领域检查清单

### 使用 /checklist 命令

```
您: /checklist security accessibility
```

**Claude 响应：**
```markdown
## 🔒 安全检查清单

### 认证
- [ ] 密码使用 bcrypt/argon2 哈希
- [ ] JWT 令牌有过期时间
- [ ] 实现刷新令牌轮换
- [ ] 登出时会话失效

### 输入验证
- [ ] 所有用户输入已清理
- [ ] SQL 注入防护（参数化查询）
- [ ] XSS 防护（输出编码）
- [ ] 文件上传限制

### 授权
- [ ] 基于角色的访问控制
- [ ] 资源所有权验证
- [ ] API 速率限制

---

## ♿ 无障碍检查清单

### 键盘导航
- [ ] 所有交互元素可聚焦
- [ ] 可见的焦点指示器
- [ ] 导航跳过链接
- [ ] 无键盘陷阱

### 屏幕阅读器
- [ ] 语义化 HTML 结构
- [ ] 自定义控件上的 ARIA 标签
- [ ] 图片的替代文本
- [ ] 表单标签与输入关联

### 视觉
- [ ] 颜色对比度最小 4.5:1
- [ ] 文本可放大到 200%
- [ ] 不仅依赖颜色传达内容
```

---

## 有效使用的技巧

### 1. 在 PLAN 中要具体
```
# 好
PLAN implement pagination for user list with 20 items per page

# 效果较差
PLAN add pagination
```

### 2. 使用 EVAL 作为质量门槛
在合并前请求 EVAL 以确保：
- 安全问题被发现
- 无障碍性已验证
- 测试覆盖率达到标准

### 3. 对复杂功能使用 AUTO
AUTO 模式适合：
- 多文件功能
- 需要多次迭代的功能
- 质量要求高的功能

### 4. 使用专家进行深度审查
提及特定领域以获得聚焦分析：
```
PLAN security review the payment processing module
EVAL with focus on accessibility
```

## 另请参阅

- [快速参考](./plugin-quick-reference.md) - 命令概览
- [架构](./plugin-architecture.md) - 工作原理
- [故障排除](./plugin-troubleshooting.md) - 常见问题
- [常见问题](./plugin-faq.md) - 常见问题解答

---

<sub>🤖 本文档由AI辅助翻译。如有错误或改进建议，请在 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues) 中反馈。</sub>
