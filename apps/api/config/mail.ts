import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: env.get('API_MAIL_MAILER'),

  /**
   * The default sender's email address and name. It is used when
   * no sender is explicitly defined for an email.
   */
  from: {
    address: env.get('API_MAIL_FROM_ADDRESS'),
    name: env.get('API_MAIL_FROM_NAME'),
  },

  /**
   * The globals are shared with all the templates rendered using the
   * configured template engine.
   *
   * This could be a nice place to define the logo URL, links base URL
   * the brand name to be used within the emails
   */
  globals: {
    brandName: 'Acme'
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {      
    resend: transports.resend({
      key: env.get('API_RESEND_API_KEY'),
      baseUrl: 'https://api.resend.com',
    }),
     
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}