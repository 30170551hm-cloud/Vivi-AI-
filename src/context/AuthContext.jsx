import React, { createContext, useState, useContext, useEffect } from 'react';
import { firebaseAuthAdapter } from '@/firebase/firebaseAuthAdapter';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = firebaseAuthAdapter.onAuthStateChanged(async (firebaseUser) => {
      try {
        setIsLoadingAuth(true);
        setAuthError(null);

        if (firebaseUser) {
          const userProfile = await firebaseAuthAdapter.me().catch(async () => {
            return { uid: firebaseUser.uid, email: firebaseUser.email };
          });

          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[AuthContext] Error al sincronizar el usuario:', error);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError({
          type: 'sync_error',
          message: error.message || 'Error al cargar el perfil de usuario'
        });
      } finally {
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async (shouldRedirect = true) => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await firebaseAuthAdapter.logout();
      
      if (shouldRedirect) {
        firebaseAuthAdapter.redirectToLogin();
      }
    } catch (error) {
      console.error('[AuthContext] Error al cerrar sesión:', error);
    }
  };

  const navigateToLogin = () => {
    firebaseAuthAdapter.redirectToLogin(window.location.pathname);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: { id: 'vivi-ai', public_settings: {} },
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth: async () => {},
      checkAppState: async () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};