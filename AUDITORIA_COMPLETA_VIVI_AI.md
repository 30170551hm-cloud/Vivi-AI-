# AUDITORIA TÉCNICA COMPLETA - VIVI AI
**Inspector Técnico Permanente: Vivi AI Inspector**

---

# Error 001

**Prioridad**: Alta / Crítica
**Archivo**: `package.json` / Carpeta `node_modules`
**Carpeta**: Raíz del proyecto
**Descripción**: Los ejecutables de CLI para las herramientas de desarrollo (`eslint`, `tsc`, `vite`) no están en la carpeta `node_modules/.bin` porque dicha carpeta no existe. Al intentar ejecutar `npm install` para restaurarla, el sistema operativo rechaza la operación con un error `EPERM: operation not permitted, rmdir` sobre la carpeta `node_modules/firebase`.
**Causa**: Bloqueo de archivos por parte del sistema operativo (antivirus, editores de código abiertos o procesos en segundo plano de Node que mantienen bloqueado el módulo `firebase`).
**Impacto**: Imposibilidad absoluta de correr comandos locales del desarrollador como `npm run lint`, `npm run typecheck` o `npm run build`, paralizando la compilación y la verificación de calidad en local.
**Nivel de riesgo**: Alto (Bloqueo total del flujo de desarrollo).
**Cómo reproducirlo**: Ejecutar `npm run lint` o `npm install` desde la terminal en un entorno Windows.
**Qué agente debería solucionarlo**: DevOps / SysAdmin o Desarrollador Principal.
**Tiempo estimado**: 10 minutos (matar procesos de node, borrar `node_modules` manualmente y reinstalar).

---

# Error 002

**Prioridad**: Crítica
**Archivo**: [firestore.rules](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/firestore.rules#L34-L37)
**Carpeta**: Raíz del proyecto
**Descripción**: Las reglas de seguridad de Firestore permiten escritura sin restricciones de campos a cualquier usuario en su propio documento de perfil `/users/{userId}`:
```javascript
match /users/{userId} {
  allow read: if isSignedIn() && (request.auth.uid == userId || isFounder());
  allow write: if isSignedIn() && request.auth.uid == userId;
}
```
**Causa**: Diseño inseguro de las reglas de base de datos que no restringe qué campos puede modificar un cliente.
**Impacto**: Un usuario malicioso autenticado puede enviar una solicitud de actualización desde el cliente y establecer `is_founder: true` en su propio perfil. Debido a que la función `isFounder()` en las reglas evalúa este campo de Firestore, el atacante escalaría privilegios a nivel "Founder", obteniendo lectura/escritura de toda la base de datos (mensajes de otros usuarios, propuestas de mejora, etc.).
**Nivel de riesgo**: Crítico (Brecha de seguridad grave y escalada de privilegios).
**Cómo reproducirlo**: Iniciar sesión como usuario regular y ejecutar en la consola del navegador:
`await setDoc(doc(db, "users", auth.currentUser.uid), { is_founder: true }, { merge: true });`
**Qué agente debería solucionarlo**: Ingeniero de Seguridad / Desarrollador Backend.
**Tiempo estimado**: 15 minutos (implementar restricciones de campos en `firestore.rules`).

---

# Error 003

**Prioridad**: Crítica
**Archivo**: [firebaseAuthAdapter.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/lib/firebaseAuthAdapter.js#L31-L32), [firebaseStorageAdapter.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/lib/firebaseStorageAdapter.js#L19), [llmProviders.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/lib/llmProviders.js#L17)
**Carpeta**: `src/lib/`
**Descripción**: Inicialización e invocación a nivel de módulo (top-level) de servicios de Firebase como `getAuth(app)`, `getFirestore(app)`, `getStorage(app)` y `getFunctions(app)`.
**Causa**: Importación directa de la variable `app` (la cual puede exportarse como `undefined` si el bloque try-catch de `firebase.js` falla debido a variables de entorno ausentes).
**Impacto**: Si la inicialización en `firebase.js` falla (caso común en entornos de desarrollo sin `.env` configurado), la app entera sufre un error fatal en tiempo de carga del bundle, produciendo una pantalla blanca y bloqueando a todos los usuarios.
**Nivel de riesgo**: Crítico (Fallo catastrófico en tiempo de carga).
**Cómo reproducirlo**: Ejecutar el servidor de desarrollo `npm run dev` sin configurar las variables `.env` reales de Firebase.
**Qué agente debería solucionarlo**: Arquitecto de Software / Desarrollador Frontend.
**Tiempo estimado**: 20 minutos (inicializar los servicios perezosamente o validar la inicialización antes de invocarlos).

---

# Error 004

**Prioridad**: Alta
**Archivo**: [Register.jsx](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/pages/Register.jsx#L32-L68)
**Carpeta**: `src/pages/`
**Descripción**: El componente de registro asume y exige un flujo OTP de 6 dígitos enviado por email (`base44.auth.register`, `base44.auth.verifyOtp` y `base44.auth.resendOtp`). Sin embargo, Firebase Auth no tiene un flujo OTP nativo para email/password.
**Causa**: Arquitectura incompatible al intentar mapear directamente el comportamiento del SDK de Base44 sobre Firebase Auth. El adaptador `firebaseAuthAdapter.js` no implementa ni puede implementar fácilmente verificación por código OTP de 6 dígitos sin un servidor intermedio.
**Impacto**: Al migrar la autenticación a Firebase, el registro de usuarios dejará de funcionar por completo.
**Nivel de riesgo**: Alto (Bloqueo del registro de nuevos usuarios).
**Cómo reproducirlo**: Intentar registrar un nuevo usuario usando la pantalla de registro tras conectar el adaptador de Firebase Auth.
**Qué agente debería solucionarlo**: Desarrollador Fullstack.
**Tiempo estimado**: 2 horas (cambiar el flujo a enlaces de verificación de Firebase, o implementar una Cloud Function con Nodemailer y almacenamiento temporal de códigos OTP en Firestore).

---

# Error 005

**Prioridad**: Media
**Archivo**: Múltiples archivos en `src/vivi/modules/`
**Carpeta**: `src/vivi/modules/`
**Descripción**: Presencia de 9 archivos de módulos completamente vacíos (0 bytes):
- `ViviArchitecturememory.js`
- `ViviAutoFix.js`
- `ViviDeployment.js`
- `ViviFileSystem.js`
- `ViviGit.js`
- `ViviProyectBuilder.js`
- `ViviSandbox.js`
- `ViviTestRunner.js`
- `ViviVersionControl.js`
**Causa**: Estructura de archivos generada de manera preliminar durante la fase de andamiaje (scaffolding) que nunca se llegó a codificar.
**Impacto**: Código muerto, desorden en la estructura de carpetas y confusión para nuevos programadores que intenten entender la arquitectura.
**Nivel de riesgo**: Bajo (Inconsistencia y ruido en el repositorio).
**Cómo reproducirlo**: Listar los archivos y ver sus tamaños en la carpeta `src/vivi/modules/`.
**Qué agente debería solucionarlo**: Desarrollador Principal.
**Tiempo estimado**: 10 minutos (Eliminar los archivos vacíos si no están planificados).

---

# Error 006

**Prioridad**: Crítica
**Archivo**: [ViviCore.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/modules/ViviCore.js#L18) y [ViviMemory.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/modules/ViviMemory.js#L14)
**Carpeta**: `src/vivi/modules/`
**Descripción**: El motor conversacional principal (`ViviCore.js`) y el módulo de memoria (`ViviMemory.js`) importan y llaman directamente al SDK cliente de Base44 para invocación de LLM (`base44.integrations.Core.InvokeLLM`) y para persistencia de entidades (`base44.entities.ChatMessage.create`, `base44.entities.Memory`).
**Causa**: Los archivos adaptadores de Firebase fueron creados, pero los módulos internos de la IA de Vivi no han sido refactorizados para utilizarlos.
**Impacto**: La inteligencia de Vivi está totalmente acoplada a Base44. Al desactivar Base44, Vivi dejará de responder y de memorizar de inmediato.
**Nivel de riesgo**: Crítico (Fallo funcional total de la IA tras la migración).
**Cómo reproducirlo**: Cortar el token de Base44 e intentar chatear con Vivi.
**Qué agente debería solucionarlo**: Desarrollador de Inteligencia Artificial / Fullstack.
**Tiempo estimado**: 3 horas (Refactorizar e implementar `CoreIntegrations` y `FirestoreEntities` en los módulos de Vivi).

---

# Error 007

**Prioridad**: Alta
**Archivo**: [ResetPassword.jsx](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/pages/ResetPassword.jsx#L12)
**Carpeta**: `src/pages/`
**Descripción**: La página de restablecimiento de contraseña busca el parámetro de consulta `token` (`searchParams.get("token")`). Sin embargo, los correos enviados por Firebase Auth contienen el código en la variable `oobCode`.
**Causa**: Incompatibilidad semántica de parámetros de URL entre plataformas de autenticación.
**Impacto**: Los usuarios que hagan clic en el correo oficial de recuperación enviado por Firebase llegarán a la pantalla con un error de "Enlace de restablecimiento inválido", imposibilitando la recuperación de contraseñas.
**Nivel de riesgo**: Alto (Bloqueo de flujos de soporte al usuario).
**Cómo reproducirlo**: Generar un enlace de recuperación desde Firebase Auth y abrirlo en la aplicación.
**Qué agente debería solucionarlo**: Desarrollador Frontend.
**Tiempo estimado**: 10 minutos (Cambiar `"token"` por `"oobCode"` en la lectura de params).

---

# Error 008

**Prioridad**: Crítica
**Archivo**: [FileManagementTool.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/tools/FileManagementTool.js)
**Carpeta**: `src/vivi/tools/`
**Descripción**: La herramienta de archivos utiliza la función `base44.integrations.Core.ExtractDataFromUploadedFile` para extraer el contenido textual de archivos cargados (como PDFs y documentos de Word).
**Causa**: Firebase Storage no cuenta con una API integrada cliente de extracción de datos textuales a partir de binarios cargados.
**Impacto**: Al migrar a Firebase, la capacidad de Vivi para leer, resumir o analizar archivos adjuntos en el chat dejará de funcionar por completo.
**Nivel de riesgo**: Alto (Pérdida de una característica central).
**Cómo reproducirlo**: Adjuntar un archivo PDF en el chat e indicarle a Vivi que analice su contenido tras la migración.
**Qué agente debería solucionarlo**: Desarrollador Backend / Fullstack.
**Tiempo estimado**: 4 horas (Implementar una Firebase Cloud Function que use bibliotecas de parsing como `pdf-parse` y conectarla con `FileManagementTool.js`).

---

# Error 009

**Prioridad**: Crítica
**Archivo**: [WebSearchTool.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/tools/WebSearchTool.js#L22-L33)
**Carpeta**: `src/vivi/tools/`
**Descripción**: La herramienta de búsqueda en la web solicita al LLM de Base44 que realice navegación web activa pasando el parámetro `add_context_from_internet: true`. Sin embargo, la Cloud Function `callLLM` de Firebase no tiene implementado ningún conector o soporte para búsqueda en la web.
**Causa**: La Cloud Function del backend de Firebase realiza llamadas directas a las APIs estáticas de OpenAI o Gemini sin proveer grounding de Google Search o motores de búsqueda externos (ej. SerpAPI/Tavily).
**Impacto**: Vivi perderá por completo su capacidad de responder con datos en tiempo real de internet, limitándose a su conocimiento estático, lo que inducirá alucinaciones graves al preguntarle sobre eventos actuales.
**Nivel de riesgo**: Alto (Pérdida de capacidad de búsqueda y riesgo de alucinación).
**Cómo reproducirlo**: Pedirle a Vivi que busque el clima de hoy o noticias recientes utilizando la herramienta de búsqueda web.
**Qué agente debería solucionarlo**: Ingeniero de IA / Desarrollador Backend.
**Tiempo estimado**: 4 horas (Habilitar Google Search Grounding en la API de Gemini dentro de `callLLM` o integrar Tavily API).

---

# Error 010

**Prioridad**: Alta
**Archivo**: [ViviFounderAuth.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/modules/ViviFounderAuth.js#L13-L17)
**Carpeta**: `src/vivi/modules/`
**Descripción**: Exposición de una lista dura de correos electrónicos de administración (`FOUNDER_EMAILS`) en el código de producción expuesto en el cliente (frontend).
**Causa**: Implementación de lógica de autorización client-side insegura.
**Impacto**: Fuga de información (correos privados del fundador) y vulnerabilidad de spoofing. Si el registro está abierto, cualquier usuario puede crearse una cuenta con ese correo exacto y, debido a que el cliente lo valida puramente por string, se le dará acceso visual al Panel de Fundador.
**Nivel de riesgo**: Alto (Seguridad y Privacidad).
**Cómo reproducirlo**: Registrar una cuenta con cualquiera de los correos listados en la constante `FOUNDER_EMAILS` e ingresar a la ruta `/founder`.
**Qué agente debería solucionarlo**: Desarrollador Fullstack.
**Tiempo estimado**: 1 hora (Utilizar claims de Firebase Auth y validar el rol en el backend de forma segura).

---

# Error 011

**Prioridad**: Alta
**Archivo**: `firebase.json` / `firestore.indexes.json`
**Carpeta**: Raíz del proyecto
**Descripción**: Las consultas en `firebaseEntities.js` (`list` y `filter`) realizan un filtrado por `ownerId` combinado con ordenaciones por otros campos (`importance` desc, `created_date` desc). Firestore requiere de forma estricta índices compuestos para este tipo de consultas.
**Causa**: No se ha definido un archivo `firestore.indexes.json` ni se ha configurado la sección `"indexes"` en `firebase.json`.
**Impacto**: Las consultas de carga de chats y recuperación de memorias fallarán de inmediato en producción, arrojando errores en la consola y dejando la aplicación sin datos.
**Nivel de riesgo**: Alto (Pérdida de persistencia y carga de datos en la UI).
**Cómo reproducirlo**: Intentar abrir la pantalla de chat o memoria con la app conectada a un entorno real de Firestore sin haber creado previamente los índices compuestos manualmente en la consola de Firebase.
**Qué agente debería solucionarlo**: Desarrollador Backend / DevOps.
**Tiempo estimado**: 30 minutos (Crear y desplegar el archivo de índices compuestos).

---

# Error 012

**Prioridad**: Media
**Archivo**: [UserNotRegisteredError.jsx](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/components/UserNotRegisteredError.jsx)
**Carpeta**: `src/components/`
**Descripción**: El componente utiliza colores claros y planos (`bg-gradient-to-b from-white to-slate-50`, `text-slate-900`) que rompen drásticamente con la línea de diseño general de Vivi AI, caracterizada por ser oscura (`#0A0A0C`), elegante, con degradados de fucsia/púrpura y efectos de vidrio.
**Causa**: Empleo de un componente de plantilla genérico sin adaptar al sistema de diseño unificado del proyecto.
**Impacto**: Inconsistencia estética de interfaz (UX), produciendo una mala impresión visual al usuario (efecto "flashbang" de luz al toparse con un error).
**Nivel de riesgo**: Bajo (Estética e Identidad de Marca).
**Cómo reproducirlo**: Forzar un error de usuario no registrado para visualizar la página de error.
**Qué agente debería solucionarlo**: Desarrollador Frontend / Diseñador UX.
**Tiempo estimado**: 15 minutos (Ajustar los estilos CSS con Tailwind para seguir el tema oscuro).

---

# Error 013

**Prioridad**: Media
**Archivo**: [utils.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/lib/utils.js#L9)
**Carpeta**: `src/lib/`
**Descripción**: El archivo exporta la constante `isIframe` utilizando `window.self !== window.top` directamente en el nivel superior (global).
**Causa**: Acceso directo al objeto global `window` sin comprobación de entorno.
**Impacto**: Si el compilador, servidor de renderizado del lado del servidor (SSR) o un test runner de backend importa este archivo, el proceso colapsará instantáneamente con un `ReferenceError: window is not defined`.
**Nivel de riesgo**: Medio (Fallo potencial de compilación, build o tests).
**Cómo reproducirlo**: Ejecutar un script de prueba en Node.js que importe indirectamente `src/lib/utils.js`.
**Qué agente debería solucionarlo**: Desarrollador Frontend.
**Tiempo estimado**: 5 minutos (Proteger la constante: `typeof window !== 'undefined' && window.self !== window.top`).

---

# Error 014

**Prioridad**: Media
**Archivo**: [firebaseEntities.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/lib/firebaseEntities.js#L110-L114)
**Carpeta**: `src/lib/`
**Descripción**: En los métodos `create` y `bulkCreate`, se retorna el objeto creado de forma inmediata incluyendo los campos de fecha como `created_date: serverTimestamp()`.
**Causa**: Retorno del objeto payload local sin esperar a que el servidor de Firestore resuelva los metadatos de tiempo reales.
**Impacto**: La UI recibirá un objeto especial de tipo `FieldValue` (Sentinel) en lugar de una fecha formateable. Si el código del cliente intenta parsear o mostrar la fecha al instante de crear el registro (por ejemplo, al mandar un mensaje), ocurrirán fallos visuales o excepciones JavaScript.
**Nivel de riesgo**: Medio (Bugs en UI al interactuar en tiempo real).
**Cómo reproducirlo**: Enviar un mensaje de chat y verificar si la fecha del mensaje se renderiza correctamente de inmediato.
**Qué agente debería solucionarlo**: Desarrollador Fullstack.
**Tiempo estimado**: 30 minutos (Modificar el adaptador para simular una fecha local en el retorno o suscribir el estado a los cambios confirmados del servidor).

---

# Error 015

**Prioridad**: Banda / Inconsistencia
**Archivo**: [index.js](file:///C:/Users/Henrry%20Garcia/OneDrive/Desktop/Act6VIVI-AI-main-updated/VIVI-AI-main/src/vivi/index.js#L96)
**Carpeta**: `src/vivi/`
**Descripción**: La propiedad `security` está parcialmente comentada en la exportación del singleton Vivi: `// analytics: registry.get('analytics'),    security: registry.get('security'),`.
**Causa**: Error de edición tipográfica al comentar una propiedad adyacente (`analytics`).
**Impacto**: El método `getVivi().security` retorna `undefined` en lugar del módulo inicializado, obligando a los módulos clientes a recurrir al método genérico `getVivi().registry.get('security')`.
**Nivel de riesgo**: Bajo (Inconsistencia en la API pública).
**Cómo reproducirlo**: Intentar invocar `getVivi().security` en la consola.
**Qué agente debería solucionarlo**: Desarrollador Frontend.
**Tiempo estimado**: 2 minutos (Descomentar y separar adecuadamente la propiedad).

---

## Errores Críticos
- **Error 002**: Escalada de privilegios a Founder en `firestore.rules`.
- **Error 003**: Bloqueo de carga de la app (pantalla blanca) por inicialización insegura de Firebase.
- **Error 006**: Acoplamiento crítico al SDK de Base44 en ViviCore y ViviMemory.
- **Error 008**: Pérdida de la función de extracción de datos de archivos en Firebase.
- **Error 009**: Pérdida de la capacidad de búsqueda en la web en Cloud Functions.

## Errores Altos
- **Error 001**: Ejecutables de CLI rotos y fallo de permisos `EPERM` en `npm install`.
- **Error 004**: Incompatibilidad del flujo OTP en Firebase Auth para registros.
- **Error 007**: Enlaces de restauración de contraseña rotos por parámetro `token` vs. `oobCode`.
- **Error 010**: Exposición de correos del fundador en el cliente y riesgo de spoofing.
- **Error 011**: Ausencia de índices compuestos de Firestore en la configuración del deploy.

## Errores Medios
- **Error 005**: 9 archivos de módulos vacíos que incrementan el ruido arquitectónico.
- **Error 012**: Inconsistencia visual de interfaz en la pantalla de error de acceso restringido.
- **Error 013**: Crash potencial de Node/SSR al cargar `utils.js` por acceso directo a `window`.
- **Error 014**: Retorno de Sentinels de Firestore en lugar de fechas en la creación de registros.

## Errores Bajos
- **Error 015**: Inconsistencia menor de exportación del módulo `security` en `getVivi()`.

## Riesgos futuros
- Dependencia económica y de conectividad de servicios externos de IA (OpenAI / Gemini) que pueden bloquearse, cambiar tarifas o requerir conexión satelital continua.
- Falta de un mecanismo de fallback robusto en caso de caída de servicios en la nube de Firebase.

## Mejoras recomendadas
- Implementar soporte a modelos locales mediante Ollama o WebLLM para dar opción de "Modo Local/Desconectado".
- Mudar la lista de correos administradores (`ViviFounderAuth.js`) a claims personalizados en Firebase Auth para evitar exposición en el cliente.
- Agregar un componente genérico de manejo de errores globales en React para capturar fallos de inicialización y evitar pantallas en blanco.

## Código obsoleto
- La inicialización y los imports de `@base44/sdk` y `base44Client` en todos los archivos de producción una vez que se complete la migración a Firebase.
- Las constantes de endpoints de Base44 en el archivo de variables de entorno `.env`.

## Código duplicado
- Métodos homónimos en adaptadores (`confirmPasswordReset` en `firebaseAuthAdapter` vs `firebase/auth`) que, aunque se resuelven correctamente por ámbito, representan una práctica de código confusa y propensa a errores durante refactorizaciones.

## Dependencias rotas
- Ausencia del binario `esbuild` en la carpeta `node_modules` local, impidiendo la ejecución directa del bundle con Vite.

## Problemas de arquitectura
- Acoplamiento directo de módulos funcionales (`ViviCore`, `ViviMemory`, `useChat`) a dependencias del SDK de base de datos (`base44`), rompiendo el patrón de inyección y desacoplamiento esperado.

## Problemas de seguridad
- Reglas de Firestore deficientes en la entidad `/users` permitiendo la escalación libre de privilegios a Founder (Error 002).
- Exposición pública de correos privados del fundador en código expuesto en el cliente (Error 010).

## Problemas de rendimiento
- Las consultas recursivas a Firestore sin índices compuestos que causarán excepciones y tiempos de carga extendidos (Error 011).
- Ausencia de caché en la persistencia local de memorias en la transición a Firebase.

## Problemas de UX
- Contraste y quiebre de tema de color (Light vs Dark) en el renderizado de pantallas de error del sistema (Error 012).

## Problemas de accesibilidad
- Los componentes de alerta no cuentan con etiquetas de accesibilidad de voz para lectores de pantalla en dispositivos móviles.

## Problemas de Firebase
- Configuración de base de datos sin índices definidos y código expuesto a excepciones por inicializaciones globales tempranas.

## Problemas de GitHub
- La Cloud Function `getRepoTree` y `getRepoFile` requiere almacenamiento del token personal (`GITHUB_TOKEN`) de manera forzada en secrets, sin el cual el analizador de código de Vivi de fondo falla por completo en local.

## Problemas de Vercel
- Si el build falla localmente por falta de `esbuild` (Error 001), los despliegues automáticos en Vercel también fallarán.

## Problemas de Cloud Run
- Las Cloud Functions v2 de Firebase se ejecutan sobre Cloud Run. Si se invocan intensamente las funciones LLM sin configurar límites de instancias, los costos pueden escalar sin control.

## Problemas de Base44
- Bloqueo total de la inteligencia y memoria del asistente al momento de desactivar los servicios en la nube de la plataforma original debido al acoplamiento de ViviCore.

## Variables incorrectas
- Lectura errónea del parámetro de URL `token` en lugar de `oobCode` en la pantalla de reinicio de contraseñas (Error 007).

## Importaciones incorrectas
- Importación directa de subcarpetas internas de la distribución de paquetes (`@base44/sdk/dist/utils/axios-client`) en lugar de usar los entrypoints públicos del SDK, lo cual puede romperse en actualizaciones de versión del paquete.

## Exportaciones incorrectas
- Exportación del singleton de bootstrap de Vivi con el módulo `security` comentado incorrectamente en `vivi/index.js` (Error 015).
