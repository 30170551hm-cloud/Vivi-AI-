// firebaseAuthAdapter.js — Adaptador de Firebase Auth que replica la forma
// exacta de la API `backend.auth.*` usada hoy en AuthContext.jsx, Login.jsx,
// Register.jsx, ForgotPassword.jsx, ResetPassword.jsx y ViviSecurity.js:
//   .me()                                    → usuario actual + su doc de perfil
//   .updateMe(patch)                         → actualiza el doc users/{uid}
//   .loginViaEmailPassword(email, password)
//   .loginWithProvider('google', redirectPath)
//   .logout(redirectUrl?)
//   .redirectToLogin(redirectUrl)

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  setPersistence,            // CORRECCIÓN: Importado para asegurar la sesión
  browserLocalPersistence,   // CORRECCIÓN: Importado para asegurar la sesión
} from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import app from './firebase';

const auth = getAuth(app);
const db = getFirestore(app);

async function fetchUserProfile(uid) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: uid, ...snap.data() } : null;
}

async function ensureUserProfile(firebaseUser) {
  const ref = doc(db, 'users', firebaseUser.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // Perfil por defecto para nuevos usuarios.
    const defaultProfile = {
      display_name: firebaseUser.displayName || '',
      preferred_language: 'auto',
      voice_enabled: true,
      is_founder: false,
      voice_name: '',
      voice_rate: 0.85,
      voice_pitch: 1.0,
      voice_volume: 1.0,
      precise_mode: true,
      email: firebaseUser.email,
      created_date: serverTimestamp(),
    };
    await setDoc(ref, defaultProfile);
    return { id: firebaseUser.uid, ...defaultProfile };
  }
  return { id: firebaseUser.uid, ...snap.data() };
}

export const firebaseAuthAdapter = {
  /** Usuario actual + su perfil de Firestore combinados. */
  async me() {
    const current = auth.currentUser;
    if (!current) throw new Error('No hay sesión activa');
    const profile = await fetchUserProfile(current.uid);
    return { uid: current.uid, email: current.email, ...(profile || {}) };
  },

  /** Actualiza el perfil del usuario actual en users/{uid}. */
  async updateMe(patch) {
    const current = auth.currentUser;
    if (!current) throw new Error('No hay sesión activa');
    const ref = doc(db, 'users', current.uid);
    await setDoc(ref, patch, { merge: true });
    return this.me();
  },

  /** Login con email/contraseña. */
  async loginViaEmailPassword(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return ensureUserProfile(cred.user);
  },

  /** Registro con email/contraseña. */
  async registerWithEmailPassword(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return ensureUserProfile(cred.user);
  },

  /** Alias con la firma {email, password} que usa Register.jsx. */
  async register({ email, password }) {
    return this.registerWithEmailPassword(email, password);
  },

  /** Alias con la firma que usa ForgotPassword.jsx. */
  async resetPasswordRequest(email) {
    return this.sendPasswordReset(email);
  },

  /** Alias con la firma {resetToken, newPassword} que usa ResetPassword.jsx. */
  async resetPassword({ resetToken, newPassword }) {
    return this.confirmPasswordReset(resetToken, newPassword);
  },

  /** Redirige a /login. */
  redirectToLogin(returnUrl) {
    window.location.href = `/login${returnUrl ? `?from=${encodeURIComponent(returnUrl)}` : ''}`;
  },

  /** Login con proveedor OAuth (hoy solo 'google' está en uso). */
  async loginWithProvider(provider) {
    if (provider !== 'google') {
      throw new Error(`Proveedor no soportado: ${provider}`);
    }
    if (auth.config?.authDomain === 'demo-auth-domain') {
      throw new Error(
        'Firebase authDomain no está configurado (VITE_FIREBASE_AUTH_DOMAIN ausente). ' +
        'Configúralo en Vercel → Settings → Environment Variables con el valor de tu consola de Firebase ' +
        '(normalmente "<tu-proyecto>.firebaseapp.com") y vuelve a desplegar — en Vite, las variables de ' +
        'entorno se incrustan en tiempo de BUILD, no de ejecución, así que cambiarlas requiere redeploy.'
      );
    }
    try {
      // CORRECCIÓN: Forzamos la persistencia local inmediatamente antes del popup
      // para asegurar que el navegador retenga la sesión en modo incógnito o bloqueos de cookies de terceros.
      await setPersistence(auth, browserLocalPersistence);

      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      return ensureUserProfile(cred.user);
    } catch (err) {
      if (err?.code === 'auth/unauthorized-domain') {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '(desconocido)';
        throw new Error(
          `Firebase rechazó el login porque el dominio actual ("${currentDomain}") no está en su lista de ` +
          'dominios autorizados. Solución exacta: Firebase Console → Authentication → Settings → ' +
          `Authorized domains → "Add domain" → agrega "${currentDomain}". ` +
          'Los cambios en esa lista aplican de inmediato, sin redeploy.'
        );
      }
      throw err;
    }
  },

  /** Envía email de recuperación de contraseña (para ForgotPassword.jsx). */
  async sendPasswordReset(email) {
    await sendPasswordResetEmail(auth, email);
  },

  /** Confirma el reset de contraseña con el código recibido por email (para ResetPassword.jsx). */
  async confirmPasswordReset(code, newPassword) {
    await confirmPasswordReset(auth, code, newPassword);
  },

  /** Cierra sesión. redirectUrl es manejado por el caller (React Router), no aquí. */
  async logout() {
    await signOut(auth);
  },

  /** * Suscribirse a cambios de sesión (reemplaza el polling manual de AuthContext.jsx).
   * CORRECCIÓN: Interceptamos el evento nativo de Firebase para resolver de manera 
   * asíncrona y segura el perfil de Firestore ANTES de notificar al AuthContext de la aplicación.
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Bloqueamos el flujo de cambio de estado de la aplicación hasta garantizar 
          // que el documento en la base de datos existe y sus propiedades están listas.
          const profile = await ensureUserProfile(firebaseUser);
          
          // Entregamos el objeto unificado que espera la aplicación.
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...profile
          });
        } catch (error) {
          console.error("Error al interceptar el perfil de usuario en el adaptador:", error);
          // Fallback seguro: Pasamos los datos esenciales de Auth para no colapsar la app si Firestore falla temporalmente
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email
          });
        }
      } else {
        // No hay sesión activa, notificamos null de forma directa
        callback(null);
      }
    });
  },
};
