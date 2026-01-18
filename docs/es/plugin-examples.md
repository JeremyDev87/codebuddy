<p align="center">
  <a href="../plugin-examples.md">English</a> |
  <a href="../ko/plugin-examples.md">한국어</a> |
  <a href="../zh-CN/plugin-examples.md">中文</a> |
  <a href="../ja/plugin-examples.md">日本語</a> |
  <a href="plugin-examples.md">Español</a> |
  <a href="../pt-BR/plugin-examples.md">Português</a>
</p>

# Ejemplos de Uso de CodingBuddy

Ejemplos del mundo real que muestran cómo usar el flujo de trabajo PLAN/ACT/EVAL de manera efectiva.

## Ejemplo 1: Implementar un Endpoint de API REST

### Escenario
Agregar un nuevo endpoint para registro de usuarios con validación.

### Fase PLAN

```
Usted: PLAN implement a POST /api/users endpoint for user registration with email validation
```

**Respuesta de Claude:**
```markdown
# Mode: PLAN
## Agent: backend-developer [Primary Agent]

## 📋 Resumen del Plan
Implementar endpoint de registro de usuario con validación de email, hash de contraseña
y manejo adecuado de errores.

## ✅ Lista de Tareas
- [ ] Definir tipos de Usuario y esquema de validación
- [ ] Escribir pruebas que fallen para el endpoint de registro
- [ ] Implementar manejador de registro
- [ ] Agregar utilidad de validación de email
- [ ] Agregar hash de contraseña
- [ ] Escribir pruebas de integración

## 🎯 Pasos de Implementación

### Lógica Central (Enfoque TDD)
1. Escribir prueba: POST /api/users devuelve 201 con datos válidos
2. Escribir prueba: Devuelve 400 con email inválido
3. Escribir prueba: Devuelve 400 con contraseña débil
4. Implementar utilidades de validación
5. Implementar manejador de registro

### 🔒 Planificación de Seguridad
- Hash de contraseña con bcrypt (factor de costo 12)
- Sanitización de entrada para prevención de XSS
- Recomendación de limitación de tasa

## 📁 Estructura de Archivos
- src/entities/user/types.ts
- src/entities/user/user.validation.ts
- src/entities/user/user.api.ts
- src/entities/user/__tests__/user.api.test.ts

**Siguiente:** Escriba `ACT` para ejecutar
```

### Fase ACT

```
Usted: ACT
```

**Respuesta de Claude:**
```markdown
# Mode: ACT
## Agent: backend-developer [Primary Agent]

## 🚀 Progreso de Implementación

### Paso 1: Definir Tipos
✅ Tipos de usuario creados
- `src/entities/user/types.ts`: UserInput, User, ValidationError

### Paso 2: Escribir Pruebas que Fallen (Red)
✅ Archivo de pruebas creado
- `src/entities/user/__tests__/user.api.test.ts`
- Prueba: "returns 201 on valid registration" - FALLANDO ❌

### Paso 3: Implementar Validación (Green)
✅ Utilidad de validación creada
- `src/entities/user/user.validation.ts`: validateEmail, validatePassword

### Paso 4: Implementar Manejador (Green)
✅ Endpoint de registro creado
- `src/entities/user/user.api.ts`: manejador registerUser
- Las pruebas ahora pasan ✅

### Paso 5: Refactorizar
✅ Helper de respuesta de error extraído
✅ Comentarios JSDoc agregados

## ✅ Verificaciones de Calidad
- ✅ Seguridad de Tipos: Todos los tipos explícitos
- ✅ Pruebas: 4/4 pasando (cobertura: 94%)
- ✅ Seguridad: Contraseña hasheada con bcrypt

**Siguiente:** Escriba `EVAL` para evaluación de calidad o continúe con `PLAN`
```

### Fase EVAL (Opcional)

```
Usted: EVAL
```

**Respuesta de Claude:**
```markdown
# Mode: EVAL
## Agent: code-reviewer [Primary Agent]

## 📊 Evaluación de Calidad del Código

### Análisis de Seguridad 🔒
| Verificación | Estado | Notas |
|--------------|--------|-------|
| Hash de contraseña | ✅ Pasa | bcrypt con costo 12 |
| Validación de entrada | ✅ Pasa | Regex de email, reglas de contraseña |
| Inyección SQL | ✅ Pasa | Usando consultas parametrizadas |
| Limitación de tasa | ⚠️ Medio | No implementado |

### Calidad del Código 📏
| Métrica | Valor | Objetivo |
|---------|-------|----------|
| Cobertura de pruebas | 94% | 90%+ ✅ |
| Complejidad | Baja | Aceptable ✅ |
| Seguridad de tipos | 100% | 100% ✅ |

### Recomendaciones
1. **Medio**: Agregar limitación de tasa para prevenir fuerza bruta
2. **Bajo**: Considerar agregar flujo de verificación de email

## 🔄 Plan Mejorado
Si desea abordar los hallazgos:
- Agregar middleware de limitación de tasa
- Implementar token de verificación de email
```

---

## Ejemplo 2: Depurar una Prueba que Falla

### Escenario
Una prueba está fallando intermitentemente y necesita depurarla.

### Fase PLAN

```
Usted: PLAN debug the flaky test in UserProfile.test.tsx that fails randomly
```

**Respuesta de Claude:**
```markdown
# Mode: PLAN
## Agent: test-strategy-specialist [Primary Agent]

## 📋 Resumen del Plan
Investigar y corregir prueba inestable en el componente UserProfile.

## 🔍 Estrategia de Depuración
1. Identificar archivo de prueba y aserción que falla
2. Verificar problemas de temporización asíncrona
3. Buscar estado compartido entre pruebas
4. Verificar limpieza de mocks
5. Agregar aserciones waitFor adecuadas

## 🎯 Pasos de Investigación
1. Leer archivo de prueba e identificar patrón de falla
2. Verificar si faltan await o wrappers act()
3. Verificar limpieza en beforeEach/afterEach
4. Agregar waitFor explícito para operaciones asíncronas

**Siguiente:** Escriba `ACT` para comenzar la depuración
```

### Fase ACT

```
Usted: ACT
```

**Respuesta de Claude:**
```markdown
# Mode: ACT
## Agent: test-strategy-specialist [Primary Agent]

## 🚀 Progreso de Depuración

### Paso 1: Analizar Prueba
✅ Problema encontrado en `UserProfile.test.tsx:45`
- Falta `await` en render asíncrono
- Actualización de estado ocurriendo después de la aserción

### Paso 2: Aplicar Corrección
✅ Prueba modificada
```tsx
// Antes (inestable)
it('shows user name', () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});

// Después (estable)
it('shows user name', async () => {
  render(<UserProfile userId="1" />);
  await waitFor(() => {
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Paso 3: Verificar Corrección
✅ Prueba ejecutada 50 veces - 0 fallas

## ✅ Causa Raíz
La obtención de datos asíncrona se completaba después de la aserción. Corregido con `waitFor` adecuado.
```

---

## Ejemplo 3: Desarrollo Autónomo de Funcionalidades

### Escenario
Implementar una funcionalidad completa con control de calidad autónomo.

### Modo AUTO

```
Usted: AUTO implement a dark mode toggle with localStorage persistence
```

**Respuesta de Claude:**
```markdown
# Mode: AUTO (Iteración 1/5)
## Agent: frontend-developer [Primary Agent]

## 📋 Fase PLAN
- Crear proveedor ThemeContext
- Implementar componente toggle
- Agregar persistencia en localStorage
- Estilizar variantes de modo oscuro

## 🚀 Fase ACT
✅ ThemeContext creado con modos claro/oscuro
✅ Componente DarkModeToggle implementado
✅ Sincronización con localStorage agregada en montaje/cambio
✅ CSS global actualizado con variables de modo oscuro

## 📊 Fase EVAL
| Problema | Severidad | Estado |
|----------|-----------|--------|
| Falta accesibilidad de teclado | Alto | Encontrado |
| Sin detección de preferencia del sistema | Medio | Encontrado |
| Cobertura de pruebas en 78% | Medio | Encontrado |

---

# Mode: AUTO (Iteración 2/5)

## 📋 Fase PLAN
Abordar problemas Altos y Medios de la Iteración 1

## 🚀 Fase ACT
✅ Soporte de teclado agregado (toggle con Enter/Space)
✅ Detección de prefers-color-scheme agregada
✅ Pruebas faltantes agregadas (cobertura ahora 92%)

## 📊 Fase EVAL
| Problema | Severidad | Estado |
|----------|-----------|--------|
| Todos los problemas anteriores | - | ✅ Resueltos |

---

# Mode: AUTO - Completado ✅

## Resumen
- **Iteraciones**: 2
- **Problemas Críticos**: 0
- **Problemas Altos**: 0
- **Cobertura**: 92%

## Archivos Creados/Modificados
- src/shared/providers/ThemeContext.tsx
- src/shared/components/DarkModeToggle.tsx
- src/app/globals.css (variables de modo oscuro)
- tests/ThemeContext.test.tsx
```

---

## Ejemplo 4: Auditoría de Seguridad

### Escenario
Auditar código de autenticación existente para problemas de seguridad.

### Fase PLAN

```
Usted: PLAN security audit the authentication module in src/auth/
```

**Respuesta de Claude:**
```markdown
# Mode: PLAN
## Agent: security-specialist [Primary Agent]

## 📋 Alcance de la Auditoría
Revisión de seguridad del módulo de autenticación enfocándose en:
- Manejo de tokens (JWT)
- Almacenamiento de contraseñas
- Gestión de sesiones
- Validación de entrada
- Cumplimiento OWASP Top 10

## 🔍 Lista de Verificación de Auditoría
- [ ] Fortaleza del secreto JWT y rotación
- [ ] Lógica de expiración y renovación de tokens
- [ ] Algoritmo y parámetros de hash de contraseña
- [ ] Protección contra fuerza bruta
- [ ] Prevención de XSS en respuestas de autenticación
- [ ] Protección CSRF en endpoints de autenticación
- [ ] Configuración segura de cookies
- [ ] Limitación de tasa

**Siguiente:** Escriba `ACT` para realizar la auditoría
```

### Fase ACT

```
Usted: ACT
```

**Respuesta de Claude:**
```markdown
# Mode: ACT
## Agent: security-specialist [Primary Agent]

## 🔍 Hallazgos de la Auditoría de Seguridad

### Problemas Críticos 🔴
| Problema | Ubicación | Riesgo |
|----------|-----------|--------|
| Secreto JWT en código | auth.config.ts:5 | Exposición de secreto |
| Sin expiración de token | jwt.utils.ts:12 | Secuestro de sesión |

### Problemas Altos 🟠
| Problema | Ubicación | Riesgo |
|----------|-----------|--------|
| Política de contraseña débil | validation.ts:8 | Fuerza bruta |
| Falta limitación de tasa | login.handler.ts | Enumeración de cuentas |

### Problemas Medios 🟡
| Problema | Ubicación | Riesgo |
|----------|-----------|--------|
| Cookie sin bandera Secure | session.ts:22 | MITM |
| Mensajes de error detallados | error.handler.ts | Fuga de información |

## 📋 Plan de Remediación
1. Mover secreto JWT a variable de entorno
2. Agregar expiración de token (15 min acceso, 7 días renovación)
3. Implementar limitación de tasa (5 intentos/min)
4. Agregar banderas Secure, HttpOnly, SameSite a cookies

**Siguiente:** Escriba `ACT` para implementar correcciones o `PLAN` para remediación detallada
```

---

## Ejemplo 5: Generar Lista de Verificación por Dominio

### Usando el Comando /checklist

```
Usted: /checklist security accessibility
```

**Respuesta de Claude:**
```markdown
## 🔒 Lista de Verificación de Seguridad

### Autenticación
- [ ] Contraseñas hasheadas con bcrypt/argon2
- [ ] Tokens JWT tienen expiración
- [ ] Rotación de tokens de renovación implementada
- [ ] Invalidación de sesión al cerrar sesión

### Validación de Entrada
- [ ] Toda entrada de usuario sanitizada
- [ ] Prevención de inyección SQL (consultas parametrizadas)
- [ ] Prevención de XSS (codificación de salida)
- [ ] Restricciones de carga de archivos

### Autorización
- [ ] Control de acceso basado en roles
- [ ] Verificación de propiedad de recursos
- [ ] Limitación de tasa de API

---

## ♿ Lista de Verificación de Accesibilidad

### Navegación por Teclado
- [ ] Todos los elementos interactivos son enfocables
- [ ] Indicadores de foco visibles
- [ ] Enlaces de salto para navegación
- [ ] Sin trampas de teclado

### Lectores de Pantalla
- [ ] Estructura HTML semántica
- [ ] Etiquetas ARIA en controles personalizados
- [ ] Texto alternativo en imágenes
- [ ] Etiquetas de formulario asociadas con entradas

### Visual
- [ ] Contraste de color mínimo 4.5:1
- [ ] Texto redimensionable al 200%
- [ ] Ningún contenido depende solo del color
```

---

## Consejos para un Uso Efectivo

### 1. Sea Específico en PLAN
```
# Bueno
PLAN implement pagination for user list with 20 items per page

# Menos efectivo
PLAN add pagination
```

### 2. Use EVAL para Puertas de Calidad
Solicite EVAL antes de fusionar para asegurar:
- Se detectan problemas de seguridad
- Se verifica la accesibilidad
- La cobertura de pruebas cumple los estándares

### 3. Aproveche AUTO para Funcionalidades Complejas
El modo AUTO es ideal para:
- Funcionalidades con múltiples archivos
- Funcionalidades que requieren múltiples iteraciones
- Cuando el estándar de calidad es alto

### 4. Use Especialistas para Revisiones Profundas
Mencione dominios específicos para análisis enfocado:
```
PLAN security review the payment processing module
EVAL with focus on accessibility
```

## Ver También

- [Referencia Rápida](./plugin-quick-reference.md) - Comandos de un vistazo
- [Arquitectura](./plugin-architecture.md) - Cómo funciona
- [Resolución de Problemas](./plugin-troubleshooting.md) - Problemas comunes
- [Preguntas Frecuentes](./plugin-faq.md) - Preguntas frecuentes

---

<sub>🤖 Este documento fue traducido con asistencia de IA. Si encuentras errores o sugerencias de mejora, por favor repórtalos en [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
