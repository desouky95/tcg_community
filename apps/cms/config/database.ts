import path from 'path';
import type { Core } from '@strapi/strapi';
import { isDatabaseClientKind } from '@strapi/database';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const client = env('CMS_DATABASE_CLIENT', 'sqlite');

  if (!isDatabaseClientKind(client)) {
    throw new Error(
      `Unsupported DATABASE_CLIENT: ${client}. Use "postgres", "mysql", or "sqlite".`
    );
  }

  const connections: Record<Core.Config.Database.ClientKind, Core.Config.Database['connection']> = {
    mysql: {
      client: 'mysql',
      connection: {
        host: env('CMS_DATABASE_HOST', 'localhost'),
        port: env.int('CMS_DATABASE_PORT', 3306),
        database: env('CMS_DATABASE_NAME', 'strapi'),
        user: env('CMS_DATABASE_USERNAME', 'strapi'),
        password: env('CMS_DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('CMS_DATABASE_SSL', false) && {
          key: env('CMS_DATABASE_SSL_KEY', undefined),
          cert: env('CMS_DATABASE_SSL_CERT', undefined),
          ca: env('CMS_DATABASE_SSL_CA', undefined),
          capath: env('CMS_DATABASE_SSL_CAPATH', undefined),
          cipher: env('CMS_DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('CMS_DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('CMS_DATABASE_POOL_MIN', 2), max: env.int('CMS_DATABASE_POOL_MAX', 5) },
    },
    postgres: {
      client: 'postgres',
      connection: {
        connectionString: env('CMS_DATABASE_URL'),
        host: env('CMS_DATABASE_HOST', 'localhost'),
        port: env.int('CMS_DATABASE_PORT', 5432),
        database: env('CMS_DATABASE_NAME', 'strapi'),
        user: env('CMS_DATABASE_USERNAME', 'strapi'),
        password: env('CMS_DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('CMS_DATABASE_SSL', false) && {
          key: env('CMS_DATABASE_SSL_KEY', undefined),
          cert: env('CMS_DATABASE_SSL_CERT', undefined),
          ca: env('CMS_DATABASE_SSL_CA', undefined),
          capath: env('CMS_DATABASE_SSL_CAPATH', undefined),
          cipher: env('CMS_DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('CMS_DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
        schema: env('CMS_DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('CMS_DATABASE_POOL_MIN', 2), max: env.int('CMS_DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', '..', env('CMS_DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      ...connections[client],
      acquireConnectionTimeout: env.int('CMS_DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

export default config;
