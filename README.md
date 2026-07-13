# Vivi AI

Asistente personal inteligente con avatar animado, gestión de rutinas, objetivos y memoria diaria.

## Arquitectura

- **Frontend**: React 18 + Vite 6 + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Deployment**: Vercel
- **Source of truth**: Este repositorio (rama `main`)
- **Dependencia de Base44**: NINGUNA (completamente independiente)

## Estructura del Proyecto

```
Vivi-AI-/
├── src/
│   ├── lib/                        # Capa de abstracción Firebase
│   │   ├── backendClient.js        # Reemplaza @/api/base44Client
│   │   ├── firebase.js             # Inicialización Firebase
│   │   ├── authClient.js           # Auth (reemplaza base44.auth)
│   │   ├── firebaseAuthAdapter.js  # Firebase Auth adapter
│   │   ├── firebaseEntities.js     # Entities (reemplaza base44.entities)
│   │   ├── firebaseStorageAdapter.js # Storage (reemplaza UploadFile)
│   │   ├── llmProviders.js         # LLM vía Cloud Functions
│   │   ├── aiProvider.js           # Wrapper de IA
│   │   ├── authMode.js             # Selección de modo de auth
│   │   ├── app-params.js           # Parámetros de la app
│   │   └── AuthContext.jsx         # Context de autenticación
│   ├── api/
│   │   └── base44Client.js         # Bridge: re-exporta backend como base44
│   ├── vivi/
│   │   ├── modules/                # 30+ módulos del sistema Vivi
│   │   ├── core/                   # EventBus, ModuleBase, ModuleRegistry
│   │   ├── events.js               # Constantes de eventos
│   │   ├── emotionConfig.js        # Configuración de emociones
│   │   └── index.js                # Bootstrap del sistema
│   ├── components/                 # Componentes React (shadcn/ui + propios)
│   ├── pages/                      # Páginas de la aplicación
│   ├── hooks/                      # Hooks personalizados
│   ├── App.jsx                     # Router principal
│   └── main.jsx                    # Entry point
├── functions/                      # Firebase Cloud Functions
│   ├── index.js                    # Endpoints (callLLM, generateSpeech, etc.)
│   └── package.json                # Dependencias de functions
├── .github/workflows/              # CI/CD
│   └── node.js.yml                 # Build + Lint + Verify
├── firestore.rules                 # Reglas de seguridad Firestore
├── .env.example                    # Variables de entorno documentadas
├── .npmrc                          # Supply-chain security
├── vite.config.js                  # Configuración Vite (sin @base44/vite-plugin)
├── package.json                    # Dependencias (sin @base44/sdk)
├── tailwind.config.js              # Configuración Tailwind
└── eslint.config.js                # Configuración ESLint
```

## Inicio Rápido

### Prerrequisitos
- Node.js 20+
- npm 10+
- Proyecto de Firebase configurado

### Instalación

```bash
git clone https://github.com/30170551hm-cloud/Vivi-AI-.git
cd Vivi-AI-
npm install
```

### Configuración

1. Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Completa las variables de Firebase:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

3. Para las Cloud Functions, configura `functions/` con tu proyecto Firebase:
```bash
cd functions
npm install
```

### Desarrollo

```bash
npm run dev
```
Abre http://localhost:5173

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Vercel detectará automáticamente Vite (`npm run build` → `dist/`)
4. Las Cloud Functions se despliegan por separado con `firebase deploy --only functions`

## Cloud Functions

| Endpoint | Propósito |
|---|---|
| `callLLM` | Inferencia LLM (OpenAI / Gemini) |
| `generateSpeech` | Text-to-speech |
| `generateImage` | Generación de imágenes IA |
| `getRepoTree` | Listar archivos del repo |
| `getRepoFile` | Leer archivo del repo |
| `proposeRepoChanges` | Proponer cambios de código |
| `approveRepoChanges` | Aprobar y aplicar cambios |

## Módulos del Sistema Vivi

ViviCore, ViviVoice, ViviAvatar, ViviMemory, ViviKnowledge, ViviIntegrations,
ViviNotifications, ViviSettings, ViviFounderConsole, ViviSecurity, ViviApi,
ViviLogger, ViviRealtimeFacts, ViviVenezuela, ViviVAD, ViviTOOR, ViviBaseBrain,
ViviVDE, ViviFounderAuth, ViviReasoning, ViviEmotionEngine, ViviVisionEngine,
ViviAudioEngine, ViviLearningEngine, ViviConversationEngine, ViviCodeAnalyzer,
ViviPermissionManager, ViviUniversity, ViviAnalytics

## Licencia

Propietario — HRYET. Fundador: Henrry Moyses García Rojas.
