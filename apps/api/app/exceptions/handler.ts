import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const candidate = error as {
      status?: number
      messages?: Array<{ field?: string; message?: string; rule?: string }>
    }
    if (candidate?.status === 422 && Array.isArray(candidate.messages)) {
      return ctx.response.status(422).json({
        error: {
          code: 'validation_error',
          message: 'Request validation failed',
          details: candidate.messages.map((item) => ({
            field: item.field,
            message: item.message,
            code: item.rule,
          })),
        },
      })
    }
    return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
