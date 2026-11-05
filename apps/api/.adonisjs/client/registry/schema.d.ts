/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractRawResponse, ExtractResponse, Method, PathWithRegistry, PatternsByMethod, RouteWithRegistry } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'
import type { routes } from './index.ts'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
      rawResponse: ExtractRawResponse<unknown>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createCategory']>>>
    }
  }
  'catalogue.update_category': {
    methods: ["PUT"]
    pattern: '/api/v1/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/category').updateCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/category').updateCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveCategory']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['createSubcategory']>>>
    }
  }
  'checklists.store': {
    methods: ["POST"]
    pattern: '/api/v1/checklists'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/checklist').createChecklistValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/checklist').createChecklistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'checklists.update': {
    methods: ["PUT"]
    pattern: '/api/v1/checklists/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/checklist').updateChecklistValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/checklist').updateChecklistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['archiveChecklist']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['validateImport']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['commitImport']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/catalogue_controller').default['rollbackImport']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['blockUser']>>>
    }
  }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['requestOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.me': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/auth/me'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['me']>>>
    }
  }
  'commerce.customer': {
    methods: ["POST"]
    pattern: '/api/v1/auth/commerce/customer'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commerce_controller').default['customer']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commerce_controller').default['customer']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commerce_controller').default['customer']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['signup']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyOtp']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['otpLogin']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['recoverPassword']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
    }
  }
  'categories.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['show']>>>
    }
  }
  'checklists.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['index']>>>
    }
  }
  'checklists.cover': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists/:id/cover'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['cover']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['cover']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['cover']>>>
    }
  }
  'checklists.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['show']>>>
    }
  }
  'checklists.download': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists/:id/download'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['download']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['download']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['download']>>>
    }
  }
  'cards.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/checklists/:id/cards'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
    }
  }
  'checklists.import': {
    methods: ["POST"]
    pattern: '/api/v1/checklists/:id/import'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/checklist').importChecklistValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/checklist').importChecklistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['import']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['import']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/checklists_controller').default['import']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'cards.index': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/medusa/checklists/:id/card'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['index']>>>
    }
  }
  'cards.batch': {
    methods: ["POST"]
    pattern: '/api/v1/cards/cards/batch'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['batch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['batch']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/cards_controller').default['batch']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['index']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['findOrCreate']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['show']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/conversations_controller').default['storeMessage']>>>
    }
  }
  'scrappers.collections': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scrapper/collections'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['collections']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['collections']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['collections']>>>
    }
  }
  'scrappers.scrapped': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scrapper/done'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['scrapped']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['scrapped']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['scrapped']>>>
    }
  }
  'scrappers.start': {
    methods: ["POST"]
    pattern: '/api/v1/scrapper/jobs'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/scraper').startScrapeJobValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/scraper').startScrapeJobValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['start']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['start']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['start']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'scrappers.show': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/scrapper/jobs/:jobId'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { jobId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['show']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/scrappers_controller').default['show']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['search']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swaps_controller').default['match']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['store']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['accept']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['updatePostal']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['markReceived']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/swap_deals_controller').default['scanQr']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['index']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/reviews_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/admin_controller').default['listUsers']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['show']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'user_checklists.import': {
    methods: ["POST"]
    pattern: '/api/v1/user-checklists/:id/import'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user_checklist').importUpdateChecklist)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user_checklist').importUpdateChecklist)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['import']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['import']>>> | { status: 422; response: { errors: SimpleError[] } }
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/user_checklists_controller').default['import']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['show']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/profile_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['preferences']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deactivate']>>> | { status: 422; response: { errors: SimpleError[] } }
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['exportPersonalData']>>>
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
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/identity_controller').default['deletePersonalData']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'commerce_catalog.collections': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/internal/card-catalog/collections'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collections']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collections']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collections']>>>
    }
  }
  'commerce_catalog.collection': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/internal/card-catalog/collections/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collection']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collection']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['collection']>>>
    }
  }
  'commerce_catalog.cards': {
    methods: ["GET","HEAD"]
    pattern: '/api/v1/internal/card-catalog/collections/:id/cards'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['cards']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['cards']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['cards']>>>
    }
  }
  'commerce_catalog.batch': {
    methods: ["POST"]
    pattern: '/api/v1/internal/card-catalog/cards/batch'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['batch']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['batch']>>>
      rawResponse: ExtractRawResponse<Awaited<ReturnType<import('#controllers/commerce_catalog_controller').default['batch']>>>
    }
  }
}

export namespace Route {
  export type Request<Name extends keyof typeof routes> = RouteWithRegistry.Request<typeof routes, Name>
  export type Response<Name extends keyof typeof routes> = RouteWithRegistry.Response<typeof routes, Name>
  export type Params<Name extends keyof typeof routes> = RouteWithRegistry.Params<typeof routes, Name>
  export type Body<Name extends keyof typeof routes> = RouteWithRegistry.Body<typeof routes, Name>
  export type Query<Name extends keyof typeof routes> = RouteWithRegistry.Query<typeof routes, Name>
  export type Error<Name extends keyof typeof routes> = RouteWithRegistry.Error<typeof routes, Name>
}

export namespace Path {
  export type Request<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Request<typeof routes, M, P>
  export type Response<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Response<typeof routes, M, P>
  export type Params<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Params<typeof routes, M, P>
  export type Body<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Body<typeof routes, M, P>
  export type Query<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Query<typeof routes, M, P>
  export type Error<M extends Method, P extends PatternsByMethod<typeof routes, M>> =
    PathWithRegistry.Error<typeof routes, M, P>
}
