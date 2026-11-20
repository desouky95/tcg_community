import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('CMS_ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('CMS_API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('CMS_TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('CMS_ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('CMS_FLAG_NPS', true),
    promoteEE: env.bool('CMS_FLAG_PROMOTE_EE', true),
    docLinks: env.bool('CMS_FLAG_DOC_LINKS', true),
  },
});

export default config;
