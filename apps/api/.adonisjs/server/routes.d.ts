import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'drive.fs.serve': { paramsTuple: [...ParamValue[]]; params: {'*': ParamValue[]} }
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