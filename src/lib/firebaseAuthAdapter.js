import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  confirmPasswordReset, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, getFirestore, serverTimestamp } from 'firebase/firestore';
import app from '../lib/firebase'; // Ruta relativa exacta auditada hacia src/lib/firebase.js

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
  async me() {
    const current = auth.currentUser;
    if (!current) throw new Error('No hay sesión activa');
    const profile = await fetchUserProfile(current.uid);
    return { uid: current.uid, email: current.email, ...(profile || {}) };
  },

  async updateMe(patch) {
    const current = auth.currentUser;
    if (!current) throw new Error('No hay sesión activa');
    const ref = doc(db, 'users', current.uid);
    await setDoc(ref, patch, { merge: true });
    return this.me();
  },

  async loginViaEmailPassword(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return ensureUserProfile(cred.user);
  },

  async registerWithEmailPassword(email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return ensureUserProfile(cred.user);
  },

  async register({ email, password }) {
    return this.registerWithEmailPassword(email, password);
  },

  async loginWithProvider(providerName) {
    if (providerName !== 'google') {
      throw new Error(`Proveedor no soportado: ${providerName}`);
    }
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return ensureUserProfile(cred.user);
  },

  async resetPasswordRequest(email) {
    return this.sendPasswordReset(email);
  },

  async resetPassword({ resetToken, newPassword }) {
    return this.confirmPasswordReset(resetToken, newPassword);
  },

  async sendPasswordReset(email) {
    await sendPasswordResetEmail(auth, email);
  },

  async confirmPasswordReset(code, newPassword) {
    await confirmPasswordReset(auth, code, newPassword);
  },

  async logout() {
    await signOut(auth);
  },

  redirectToLogin(returnUrl) {
    window.location.href = `/login${returnUrl ? `?from=${encodeURIComponent(returnUrl)}` : ''}`;
  },

  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};