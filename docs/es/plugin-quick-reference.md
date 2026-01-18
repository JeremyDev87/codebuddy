<p align="center">
  <a href="../plugin-quick-reference.md">English</a> |
  <a href="../ko/plugin-quick-reference.md">한국어</a> |
  <a href="../zh-CN/plugin-quick-reference.md">中文</a> |
  <a href="../ja/plugin-quick-reference.md">日本語</a> |
  <a href="plugin-quick-reference.md">Español</a> |
  <a href="../pt-BR/plugin-quick-reference.md">Português</a>
</p>

# Tarjeta de Referencia Rápida de CodingBuddy

Una referencia rápida para comandos, modos y flujos de trabajo comunes.

## Modos de Flujo de Trabajo

| Modo | Activador | Propósito |
|------|-----------|-----------|
| **PLAN** | `PLAN <tarea>` | Diseñar el enfoque de implementación con TDD |
| **ACT** | `ACT` | Ejecutar el plan, realizar cambios |
| **EVAL** | `EVAL` | Evaluar calidad, sugerir mejoras |
| **AUTO** | `AUTO <tarea>` | Ciclo autónomo hasta alcanzar calidad |

### Flujo de Modos

```
┌─────────────────────────────────────────────────────────────┐
│                      Flujo Por Defecto                       │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──(usuario: ACT)──> ACT ──(auto)──> PLAN              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Flujo de Evaluación                       │
├─────────────────────────────────────────────────────────────┤
│  PLAN ──> ACT ──> PLAN ──(usuario: EVAL)──> EVAL ──> PLAN   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Flujo Autónomo                           │
├─────────────────────────────────────────────────────────────┤
│  AUTO ──> [PLAN ──> ACT ──> EVAL] ──(repetir)──> Listo      │
│           └── hasta que Critical=0 AND High=0 ──┘           │
└─────────────────────────────────────────────────────────────┘
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/plan` | Entrar en modo PLAN |
| `/act` | Entrar en modo ACT |
| `/eval` | Entrar en modo EVAL |
| `/auto` | Entrar en modo AUTO |
| `/checklist` | Generar lista de verificación contextual |

### Palabras Clave Localizadas

| Inglés | Coreano | Japonés | Chino | Español |
|--------|---------|---------|-------|---------|
| PLAN | 계획 | 計画 | 计划 | PLANIFICAR |
| ACT | 실행 | 実行 | 执行 | ACTUAR |
| EVAL | 평가 | 評価 | 评估 | EVALUAR |
| AUTO | 자동 | 自動 | 自动 | AUTOMÁTICO |

## Agentes Especialistas

### Especialistas de Planificación
| Agente | Enfoque |
|--------|---------|
| 🏛️ architecture-specialist | Diseño de sistemas, ubicación de capas |
| 🧪 test-strategy-specialist | Enfoque TDD, objetivos de cobertura |
| 📨 event-architecture-specialist | Colas de mensajes, sagas, tiempo real |
| 🔗 integration-specialist | Integración API, servicios externos |
| 📊 observability-specialist | Registro, monitoreo, trazabilidad |
| 🔄 migration-specialist | Migración de datos, versionado |

### Especialistas de Implementación
| Agente | Enfoque |
|--------|---------|
| 📏 code-quality-specialist | SOLID, DRY, complejidad |
| ⚡ performance-specialist | Tamaño del paquete, optimización |
| 🔒 security-specialist | Autenticación, validación de entrada, XSS |
| ♿ accessibility-specialist | WCAG 2.1, ARIA, teclado |
| 🔍 seo-specialist | Metadatos, datos estructurados |
| 🎨 ui-ux-designer | Jerarquía visual, patrones UX |

### Agentes Desarrolladores
| Agente | Enfoque |
|--------|---------|
| 🖥️ frontend-developer | Componentes UI, gestión de estado |
| ⚙️ backend-developer | APIs, base de datos, autenticación |
| 🔧 devops-engineer | CI/CD, infraestructura |
| 📱 mobile-developer | Desarrollo de aplicaciones móviles |

## Flujos de Trabajo Comunes

### 1. Implementar una Nueva Funcionalidad

```
Usted: PLAN implement user authentication with JWT

Claude: [Crea un plan estructurado con enfoque TDD]

Usted: ACT

Claude: [Implementa siguiendo Red-Green-Refactor]

Usted: EVAL  (opcional)

Claude: [Revisa calidad del código, seguridad, sugiere mejoras]
```

### 2. Corregir un Error

```
Usted: PLAN fix the login timeout issue in auth module

Claude: [Analiza el problema, crea plan de depuración]

Usted: ACT

Claude: [Implementa la corrección con pruebas]
```

### 3. Desarrollo Autónomo

```
Usted: AUTO implement a complete REST API for user management

Claude: [Cicla PLAN→ACT→EVAL hasta que Critical=0, High=0]
```

### 4. Generar Lista de Verificación

```
Usted: /checklist security performance

Claude: [Genera listas de verificación de seguridad y rendimiento]
```

## Estándares de Calidad

### Objetivos de Cobertura
- **Lógica Central**: 90%+ de cobertura de pruebas
- **Componentes UI**: Interacciones clave probadas

### Ciclo TDD
```
RED ──> GREEN ──> REFACTOR
 │         │          │
 │         │          └── Mejorar estructura
 │         └── Código mínimo para pasar
 └── Escribir prueba que falle
```

### Calidad de Código
- Sin tipos `any` (TypeScript estricto)
- Separación de funciones puras/impuras
- Principios SOLID
- DRY (No Te Repitas)

## Gestión de Contexto

### Persistencia de Sesión
El contexto se almacena en `docs/codingbuddy/context.md`:
- Sobrevive a la compactación de conversación
- Rastrea decisiones entre modos
- Preserva agentes recomendados

### Comandos de Contexto
| Acción | Cómo |
|--------|------|
| Ver contexto | Leer `docs/codingbuddy/context.md` |
| Reiniciar contexto | Iniciar nuevo modo PLAN |
| Actualizar contexto | Automático al completar modo |

## Herramientas MCP

| Herramienta | Propósito |
|-------------|-----------|
| `parse_mode` | Analizar modo de flujo de trabajo del prompt |
| `get_agent_details` | Obtener información del agente especialista |
| `generate_checklist` | Generar listas de verificación específicas por dominio |
| `read_context` | Leer documento de contexto actual |
| `update_context` | Actualizar contexto con progreso |
| `get_project_config` | Obtener configuración del proyecto |

## Consejos Rápidos

1. **Comience con PLAN** - Siempre planifique antes de implementar
2. **Use AUTO para funcionalidades complejas** - Deje que el ciclo se ejecute hasta alcanzar calidad
3. **Solicite EVAL después de ACT** - Obtenga evaluación de calidad antes de fusionar
4. **Revise el contexto** - Lea `context.md` para ver decisiones anteriores
5. **Use especialistas** - Detectan problemas específicos de su dominio

## Ver También

- [Guía de Instalación](./plugin-guide.md) - Configuración e instalación
- [Arquitectura](./plugin-architecture.md) - Cómo funciona
- [Ejemplos](./plugin-examples.md) - Flujos de trabajo del mundo real
- [Resolución de Problemas](./plugin-troubleshooting.md) - Problemas comunes
- [Preguntas Frecuentes](./plugin-faq.md) - Preguntas frecuentes

---

<sub>🤖 Este documento fue traducido con asistencia de IA. Si encuentras errores o sugerencias de mejora, por favor repórtalos en [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
