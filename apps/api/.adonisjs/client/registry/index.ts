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
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/auth/me',
    tokens: [{"old":"/api/v1/auth/me","type":0,"val":"api","end":""},{"old":"/api/v1/auth/me","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/me","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
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
  'identity.otp_login': {
    methods: ["POST"],
    pattern: '/api/v1/auth/otp-login',
    tokens: [{"old":"/api/v1/auth/otp-login","type":0,"val":"api","end":""},{"old":"/api/v1/auth/otp-login","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/otp-login","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/otp-login","type":0,"val":"otp-login","end":""}],
    types: placeholder as Registry['identity.otp_login']['types'],
  },
  'identity.recover_password': {
    methods: ["POST"],
    pattern: '/api/v1/auth/password-recovery',
    tokens: [{"old":"/api/v1/auth/password-recovery","type":0,"val":"api","end":""},{"old":"/api/v1/auth/password-recovery","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/password-recovery","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/password-recovery","type":0,"val":"password-recovery","end":""}],
    types: placeholder as Registry['identity.recover_password']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/v1/auth/logout',
    tokens: [{"old":"/api/v1/auth/logout","type":0,"val":"api","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"v1","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/v1/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'catalogue.categories': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['catalogue.categories']['types'],
  },
  'catalogue.category': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.category']['types'],
  },
  'catalogue.checklists': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists',
    tokens: [{"old":"/api/v1/checklists","type":0,"val":"api","end":""},{"old":"/api/v1/checklists","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists","type":0,"val":"checklists","end":""}],
    types: placeholder as Registry['catalogue.checklists']['types'],
  },
  'catalogue.checklist': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.checklist']['types'],
  },
  'catalogue.cards': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/catalogue/cards',
    tokens: [{"old":"/api/v1/catalogue/cards","type":0,"val":"api","end":""},{"old":"/api/v1/catalogue/cards","type":0,"val":"v1","end":""},{"old":"/api/v1/catalogue/cards","type":0,"val":"catalogue","end":""},{"old":"/api/v1/catalogue/cards","type":0,"val":"cards","end":""}],
    types: placeholder as Registry['catalogue.cards']['types'],
  },
  'catalogue.card': {
    methods: ["GET","HEAD"],
    pattern: '/api/v1/catalogue/cards/:id',
    tokens: [{"old":"/api/v1/catalogue/cards/:id","type":0,"val":"api","end":""},{"old":"/api/v1/catalogue/cards/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/catalogue/cards/:id","type":0,"val":"catalogue","end":""},{"old":"/api/v1/catalogue/cards/:id","type":0,"val":"cards","end":""},{"old":"/api/v1/catalogue/cards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.card']['types'],
  },
  'catalogue.create_category': {
    methods: ["POST"],
    pattern: '/api/v1/categories',
    tokens: [{"old":"/api/v1/categories","type":0,"val":"api","end":""},{"old":"/api/v1/categories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['catalogue.create_category']['types'],
  },
  'catalogue.update_category': {
    methods: ["PUT"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.update_category']['types'],
  },
  'catalogue.archive_category': {
    methods: ["DELETE"],
    pattern: '/api/v1/categories/:id',
    tokens: [{"old":"/api/v1/categories/:id","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.archive_category']['types'],
  },
  'catalogue.create_subcategory': {
    methods: ["POST"],
    pattern: '/api/v1/categories/:id/subcategories',
    tokens: [{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"api","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"v1","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"categories","end":""},{"old":"/api/v1/categories/:id/subcategories","type":1,"val":"id","end":""},{"old":"/api/v1/categories/:id/subcategories","type":0,"val":"subcategories","end":""}],
    types: placeholder as Registry['catalogue.create_subcategory']['types'],
  },
  'catalogue.create_checklist': {
    methods: ["POST"],
    pattern: '/api/v1/checklists',
    tokens: [{"old":"/api/v1/checklists","type":0,"val":"api","end":""},{"old":"/api/v1/checklists","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists","type":0,"val":"checklists","end":""}],
    types: placeholder as Registry['catalogue.create_checklist']['types'],
  },
  'catalogue.update_checklist': {
    methods: ["PUT"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.update_checklist']['types'],
  },
  'catalogue.archive_checklist': {
    methods: ["DELETE"],
    pattern: '/api/v1/checklists/:id',
    tokens: [{"old":"/api/v1/checklists/:id","type":0,"val":"api","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"v1","end":""},{"old":"/api/v1/checklists/:id","type":0,"val":"checklists","end":""},{"old":"/api/v1/checklists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['catalogue.archive_checklist']['types'],
  },
  'catalogue.validate_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/validate',
    tokens: [{"old":"/api/v1/admin/catalogue-imports/validate","type":0,"val":"api","end":""},{"old":"/api/v1/admin/catalogue-imports/validate","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/catalogue-imports/validate","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/catalogue-imports/validate","type":0,"val":"catalogue-imports","end":""},{"old":"/api/v1/admin/catalogue-imports/validate","type":0,"val":"validate","end":""}],
    types: placeholder as Registry['catalogue.validate_import']['types'],
  },
  'catalogue.commit_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/:id/commit',
    tokens: [{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":0,"val":"api","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":0,"val":"catalogue-imports","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":1,"val":"id","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/commit","type":0,"val":"commit","end":""}],
    types: placeholder as Registry['catalogue.commit_import']['types'],
  },
  'catalogue.rollback_import': {
    methods: ["POST"],
    pattern: '/api/v1/admin/catalogue-imports/:id/rollback',
    tokens: [{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":0,"val":"api","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":0,"val":"v1","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":0,"val":"admin","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":0,"val":"catalogue-imports","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":1,"val":"id","end":""},{"old":"/api/v1/admin/catalogue-imports/:id/rollback","type":0,"val":"rollback","end":""}],
    types: placeholder as Registry['catalogue.rollback_import']['types'],
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
  'identity.preferences': {
    methods: ["PUT"],
    pattern: '/api/v1/account/preferences',
    tokens: [{"old":"/api/v1/account/preferences","type":0,"val":"api","end":""},{"old":"/api/v1/account/preferences","type":0,"val":"v1","end":""},{"old":"/api/v1/account/preferences","type":0,"val":"account","end":""},{"old":"/api/v1/account/preferences","type":0,"val":"preferences","end":""}],
    types: placeholder as Registry['identity.preferences']['types'],
  },
  'identity.deactivate': {
    methods: ["POST"],
    pattern: '/api/v1/account/deactivate',
    tokens: [{"old":"/api/v1/account/deactivate","type":0,"val":"api","end":""},{"old":"/api/v1/account/deactivate","type":0,"val":"v1","end":""},{"old":"/api/v1/account/deactivate","type":0,"val":"account","end":""},{"old":"/api/v1/account/deactivate","type":0,"val":"deactivate","end":""}],
    types: placeholder as Registry['identity.deactivate']['types'],
  },
  'identity.export_personal_data': {
    methods: ["POST"],
    pattern: '/api/v1/account/privacy-exports',
    tokens: [{"old":"/api/v1/account/privacy-exports","type":0,"val":"api","end":""},{"old":"/api/v1/account/privacy-exports","type":0,"val":"v1","end":""},{"old":"/api/v1/account/privacy-exports","type":0,"val":"account","end":""},{"old":"/api/v1/account/privacy-exports","type":0,"val":"privacy-exports","end":""}],
    types: placeholder as Registry['identity.export_personal_data']['types'],
  },
  'identity.delete_personal_data': {
    methods: ["POST"],
    pattern: '/api/v1/account/privacy-deletions',
    tokens: [{"old":"/api/v1/account/privacy-deletions","type":0,"val":"api","end":""},{"old":"/api/v1/account/privacy-deletions","type":0,"val":"v1","end":""},{"old":"/api/v1/account/privacy-deletions","type":0,"val":"account","end":""},{"old":"/api/v1/account/privacy-deletions","type":0,"val":"privacy-deletions","end":""}],
    types: placeholder as Registry['identity.delete_personal_data']['types'],
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
  'scrappers.collections': {
    methods: ["GET","HEAD"],
    pattern: '/scrapper/collections',
    tokens: [{"old":"/scrapper/collections","type":0,"val":"scrapper","end":""},{"old":"/scrapper/collections","type":0,"val":"collections","end":""}],
    types: placeholder as Registry['scrappers.collections']['types'],
  },
  'scrappers.start': {
    methods: ["POST"],
    pattern: '/scrapper/jobs',
    tokens: [{"old":"/scrapper/jobs","type":0,"val":"scrapper","end":""},{"old":"/scrapper/jobs","type":0,"val":"jobs","end":""}],
    types: placeholder as Registry['scrappers.start']['types'],
  },
  'scrappers.show': {
    methods: ["GET","HEAD"],
    pattern: '/scrapper/jobs/:jobId',
    tokens: [{"old":"/scrapper/jobs/:jobId","type":0,"val":"scrapper","end":""},{"old":"/scrapper/jobs/:jobId","type":0,"val":"jobs","end":""},{"old":"/scrapper/jobs/:jobId","type":1,"val":"jobId","end":""}],
    types: placeholder as Registry['scrappers.show']['types'],
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
