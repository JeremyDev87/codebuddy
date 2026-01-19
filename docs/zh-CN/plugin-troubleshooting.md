<p align="center">
  <a href="../plugin-troubleshooting.md">English</a> |
  <a href="../ko/plugin-troubleshooting.md">한국어</a> |
  <a href="plugin-troubleshooting.md">中文</a> |
  <a href="../ja/plugin-troubleshooting.md">日本語</a> |
  <a href="../es/plugin-troubleshooting.md">Español</a> |
  <a href="../pt-BR/plugin-troubleshooting.md">Português</a>
</p>

# CodingBuddy 故障排除指南

使用 CodingBuddy Claude Code 插件时常见问题的解决方案。

## 安装问题

### 插件未在 Claude Code 中显示

**症状**：安装后，`claude plugin list` 未显示 codingbuddy。

**解决方案**：

1. **验证安装完成**
   ```bash
   # 检查插件文件是否存在
   ls ~/.claude/plugins/codingbuddy/
   ```

2. **重新安装插件**
   ```bash
   claude plugin uninstall codingbuddy@jeremydev87
   claude plugin install codingbuddy@jeremydev87
   ```

3. **检查 Claude Code 版本**
   ```bash
   claude --version
   # 插件系统需要 Claude Code 1.0+
   ```

4. **重启 Claude Code**
   ```bash
   # 完全退出 Claude Code 并重新启动
   claude
   ```

### npm 安装失败

**症状**：`npm install -g codingbuddy-claude-plugin` 失败并显示错误。

**解决方案**：

1. **权限错误（EACCES）**
   ```bash
   # 选项 A：使用 Node 版本管理器
   # 安装 nvm，然后：
   nvm install --lts
   npm install -g codingbuddy-claude-plugin

   # 选项 B：修复 npm 前缀
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   npm install -g codingbuddy-claude-plugin
   ```

2. **网络错误**
   ```bash
   # 检查 npm 仓库
   npm config get registry
   # 应该是 https://registry.npmjs.org/

   # 尝试详细日志
   npm install -g codingbuddy-claude-plugin --verbose
   ```

3. **Node 版本过旧**
   ```bash
   node --version
   # 需要 Node.js 18+
   # 如需要请更新 Node.js
   ```

---

## 市场问题

### "Invalid marketplace schema" 错误

**症状**：执行 `claude marketplace add` 时出现以下错误：
```
✘ Failed to add marketplace: Invalid marketplace schema from URL: : Invalid input: expected object, received string
```

**原因**：使用了 URL 格式而不是 GitHub 仓库格式。

**解决方法**：
```bash
# 错误（URL 格式 - 已弃用）
claude marketplace add https://jeremydev87.github.io/codingbuddy

# 正确（GitHub 仓库格式）
claude marketplace add JeremyDev87/codingbuddy
```

### 从 URL 格式迁移

如果您之前使用 URL 格式添加了市场：

```bash
# 1. 删除旧市场
claude marketplace remove https://jeremydev87.github.io/codingbuddy

# 2. 使用正确格式添加
claude marketplace add JeremyDev87/codingbuddy

# 3. 重新安装插件
claude plugin install codingbuddy@jeremydev87
```

### 找不到市场

**症状**：执行 `claude marketplace add JeremyDev87/codingbuddy` 时出现 "not found" 错误

**解决方法**：

1. **检查拼写和大小写**
   - GitHub 用户名：`JeremyDev87`（区分大小写）
   - 仓库：`codingbuddy`

2. **验证网络连接**
   ```bash
   curl -I https://github.com/JeremyDev87/codingbuddy
   ```

3. **更新 Claude Code**
   ```bash
   npm update -g @anthropic-ai/claude-code
   ```

---

## MCP 连接问题

### MCP 服务器无法连接

**症状**：工作流命令（PLAN、ACT、EVAL）无法正常激活，没有代理显示。

**诊断**：
```bash
# 检查 codingbuddy CLI 是否已安装
which codingbuddy
codingbuddy --version

# 检查 MCP 配置
cat ~/.claude/settings.json | grep -A5 codingbuddy
```

**解决方案**：

1. **安装 MCP 服务器**
   ```bash
   npm install -g codingbuddy
   ```

2. **添加 MCP 配置**

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

3. **重启 Claude Code**
   ```bash
   # 退出并重新启动
   claude
   ```

### MCP 工具不可用

**症状**：`/mcp` 命令未显示 CodingBuddy 工具。

**解决方案**：

1. **检查 MCP 服务器是否正在运行**
   ```bash
   # 在单独的终端中运行：
   codingbuddy
   # 应该启动且无错误
   ```

2. **验证 PATH 包含 codingbuddy**
   ```bash
   echo $PATH
   which codingbuddy
   # 如果未找到，添加到 PATH
   ```

3. **检查是否有冲突的 MCP 服务器**
   ```bash
   cat ~/.claude/settings.json
   # 确保没有 codingbuddy 的重复条目
   ```

### "Command not found: codingbuddy"

**症状**：MCP 尝试运行 `codingbuddy` 但未找到。

**解决方案**：

1. **将全局 npm bin 添加到 PATH**
   ```bash
   # 对于 npm
   export PATH="$(npm config get prefix)/bin:$PATH"

   # 对于 yarn
   export PATH="$(yarn global bin):$PATH"
   ```

2. **在 MCP 配置中使用绝对路径**
   ```json
   {
     "mcpServers": {
       "codingbuddy": {
         "command": "/usr/local/bin/codingbuddy",
         "args": []
       }
     }
   }
   ```

---

## 工作流问题

### PLAN/ACT/EVAL 关键词未被识别

**症状**：输入 "PLAN implement X" 不会触发工作流模式。

**解决方案**：

1. **检查关键词是否在消息开头**
   ```
   # 正确
   PLAN implement user login

   # 错误 - 关键词不在开头
   Can you PLAN implement user login
   ```

2. **使用大写或本地化关键词**
   ```
   PLAN ...
   계획 ...  （韩语）
   計画 ...  （日语）
   计划 ...  （中文）
   ```

3. **验证 MCP 已连接**
   - 输入 `/mcp` 查看可用工具
   - 应该显示 `parse_mode` 工具

### 上下文不持久化

**症状**：ACT 模式不记得 PLAN 决策。

**解决方案**：

1. **检查上下文文件是否存在**
   ```bash
   cat docs/codingbuddy/context.md
   ```

2. **确保 PLAN 正确完成**
   - PLAN 模式创建上下文文件
   - 如果中断，重新开始 PLAN

3. **检查文件权限**
   ```bash
   ls -la docs/codingbuddy/
   # 确保有写入权限
   ```

### AUTO 模式不停止

**症状**：AUTO 模式即使问题已修复仍继续迭代。

**解决方案**：

1. **检查迭代限制**
   - 默认为 5 次迭代
   - AUTO 在 Critical=0 且 High=0 时停止

2. **审查 EVAL 发现**
   - 某些问题可能是重复出现的
   - 解决根本原因，而非症状

3. **手动干预**
   - 输入任何消息以中断 AUTO
   - 审查发现，然后根据需要重新启动

---

## 性能问题

### 响应时间慢

**症状**：Claude 在工作流模式下响应时间很长。

**解决方案**：

1. **简化任务**
   - 将复杂任务分解为更小的块
   - 每次 PLAN 一个功能

2. **减少专家代理**
   - 在 `codingbuddy.config.js` 中配置更少的专家
   ```javascript
   module.exports = {
     specialists: ['security-specialist']  // 只保留必要的
   };
   ```

3. **检查上下文大小**
   - 大型上下文文件会减慢处理速度
   - 为新功能开始新的 PLAN

### Token 使用量高

**症状**：快速达到上下文限制。

**解决方案**：

1. **使用聚焦的提示**
   ```
   # 更好
   PLAN add email validation to registration

   # 效率较低
   PLAN review the entire auth module and add validation
   ```

2. **让上下文自然压缩**
   - Claude Code 自动摘要旧上下文
   - 不要手动重复之前的上下文

---

## 配置问题

### 项目配置未加载

**症状**：`codingbuddy.config.js` 设置未应用。

**解决方案**：

1. **检查文件位置**
   - 必须在项目根目录
   - 文件名必须是 `codingbuddy.config.js`

2. **验证语法**
   ```bash
   node -e "console.log(require('./codingbuddy.config.js'))"
   ```

3. **检查导出格式**
   ```javascript
   // 正确
   module.exports = { language: 'zh' };

   // 错误
   export default { language: 'zh' };
   ```

### 响应语言错误

**症状**：Claude 用错误的语言响应。

**解决方案**：

1. **在配置中设置语言**
   ```javascript
   // codingbuddy.config.js
   module.exports = {
     language: 'zh'  // 'en', 'ko', 'ja', 'zh', 'es'
   };
   ```

2. **使用环境变量**
   ```bash
   export CODINGBUDDY_LANGUAGE=zh
   ```

3. **使用本地化关键词**
   - 以中文开始：`计划 实现用户登录`
   - Claude 将用中文响应

---

## 调试模式

### 启用详细日志

用于详细调试：

```bash
# 使用调试输出运行 MCP 服务器
CODINGBUDDY_DEBUG=true codingbuddy
```

### 检查 MCP 通信

```bash
# 在 Claude Code 中检查 MCP 状态
/mcp

# 应该显示：
# - codingbuddy 服务器状态
# - 可用工具
# - 最后的错误（如果有）
```

### 查看上下文文档

```bash
# 检查持久化的上下文
cat docs/codingbuddy/context.md

# 查找：
# - 之前的 PLAN 决策
# - ACT 进度
# - EVAL 发现
```

---

## 获取帮助

### 报告问题

1. **GitHub Issues**：[github.com/JeremyDev87/codingbuddy/issues](https://github.com/JeremyDev87/codingbuddy/issues)

2. **报告中包含**：
   - Claude Code 版本（`claude --version`）
   - 插件版本（来自 plugin.json）
   - MCP 服务器版本（`codingbuddy --version`）
   - 重现步骤
   - 错误消息

### 查看文档

- [安装指南](./plugin-guide.md)
- [架构](./plugin-architecture.md)
- [常见问题](./plugin-faq.md)

---

## 快速诊断检查清单

```
[ ] 已安装 Node.js 18+
[ ] 已安装 Claude Code 1.0+
[ ] 插件在 `claude plugin list` 中可见
[ ] MCP 服务器已安装（`which codingbuddy`）
[ ] settings.json 中有 MCP 配置
[ ] 可以通过 `/mcp` 看到工具
[ ] PLAN 关键词触发模式
[ ] PLAN 后创建了上下文文件
```

---

<sub>🤖 本文档由AI辅助翻译。如有错误或改进建议，请在 [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues) 中反馈。</sub>
