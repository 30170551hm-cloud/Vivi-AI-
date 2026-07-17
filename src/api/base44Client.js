// src/api/base44Client.js — Versión limpia y neutralizada para producción con Firebase

export const base44 = {
  auth: {
    me: async () => { 
      throw new Error('Base44 Auth deshabilitado. La aplicación utiliza Firebase Auth.'); 
    },
    logout: async () => {},
    redirectToLogin: (returnUrl) => {
      window.location.href = `/login${returnUrl ? `?from=${encodeURIComponent(returnUrl)}` : ''}`;
    }
  },
  entities: {
    User: {
      list: async () => [],
      get: async () => null,
      create: async () => {},
      update: async () => {},
      delete: async () => {}
    }
  },
  integrations: {
    Core: {
      InvokeLLM: async () => { throw new Error('Usa Cloud Functions / Gemini'); },
      GenerateImage: async () => { throw new Error('No soportado'); }
    }
  },
  analytics: {
    track: () => {},
    trackBatch: () => {}
  }
};

export const appParams = {
  appId: 'vivi-ai',
  token: null
};

export function createAxiosClient() {
  return {
    get: async () => ({ data: {} }),
    post: async () => ({ data: {} }),
    put: async () => ({ data: {} }),
    delete: async () => ({ data: {} })
  };
}