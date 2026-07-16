// MOCK_firebase.mjs — MOCK explícito, NO el paquete real 'firebase'.
// Cubre únicamente 'firebase/app' y 'firebase/functions', que son los que
// alcanza la cadena real getVivi() → ViviCodeAnalyzer → githubProvider.js
// → firebase.js. No prueba que Firebase funcione de verdad.
export function initializeApp() { return { name: 'mock-app' }; }
export function getFunctions() { return { name: 'mock-functions' }; }
export function httpsCallable() { return async () => ({ data: null }); }
export function getAuth() { return { currentUser: null }; }
export function setPersistence() { return Promise.resolve(); }
export const browserLocalPersistence = 'mock-persistence';
export function getFirestore() { return { name: 'mock-firestore' }; }
export function getStorage() { return { name: 'mock-storage' }; }
export function doc() { return {}; }
export function collection() { return {}; }
export function addDoc() { return Promise.resolve({ id: 'mock-doc' }); }
export function updateDoc() { return Promise.resolve(); }
export function deleteDoc() { return Promise.resolve(); }
export function getDocs() { return Promise.resolve({ docs: [] }); }
export function getDoc() { return Promise.resolve({ exists: () => false, data: () => ({}) }); }
export function setDoc() { return Promise.resolve(); }
export function query() { return {}; }
export function where() { return {}; }
export function orderBy() { return {}; }
export function limit() { return {}; }
export function writeBatch() { return { delete() {}, set() {}, commit: () => Promise.resolve() }; }
export function serverTimestamp() { return 0; }
export function ref() { return {}; }
export function uploadBytes() { return Promise.resolve(); }
export function getDownloadURL() { return Promise.resolve('https://example.invalid/mock-file'); }
export function onAuthStateChanged() { return () => {}; }
export function signInWithEmailAndPassword() { return Promise.reject(new Error('mock auth')); }
export function createUserWithEmailAndPassword() { return Promise.reject(new Error('mock auth')); }
export function signInWithPopup() { return Promise.reject(new Error('mock auth')); }
export function GoogleAuthProvider() {}
export function sendPasswordResetEmail() { return Promise.resolve(); }
export function confirmPasswordReset() { return Promise.resolve(); }
export function signOut() { return Promise.resolve(); }
