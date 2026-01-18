<p align="center">
  <a href="../plugin-faq.md">English</a> |
  <a href="../ko/plugin-faq.md">한국어</a> |
  <a href="../zh-CN/plugin-faq.md">中文</a> |
  <a href="../ja/plugin-faq.md">日本語</a> |
  <a href="plugin-faq.md">Español</a> |
  <a href="../pt-BR/plugin-faq.md">Português</a>
</p>

# Preguntas Frecuentes de CodingBuddy

Preguntas frecuentes sobre el Plugin de CodingBuddy para Claude Code.

## Preguntas Generales

### ¿Qué es CodingBuddy?

CodingBuddy es un sistema Multi-AI Rules que proporciona prácticas de codificación consistentes entre asistentes de IA. Incluye:

- **Modos de Flujo de Trabajo**: PLAN/ACT/EVAL/AUTO para desarrollo estructurado
- **Agentes Especialistas**: Más de 12 expertos en dominios (seguridad, rendimiento, accesibilidad, etc.)
- **Habilidades**: Flujos de trabajo reutilizables (TDD, depuración, diseño de API, etc.)
- **Listas de Verificación**: Verificaciones de calidad específicas por dominio

### ¿Es necesario el plugin?

**No**, pero es recomendado. Puede usar CodingBuddy de dos formas:

1. **Plugin + Servidor MCP** (recomendado): Integración completa con Claude Code
2. **Solo Servidor MCP**: Configuración manual, misma funcionalidad

El plugin proporciona:
- Documentación automática de comandos
- Configuración más fácil
- Mejor integración con Claude Code

### ¿Cuál es la diferencia entre el Plugin y el Servidor MCP?

| Componente | Propósito |
|------------|-----------|
| **Plugin** | Punto de entrada para Claude Code (manifiesto + configuración) |
| **Servidor MCP** | Funcionalidad real (herramientas, agentes, habilidades) |

El plugin es un envoltorio ligero que le dice a Claude Code cómo conectarse al servidor MCP.

### ¿Funciona con otras herramientas de IA?

¡Sí! CodingBuddy soporta múltiples asistentes de IA:

- **Claude Code**: Soporte completo de plugin
- **Cursor**: Mediante configuración `.cursor/rules/`
- **GitHub Copilot**: Mediante configuración `.codex/`
- **Amazon Q**: Mediante configuración `.q/`
- **Kiro**: Mediante configuración `.kiro/`

Todas las herramientas comparten las mismas reglas de `packages/rules/.ai-rules/`.

---

## Preguntas de Instalación

### ¿Cómo instalo el plugin?

```bash
# Método más fácil
claude plugin add codingbuddy

# Luego instale el servidor MCP
npm install -g codingbuddy
```

Consulte la [Guía de Instalación](./plugin-guide.md) para instrucciones detalladas.

### ¿Necesito instalar tanto el plugin como el servidor MCP?

**Sí**, para funcionalidad completa:

- **Plugin**: Requerido para integración con Claude Code
- **Servidor MCP**: Requerido para herramientas y agentes

El plugin sin el servidor MCP tendrá funcionalidad limitada.

### ¿Cómo actualizo el plugin?

```bash
# Actualizar plugin
claude plugin update codingbuddy

# Actualizar servidor MCP
npm update -g codingbuddy
```

### ¿Puedo usarlo sin instalación global de npm?

Sí, use npx:

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

## Preguntas de Flujo de Trabajo

### ¿Cuál es la diferencia entre PLAN y AUTO?

| Modo | Control | Iteraciones | Cuándo Usar |
|------|---------|-------------|-------------|
| **PLAN** | Manual | 1 | Cuando desea revisar antes de actuar |
| **AUTO** | Autónomo | Hasta alcanzar calidad | Para funcionalidades completas con puertas de calidad |

**PLAN** → Usted revisa → **ACT** → Usted revisa → **EVAL** (opcional)

**AUTO** → Cicla PLAN→ACT→EVAL hasta que Critical=0, High=0

### ¿Cuándo debo usar EVAL?

Use EVAL cuando desee:
- Auditoría de seguridad antes de fusionar
- Revisión de accesibilidad
- Análisis de rendimiento
- Evaluación de calidad del código

EVAL es **opcional** - úselo solo cuando necesite evaluación de calidad.

### ¿Puedo cambiar de modo a mitad del flujo de trabajo?

Sí, cualquier modo puede activarse en cualquier momento:

```
PLAN implement feature   → Crea plan
ACT                      → Ejecuta plan
PLAN refine approach     → Crea nuevo plan (reinicia contexto)
ACT                      → Ejecuta nuevo plan
EVAL                     → Revisa implementación
```

### ¿Cómo funciona la persistencia del contexto?

El contexto se guarda en `docs/codingbuddy/context.md`:

- **PLAN**: Reinicia el contexto, crea nuevo archivo
- **ACT**: Lee contexto de PLAN, agrega progreso
- **EVAL**: Lee todo el contexto, agrega hallazgos

Esto sobrevive a la compactación de conversación, así que ACT puede acceder a las decisiones de PLAN incluso si los mensajes anteriores se resumen.

### ¿Cuáles son las palabras clave localizadas?

| Inglés | Coreano | Japonés | Chino | Español |
|--------|---------|---------|-------|---------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMÁTICO |

---

## Preguntas sobre Agentes Especialistas

### ¿Qué agentes especialistas están disponibles?

**Especialistas de Planificación**:
- 🏛️ architecture-specialist
- 🧪 test-strategy-specialist
- 📨 event-architecture-specialist
- 🔗 integration-specialist
- 📊 observability-specialist
- 🔄 migration-specialist

**Especialistas de Implementación**:
- 📏 code-quality-specialist
- ⚡ performance-specialist
- 🔒 security-specialist
- ♿ accessibility-specialist
- 🔍 seo-specialist
- 🎨 ui-ux-designer

**Agentes Desarrolladores**:
- 🖥️ frontend-developer
- ⚙️ backend-developer
- 🔧 devops-engineer
- 📱 mobile-developer

### ¿Cómo se seleccionan los agentes?

Los agentes se seleccionan basándose en:

1. **Contexto de la tarea**: Palabras clave en su prompt
2. **Modo**: Diferentes agentes para PLAN vs ACT vs EVAL
3. **Configuración**: Agentes personalizados en `codingbuddy.config.js`

### ¿Puedo usar múltiples agentes?

Sí, los especialistas se ejecutan en paralelo durante el modo EVAL:

```
EVAL with security and accessibility focus
```

Esto activa tanto security-specialist como accessibility-specialist.

### ¿Cómo veo los detalles de un agente?

Use la herramienta MCP:

```
/mcp call get_agent_details --agentName security-specialist
```

---

## Preguntas de Configuración

### ¿Cómo configuro el plugin?

Cree `codingbuddy.config.js` en la raíz de su proyecto:

```javascript
module.exports = {
  language: 'es',
  defaultMode: 'PLAN',
  specialists: [
    'security-specialist',
    'accessibility-specialist'
  ]
};
```

### ¿Qué opciones de configuración están disponibles?

| Opción | Tipo | Por Defecto | Descripción |
|--------|------|-------------|-------------|
| `language` | string | auto-detectar | Idioma de respuesta (en, ko, ja, zh, es) |
| `defaultMode` | string | PLAN | Modo de flujo de trabajo inicial |
| `specialists` | array | todos | Agentes especialistas habilitados |

### ¿Cómo cambio el idioma de respuesta?

Tres formas:

1. **Archivo de configuración**:
   ```javascript
   module.exports = { language: 'es' };
   ```

2. **Variable de entorno**:
   ```bash
   export CODINGBUDDY_LANGUAGE=es
   ```

3. **Usar palabra clave localizada**:
   ```
   PLANIFICAR implementar login de usuario
   ```

---

## Preguntas de Resolución de Problemas

### ¿Por qué no funcionan los modos de flujo de trabajo?

Causas comunes:

1. Servidor MCP no instalado → `npm install -g codingbuddy`
2. MCP no configurado → Agregar a `~/.claude/settings.json`
3. Palabra clave no al inicio → Ponga PLAN/ACT/EVAL primero

Consulte la [Guía de Resolución de Problemas](./plugin-troubleshooting.md) para soluciones detalladas.

### ¿Por qué el contexto no persiste?

1. Verifique que existe `docs/codingbuddy/context.md`
2. El modo PLAN crea el archivo - siempre comience con PLAN
3. Verifique permisos de escritura en la carpeta docs

### ¿Cómo reinicio el contexto?

Inicie un nuevo PLAN:

```
PLAN start fresh implementation
```

El modo PLAN reinicia automáticamente el documento de contexto.

### ¿Dónde puedo reportar errores?

Issues de GitHub: [github.com/JeremyDev87/codingbuddy/issues](https://github.com/JeremyDev87/codingbuddy/issues)

Incluya:
- Números de versión (plugin, servidor MCP, Claude Code)
- Pasos para reproducir
- Mensajes de error

---

## Mejores Prácticas

### ¿Cuál es el flujo de trabajo recomendado?

1. **Comience con PLAN** - Siempre planifique antes de implementar
2. **Use prompts específicos** - "implement X" no "help with X"
3. **Revise antes de ACT** - Verifique que el plan tiene sentido
4. **EVAL antes de fusionar** - Obtenga evaluación de calidad
5. **Use AUTO para funcionalidades complejas** - Deje que el ciclo se ejecute

### ¿Cómo obtengo los mejores resultados?

1. **Sea específico**: "Add JWT auth with refresh tokens" no "add auth"
2. **Mencione preocupaciones**: "with focus on security" activa especialistas
3. **Divida tareas grandes**: Una funcionalidad por PLAN
4. **Revise hallazgos de EVAL**: Aborde problemas antes de fusionar

### ¿Cuándo debo usar TDD?

Use TDD (prueba primero) para:
- Lógica de negocio
- Utilidades y helpers
- Manejadores de API
- Transformaciones de datos

Use test-after para:
- Componentes UI
- Elementos visuales
- Layouts

---

## Ver También

- [Guía de Instalación](./plugin-guide.md)
- [Referencia Rápida](./plugin-quick-reference.md)
- [Arquitectura](./plugin-architecture.md)
- [Ejemplos](./plugin-examples.md)
- [Resolución de Problemas](./plugin-troubleshooting.md)

---

<sub>🤖 Este documento fue traducido con asistencia de IA. Si encuentras errores o sugerencias de mejora, por favor repórtalos en [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
