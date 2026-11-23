import type { Core } from "@strapi/strapi";

const allowedMediaTypes = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.*",
  "text/plain",
  "text/csv",
];

const deniedTypes = [
  "image/svg+xml",
  "application/vnd.microsoft.portable-executable",
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-executable",
  "application/x-dosexec",
  "application/x-sh",
  "text/x-shellscript",
  "application/x-mach-binary",
];

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  "users-permissions": {
    config: {
      jwtManagement: "refresh",
      jwtSecret: env("CMS_JWT_SECRET"),
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env("DO_SPACE_ACCESS_KEY"),
            secretAccessKey: env("DO_SPACE_SECRET_KEY"),
          },
          endpoint: env("DO_SPACE_ENDPOINT"),
          region: env("DO_SPACE_REGION"),
          forcePathStyle : false,
          params: {
            Bucket: env("DO_SPACE_BUCKET"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: "3.0.0",
      servers: [
        { url: "http://localhost:1337/api", description: "Development server" },
      ],
    },
  },
  "medusa-collections": {
    enabled: true,
    resolve: "./src/plugins/medusa-collections",
  },
  "strapi-typed-client": {
    enabled: true,
  },
  "croppable-media": {
    enabled: true,
    config: {
      cropSizes: [
        { label: "hero", ratio: [21, 9], maxWidth: 2400 },
        { label: "portrait", ratio: [3, 4], maxWidth: 900 },
      ],
    },
  },
});

export default config;
