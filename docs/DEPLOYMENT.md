# Guía de Despliegue — Vivi AI

## Despliegue Frontend (Vercel)

### Automático (recomendado)

1. Conecta tu repositorio `30170551hm-cloud/Vivi-AI-` a Vercel
2. Vercel detecta automáticamente Vite:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Configura las variables de entorno en Vercel Dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GEMINI_API_KEY` (opcional)
4. Cada push a `main` despliega automáticamente

### Manual

```bash
npm run build
vercel --prod
```

## Despliegue Cloud Functions (Firebase)

### Prerrequisitos

1. Instala Firebase CLI:
```bash
npm install -g firebase-tools
firebase login
```

2. Configura el proyecto:
```bash
firebase use --add tu-proyecto-id
```

### Despliegue

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Configurar Secrets

```bash
firebase functions:secrets:set OPENAI_API_KEY
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set ELEVENLABS_API_KEY
```

## Despliegue Firestore Rules

```bash
firebase deploy --only firestore:rules
```

## CI/CD (GitHub Actions)

El workflow `.github/workflows/node.js.yml` ejecuta en cada push a `main`:

1. `npm ci` — instalación de dependencias
2. `npm run lint` — verificación de lint
3. `npm run build` — build de producción
4. `npm run vercel-build` — verificación de build de Vercel
5. `cd functions && npm ci` — instalación de functions
6. `import('./index.js')` — verificación de import de functions

Todos los pasos deben pasar antes de que el deploy de Vercel proceda.

## Verificación Post-Despliegue

1. Visita la URL de Vercel
2. Verifica que el login con Google funcione
3. Verifica que la conversación de voz funcione
4. Revisa la consola del navegador para errores

## Rollback

En Vercel Dashboard → Deployments → selecciona un deploy anterior → "Instant Rollback"
