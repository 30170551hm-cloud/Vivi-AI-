# Auditoría de Dependencias — Vivi AI

> Fecha: 2026-07-13
> Repositorio: `30170551hm-cloud/Vivi-AI-App`
> Rama: `main`

## Criterios de Evaluación

Cada dependencia se evalúa con los siguientes criterios:

| Estado | Significado |
|---|---|
| ✅ Necesaria | En uso activo, sin reemplazo mejor disponible |
| ⚠️ Revisar | En uso pero con alternativas o posible obsolescencia |
| 🔄 Actualizable | Versión estable disponible superior |
| ❌ Eliminable | No detectada en el código o reemplazable sin impacto |

---

## Dependencias de Producción

### Núcleo del Framework

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `react` | ^18.2.0 | ✅ | Framework principal. React 19 disponible pero requiere migración. |
| `react-dom` | ^18.2.0 | ✅ | Renderizador React. |
| `react-router-dom` | ^6.26.0 | ✅ | Enrutamiento. v7 disponible, migración no urgente. |
| `vite` | ^6.1.0 | ✅ | Build tool. Última estable. |
| `firebase` | ^10.14.1 | ✅ | Backend standalone (Auth, Firestore, Storage). v11 disponible. |

### UI y Componentes

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `@radix-ui/*` (27 paquetes) | ^1.x | ✅ | Primitivos de UI accesibles. Base de shadcn/ui. |
| `lucide-react` | ^0.475.0 | ✅ | Iconografía. |
| `framer-motion` | ^11.16.4 | ✅ | Animaciones del avatar y transiciones. |
| `tailwindcss` | ^3.4.17 | ✅ | Styling. v4 disponible pero breaking changes. |
| `tailwindcss-animate` | ^1.0.7 | ✅ | Animaciones Tailwind. |
| `class-variance-authority` | ^0.7.1 | ✅ | Variante de componentes. |
| `clsx` | ^2.1.1 | ✅ | Utilidad de clases. |
| `tailwind-merge` | ^3.0.2 | ✅ | Merge de clases Tailwind. |
| `cmdk` | ^1.0.0 | ✅ | Command palette (shadcn). |
| `sonner` | ^2.0.1 | ✅ | Toast notifications. |
| `vaul` | ^1.1.2 | ✅ | Drawer component (shadcn). |
| `next-themes` | ^0.4.4 | ⚠️ | Theme switching. Solo necesario si se soporta dark mode toggle. |
| `embla-carousel-react` | ^8.5.2 | ⚠️ | Carousel. Verificar si se usa en alguna página. |
| `canvas-confetti` | ^1.9.4 | ⚠️ | Efectos visuales. Solo si se usa en celebraciones. |
| `html2canvas` | ^1.4.1 | ⚠️ | Captura de pantalla. Solo si se usa en exportación. |

### Formularios y Validación

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `react-hook-form` | ^7.54.2 | ✅ | Gestión de formularios. |
| `@hookform/resolvers` | ^4.1.2 | ✅ | Resolvers para react-hook-form. |
| `zod` | ^3.24.2 | ✅ | Validación de esquemas. |
| `input-otp` | ^1.4.2 | ✅ | Input OTP para verificación. |

### Data y Estado

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `@tanstack/react-query` | ^5.84.1 | ✅ | Data fetching y cache. |
| `lodash` | ^4.17.21 | ⚠️ | Utilidades. Considerar reemplazar por esbuild tree-shaking o nativo. |
| `moment` | ^2.30.1 | ⚠️ | Fechas. `date-fns` ya está instalado — moment es redundante. |
| `date-fns` | ^3.6.0 | ✅ | Fechas (alternativa moderna a moment). |

### Multimedia y Visualización

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `recharts` | ^2.15.4 | ✅ | Gráficos para paneles. |
| `react-leaflet` | ^4.2.1 | ✅ | Mapas (Waze integration). |
| `three` | ^0.171.0 | ✅ | 3D para avatar y visualizaciones. |
| `react-markdown` | ^9.0.1 | ✅ | Renderizado de markdown en chat. |
| `react-quill` | ^2.0.0 | ⚠️ | Editor rich text. Verificar uso. |
| `jspdf` | ^4.2.1 | ✅ | Generación de PDF en file delivery system. |

### Pagos

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `@stripe/react-stripe-js` | ^3.0.0 | ✅ | Stripe UI components. |
| `@stripe/stripe-js` | ^5.2.0 | ✅ | Stripe SDK. |

### Arrastrar y Soltar

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `@hello-pangea/dnd` | ^17.0.0 | ✅ | Drag and drop (fork mantenido de react-beautiful-dnd). |
| `react-resizable-panels` | ^2.1.7 | ✅ | Paneles redimensionables. |

### Notificaciones

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `react-hot-toast` | ^2.6.0 | ⚠️ | Toast notifications. `sonner` ya está instalado — posible redundancia. |

---

## Dependencias de Desarrollo

| Paquete | Versión | Estado | Notas |
|---|---|---|---|
| `typescript` | ^5.8.2 | ✅ | Type checking. |
| `eslint` | ^9.19.0 | ✅ | Linting. |
| `eslint-plugin-react` | ^7.37.4 | ✅ | React linting. |
| `eslint-plugin-react-hooks` | ^5.0.0 | ✅ | Hooks linting. |
| `eslint-plugin-react-refresh` | ^0.4.18 | ✅ | HMR linting. |
| `eslint-plugin-unused-imports` | ^4.3.0 | ✅ | Detección de imports sin usar. |
| `@vitejs/plugin-react` | ^4.3.4 | ✅ | React plugin para Vite. |
| `autoprefixer` | ^10.4.20 | ✅ | PostCSS autoprefixer. |
| `postcss` | ^8.5.3 | ✅ | CSS processing. |
| `tailwindcss` | ^3.4.17 | ✅ | Tailwind (dev). |
| `@types/node` | ^22.13.5 | ✅ | Node types. |
| `@types/react` | ^18.2.66 | ✅ | React types. |
| `@types/react-dom` | ^18.2.22 | ✅ | ReactDOM types. |
| `globals` | ^15.14.0 | ✅ | Globals para ESLint. |
| `baseline-browser-mapping` | ^2.8.32 | ✅ | Browser compatibility mapping. |

---

## Recomendaciones

### Alta Prioridad

1. **Eliminar `moment`** — `date-fns` ya está instalado y es más ligero. Moment está en modo mantenimiento.
   - Impacto: -67KB bundle
   - Riesgo: Bajo (reemplazo directo con date-fns)

2. **Unificar toast notifications** — Tanto `sonner` como `react-hot-toast` están instalados. Elegir uno.
   - Recomendación: Mantener `sonner` (mejor integración con shadcn/ui)
   - Impacto: -12KB bundle

### Media Prioridad

3. **Verificar uso de `react-quill`** — Si no se usa, eliminar.
4. **Verificar uso de `embla-carousel-react`** — Si no hay carruseles, eliminar.
5. **Verificar uso de `canvas-confetti`** — Si no se usa, eliminar.
6. **Verificar uso de `html2canvas`** — Si no se usa, eliminar.

### Baja Prioridad

7. **Considerar migrar `lodash`** a imports específicos (`lodash/debounce` en lugar de `lodash`) para tree-shaking.
8. **Evaluar React 19** cuando sea estable — nuevas features de concurrent rendering.
9. **Evaluar Tailwind CSS 4** cuando sea estable — nuevo motor más rápido.

---

## Dependencias Críticas (NUNCA eliminar)

Estas dependencias son fundamentales para el funcionamiento de Vivi AI:

- `react`, `react-dom` — Framework
- `firebase` — Backend standalone
- `framer-motion` — Animaciones del avatar
- `lucide-react` — Iconografía
- `tailwindcss` — Styling
- `react-router-dom` — Enrutamiento
- `vite` — Build tool
- `jspdf` — Generación de archivos PDF
- `three` — 3D avatar
- `@tanstack/react-query` — Data fetching

---

## Conclusión

El repositorio tiene **cero dependencias de Base44** — es completamente independiente. Las dependencias instaladas son apropiadas para una aplicación React moderna. Las únicas mejoras claras son eliminar `moment` (redundante con `date-fns`) y unificar los sistemas de toast.