# Gobernanza del Repositorio — Vivi AI

> **GitHub es la fuente única de verdad del proyecto Vivi AI.**
> Repositorio oficial: `30170551hm-cloud/Vivi-AI-App`
> Rama principal: `main`

---

## Principios

### 1. Fuente Única de Verdad

Todo el código, la configuración, la documentación y la evolución de Vivi AI viven en este repositorio. No existen copias paralelas ni dependencias ocultas fuera de GitHub.

### 2. Commits como Historial

Cada modificación queda registrada como un commit con mensaje descriptivo. El historial de commits es la línea de tiempo del proyecto.

**Formato de commits:**
```
<tipo>: <descripción>

Tipos:
- feat:     Nueva funcionalidad
- fix:      Corrección de bug
- refactor: Refactorización sin cambio de comportamiento
- docs:     Documentación
- chore:    Tareas de mantenimiento
- test:     Pruebas
- ci:       CI/CD
```

### 3. Ramas para Modificaciones

Las modificaciones al código deben realizarse en ramas de trabajo y requerir validación antes del Pull Request:

```
main (producción)
├── feat/file-delivery-system     # Nuevas features
├── fix/voice-barge-in            # Bug fixes
├── refactor/memory-module        # Refactorizaciones
└── docs/dependency-audit         # Documentación
```

**Flujo:**
1. Crear rama desde `main`
2. Implementar cambios
3. Verificar `npm run build` pasa sin errores
4. Crear Pull Request a `main`
5. Validar CI/CD (GitHub Actions)
6. Merge a `main`

### 4. CI/CD Automático

GitHub Actions ejecuta en cada push a `main`:
- `npm ci` — Instalación limpia
- `npm run lint` — Linting
- `npm run build` — Build de producción
- `npm run vercel-build` — Verificación de build Vercel

Si algún paso falla, el commit se marca como fallido y debe corregirse antes de continuar.

### 5. Sin Dependencias Ocultas

Todas las dependencias están declaradas en `package.json`. No hay imports a paquetes no instalados ni referencias a servicios externos no documentados.

**Dependencias externas configuradas mediante secrets:**
- Firebase (config en `.env`)
- Vercel (despliegue automático desde GitHub)
- LLM providers (Groq, OpenRouter, Gemini, OpenAI, Anthropic)
- ElevenLabs (TTS)
- GitHub connector (OAuth scopes: `repo`, `read:org`)

---

## Estructura del Repositorio

```
Vivi-AI-App/
├── .github/workflows/       # CI/CD pipelines
├── base44/                  # Esquemas de entidades (JSON)
├── docs/                    # Documentación técnica
├── functions/               # Cloud Functions (Firebase)
├── public/                  # Assets estáticos
├── src/
│   ├── api/                 # Cliente API (bridge)
│   ├── components/          # Componentes React
│   │   ├── chat/            # Interfaz de chat
│   │   ├── github/          # Integración GitHub
│   │   ├── ui/              # shadcn/ui primitives
│   │   └── vivi/            # Componentes del avatar
│   ├── hooks/               # React hooks
│   ├── lib/                 # Capa de abstracción
│   │   ├── firebase.js      # Inicialización Firebase
│   │   ├── authClient.js    # Auth adapter
│   │   ├── backendClient.js # Backend abstraction
│   │   └── fileGenerator.js # Generación de archivos
│   ├── pages/               # Páginas/rutas
│   ├── utils/               # Utilidades
│   └── vivi/                # Sistema modular de Vivi
│       ├── core/            # ModuleBase, EventBus, Registry
│       ├── modules/         # Módulos de IA
│       ├── hooks/           # useVivi hook
│       ├── tools/           # Herramientas
│       └── events.js        # Registro de eventos
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## Permisos de GitHub

El conector de GitHub tiene los siguientes scopes OAuth:

| Scope | Permiso | Uso |
|---|---|---|
| `repo` | Acceso completo a repositorios | Lectura/escritura de código, issues, PRs, branches |
| `read:org` | Lectura de organización | Listar repositorios de la organización |

### Permisos NO concedidos (no necesarios actualmente)

- `admin:org` — Administración de organización
- `delete_repo` — Eliminar repositorios
- `admin:repo_hook` — Webhooks administrativos
- `admin:org_hook` — Webhooks de organización

Si en el futuro se necesitan permisos adicionales, se debe:
1. Identificar el scope exacto necesario
2. Solicitar al founder que reautorice el conector con el scope adicional
3. Actualizar `base44/connectors/github.jsonc`

---

## Evolución Continua

Cuando se solicite una nueva función o mejora:

1. **Análisis** — Revisar impacto en la arquitectura existente
2. **Branch** — Crear rama de trabajo desde `main`
3. **Implementación** — Escribir código siguiendo las convenciones
4. **Validación local** — `npm run lint && npm run build`
5. **Commit** — Con mensaje descriptivo siguiendo el formato
6. **Push** — A la rama de trabajo
7. **PR** — Crear Pull Request a `main`
8. **CI/CD** — GitHub Actions valida automáticamente
9. **Merge** — Tras validación exitosa
10. **Deploy** — Vercel despliega automáticamente desde `main`

---

## Contacto

- **Founder**: Henrry Moyses García Rojas
- **Organización**: HRYET
- **Soporte**: Contactar a Base44 support para issues de plataforma