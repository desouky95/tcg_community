/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'auth.request_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/request-otp'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').requestOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').requestOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['requestOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['requestOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.signup': {
    methods: ["POST"]
    pattern: '/api/v1/auth/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signup']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signup']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify_otp': {
    methods: ["POST"]
    pattern: '/api/v1/auth/verify-otp'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').verifyOtpValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').verifyOtpValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyOtp']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'identity.otp_login': {
    methods: ["POST"]
    pattern: '/api/v1/auth/otp-login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/identity').otpLoginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/identity').otpLoginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['otpLogin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['otpLogin']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'identity.recover_password': {
    methods: ["POST"]
    pattern: '/api/v1/auth/password-recovery'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/identity').passwordRecoveryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/identity').passwordRecoveryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['recoverPassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['recoverPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.logout': {
    methods: ["POST"]
    pattern: '/api/v1/auth/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'catalogue.categories': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['categories']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['categories']>>>
    }
  }
  'catalogue.category': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['category']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['category']>>>
    }
  }
  'catalogue.checklists': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['checklists']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['checklists']>>>
    }
  }
  'catalogue.checklist': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['checklist']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['checklist']>>>
    }
  }
  'catalogue.cards': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/catalogue/cards'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['cards']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['cards']>>>
    }
  }
  'catalogue.card': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/catalogue/cards/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['card']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['card']>>>
    }
  }
  'catalogue.create_category': {
    methods: ["POST"]
    pattern: '/api/v1/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createCategory']>>>
    }
  }
  'catalogue.update_category': {
    methods: ["PUT"]
    pattern: '/api/v1/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateCategory']>>>
    }
  }
  'catalogue.archive_category': {
    methods: ["DELETE"]
    pattern: '/api/v1/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveCategory']>>>
    }
  }
  'catalogue.create_subcategory': {
    methods: ["POST"]
    pattern: '/api/v1/categories/:id/subcategories'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createSubcategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createSubcategory']>>>
    }
  }
  'catalogue.create_checklist': {
    methods: ["POST"]
    pattern: '/api/v1/checklists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createChecklist']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createChecklist']>>>
    }
  }
  'catalogue.update_checklist': {
    methods: ["PUT"]
    pattern: '/api/v1/checklists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateChecklist']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateChecklist']>>>
    }
  }
  'catalogue.archive_checklist': {
    methods: ["DELETE"]
    pattern: '/api/v1/checklists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveChecklist']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveChecklist']>>>
    }
  }
  'catalogue.validate_import': {
    methods: ["POST"]
    pattern: '/api/v1/admin/catalogue-imports/validate'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['validateImport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['validateImport']>>>
    }
  }
  'catalogue.commit_import': {
    methods: ["POST"]
    pattern: '/api/v1/admin/catalogue-imports/:id/commit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['commitImport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['commitImport']>>>
    }
  }
  'catalogue.rollback_import': {
    methods: ["POST"]
    pattern: '/api/v1/admin/catalogue-imports/:id/rollback'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['rollbackImport']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['rollbackImport']>>>
    }
  }
  'reviews.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/:id/reviews'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['index']>>>
    }
  }
  'reviews.store': {
    methods: ["POST"]
    pattern: '/api/v1/users/:targetUserId/reviews'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/review').addReviewValidator)>>
      paramsTuple: [ParamValue]
      params: { targetUserId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/review').addReviewValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'admin.list_users': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['listUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['listUsers']>>>
    }
  }
  'admin.block_user': {
    methods: ["POST"]
    pattern: '/api/v1/admin/users/:id/block'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['blockUser']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['blockUser']>>>
    }
  }
  'user_checklists.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/user-checklists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['show']>>>
    }
  }
  'user_checklists.update': {
    methods: ["POST"]
    pattern: '/api/v1/user-checklists/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_checklist').updateOrCreateUserChecklistValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_checklist').updateOrCreateUserChecklistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user_checklists.import_excel': {
    methods: ["POST"]
    pattern: '/api/v1/user-checklists/:id/import'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_checklist').importUpdateChecklist)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_checklist').importUpdateChecklist)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['importExcel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['importExcel']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'profile.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/account/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
    }
  }
  'profile.update': {
    methods: ["PUT"]
    pattern: '/api/v1/account/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'identity.preferences': {
    methods: ["PUT"]
    pattern: '/api/v1/account/preferences'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/identity').preferencesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/identity').preferencesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['preferences']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['preferences']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'identity.deactivate': {
    methods: ["POST"]
    pattern: '/api/v1/account/deactivate'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/identity').accountActionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/identity').accountActionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deactivate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deactivate']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'identity.export_personal_data': {
    methods: ["POST"]
    pattern: '/api/v1/account/privacy-exports'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['exportPersonalData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['exportPersonalData']>>>
    }
  }
  'identity.delete_personal_data': {
    methods: ["POST"]
    pattern: '/api/v1/account/privacy-deletions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/identity').accountActionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/identity').accountActionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deletePersonalData']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deletePersonalData']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'swaps.search': {
    methods: ["POST"]
    pattern: '/api/v1/swaps/search'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/swap').swapSearchValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/swap').swapSearchValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['search']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['search']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'swaps.match': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/swaps/:userId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { userId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['match']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['match']>>>
    }
  }
  'conversations.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/conversations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['index']>>>
    }
  }
  'conversations.find_or_create': {
    methods: ["POST"]
    pattern: '/api/v1/conversations/find-or-create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['findOrCreate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['findOrCreate']>>>
    }
  }
  'conversations.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/conversations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['show']>>>
    }
  }
  'conversations.store_message': {
    methods: ["POST"]
    pattern: '/api/v1/conversations/:id/messages'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['storeMessage']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['storeMessage']>>>
    }
  }
  'swap_deals.store': {
    methods: ["POST"]
    pattern: '/api/v1/swap-deals'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['store']>>>
    }
  }
  'swap_deals.accept': {
    methods: ["POST"]
    pattern: '/api/v1/swap-deals/:id/accept'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['accept']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['accept']>>>
    }
  }
  'swap_deals.update_postal': {
    methods: ["POST"]
    pattern: '/api/v1/swap-deals/:id/postal'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['updatePostal']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['updatePostal']>>>
    }
  }
  'swap_deals.mark_received': {
    methods: ["POST"]
    pattern: '/api/v1/swap-deals/:id/received'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['markReceived']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['markReceived']>>>
    }
  }
  'swap_deals.scan_qr': {
    methods: ["POST"]
    pattern: '/api/v1/swap-deals/:id/scan-qr'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['scanQr']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['scanQr']>>>
    }
  }
}
