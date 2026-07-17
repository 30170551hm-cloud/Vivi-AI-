// harness_founder.mjs — Pruebas reales de ViviSecurity + ViviFounderAuth,
// contra el código de producción sin modificar. El único mock es
// base44.auth.me() (via MOCK_base44_sdk.mjs), declarado explícitamente.
import assert from 'node:assert/strict';
import { EventBus } from '../src/vivi/core/EventBus.js';
import { ModuleRegistry } from '../src/vivi/core/ModuleRegistry.js';
import ViviSecurity from '../src/vivi/modules/ViviSecurity.js';
import ViviFounderAuth from '../src/vivi/modules/ViviFounderAuth.js';
import ViviMemory from '../src/vivi/modules/ViviMemory.js';
import { EVENTS } from '../src/vivi/events.js';
import { base44 } from '../src/api/base44Client.js';

let passed = 0, failed = 0;
async function test(name, fn) {
  try { await fn(); console.log(`✓ PASS: ${name}`); passed++; }
  catch (err) { console.log(`✗ FAIL: ${name}\n  ${err.message}`); failed++; }
}

// Simula un founder autenticado, sobreescribiendo el mock inerte de base44.auth.me
// SOLO para esta prueba (no modifica MOCK_base44_sdk.mjs).
base44.auth.me = async () => ({
  email: 'henrrygarciarojas@gmail.com',
  is_founder: true,
  role: 'admin',
});

await test('ViviSecurity: refresh() detecta al usuario founder real de FOUNDER_EMAILS', async () => {
  const bus = new EventBus();
  const registry = new ModuleRegistry(bus);
  const security = new ViviSecurity(bus);
  registry.register(security);
  await registry.initAll();
  assert.equal(security.isAuthenticated(), true);
  assert.equal(security.isAuthorized(), true);
  assert.equal(security.isFounder(), true);
});

await test('ViviFounderAuth: reconoce al founder y emite FOUNDER_RECOGNIZED', async () => {
  const bus = new EventBus();
  const registry = new ModuleRegistry(bus);
  registry.register(new ViviSecurity(bus));
  registry.register(new ViviMemory(bus));
  const founderAuth = new ViviFounderAuth(bus);
  registry.register(founderAuth);

  let recognizedPayload = null;
  bus.on(EVENTS.FOUNDER_RECOGNIZED, (p) => { recognizedPayload = p; });

  await registry.initAll();

  assert.equal(founderAuth.isFounder(), true);
  assert.equal(founderAuth.hasChecked(), true);
  assert.ok(recognizedPayload, 'FOUNDER_RECOGNIZED debía emitirse');
  assert.equal(recognizedPayload.email, 'henrrygarciarojas@gmail.com');
});

await test('ViviFounderAuth: con un usuario NO founder, isFounder() es false', async () => {
  base44.auth.me = async () => ({ email: 'otro@ejemplo.com', is_founder: false, role: 'user' });
  const bus = new EventBus();
  const registry = new ModuleRegistry(bus);
  registry.register(new ViviSecurity(bus));
  registry.register(new ViviMemory(bus));
  const founderAuth = new ViviFounderAuth(bus);
  registry.register(founderAuth);
  await registry.initAll();
  assert.equal(founderAuth.isFounder(), false);
});

console.log(`\n${passed} pasaron, ${failed} fallaron (de ${passed + failed} pruebas totales)`);
if (failed > 0) process.exit(1);
