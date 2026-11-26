import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'auth.request_otp': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.oauth_signup': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'auth.oauth_verify': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'auth.otp_login': { paramsTuple?: []; params?: {} }
    'auth.password_recovery': { paramsTuple?: []; params?: {} }
    'medusa.cards.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'medusa.cards.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
    'medusa.cards.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account.profile.show': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.request_otp': { paramsTuple?: []; params?: {} }
    'auth.verify_otp': { paramsTuple?: []; params?: {} }
    'auth.oauth_signup': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'auth.oauth_verify': { paramsTuple: [ParamValue]; params: {'provider': ParamValue} }
    'auth.otp_login': { paramsTuple?: []; params?: {} }
    'auth.password_recovery': { paramsTuple?: []; params?: {} }
  }
  PUT: {
  }
  DELETE: {
  }
  PATCH: {
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}