<p align="center">
  <a href="../plugin-guide.md">English</a> |
  <a href="../ko/plugin-guide.md">한국어</a> |
  <a href="plugin-guide.md">中文</a> |
  <a href="../ja/plugin-guide.md">日本語</a> |
  <a href="../es/plugin-guide.md">Español</a> |
  <a href="../pt-BR/plugin-guide.md">Português</a>
</p>

# Claude Code 插件安装与设置指南

本指南提供 CodingBuddy Claude Code 插件的安装和配置步骤说明。

## 前置要求

在安装插件之前，请确保您具备以下条件：

- **Node.js** 18.0 或更高版本
- **Claude Code** CLI 已安装并完成认证
- **npm** 或 **yarn** 包管理器

验证您的环境：

```bash
# 检查 Node.js 版本
node --version  # 应为 v18.0.0 或更高版本

# 检查 Claude Code 是否已安装
claude --version
```

## 安装方法

### 方法 1：通过 Claude Code 市场（推荐）

最简单的插件安装方式：

```bash
# 1. 添加市场
claude marketplace add JeremyDev87/codingbuddy

# 2. 安装插件
claude plugin install codingbuddy@jeremydev87
```

> **迁移说明**：如果您之前使用 `claude marketplace add https://jeremydev87.github.io/codingbuddy`，请删除旧的市场并使用上面显示的 GitHub 仓库格式。URL 格式已弃用。

此命令会自动：
- 下载最新版本的插件
- 将其注册到 Claude Code
- 设置 MCP 配置

### 方法 2：通过 npm

如果您需要更多安装控制：

```bash
# 全局安装
npm install -g codingbuddy-claude-plugin

# 或使用 yarn
yarn global add codingbuddy-claude-plugin
```

## MCP 服务器设置（必需）

该插件需要 CodingBuddy MCP 服务器才能实现完整功能。MCP 服务器提供：

- 专家代理和技能
- 工作流模式（PLAN/ACT/EVAL/AUTO）
- 上下文检查清单
- 会话管理

### 安装 MCP 服务器

```bash
npm install -g codingbuddy
```

### 配置 Claude Code

将 MCP 服务器添加到您的 Claude Code 配置中：

**选项 A：全局配置**

编辑 `~/.claude/settings.json`：

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

**选项 B：项目级配置**

在您的项目根目录创建 `.mcp.json`：

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

## 验证安装

### 步骤 1：检查插件是否已注册

```bash
claude plugin list
```

您应该在列表中看到 `codingbuddy`。

### 步骤 2：测试 MCP 连接

启动 Claude Code 并尝试一个工作流命令：

```bash
claude

# 在 Claude Code 中输入：
PLAN implement a user login feature
```

如果配置正确，您将看到：
- 模式指示器：`# Mode: PLAN`
- 代理激活消息
- 结构化计划输出

### 步骤 3：验证 MCP 工具

在 Claude Code 中检查可用工具：

```
/mcp
```

您应该看到 CodingBuddy 工具，如：
- `parse_mode`
- `get_agent_details`
- `generate_checklist`
- `read_context`
- `update_context`

## 安装故障排除

### 插件未显示

**症状**：`claude plugin list` 未显示 codingbuddy

**解决方案**：
1. 重新安装插件：
   ```bash
   claude plugin uninstall codingbuddy@jeremydev87
   claude plugin install codingbuddy@jeremydev87
   ```

2. 检查 Claude Code 版本：
   ```bash
   claude --version
   # 如需更新
   npm update -g @anthropic-ai/claude-code
   ```

### MCP 服务器无法连接

**症状**：工作流命令不起作用，没有代理激活

**解决方案**：
1. 验证 codingbuddy 是否已全局安装：
   ```bash
   which codingbuddy  # 应显示路径
   codingbuddy --version
   ```

2. 检查 MCP 配置：
   ```bash
   cat ~/.claude/settings.json
   # 验证 mcpServers 部分是否存在
   ```

3. 重启 Claude Code：
   ```bash
   # 退出并重新启动
   claude
   ```

### 权限错误

**症状**：安装失败，显示 EACCES 或权限被拒绝

**解决方案**：
1. 修复 npm 权限：
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   export PATH=~/.npm-global/bin:$PATH
   ```

2. 或使用 Node 版本管理器（nvm、fnm）

### 版本不匹配

**症状**：功能未按预期工作

**解决方案**：
1. 更新两个包：
   ```bash
   npm update -g codingbuddy codingbuddy-claude-plugin
   ```

2. 验证版本匹配：
   ```bash
   codingbuddy --version
   # 插件版本在 Claude Code 启动时显示
   ```

## 配置选项

### 项目级配置

在您的项目根目录创建 `codingbuddy.config.js`：

```javascript
module.exports = {
  // 响应语言（默认自动检测）
  language: 'zh',  // 'en', 'ko', 'ja', 'zh', 'es'

  // 默认工作流模式
  defaultMode: 'PLAN',

  // 启用的专家代理
  specialists: [
    'security-specialist',
    'accessibility-specialist',
    'performance-specialist'
  ]
};
```

### 环境变量

| 变量 | 描述 | 默认值 |
|----------|-------------|---------|
| `CODINGBUDDY_LANGUAGE` | 响应语言 | 自动检测 |
| `CODINGBUDDY_DEBUG` | 启用调试日志 | false |

## 后续步骤

安装完成后，请探索：

- [快速参考](./plugin-quick-reference.md) - 命令和工作流概览
- [插件架构](./plugin-architecture.md) - 插件工作原理
- [使用示例](./plugin-examples.md) - 真实工作流示例
- [常见问题](./plugin-faq.md) - 常见问题解答

## 更新插件

### 通过 Claude Code 更新

```bash
claude plugin update codingbuddy
```

### 通过 npm 更新

```bash
npm update -g codingbuddy codingbuddy-claude-plugin
```

## 卸载

### 移除插件

```bash
claude plugin remove codingbuddy
```

### 移除 MCP 服务器

```bash
npm uninstall -g codingbuddy
```

### 清理配置

从以下位置移除 `codingbuddy` 条目：
- `~/.claude/settings.json`（全局）
- `.mcp.json`（项目级）

---

<sub>🤖 本文档由AI辅助翻译。如有错误或改进建议，请在 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues) 中反馈。</sub>
