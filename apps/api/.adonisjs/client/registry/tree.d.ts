/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  catalogue: {
    createCategory: typeof routes['catalogue.create_category']
    updateCategory: typeof routes['catalogue.update_category']
    archiveCategory: typeof routes['catalogue.archive_category']
    createSubcategory: typeof routes['catalogue.create_subcategory']
    archiveChecklist: typeof routes['catalogue.archive_checklist']
    validateImport: typeof routes['catalogue.validate_import']
    commitImport: typeof routes['catalogue.commit_import']
    rollbackImport: typeof routes['catalogue.rollback_import']
  }
  checklists: {
    store: typeof routes['checklists.store']
    update: typeof routes['checklists.update']
    index: typeof routes['checklists.index']
    cover: typeof routes['checklists.cover']
    show: typeof routes['checklists.show']
    download: typeof routes['checklists.download']
    import: typeof routes['checklists.import']
  }
  admin: {
    blockUser: typeof routes['admin.block_user']
    listUsers: typeof routes['admin.list_users']
  }
  auth: {
    requestOtp: typeof routes['auth.request_otp']
    me: typeof routes['auth.me']
    signup: typeof routes['auth.signup']
    verifyOtp: typeof routes['auth.verify_otp']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  commerce: {
    customer: typeof routes['commerce.customer']
  }
  facebookAuth: {
    redirect: typeof routes['facebook_auth.redirect']
    finish: typeof routes['facebook_auth.finish']
    callback: typeof routes['facebook_auth.callback']
    signup: typeof routes['facebook_auth.signup']
    verify: typeof routes['facebook_auth.verify']
    pending: typeof routes['facebook_auth.pending']
    link: typeof routes['facebook_auth.link']
  }
  identity: {
    otpLogin: typeof routes['identity.otp_login']
    deleteDeactivatedAccount: typeof routes['identity.delete_deactivated_account']
    recoverPassword: typeof routes['identity.recover_password']
    getPreferences: typeof routes['identity.get_preferences']
    preferences: typeof routes['identity.preferences']
    deactivate: typeof routes['identity.deactivate']
    exportPersonalData: typeof routes['identity.export_personal_data']
    listPersonalExports: typeof routes['identity.list_personal_exports']
    getPersonalExport: typeof routes['identity.get_personal_export']
    downloadPersonalExport: typeof routes['identity.download_personal_export']
    deletePersonalData: typeof routes['identity.delete_personal_data']
  }
  categories: {
    index: typeof routes['categories.index']
    show: typeof routes['categories.show']
  }
  cards: {
    index: typeof routes['cards.index']
    batch: typeof routes['cards.batch']
  }
  conversations: {
    index: typeof routes['conversations.index']
    findOrCreate: typeof routes['conversations.find_or_create']
    show: typeof routes['conversations.show']
    storeMessage: typeof routes['conversations.store_message']
  }
  scrappers: {
    collections: typeof routes['scrappers.collections']
    scrapped: typeof routes['scrappers.scrapped']
    start: typeof routes['scrappers.start']
    show: typeof routes['scrappers.show']
  }
  swaps: {
    search: typeof routes['swaps.search']
    match: typeof routes['swaps.match']
  }
  swapDeals: {
    store: typeof routes['swap_deals.store']
    accept: typeof routes['swap_deals.accept']
    updatePostal: typeof routes['swap_deals.update_postal']
    markReceived: typeof routes['swap_deals.mark_received']
    scanQr: typeof routes['swap_deals.scan_qr']
  }
  collectionProgress: {
    publicView: typeof routes['collection_progress.public_view']
    start: typeof routes['collection_progress.start']
    details: typeof routes['collection_progress.details']
    batch: typeof routes['collection_progress.batch']
    visibility: typeof routes['collection_progress.visibility']
    reset: typeof routes['collection_progress.reset']
    preview: typeof routes['collection_progress.preview']
    commit: typeof routes['collection_progress.commit']
    export: typeof routes['collection_progress.export']
    legacyImport: typeof routes['collection_progress.legacy_import']
    sharedView: typeof routes['collection_progress.shared_view']
    dashboard: typeof routes['collection_progress.dashboard']
  }
  reviews: {
    index: typeof routes['reviews.index']
    store: typeof routes['reviews.store']
  }
  profile: {
    show: typeof routes['profile.show']
    update: typeof routes['profile.update']
  }
  userChecklists: {
    show: typeof routes['user_checklists.show']
    update: typeof routes['user_checklists.update']
  }
  commerceCatalog: {
    collections: typeof routes['commerce_catalog.collections']
    collection: typeof routes['commerce_catalog.collection']
    cards: typeof routes['commerce_catalog.cards']
    batch: typeof routes['commerce_catalog.batch']
  }
  configs: {
    config: typeof routes['configs.config']
  }
}
