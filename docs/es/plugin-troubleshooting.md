<p align="center">
  <a href="../plugin-troubleshooting.md">English</a> |
  <a href="../ko/plugin-troubleshooting.md">한국어</a> |
  <a href="../zh-CN/plugin-troubleshooting.md">中文</a> |
  <a href="../ja/plugin-troubleshooting.md">日本語</a> |
  <a href="plugin-troubleshooting.md">Español</a> |
  <a href="../pt-BR/plugin-troubleshooting.md">Português</a>
</p>

# Guía de Resolución de Problemas de CodingBuddy

Soluciones a problemas comunes al usar el Plugin de CodingBuddy para Claude Code.

## Problemas de Instalación

### El Plugin No Aparece en Claude Code

**Síntoma**: Después de la instalación, `claude plugin list` no muestra codingbuddy.

**Soluciones**:

1. **Verificar que la instalación se completó**
   ```bash
   # Comprobar si existen los archivos del plugin
   ls ~/.claude/plugins/codingbuddy/
   ```

2. **Reinstalar el plugin**
   ```bash
   claude plugin remove codingbuddy
   claude plugin add codingbuddy
   ```

3. **Verificar la versión de Claude Code**
   ```bash
   claude --version
   # El sistema de plugins requiere Claude Code 1.0+
   ```

4. **Reiniciar Claude Code**
   ```bash
   # Salga de Claude Code completamente y reinicie
   claude
   ```

### La Instalación de npm Falla

**Síntoma**: `npm install -g codingbuddy-claude-plugin` falla con errores.

**Soluciones**:

1. **Errores de permisos (EACCES)**
   ```bash
   # Opción A: Use un gestor de versiones de Node
   # Instale nvm, luego:
   nvm install --lts
   npm install -g codingbuddy-claude-plugin

   # Opción B: Corregir prefijo de npm
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   npm install -g codingbuddy-claude-plugin
   ```

2. **Errores de red**
   ```bash
   # Verificar registro de npm
   npm config get registry
   # Debe ser https://registry.npmjs.org/

   # Intentar con registro detallado
   npm install -g codingbuddy-claude-plugin --verbose
   ```

3. **Versión de Node muy antigua**
   ```bash
   node --version
   # Requiere Node.js 18+
   # Actualice Node.js si es necesario
   ```

---

## Problemas de Conexión MCP

### El Servidor MCP No Conecta

**Síntoma**: Los comandos de flujo de trabajo (PLAN, ACT, EVAL) no se activan correctamente, no se muestra el agente.

**Diagnóstico**:
```bash
# Verificar si el CLI de codingbuddy está instalado
which codingbuddy
codingbuddy --version

# Verificar configuración MCP
cat ~/.claude/settings.json | grep -A5 codingbuddy
```

**Soluciones**:

1. **Instalar el servidor MCP**
   ```bash
   npm install -g codingbuddy
   ```

2. **Agregar configuración MCP**

   Edite `~/.claude/settings.json`:
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

3. **Reiniciar Claude Code**
   ```bash
   # Salga y reinicie
   claude
   ```

### Las Herramientas MCP No Están Disponibles

**Síntoma**: El comando `/mcp` no muestra las herramientas de CodingBuddy.

**Soluciones**:

1. **Verificar que el servidor MCP está ejecutándose**
   ```bash
   # En una terminal separada, ejecute:
   codingbuddy
   # Debe iniciarse sin errores
   ```

2. **Verificar que PATH incluye codingbuddy**
   ```bash
   echo $PATH
   which codingbuddy
   # Si no se encuentra, agregue al PATH
   ```

3. **Verificar conflictos de servidores MCP**
   ```bash
   cat ~/.claude/settings.json
   # Asegúrese de que no hay entradas duplicadas para codingbuddy
   ```

### "Command not found: codingbuddy"

**Síntoma**: MCP intenta ejecutar `codingbuddy` pero no se encuentra.

**Soluciones**:

1. **Agregar el directorio bin global de npm al PATH**
   ```bash
   # Para npm
   export PATH="$(npm config get prefix)/bin:$PATH"

   # Para yarn
   export PATH="$(yarn global bin):$PATH"
   ```

2. **Usar ruta absoluta en configuración MCP**
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

## Problemas de Flujo de Trabajo

### Las Palabras Clave PLAN/ACT/EVAL No Se Reconocen

**Síntoma**: Escribir "PLAN implement X" no activa el modo de flujo de trabajo.

**Soluciones**:

1. **Verificar que la palabra clave está al inicio del mensaje**
   ```
   # Correcto
   PLAN implement user login

   # Incorrecto - palabra clave no al inicio
   Can you PLAN implement user login
   ```

2. **Usar mayúsculas o palabras clave localizadas**
   ```
   PLAN ...
   계획 ...  (Coreano)
   計画 ...  (Japonés)
   PLANIFICAR ... (Español)
   ```

3. **Verificar que MCP está conectado**
   - Escriba `/mcp` para ver herramientas disponibles
   - Debe mostrar la herramienta `parse_mode`

### El Contexto No Se Persiste

**Síntoma**: El modo ACT no recuerda las decisiones de PLAN.

**Soluciones**:

1. **Verificar que existe el archivo de contexto**
   ```bash
   cat docs/codingbuddy/context.md
   ```

2. **Asegurar que PLAN se completó correctamente**
   - El modo PLAN crea el archivo de contexto
   - Si se interrumpió, reinicie con PLAN

3. **Verificar permisos de archivo**
   ```bash
   ls -la docs/codingbuddy/
   # Asegure permisos de escritura
   ```

### El Modo AUTO No Se Detiene

**Síntoma**: El modo AUTO sigue iterando incluso cuando los problemas están corregidos.

**Soluciones**:

1. **Verificar límite de iteraciones**
   - El límite por defecto es 5 iteraciones
   - AUTO se detiene cuando Critical=0 Y High=0

2. **Revisar hallazgos de EVAL**
   - Algunos problemas pueden ser recurrentes
   - Aborde la causa raíz, no los síntomas

3. **Intervención manual**
   - Escriba cualquier mensaje para interrumpir AUTO
   - Revise los hallazgos, luego reinicie si es necesario

---

## Problemas de Rendimiento

### Tiempos de Respuesta Lentos

**Síntoma**: Claude tarda mucho tiempo en responder en los modos de flujo de trabajo.

**Soluciones**:

1. **Simplificar la tarea**
   - Divida tareas complejas en partes más pequeñas
   - Use PLAN para una funcionalidad a la vez

2. **Reducir agentes especialistas**
   - Configure menos especialistas en `codingbuddy.config.js`
   ```javascript
   module.exports = {
     specialists: ['security-specialist']  // Solo los esenciales
   };
   ```

3. **Verificar tamaño del contexto**
   - Archivos de contexto grandes ralentizan el procesamiento
   - Inicie un nuevo PLAN para nuevas funcionalidades

### Alto Uso de Tokens

**Síntoma**: Alcanzando límites de contexto rápidamente.

**Soluciones**:

1. **Usar prompts enfocados**
   ```
   # Mejor
   PLAN add email validation to registration

   # Menos eficiente
   PLAN review the entire auth module and add validation
   ```

2. **Dejar que el contexto se compacte naturalmente**
   - Claude Code resume automáticamente el contexto antiguo
   - No repita manualmente el contexto anterior

---

## Problemas de Configuración

### La Configuración del Proyecto No Se Carga

**Síntoma**: La configuración de `codingbuddy.config.js` no se aplica.

**Soluciones**:

1. **Verificar ubicación del archivo**
   - Debe estar en la raíz del proyecto
   - Nombrado exactamente `codingbuddy.config.js`

2. **Verificar sintaxis**
   ```bash
   node -e "console.log(require('./codingbuddy.config.js'))"
   ```

3. **Verificar formato de exportación**
   ```javascript
   // Correcto
   module.exports = { language: 'es' };

   // Incorrecto
   export default { language: 'es' };
   ```

### Respuestas en Idioma Incorrecto

**Síntoma**: Claude responde en el idioma incorrecto.

**Soluciones**:

1. **Establecer idioma en configuración**
   ```javascript
   // codingbuddy.config.js
   module.exports = {
     language: 'es'  // 'en', 'ko', 'ja', 'zh', 'es'
   };
   ```

2. **Usar variable de entorno**
   ```bash
   export CODINGBUDDY_LANGUAGE=es
   ```

3. **Usar palabras clave localizadas**
   - Comience con español: `PLANIFICAR implementar login de usuario`
   - Claude responderá en español

---

## Modo de Depuración

### Habilitar Registro Detallado

Para depuración detallada:

```bash
# Ejecutar servidor MCP con salida de depuración
CODINGBUDDY_DEBUG=true codingbuddy
```

### Verificar Comunicación MCP

```bash
# En Claude Code, verificar estado MCP
/mcp

# Debe mostrar:
# - Estado del servidor codingbuddy
# - Herramientas disponibles
# - Último error si hay alguno
```

### Revisar Documento de Contexto

```bash
# Verificar qué contexto está persistido
cat docs/codingbuddy/context.md

# Buscar:
# - Decisiones previas de PLAN
# - Progreso de ACT
# - Hallazgos de EVAL
```

---

## Obtener Ayuda

### Reportar Problemas

1. **Issues de GitHub**: [github.com/JeremyDev87/codingbuddy/issues](https://github.com/JeremyDev87/codingbuddy/issues)

2. **Incluir en el reporte**:
   - Versión de Claude Code (`claude --version`)
   - Versión del plugin (de plugin.json)
   - Versión del servidor MCP (`codingbuddy --version`)
   - Pasos para reproducir
   - Mensajes de error

### Consultar Documentación

- [Guía de Instalación](./plugin-guide.md)
- [Arquitectura](./plugin-architecture.md)
- [Preguntas Frecuentes](./plugin-faq.md)

---

## Lista de Verificación de Diagnóstico Rápido

```
[ ] Node.js 18+ instalado
[ ] Claude Code 1.0+ instalado
[ ] Plugin visible en `claude plugin list`
[ ] Servidor MCP instalado (`which codingbuddy`)
[ ] Configuración MCP en settings.json
[ ] Puede ver herramientas con `/mcp`
[ ] Palabra clave PLAN activa el modo
[ ] Archivo de contexto creado después de PLAN
```

---

<sub>🤖 Este documento fue traducido con asistencia de IA. Si encuentras errores o sugerencias de mejora, por favor repórtalos en [GitHub Issues](https://github.com/JeremyDev87/codingbuddy/issues).</sub>
