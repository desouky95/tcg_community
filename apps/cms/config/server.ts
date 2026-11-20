import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('CMS_APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('CMS_WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
