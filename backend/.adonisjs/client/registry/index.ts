/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.request_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/request-otp',
    tokens: [{"old":"/api/v1/auth/request-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/request-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/request-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/request-otp","type":0,"val":"request-otp","end":""}],
    types: placeholder as Registry['auth.request_otp']['types'],
  },
  'auth.signup': {
    methods: ["POST"],
    pattern: '/api/v1/auth/signup',
    tokens: [{"old":"/api/v1/auth/signup","type":0,"val":"api","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['auth.signup']['types'],
  },
  'auth.verify_otp': {
    methods: ["POST"],
    pattern: '/api/v1/auth/verify-otp',
    tokens: [{"old":"/api/v1/auth/verify-otp","type":0,"val":"api","end":""},{"old":"/api/v1/auth/verify-otp","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/verify-otp","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/verify-otp","type":0,"val":"verify-otp","end":""}],
    types: placeholder as Registry['auth.verify_otp']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/login',
    tokens: [{"old":"/api/v1/auth/login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.show']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.add_subcategory': {
    methods: ["POST"],
    pattern: '/api/v1/categories/:id/subcategories',
    tokens: [{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id/subcategories","type":1,"val":"id","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"subcategories","end":""}],
    types: placeholder as Registry['categories.add_subcategory']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'checklists.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists',
    tokens: [{"old":"/api/v1/checklists","type":0,"val":"api","end":""},{"old":"/api/v1/checklists","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists","type":0,"val":"checklists","end":""}],
    types: placeholder as Registry['checklists.index']['types'],
  },
  'checklists.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['checklists.show']['types'],
  },
  'checklists.store': {
    methods: ["POST"],
    pattern: '/api/v1/checklists',
    tokens: [{"old":"/api/v1/checklists","type":0,"val":"api","end":""},{"old":"/api/v1/checklists","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists","type":0,"val":"checklists","end":""}],
    types: placeholder as Registry['checklists.store']['types'],
  },
  'checklists.update': {
    methods: ["PUT"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['checklists.update']['types'],
  },
  'checklists.destroy': {
    methods: ["DELETE"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['checklists.destroy']['types'],
  },
  'reviews.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id/reviews',
    tokens: [{"old":"/api/v1/users/:id/reviews","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id/reviews","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id/reviews","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id/reviews","type":1,"val":"id","end":""},{"old":"/api/v1/users/:id/reviews","type":0,"val":"reviews","end":""}],
    types: placeholder as Registry['reviews.index']['types'],
  },
  'reviews.store': {
    methods: ["POST"],
    pattern: '/api/v1/users/:targetUserId/reviews',
    tokens: [{"old":"/api/v1/users/:targetUserId/reviews","type":0,"val":"api","end":""},{"old":"/api/v1/users/:targetUserId/reviews","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:targetUserId/reviews","type":0,"val":"users","end":""},{"old":"/api/v1/users/:targetUserId/reviews","type":1,"val":"targetUserId","end":""},{"old":"/api/v1/users/:targetUserId/reviews","type":0,"val":"reviews","end":""}],
    types: placeholder as Registry['reviews.store']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users/:id',
    tokens: [{"old":"/api/v1/users/:id","type":0,"val":"api","end":""},{"old":"/api/v1/users/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/users/:id","type":0,"val":"users","end":""},{"old":"/api/v1/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'admin.list_users': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/users',
    tokens: [{"old":"/api/v1/users","type":0,"val":"api","end":""},{"old":"/api/v1/users","type":0,"val":"v1","end":""},{"old":"/api/v1/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.list_users']['types'],
  },
  'admin.block_user': {
    methods: ["POST"],
    pattern: '/api/v1/admin/users/:id/block',
    tokens: [{"old":"/api/v1/admin/users/:id/block","type":0,"val":"api","end":""},{"old":"/api/v1/admin/users/:id/block","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/users/:id/block","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/users/:id/block","type":0,"val":"users","end":""},{"old":"/api/v1/admin/users/:id/block","type":1,"val":"id","end":""},{"old":"/api/v1/admin/users/:id/block","type":0,"val":"block","end":""}],
    types: placeholder as Registry['admin.block_user']['types'],
  },
  'user_checklists.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/user-checklists/:id',
    tokens: [{"old":"/api/v1/user-checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/user-checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/user-checklists/:id","type":0,"val":"user-checklists","end":""},{"old":"/api/v1/user-checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user_checklists.show']['types'],
  },
  'user_checklists.update': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id',
    tokens: [{"old":"/api/v1/user-checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/user-checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/user-checklists/:id","type":0,"val":"user-checklists","end":""},{"old":"/api/v1/user-checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['user_checklists.update']['types'],
  },
  'user_checklists.import_excel': {
    methods: ["POST"],
    pattern: '/api/v1/user-checklists/:id/import',
    tokens: [{"old":"/api/v1/user-checklists/:id/import","type":0,"val":"api","end":""},{"old":"/api/v1/user-checklists/:id/import","type":0,"val":"v1","end":""},{"old":"/api/v1/user-checklists/:id/import","type":0,"val":"user-checklists","end":""},{"old":"/api/v1/user-checklists/:id/import","type":1,"val":"id","end":""},{"old":"/api/v1/user-checklists/:id/import","type":0,"val":"import","end":""}],
    types: placeholder as Registry['user_checklists.import_excel']['types'],
  },
  'profile.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.show']['types'],
  },
  'profile.update': {
    methods: ["PUT"],
    pattern: '/api/v1/account/profile',
    tokens: [{"old":"/api/v1/account/profile","type":0,"val":"api","end":""},{"old":"/api/v1/account/profile","type":0,"val":"v1","end":""},{"old":"/api/v1/account/profile","type":0,"val":"account","end":""},{"old":"/api/v1/account/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update']['types'],
  },
  'swaps.search': {
    methods: ["POST"],
    pattern: '/api/v1/swaps/search',
    tokens: [{"old":"/api/v1/swaps/search","type":0,"val":"api","end":""},{"old":"/api/v1/swaps/search","type":0,"val":"v1","end":""},{"old":"/api/v1/swaps/search","type":0,"val":"swaps","end":""},{"old":"/api/v1/swaps/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['swaps.search']['types'],
  },
  'swaps.match': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/swaps/:userId',
    tokens: [{"old":"/api/v1/swaps/:userId","type":0,"val":"api","end":""},{"old":"/api/v1/swaps/:userId","type":0,"val":"v1","end":""},{"old":"/api/v1/swaps/:userId","type":0,"val":"swaps","end":""},{"old":"/api/v1/swaps/:userId","type":1,"val":"userId","end":""}],
    types: placeholder as Registry['swaps.match']['types'],
  },
  'conversations.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/conversations',
    tokens: [{"old":"/api/v1/conversations","type":0,"val":"api","end":""},{"old":"/api/v1/conversations","type":0,"val":"v1","end":""},{"old":"/api/v1/conversations","type":0,"val":"conversations","end":""}],
    types: placeholder as Registry['conversations.index']['types'],
  },
  'conversations.find_or_create': {
    methods: ["POST"],
    pattern: '/api/v1/conversations/find-or-create',
    tokens: [{"old":"/api/v1/conversations/find-or-create","type":0,"val":"api","end":""},{"old":"/api/v1/conversations/find-or-create","type":0,"val":"v1","end":""},{"old":"/api/v1/conversations/find-or-create","type":0,"val":"conversations","end":""},{"old":"/api/v1/conversations/find-or-create","type":0,"val":"find-or-create","end":""}],
    types: placeholder as Registry['conversations.find_or_create']['types'],
  },
  'conversations.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/conversations/:id',
    tokens: [{"old":"/api/v1/conversations/:id","type":0,"val":"api","end":""},{"old":"/api/v1/conversations/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/conversations/:id","type":0,"val":"conversations","end":""},{"old":"/api/v1/conversations/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['conversations.show']['types'],
  },
  'conversations.store_message': {
    methods: ["POST"],
    pattern: '/api/v1/conversations/:id/messages',
    tokens: [{"old":"/api/v1/conversations/:id/messages","type":0,"val":"api","end":""},{"old":"/api/v1/conversations/:id/messages","type":0,"val":"v1","end":""},{"old":"/api/v1/conversations/:id/messages","type":0,"val":"conversations","end":""},{"old":"/api/v1/conversations/:id/messages","type":1,"val":"id","end":""},{"old":"/api/v1/conversations/:id/messages","type":0,"val":"messages","end":""}],
    types: placeholder as Registry['conversations.store_message']['types'],
  },
  'swap_deals.store': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals',
    tokens: [{"old":"/api/v1/swap-deals","type":0,"val":"api","end":""},{"old":"/api/v1/swap-deals","type":0,"val":"v1","end":""},{"old":"/api/v1/swap-deals","type":0,"val":"swap-deals","end":""}],
    types: placeholder as Registry['swap_deals.store']['types'],
  },
  'swap_deals.accept': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/accept',
    tokens: [{"old":"/api/v1/swap-deals/:id/accept","type":0,"val":"api","end":""},{"old":"/api/v1/swap-deals/:id/accept","type":0,"val":"v1","end":""},{"old":"/api/v1/swap-deals/:id/accept","type":0,"val":"swap-deals","end":""},{"old":"/api/v1/swap-deals/:id/accept","type":1,"val":"id","end":""},{"old":"/api/v1/swap-deals/:id/accept","type":0,"val":"accept","end":""}],
    types: placeholder as Registry['swap_deals.accept']['types'],
  },
  'swap_deals.update_postal': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/postal',
    tokens: [{"old":"/api/v1/swap-deals/:id/postal","type":0,"val":"api","end":""},{"old":"/api/v1/swap-deals/:id/postal","type":0,"val":"v1","end":""},{"old":"/api/v1/swap-deals/:id/postal","type":0,"val":"swap-deals","end":""},{"old":"/api/v1/swap-deals/:id/postal","type":1,"val":"id","end":""},{"old":"/api/v1/swap-deals/:id/postal","type":0,"val":"postal","end":""}],
    types: placeholder as Registry['swap_deals.update_postal']['types'],
  },
  'swap_deals.mark_received': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/received',
    tokens: [{"old":"/api/v1/swap-deals/:id/received","type":0,"val":"api","end":""},{"old":"/api/v1/swap-deals/:id/received","type":0,"val":"v1","end":""},{"old":"/api/v1/swap-deals/:id/received","type":0,"val":"swap-deals","end":""},{"old":"/api/v1/swap-deals/:id/received","type":1,"val":"id","end":""},{"old":"/api/v1/swap-deals/:id/received","type":0,"val":"received","end":""}],
    types: placeholder as Registry['swap_deals.mark_received']['types'],
  },
  'swap_deals.scan_qr': {
    methods: ["POST"],
    pattern: '/api/v1/swap-deals/:id/scan-qr',
    tokens: [{"old":"/api/v1/swap-deals/:id/scan-qr","type":0,"val":"api","end":""},{"old":"/api/v1/swap-deals/:id/scan-qr","type":0,"val":"v1","end":""},{"old":"/api/v1/swap-deals/:id/scan-qr","type":0,"val":"swap-deals","end":""},{"old":"/api/v1/swap-deals/:id/scan-qr","type":1,"val":"id","end":""},{"old":"/api/v1/swap-deals/:id/scan-qr","type":0,"val":"scan-qr","end":""}],
    types: placeholder as Registry['swap_deals.scan_qr']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
