<p align="center">
  <a href="../plugin-examples.md">English</a> |
  <a href="../ko/plugin-examples.md">한국어</a> |
  <a href="../zh-CN/plugin-examples.md">中文</a> |
  <a href="../ja/plugin-examples.md">日本語</a> |
  <a href="../es/plugin-examples.md">Español</a> |
  <a href="plugin-examples.md">Português</a>
</p>

# Exemplos de Uso do CodingBuddy

Exemplos do mundo real mostrando como usar o fluxo de trabalho PLAN/ACT/EVAL de forma eficaz.

## Exemplo 1: Implementar um Endpoint de API REST

### Cenario
Adicionar um novo endpoint para registro de usuarios com validação.

### Fase PLAN

```
Você: PLAN implement a POST /api/users endpoint for user registration with email validation
```

**Resposta do Claude:**
```markdown
# Mode: PLAN
## Agent: backend-developer [Primary Agent]

## 📋 Visão Geral do Plano
Implementar endpoint de registro de usuario com validação de email, hash de senha
e tratamento adequado de erros.

## ✅ Lista de Tarefas
- [ ] Definir tipos de Usuario e schema de validação
- [ ] Escrever testes que falham para o endpoint de registro
- [ ] Implementar handler de registro
- [ ] Adicionar utilitario de validação de email
- [ ] Adicionar hash de senha
- [ ] Escrever testes de integração

## 🎯 Passos de Implementação

### Lógica Central (Abordagem TDD)
1. Escrever teste: POST /api/users retorna 201 com dados válidos
2. Escrever teste: Retorna 400 com email inválido
3. Escrever teste: Retorna 400 com senha fraca
4. Implementar utilitarios de validação
5. Implementar handler de registro

### 🔒 Planejamento de Seguranca
- Hash de senha com bcrypt (fator de custo 12)
- Sanitização de entrada para prevenção de XSS
- Recomendação de raté limiting

## 📁 Estrutura de Arquivos
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**Próximo:** Digite `ACT` para executar
```

### Fase ACT

```
Você: ACT
```

**Resposta do Claude:**
```markdown
# Mode: ACT
## Agent: backend-developer [Primary Agent]

## 🚀 Progressó da Implementação

### Passo 1: Definir Tipos
✅ Tipos de usuario criados
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### Passo 2: Escrever Testes que Falham (Red)
✅ Arquivo de teste criado
- `src/entities/user/__tests__/user.api.test.ts`
- Teste: "returns 201 on valid registration" - FALHOU ❌

### Passo 3: Implementar Validação (Green)
✅ Utilitario de validação criado
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### Passo 4: Implementar Handler (Green)
✅ Endpoint de registro criado
- `src/entities/user/user.api.ts`: handler registerUser
- Testes agora passando ✅

### Passo 5: Refatorar
✅ Helper de resposta de erro extraido
✅ Comentarios JSDoc adicionados

## ✅ Verificações de Qualidade
- ✅ Seguranca de Tipos: Todos os tipos explicitos
- ✅ Testes: 4/4 passando (cobertura: 94%)
- ✅ Seguranca: Senha com hash usando bcrypt

**Próximo:** Digite `EVAL` para avaliação de qualidade ou continue com `PLAN`
```

### Fase EVAL (Opcional)

```
Você: EVAL
```

**Resposta do Claude:**
```markdown
# Mode: EVAL
## Agent: code-reviewer [Primary Agent]

## 📊 Avaliação de Qualidade do Código

### Análise de Seguranca 🔒
| Verificação | Status | Notas |
|-------------|--------|-------|
| Hash de senha | ✅ Passou | bcrypt com custo 12 |
| Validação de entrada | ✅ Passou | Regex de email, regras de senha |
| SQL injection | ✅ Passou | Usando queries parametrizadas |
| Raté limiting | ⚠️ Medio | Não implementado |

### Qualidade de Código 📏
| Metrica | Valor | Meta |
|---------|-------|------|
| Cobertura de testes | 94% | 90%+ ✅ |
| Complexidade | Baixa | Aceitavel ✅ |
| Seguranca de tipos | 100% | 100% ✅ |

### Recomendações
1. **Medio**: Adicionar raté limiting para prevenir forca bruta
2. **Baixo**: Considerar adicionar fluxo de verificação de email

## 🔄 Plano Melhorado
Se quiser abordar os achados:
- Adicionar middleware de raté limiting
- Implementar token de verificação de email
```

---

## Exemplo 2: Debugar um Teste que Falha

### Cenario
Um teste esta falhando intermitentemente e você precisa debugar.

### Fase PLAN

```
Você: PLAN debug the flaky test in UserProfile.test.tsx that fails randomly
```

**Resposta do Claude:**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [Primary Agent]

## 📋 Visão Geral do Plano
Investigar e corrigir teste instavel no componente UserProfile.

## 🔍 Estrategia de Debug
1. Identificar arquivo de teste e asserção que falha
2. Verificar problemas de timing assincrono
3. Procurar estado compartilhado entre testes
4. Verificar limpeza de mocks
5. Adicionar asserções waitFor adequadas

## 🎯 Passos de Investigação
1. Ler arquivo de teste e identificar padrão de falha
2. Verificar await ou wrappers act() faltando
3. Verificar limpeza beforeEach/afterEach
4. Adicionar waitFor explicito para operações assincronas

**Próximo:** Digite `ACT` para iniciar debug
```

### Fase ACT

```
Você: ACT
```

**Resposta do Claude:**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [Primary Agent]

## 🚀 Progressó do Debug

### Passo 1: Analisar Teste
✅ Problema encontrado em `UserProfile.test.tsx:45`
- `await` faltando em render assincrono
- Atualização de estado acontecendo após asserção

### Passo 2: Aplicar Correção
✅ Teste modificado
```tsx
// Antes (instavel)
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// Depois (estavel)
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Passo 3: Verificar Correção
✅ Teste executado 50 vezes - 0 falhas

## ✅ Causa Raiz
Fetch de dados assincrono completava após asserção. Corrigido com `waitFor` adequado.
```

---

## Exemplo 3: Desenvolvimento Autonomo de Funcionalidade

### Cenario
Implementar uma funcionalidade completa com controle de qualidade autonomo.

### Modo AUTO

```
Você: AUTO implement a dark mode toggle with localStorage persistence
```

**Resposta do Claude:**
```markdown
# Mode: AUTO (Iteráção 1/5)
## Agent: frontend-developer [Primary Agent]

## 📋 Fase PLAN
- Criar provider ThemeContext
- Implementar componente de toggle
- Adicionar persistência com localStorage
- Estilizar variantes de modo escuro

## 🚀 Fase ACT
✅ ThemeContext criado com modos dark/light
✅ Componente DarkModeToggle implementado
✅ Sincronização com localStorage em mount/change adicionada
✅ CSS global atualizado com variaveis de modo escuro

## 📊 Fase EVAL
| Problema | Severidade | Status |
|----------|------------|--------|
| Acessibilidade de teclado faltando | Alta | Encontrado |
| Sem detecção de preferência do sistema | Media | Encontrado |
| Cobertura de testes em 78% | Media | Encontrado |

---

# Mode: AUTO (Iteráção 2/5)

## 📋 Fase PLAN
Abordar problemas Alta e Media da Iteráção 1

## 🚀 Fase ACT
✅ Suporte a teclado adicionado (Enter/Space toggle)
✅ Detecção de prefers-color-scheme adicionada
✅ Testes faltando adicionados (cobertura agora 92%)

## 📊 Fase EVAL
| Problema | Severidade | Status |
|----------|------------|--------|
| Todos os problemas anteriores | - | ✅ Resolvidos |

---

# Mode: AUTO - Completo ✅

## Resumo
- **Iteráções**: 2
- **Problemas Críticos**: 0
- **Problemas Altos**: 0
- **Cobertura**: 92%

## Arquivos Criados/Modificados
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css (variaveis de modo escuro)
- tests/ThemeContext.test.tsx
```

---

## Exemplo 4: Auditoria de Seguranca

### Cenario
Auditar código de autenticação existente para problemas de seguranca.

### Fase PLAN

```
Você: PLAN security audit the authentication module in src/auth/
```

**Resposta do Claude:**
```markdown
# Mode: PLAN
## Agent: security-specialist [Primary Agent]

## 📋 Escopo da Auditoria
Revisão de seguranca do módulo de autenticação focando em:
- Tratamento de tokens (JWT)
- Armazenamento de senhas
- Gerenciamento de sessão
- Validação de entrada
- Conformidade OWASP Top 10

## 🔍 Checklist de Auditoria
- [ ] Forca e rotação do segredo JWT
- [ ] Expiração de token e lógica de refresh
- [ ] Algoritmo e parametros de hash de senha
- [ ] Proteção contra forca bruta
- [ ] Prevenção de XSS em respostas de auth
- [ ] Proteção CSRF em endpoints de auth
- [ ] Configurações seguras de cookies
- [ ] Raté limiting

**Próximo:** Digite `ACT` para realizar auditoria
```

### Fase ACT

```
Você: ACT
```

**Resposta do Claude:**
```markdown
# Mode: ACT
## Agent: security-specialist [Primary Agent]

## 🔍 Achados da Auditoria de Seguranca

### Problemas Críticos 🔴
| Problema | Localização | Risco |
|----------|-------------|-------|
| Segredo JWT no código | auth.config.ts:5 | Exposição de segredo |
| Sem expiração de token | jwt.utils.ts:12 | Sequestro de sessão |

### Problemas Altos 🟠
| Problema | Localização | Risco |
|----------|-------------|-------|
| Politica de senha fraca | validation.ts:8 | Forca bruta |
| Raté limit faltando | login.handler.ts | Enumeração de conta |

### Problemas Medios 🟡
| Problema | Localização | Risco |
|----------|-------------|-------|
| Cookie sem flag Secure | session.ts:22 | MITM |
| Mensagens de erro verbosas | error.handler.ts | Vazamento de info |

## 📋 Plano de Remediação
1. Mover segredo JWT para variavel de ambiente
2. Adicionar expiração de token (15 min access, 7 dias refresh)
3. Implementar raté limiting (5 tentativas/min)
4. Adicionar flags Secure, HttpOnly, SameSite aos cookies

**Próximo:** Digite `ACT` para implementar correções ou `PLAN` para remediação detalhada
```

---

## Exemplo 5: Gerar Checklist de Dominio

### Usando o Comando /checklist

```
Você: /checklist security accessibility
```

**Resposta do Claude:**
```markdown
## 🔒 Checklist de Seguranca

### Autenticação
- [ ] Senhas com hash usando bcrypt/argon2
- [ ] Tokens JWT com expiração
- [ ] Rotação de refresh token implementada
- [ ] Invalidação de sessão no logout

### Validação de Entrada
- [ ] Toda entrada de usuario sanitizada
- [ ] Prevenção de SQL injection (queries parametrizadas)
- [ ] Prevenção de XSS (encoding de saida)
- [ ] Restrições de upload de arquivos

### Autorização
- [ ] Controle de acesso baseado em roles
- [ ] Verificação de propriedade de recursos
- [ ] Raté limiting de API

---

## ♿ Checklist de Acessibilidade

### Navegação por Teclado
- [ ] Todos elementos interátivos focaveis
- [ ] Indicadores de foco visiveis
- [ ] Links de pular para navegação
- [ ] Sem armadilhas de teclado

### Leitores de Tela
- [ ] Estrutura HTML semântica
- [ ] Labels ARIA em controles customizados
- [ ] Texto alt em imagens
- [ ] Labels de formulario associados a inputs

### Visual
- [ ] Contraste de cor mínimo 4.5:1
- [ ] Texto redimensionavel até 200%
- [ ] Nenhum conteúdo dependente apenas de cor
```

---

## Dicas para Uso Eficaz

### 1. Sejá Especifico no PLAN
```
# Bom
PLAN implement pagination for user list with 20 items per page

# Menos eficaz
PLAN add pagination
```

### 2. Use EVAL para Portoes de Qualidade
Solicite EVAL antes de fazer merge para garantir:
- Problemas de seguranca identificados
- Acessibilidade verificada
- Cobertura de testes atinge padrões

### 3. Aproveite AUTO para Funcionalidades Complexas
O modo AUTO e ideal para:
- Funcionalidades com multiplos arquivos
- Funcionalidades que requerem multiplas iteráções
- Quando a barra de qualidade e alta

### 4. Use Especialistas para Revisoes Profundas
Mencione dominios específicos para análise focada:
```
PLAN security review the payment processing module
EVAL with focus on accessibility
```

## Vejá Também

- [Referência Rapida](./plugin-quick-reference.md) - Comandos em um relance
- [Arquitetura](./plugin-architecture.md) - Como funciona
- [Solução de Problemas](./plugin-troubleshooting.md) - Problemas comuns
- [FAQ](./plugin-faq.md) - Perguntas frequentes

---

<sub>🤖 Este documento foi traduzido com assistência de IA. Se encontrar erros ou tiver sugestões de melhoria, por favor reporte em [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
