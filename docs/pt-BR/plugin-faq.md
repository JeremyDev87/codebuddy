<p align="center">
  <a href="../plugin-faq.md">English</a> |
  <a href="../ko/plugin-faq.md">한국어</a> |
  <a href="../zh-CN/plugin-faq.md">中文</a> |
  <a href="../ja/plugin-faq.md">日本語</a> |
  <a href="../es/plugin-faq.md">Español</a> |
  <a href="plugin-faq.md">Português</a>
</p>

# FAQ do CodingBuddy

Perguntas frequentes sobre o Plugin CodingBuddy para Claude Code.

## Perguntas Gerais

### O que é o CodingBuddy?

CodingBuddy e um sistema Multi-AI Rules que fornece práticas de codificação consistentes entre assistentes de IA. Ele inclui:

- **Modos de Fluxo de Trabalho**: PLAN/ACT/EVAL/AUTO para desenvolvimento estruturado
- **Agentes Especialistas**: 12+ especialistas de dominio (seguranca, performance, acessibilidade, etc.)
- **Habilidades**: Fluxos de trabalho reutilizaveis (TDD, debugging, design de API, etc.)
- **Checklists**: Verificações de qualidade especificas por dominio

### O plugin e obrigatório?

**Nao**, mas e recomendado. Você pode usar o CodingBuddy de duas formas:

1. **Plugin + Servidor MCP** (recomendado): Integração completa com Claude Code
2. **Apenas Servidor MCP**: Configuração manual, mesma funcionalidade

O plugin fornece:
- Documentação automatica de comandos
- Configuração mais facil
- Melhor integração com Claude Code

### Qual a diferenca entre Plugin e Servidor MCP?

| Componente | Proposito |
|------------|-----------|
| **Plugin** | Ponto de entrada para Claude Code (manifesto + config) |
| **Servidor MCP** | Funcionalidade real (ferramentas, agentes, habilidades) |

O plugin e um wrapper leve que diz ao Claude Code como se conectar ao servidor MCP.

### Funciona com outras ferramentas de IA?

Sim! O CodingBuddy suporta multiplos assistentes de IA:

- **Claude Code**: Suporte completo de plugin
- **Cursor**: Via configuração `.cursor/rules/`
- **GitHub Copilot**: Via configuração `.codex/`
- **Amazon Q**: Via configuração `.q/`
- **Kiro**: Via configuração `.kiro/`

Todas as ferramentas compartilham as mesmas regras de `packages/rules/.ai-rules/`.

---

## Perguntas de Instalação

### Como instalo o plugin?

```bash
# 1. Adicionar o marketplace
claude marketplace add https://jeremydev87.github.io/codingbuddy

# 2. Instalar o plugin
claude plugin install codingbuddy@jeremydev87

# 3. Instalar o servidor MCP
npm install -g codingbuddy
```

Vejá o [Guia de Instalação](./plugin-guide.md) para instruções detalhadas.

### Precisó instalar tanto o plugin quanto o servidor MCP?

**Sim**, para funcionalidade completa:

- **Plugin**: Necessário para integração com Claude Code
- **Servidor MCP**: Necessário para ferramentas e agentes

O plugin sem o servidor MCP terá funcionalidade limitada.

### Como atualizo o plugin?

```bash
# Atualizar plugin
claude plugin update codingbuddy

# Atualizar servidor MCP
npm update -g codingbuddy
```

### Possó usar sem instalação global do npm?

Sim, use npx:

```json
// .mcp.json
{
  "mcpServers": {
    "codingbuddy": {
      "command": "npx",
      "args": ["codingbuddy"]
    }
  }
}
```

---

## Perguntas sobre Fluxo de Trabalho

### Qual a diferenca entre PLAN e AUTO?

| Modo | Controle | Iteráções | Quando Usar |
|------|----------|-----------|-------------|
| **PLAN** | Manual | 1 | Quando quer revisar antes de agir |
| **AUTO** | Autonomo | Até qualidade atingida | Para funcionalidades completas com portoes de qualidade |

**PLAN** → Você revisa → **ACT** → Você revisa → **EVAL** (opcional)

**AUTO** → Cicla PLAN→ACT→EVAL até Critical=0, High=0

### Quando devo usar EVAL?

Use EVAL quando quiser:
- Auditoria de seguranca antes do merge
- Revisão de acessibilidade
- Análise de performance
- Avaliação de qualidade de código

EVAL e **opcional** - use apenas quando precisar de avaliação de qualidade.

### Possó trocar de modo no meio do fluxo?

Sim, qualquer modo pode ser acionado a qualquer momento:

```
PLAN implement feature   → Cria plano
ACT                      → Executa plano
PLAN refine approach     → Cria novo plano (reseta contexto)
ACT                      → Executa novo plano
EVAL                     → Revisa implementação
```

### Como funciona a persistência de contexto?

O contexto e salvo em `docs/codingbuddy/context.md`:

- **PLAN**: Reseta contexto, cria novo arquivo
- **ACT**: Le contexto do PLAN, adiciona progresso
- **EVAL**: Le todo contexto, adiciona achados

Isso sobrevive a compactação de conversação, então ACT pode acessar decisões do PLAN mesmo se mensagens antigas forem resumidas.

### Quais são as palavras-chave localizadas?

| Ingles | Coreano | Japones | Chines | Espanhol |
|--------|---------|---------|--------|----------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMATICO |

---

## Perguntas sobre Agentes Especialistas

### Quais agentes especialistas estão disponiveis?

**Especialistas de Planejamento**:
- 🏛️ architecture-specialist
- 🧪 test-strategy-specialist
- 📨 event-architecture-specialist
- 🔗 integration-specialist
- 📊 observability-specialist
- 🔄 migration-specialist

**Especialistas de Implementação**:
- 📏 code-quality-specialist
- ⚡ performance-specialist
- 🔒 security-specialist
- ♿ accessibility-specialist
- 🔍 seo-specialist
- 🎨 ui-ux-designer

**Agentes Desenvolvedores**:
- 🖥️ frontend-developer
- ⚙️ backend-developer
- 🔧 devops-engineer
- 📱 mobile-developer

### Como os agentes são selecionados?

Agentes são selecionados com base ém:

1. **Contexto da tarefa**: Palavras-chave no seu prompt
2. **Modo**: Diferentes agentes para PLAN vs ACT vs EVAL
3. **Configuração**: Agentes personalizados em `codingbuddy.config.js`

### Possó usar multiplos agentes?

Sim, especialistas rodam em paralelo durante o modo EVAL:

```
EVAL with security and accessibility focus
```

Isso ativa tanto security-specialist quanto accessibility-specialist.

### Como vejo detalhes do agente?

Use a ferramenta MCP:

```
/mcp call get_agent_details --agentName security-specialist
```

---

## Perguntas de Configuração

### Como configuro o plugin?

Crie `codingbuddy.config.js` na raiz do seu projeto:

```javascript
module.exports = {
  language: 'en',
  defaultMode: 'PLAN',
  specialists: [
    'security-specialist',
    'accessibility-specialist'
  ]
};
```

### Quais opções de configuração estão disponiveis?

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `language` | string | auto-detectar | Idioma das respostas (en, ko, ja, zh, es) |
| `defaultMode` | string | PLAN | Modo de fluxo de trabalho inicial |
| `specialists` | array | todos | Agentes especialistas habilitados |

### Como mudo o idioma das respostas?

Tres formas:

1. **Arquivo de configuração**:
   ```javascript
   module.exports = { language: 'ko' };
   ```

2. **Variavel de ambiente**:
   ```bash
   export CODINGBUDDY_LANGUAGE=ko
   ```

3. **Usar palavra-chave localizada**:
   ```
   계획 사용자 로그인 구현
   ```

---

## Perguntas de Solução de Problemas

### Por que os modos de fluxo de trabalho não funcionam?

Causas comuns:

1. Servidor MCP não instalado → `npm install -g codingbuddy`
2. MCP não configurado → Adicionar a `~/.claude/settings.json`
3. Palavra-chave não no início → Colocar PLAN/ACT/EVAL primeiro

Vejá o [Guia de Solução de Problemas](./plugin-troubleshooting.md) para soluções detalhadas.

### Por que o contexto não persiste?

1. Verificar se `docs/codingbuddy/context.md` existe
2. Modo PLAN cria o arquivo - sempre comece com PLAN
3. Verificar permissoes de escrita na pasta docs

### Como reseto o contexto?

Inicie um novo PLAN:

```
PLAN start fresh implementation
```

O modo PLAN automaticamente reseta o documento de contexto.

### Onde possó reportar bugs?

GitHub Issues: [github.com/JeremyDev87/codingbuddy/issues](https://github.com/JeremyDev87/codingbuddy/issues)

Inclua:
- Numeros de versão (plugin, servidor MCP, Claude Code)
- Passos para reproduzir
- Mensagens de erro

---

## Melhores Práticas

### Qual é o fluxo de trabalho recomendado?

1. **Comece com PLAN** - Sempre planeje antes de implementar
2. **Use prompts específicos** - "implement X" não "help with X"
3. **Revise antes do ACT** - Verifique se o plano faz sentido
4. **EVAL antes do merge** - Obtenha avaliação de qualidade
5. **Use AUTO para funcionalidades complexas** - Deixe o ciclo rodar

### Como obtenho os melhores resultados?

1. **Sejá específico**: "Add JWT auth with refresh tokens" não "add auth"
2. **Mencione preocupações**: "with focus on security" ativa especialistas
3. **Divida tarefas grandes**: Uma funcionalidade por PLAN
4. **Revise achados do EVAL**: Enderece problemas antes do merge

### Quando devo usar TDD?

Use TDD (test-first) para:
- Lógica de negocios
- Utilitarios e helpers
- Handlers de API
- Transformações de dados

Use test-after para:
- Componentes UI
- Elementos visuais
- Layouts

---

## Vejá Também

- [Guia de Instalação](./plugin-guide.md)
- [Referência Rapida](./plugin-quick-reference.md)
- [Arquitetura](./plugin-architecture.md)
- [Exemplos](./plugin-examples.md)
- [Solução de Problemas](./plugin-troubleshooting.md)

---

<sub>🤖 Este documento foi traduzido com assistência de IA. Se encontrar erros ou tiver sugestões de melhoria, por favor reporte em [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
