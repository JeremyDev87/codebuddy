<p align="center">
  <a href="../philosophy.md">English</a> |
  <a href="../ko/philosophy.md">한국어</a> |
  <a href="../zh-CN/philosophy.md">中文</a> |
  <a href="../ja/philosophy.md">日本語</a> |
  <a href="philosophy.md">Español</a>
</p>

# Filosofía

Este documento explica la visión, las creencias fundamentales y los principios de diseño de Codingbuddy.

## Visión

**Equipo de Expertos IA para Tu Código**

Una sola IA no puede ser experta en todo. Cuando le pides a una IA que escriba código, obtienes una única perspectiva—sin revisión de seguridad, sin verificación de accesibilidad, sin validación de arquitectura. Solo una IA haciendo todo "aceptable" pero nada excelente.

Los equipos de desarrollo humanos tienen especialistas:
- **Arquitectos** que diseñan sistemas
- **Ingenieros de seguridad** que encuentran vulnerabilidades
- **Especialistas en QA** que detectan casos límite
- **Expertos en rendimiento** que optimizan cuellos de botella

**Codingbuddy trae el modelo de equipo especializado a la programación con IA.**

En lugar de que una sola IA intente hacerlo todo, Codingbuddy coordina 29 agentes especializados que colaboran para revisar, verificar y refinar tu código hasta que cumpla con los estándares profesionales.

## Creencias Fundamentales

### 1. Colaboración Multi-Agente

La calidad proviene de múltiples perspectivas. Nuestro sistema de agentes de 3 niveles asegura una cobertura completa:

| Nivel | Propósito | Ejemplos |
|-------|-----------|----------|
| **Agentes de Modo** | Orquestación de flujo de trabajo | plan-mode, act-mode, eval-mode |
| **Agentes Principales** | Implementación central | solution-architect, frontend-developer, backend-developer |
| **Agentes Especialistas** | Experiencia de dominio | security, accessibility, performance, test-strategy |

Cada agente aporta experiencia enfocada, y colaboran para lograr lo que ninguna IA sola podría.

### 2. Desarrollo Orientado a la Calidad

El ciclo PLAN → ACT → EVAL asegura calidad en cada paso:

```
PLAN: Diseñar antes de codificar (arquitectura, estrategia de tests)
  ↓
ACT: Implementar con TDD y estándares de calidad
  ↓
EVAL: Revisión multi-especialista (seguridad, rendimiento, accesibilidad)
  ↓
Iterar hasta: Critical=0 AND High=0
```

### 3. Criterios de Salida

Enviar solo cuando se cumplan los objetivos de calidad:

| Severidad | Debe Corregirse Antes de Enviar |
|-----------|--------------------------------|
| 🔴 Critical | Sí - Problemas inmediatos de seguridad/datos |
| 🟠 High | Sí - Problemas significativos |
| 🟡 Medium | Opcional - Deuda técnica |
| 🟢 Low | Opcional - Mejora |

### 4. Divulgación Progresiva

Comenzar simple, profundizar cuando sea necesario:

- **Inicio Rápido**: Funciona en 2 minutos con `npx codingbuddy init`
- **Modos de Flujo de Trabajo**: Desarrollo estructurado PLAN → ACT → EVAL
- **Agentes Especialistas**: Acceso bajo demanda a 29 expertos de dominio
- **Modo AUTO**: Iteración autónoma hasta alcanzar la calidad

### 5. Convención Sobre Configuración

Valores predeterminados sensatos que funcionan para la mayoría de los proyectos:

- Flujo de trabajo PLAN → ACT → EVAL
- Enfoque de desarrollo TDD primero
- Objetivo de cobertura de tests 90%+
- Principios SOLID y código limpio

Anular solo lo que necesites cambiar.

## Principios de Diseño

### Arquitectura de Agentes

```
┌─────────────────────────────────────────┐
│         Agentes de Modo (3)             │
│    plan-mode, act-mode, eval-mode       │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       Agentes Principales (12)          │
│  solution-architect, frontend-developer │
│  backend-developer, code-reviewer, ...  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│      Agentes Especialistas (15+)        │
│   security, accessibility, performance  │
│   test-strategy, event-architecture ... │
└─────────────────────────────────────────┘
```

### Separación de Responsabilidades

| Capa | Propósito | Formato |
|------|-----------|---------|
| **Reglas** | Qué hacer (flujo de trabajo, estándares de calidad) | Markdown |
| **Agentes** | Quién sabe qué (experiencia especializada) | JSON |
| **Adaptadores** | Cómo integrar (configuración específica de herramienta) | Markdown |

Esta separación permite:

- Que las reglas evolucionen independientemente del soporte de herramientas
- Nuevos agentes sin cambiar las reglas centrales
- Soporte de nuevas herramientas sin modificar reglas existentes

### Extensibilidad Sobre Complejidad

El sistema está diseñado para extenderse, no configurarse:

- Agregar nuevos agentes especialistas creando archivos JSON
- Soportar nuevas herramientas de IA escribiendo guías de adaptadores
- Incluir contexto específico del proyecto sin modificar reglas centrales

Las cosas simples deben ser simples. Las cosas complejas deben ser posibles.

## El Modelo de Flujo de Trabajo

Codingbuddy introduce un flujo de trabajo estructurado para el desarrollo asistido por IA:

### Modo PLAN (Predeterminado)

- Entender requisitos
- Diseñar enfoque de implementación
- Identificar riesgos y casos límite
- Sin cambios de código
- Activa: Arquitecto de Soluciones + especialistas relevantes

### Modo ACT

- Ejecutar el plan
- Seguir TDD: Red → Green → Refactor
- Hacer cambios incrementales y probados
- Activa: Desarrollador Principal + especialistas de calidad

### Modo EVAL

- Revisar calidad de implementación
- Evaluación multidimensional (seguridad, rendimiento, accesibilidad)
- Identificar mejoras con niveles de severidad
- Activa: Revisor de Código + especialistas en paralelo

### Modo AUTO

- Ciclo autónomo PLAN → ACT → EVAL
- Continúa hasta: Critical=0 AND High=0
- Salvaguarda de iteración máxima
- Mejor para características complejas que requieren refinamiento iterativo

Este flujo de trabajo previene el error común de los asistentes de IA de saltar directamente al código sin una planificación adecuada.

## Lo Que Lo Hace Diferente

| Programación IA Tradicional | Codingbuddy |
|---------------------------|-------------|
| Perspectiva de una sola IA | 29 perspectivas de agentes especialistas |
| "Generar y esperar" | Planificar → Implementar → Verificar |
| Sin puertas de calidad | Critical=0, High=0 requerido |
| Revisión manual necesaria | Revisión multidimensional automatizada |
| Calidad inconsistente | Refinamiento iterativo hasta cumplir estándares |

## Lo Que Codingbuddy No Es

- **No es un generador de código**: Proporciona estructura, experiencia y puertas de calidad—no código mágico
- **No es un reemplazo del juicio humano**: Aumenta la toma de decisiones del desarrollador con perspectivas de especialistas
- **No es una solución única para todo**: Está diseñado para ser personalizado por proyecto

## Lectura Adicional

- [Primeros Pasos](./getting-started.md) - Guía de configuración rápida
- [Herramientas Compatibles](./supported-tools.md) - Integración de herramientas IA
- [Reglas Centrales](../../packages/rules/.ai-rules/rules/core.md) - Detalles del flujo de trabajo
- [Sistema de Agentes](../../packages/rules/.ai-rules/agents/README.md) - Referencia completa de agentes
