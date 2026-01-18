<p align="center">
  <a href="../plugin-quick-reference.md">English</a> |
  <a href="../ko/plugin-quick-reference.md">한국어</a> |
  <a href="../zh-CN/plugin-quick-reference.md">中文</a> |
  <a href="../ja/plugin-quick-reference.md">日本語</a> |
  <a href="../es/plugin-quick-reference.md">Español</a> |
  <a href="plugin-quick-reference.md">Português</a>
</p>

# Cartao de Referência Rapida do CodingBuddy

Uma referência rapida para comandos, modos e fluxos de trabalho comuns.

## Modos de Fluxo de Trabalho

| Modo | Gatilho | Proposito |
|------|---------|-----------|
| **PLAN** | `PLAN <tarefa>` | Projetar abordagem de implementação com TDD |
| **ACT** | `ACT` | Executar o plano, fazer alteráções |
| **EVAL** | `EVAL` | Avaliar qualidade, sugerir melhorias |
| **AUTO** | `AUTO <tarefa>` | Ciclo autonomo até atingir qualidade |

### Fluxo de Modos

```
┌─────────────────────────────────────────────────────────────┐
│                      Fluxo Padrão                           │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(usuario: ACT)──> ACT ──(auto)──> PLAN              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Fluxo de Avaliação                       │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(usuario: EVAL)──> EVAL ──> PLAN   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Fluxo Autonomo                           │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(repetir)──> Concluido  │
│           └── até Critical=0 E High=0 ──┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Comandos

| Comando | Descrição |
|---------|-----------|
| `/plan` | Entrar no modo PLAN |
| `/act` | Entrar no modo ACT |
| `/eval` | Entrar no modo EVAL |
| `/auto` | Entrar no modo AUTO |
| `/checklist` | Gerar checklist contextual |

### Palavras-chave Localizadas

| Ingles | Coreano | Japones | Chines | Espanhol |
|--------|---------|---------|--------|----------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMATICO |

## Agentes Especialistas

### Especialistas de Planejamento
| Agente | Foco |
|--------|------|
| 🏛️ architecture-specialist | Design de sistema, posicionamento de camadas |
| 🧪 test-strategy-specialist | Abordagem TDD, metas de cobertura |
| 📨 event-architecture-specialist | Filas de mensagens, sagas, tempo real |
| 🔗 integration-specialist | Integração de API, serviços externos |
| 📊 observability-specialist | Logging, monitoramento, rastreamento |
| 🔄 migration-specialist | Migração de dados, versionamento |

### Especialistas de Implementação
| Agente | Foco |
|--------|------|
| 📏 code-quality-specialist | SOLID, DRY, complexidade |
| ⚡ performance-specialist | Tamanho do bundle, otimização |
| 🔒 security-specialist | Auth, validação de entrada, XSS |
| ♿ accessibility-specialist | WCAG 2.1, ARIA, teclado |
| 🔍 seo-specialist | Metadados, dados estruturados |
| 🎨 ui-ux-designer | Hierarquia visual, padrões UX |

### Agentes Desenvolvedores
| Agente | Foco |
|--------|------|
| 🖥️ frontend-developer | Componentes UI, gerênciamento de estado |
| ⚙️ backend-developer | APIs, banco de dados, auth |
| 🔧 devops-engineer | CI/CD, infraestrutura |
| 📱 mobile-developer | Desenvolvimento de apps moveis |

## Fluxos de Trabalho Comuns

### 1. Implementar uma Nova Funcionalidade

```
Você: PLAN implement user authentication with JWT

Claude: [Cria plano estruturado com abordagem TDD]

Você: ACT

Claude: [Implementa seguindo Red-Green-Refactor]

Você: EVAL  (opcional)

Claude: [Revisa qualidade do código, seguranca, sugere melhorias]
```

### 2. Corrigir um Bug

```
Você: PLAN fix the login timeout issue in auth module

Claude: [Analisa o problema, cria plano de debug]

Você: ACT

Claude: [Implementa correção com testes]
```

### 3. Desenvolvimento Autonomo

```
Você: AUTO implement a complete REST API for user management

Claude: [Cicla PLAN→ACT→EVAL até Critical=0, High=0]
```

### 4. Gerar Checklist

```
Você: /checklist security performance

Claude: [Gera checklists de seguranca e performance]
```

## Padroes de Qualidade

### Metas de Cobertura
- **Lógica Central**: 90%+ de cobertura de testes
- **Componentes UI**: Interações principais testadas

### Ciclo TDD
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── Melhorar estrutura
 │         └── Código mínimo para passar
 └── Escrever teste que falha
```

### Qualidade de Código
- Sem tipos `any` (TypeScript strict)
- Separação de funções puras/impuras
- Principios SOLID
- DRY (Não Se Repita)

## Gerenciamento de Contexto

### Persistência de Sessão
O contexto e armazenado em `docs/codingbuddy/context.md`:
- Sobrevive a compactação de conversação
- Rastreia decisões entre modos
- Preserva agentes recomendados

### Comandos de Contexto
| Ação | Como |
|------|------|
| Ver contexto | Ler `docs/codingbuddy/context.md` |
| Resetar contexto | Iniciar novo modo PLAN |
| Atualizar contexto | Automático ao completar modo |

## Ferramentas MCP

| Ferramenta | Proposito |
|------------|-----------|
| `parse_mode` | Analisar modo de fluxo de trabalho do prompt |
| `get_agent_details` | Obter info do agente especialista |
| `generate_checklist` | Gerar checklists específicos de dominio |
| `read_context` | Ler documento de contexto atual |
| `update_context` | Atualizar contexto com progressó |
| `get_project_config` | Obter configuração do projeto |

## Dicas Rapidas

1. **Comece com PLAN** - Sempre planeje antes de implementar
2. **Use AUTO para funcionalidades complexas** - Deixe o ciclo rodar até atingir qualidade
3. **Solicite EVAL após ACT** - Obtenha avaliação de qualidade antes de fazer merge
4. **Verifique o contexto** - Leia `context.md` para ver decisões anteriores
5. **Use éspecialistas** - Eles identificam problemas específicos de seus dominios

## Vejá Também

- [Guia de Instalação](./plugin-guide.md) - Configuração e instalação
- [Arquitetura](./plugin-architecture.md) - Como funciona
- [Exemplos](./plugin-examples.md) - Fluxos de trabalho reais
- [Solução de Problemas](./plugin-troubleshooting.md) - Problemas comuns
- [FAQ](./plugin-faq.md) - Perguntas frequentes

---

<sub>🤖 Este documento foi traduzido com assistência de IA. Se encontrar erros ou tiver sugestões de melhoria, por favor reporte em [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
