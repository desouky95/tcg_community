'use strict';
const Medusa = require('@medusajs/js-sdk').default;

module.exports = {
  routes: {
    admin: {
      type: 'admin',
      routes: [{ method: 'GET', path: '/collections', handler: 'collections.list', config: { policies: ['admin::isAuthenticatedAdmin'] } }],
    },
  },
  controllers: {
    collections: {
      async list(ctx) {
        const baseUrl = process.env.MEDUSA_BACKEND_URL;
        const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY;
        if (!baseUrl || !publishableKey) return ctx.serviceUnavailable('Medusa collection search is not configured.');
        const limit = 20;
        const offset = Math.max(0, Number.parseInt(String(ctx.query.offset || '0'), 10) || 0);
        const q = typeof ctx.query.q === 'string' ? ctx.query.q.slice(0, 100) : '';
        const id = typeof ctx.query.id === 'string' ? ctx.query.id.slice(0, 200) : ''; 
        try {
          const sdk = new Medusa({ baseUrl, publishableKey });
          const result = await sdk.store.collection.list({ limit, offset, ...(id ? { id: [id] } : q ? { q } : {}) });
          ctx.body = { collections: result.collections.map(({ id, title }) => ({ id, title })), count: result.count, limit, offset };
        } catch (error) {
          strapi.log.error('Medusa collection search failed', error);
          ctx.serviceUnavailable('Unable to load Medusa collections.');
        }
      },
    },
  },
};
