import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {},
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'medusa-collection',
      type: 'string',
      intlLabel: { id: 'medusa-collection.label', defaultMessage: 'Medusa collection' },
      intlDescription: { id: 'medusa-collection.description', defaultMessage: 'Choose a collection from the store.' },
      components: { Input: async () => import('./components/MedusaCollectionInput') },
    });
  },
};
