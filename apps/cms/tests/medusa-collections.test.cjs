const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
let query;
Module._load = function (name, ...args) {
  if (name === '@medusajs/js-sdk') return { default: class { constructor() { this.store = { collection: { list: async (q) => { query = q; return { count: 1, collections: [{ id: 'pcol_1', title: 'Cards', ignored: true }] }; } } }; } } };
  return original.call(this, name, ...args);
};
const plugin = require('../src/plugins/medusa-collections/strapi-server.js');
Module._load = original;
test('collection endpoint requires admin policy and passes bounded search and pagination', async () => {
  assert.deepEqual(plugin.routes.admin.routes[0].config.policies, ['admin::isAuthenticatedAdmin']);
  process.env.MEDUSA_BACKEND_URL = 'http://localhost:9000'; process.env.MEDUSA_PUBLISHABLE_KEY = 'test';
  const ctx = { query: { q: 'Cards', offset: '20' } };
  await plugin.controllers.collections.list(ctx);
  assert.deepEqual(query, { q: 'Cards', offset: 20, limit: 20 });
  assert.deepEqual(ctx.body.collections, [{ id: 'pcol_1', title: 'Cards' }]);
});
test('lookup by id and missing configuration', async () => {
  const ctx = { query: { id: 'pcol_1' } };
  await plugin.controllers.collections.list(ctx);
  assert.deepEqual(query.id, ['pcol_1']);
  delete process.env.MEDUSA_PUBLISHABLE_KEY;
  const missing = { query: {}, serviceUnavailable: (message) => message };
  assert.match(await plugin.controllers.collections.list(missing), /not configured/);
});
