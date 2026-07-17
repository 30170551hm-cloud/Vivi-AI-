# TODO - Vivi AI Stabilization (Fases 1–6)

## Estado actual
- [ ] FASE 1: 0 errores TypeScript (`npm run typecheck`)
- [ ] FASE 2: 0 errores ESLint (`npm run lint`)
- [ ] FASE 3: Build producción exitoso (`npm run build`)
- [ ] FASE 4: Testing funcional exhaustivo
- [ ] FASE 5: Revisión de seguridad
- [ ] FASE 6: Optimización rendimiento/bundle/memoria

## Plan operativo aprobado
1. [ ] Corregir tipos en módulos críticos restantes:
   - [ ] `src/vivi/modules/ViviCore.js`
   - [ ] `src/vivi/modules/ViviMemory.js`
   - [ ] `src/vivi/modules/ViviRealtimeFacts.js`
   - [ ] `src/vivi/modules/ViviTOOR.js`
   - [ ] `src/vivi/modules/ViviVAD.js`
   - [ ] `src/vivi/modules/ViviVDE.js`
   - [ ] `src/vivi/modules/ViviVoice.js`
   - [ ] `src/vivi/tests/eventBus.test.js`
   - [ ] `src/vivi/tools/ToolBase.js`
2. [ ] Ejecutar `npm run typecheck` y repetir hasta 0 errores.
3. [ ] Ejecutar `npm run lint` y corregir hasta 0 errores.
4. [ ] Ejecutar `npm run build` y dejar build de producción estable.
5. [ ] Ejecutar pruebas funcionales exhaustivas (Fase 4).
6. [ ] Revisión de seguridad (Fase 5).
7. [ ] Optimización y verificación final (Fase 6).
8. [ ] Actualizar `CHANGELOG_VIVI_AI.md` y `SESSION_STATE.md`.
9. [ ] Commit y sincronización en repositorio oficial.

## Paso en curso (aprobado)
- [ ] Corregir causa raíz TS en `src/vivi/modules/ViviVoice.js`:
  - [ ] Reemplazar `base44.integrations.Core.GenerateSpeech(...)` por API tipada soportada en `base44.functions`.
  - [ ] Mantener comportamiento funcional de TTS fallback.
  - [ ] Añadir fallback seguro solo si la función no está disponible o falla.
- [ ] Actualizar trazabilidad en:
  - [ ] `SESSION_STATE.md`
  - [ ] `CHANGELOG_VIVI_AI.md`
- [ ] Validación obligatoria post-fix:
  - [ ] `npm run typecheck`
  - [ ] `npm run lint`
  - [ ] `npm run build`

## MCP Snyk (instalación y validación)
1. [x] Actualizar `.blackbox/blackbox_mcp_settings.json` sin romper MCP existentes.
   - [x] Mantener `github.com/VapiAI/mcp-server`.
   - [x] Agregar `github.com/snyk/snyk-ls` con `npx -y snyk@latest mcp -t stdio`.
2. [ ] Verificar runtime:
   - [ ] `node -v`
   - [ ] `npm -v`
   - [ ] `npx -v`
3. [ ] Verificar configuración MCP y compatibilidad entre servidores.
4. [x] Probar capacidad del servidor Snyk MCP con una herramienta/comando de Snyk.
   - [x] Resultado: bloqueado por incidencia externa de entorno (`ERR_SSL_CIPHER_OPERATION_FAILED` en npm/npx OpenSSL), no por configuración del proyecto.
5. [x] Si se requiere autenticación/configuración adicional, pausar y reportar antes de continuar.
   - [x] Estado: no se llegó a autenticación; falla previa de descarga TLS en entorno Windows/OpenSSL.
6. [x] Entregar informe final:
   - [x] Estado instalación.
   - [x] Estado configuración MCP.
   - [x] Resultado de prueba.
   - [x] Problemas encontrados.
   - [x] Recomendaciones de seguridad para Vivi AI.
7. [x] Registrar incidencia de entorno:
   - [x] Integración funcional de Snyk MCP aplazada por bloqueo externo de entorno SSL/TLS.
   - [x] No dedicar más tiempo a este bloqueo salvo impacto directo sobre estabilidad de Vivi AI.
