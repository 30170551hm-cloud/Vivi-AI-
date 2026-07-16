# Contribuir a Vivi AI

Gracias por tu interés en contribuir a Vivi AI. Este documento describe el proceso para agregar funcionalidades, módulos y páginas.

## Configuración del Entorno

1. Clona el repositorio:
```bash
git clone https://github.com/30170551hm-cloud/Vivi-AI-App.git
cd Vivi-AI-App
npm install
```

2. Copia `.env.example` a `.env` y completa las variables de Firebase.

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Flujo de Trabajo

1. Crea una rama desde `main`:
```bash
git checkout -b feature/nombre-descriptivo
```

2. Haz tus cambios siguiendo las convenciones del proyecto.

3. Verifica que todo pase:
```bash
npm run lint
npm run build
```

4. Crea un Pull Request hacia `main`.

## Convenciones

### Código
- **Lenguaje**: JavaScript (JSX para componentes React)
- **Estilo**: ESLint + Prettier
- **Imports**: Usa siempre el alias `@/` (ej: `@/components/ui/button`)
- **Exports**: Cada componente/página se exporta como `default`
- **Componentes**: Archivos de 50 líneas o menos; cada componente nuevo en su propio archivo

### Backend
- **Auth**: Usar `authClient` desde `@/lib/authClient`
- **Entities**: Usar `backend` desde `@/lib/backendClient` o `base44` desde `@/api/base44Client`
- **Integraciones**: Usar `backend.integrations.Core.*`

### NO Usar
- `@base44/sdk` — reemplazado por Firebase
- `@base44/vite-plugin` — reemplazado por Vite puro
- `base44.auth.*` directamente — usar `authClient` o `backend.auth`

## Crear Nuevas Funcionalidades

### Nueva Página

1. Crea el archivo en `src/pages/MiPagina.jsx`:
```jsx
import React from 'react';
import PageTransition from '@/components/PageTransition';

export default function MiPagina() {
  return (
    <PageTransition>
      <div className="min-h-screen p-4">
        <h1>Mi Página</h1>
      </div>
    </PageTransition>
  );
}
```

2. Agrega la ruta en `src/App.jsx`:
```jsx
import MiPagina from '@/pages/MiPagina';
// Dentro de <Routes>:
<Route path="/mi-pagina" element={<MiPagina />} />
```

### Nuevo Módulo Vivi

1. Crea el archivo en `src/vivi/modules/ViviMiModulo.js`:
```js
import { ModuleBase } from '../core/ModuleBase';
import { EVENTS } from '../events';

export default class ViviMiModulo extends ModuleBase {
  constructor(bus) {
    super('mimodulo', bus);
  }

  async init(registry) {
    await super.init(registry);
    this.subscribe(EVENTS.USER_INPUT, (text) => this.handle(text));
  }

  async handle(text) {
    // Lógica del módulo
  }

  health() {
    return { name: this.name, healthy: this._initialized };
  }
}
```

2. Registra el módulo en `src/vivi/index.js`:
```js
import ViviMiModulo from './modules/ViviMiModulo';
// En el array de módulos:
registry.register(new ViviMiModulo(bus));
```

### Nueva API (Cloud Function)

1. Agrega el endpoint en `functions/index.js`:
```js
export const miEndpoint = onRequest(async (req, res) => {
  // Lógica del endpoint
  res.json({ success: true });
});
```

2. Llama desde el frontend:
```js
import { backend } from '@/lib/backendClient';
// o directamente con fetch a la URL de la Cloud Function
```

## CI/CD

- Cada push a `main` ejecuta `.github/workflows/node.js.yml`
- Verifica: lint, build, vercel-build, e import de functions
- Todos los checks deben pasar antes del merge

## Seguridad

- NUNCA commitear `.env` o credenciales
- Usar `Deno.env.get()` para secrets en Cloud Functions
- Firestore Rules deben estar en `firestore.rules`
