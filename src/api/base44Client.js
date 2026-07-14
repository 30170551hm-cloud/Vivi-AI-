// @ts-nocheck

const appId = import.meta.env.VITE_BASE44_APP_ID;

function createStub() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        return (...args) => {
          console.warn(
            `[Base44 desabilitado] Se intentó usar "${String(prop)}" pero Base44 está desactivado.`,
            args
          );
          return Promise.resolve(null);
        };
      },
    }
  );
}

if (!appId) {
  console.warn(
    "[Base44] No hay VITE_BASE44_APP_ID configurado. Vivi funcionará usando Firebase."
  );
}

export const base44 = createStub();
