/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    requestOtp: typeof routes['auth.request_otp']
    me: typeof routes['auth.me']
    signup: typeof routes['auth.signup']
    verifyOtp: typeof routes['auth.verify_otp']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  identity: {
    otpLogin: typeof routes['identity.otp_login']
    recoverPassword: typeof routes['identity.recover_password']
    preferences: typeof routes['identity.preferences']
    deactivate: typeof routes['identity.deactivate']
    exportPersonalData: typeof routes['identity.export_personal_data']
    deletePersonalData: typeof routes['identity.delete_personal_data']
  }
  catalogue: {
    categories: typeof routes['catalogue.categories']
    category: typeof routes['catalogue.category']
    checklists: typeof routes['catalogue.checklists']
    checklist: typeof routes['catalogue.checklist']
    cards: typeof routes['catalogue.cards']
    card: typeof routes['catalogue.card']
    createCategory: typeof routes['catalogue.create_category']
    updateCategory: typeof routes['catalogue.update_category']
    archiveCategory: typeof routes['catalogue.archive_category']
    createSubcategory: typeof routes['catalogue.create_subcategory']
    createChecklist: typeof routes['catalogue.create_checklist']
    updateChecklist: typeof routes['catalogue.update_checklist']
    archiveChecklist: typeof routes['catalogue.archive_checklist']
    validateImport: typeof routes['catalogue.validate_import']
    commitImport: typeof routes['catalogue.commit_import']
    rollbackImport: typeof routes['catalogue.rollback_import']
  }
  reviews: {
    index: typeof routes['reviews.index']
    store: typeof routes['reviews.store']
  }
  profile: {
    show: typeof routes['profile.show']
    update: typeof routes['profile.update']
  }
  admin: {
    listUsers: typeof routes['admin.list_users']
    blockUser: typeof routes['admin.block_user']
  }
  userChecklists: {
    show: typeof routes['user_checklists.show']
    update: typeof routes['user_checklists.update']
    importExcel: typeof routes['user_checklists.import_excel']
  }
  swaps: {
    search: typeof routes['swaps.search']
    match: typeof routes['swaps.match']
  }
  conversations: {
    index: typeof routes['conversations.index']
    findOrCreate: typeof routes['conversations.find_or_create']
    show: typeof routes['conversations.show']
    storeMessage: typeof routes['conversations.store_message']
  }
  swapDeals: {
    store: typeof routes['swap_deals.store']
    accept: typeof routes['swap_deals.accept']
    updatePostal: typeof routes['swap_deals.update_postal']
    markReceived: typeof routes['swap_deals.mark_received']
    scanQr: typeof routes['swap_deals.scan_qr']
  }
  scrappers: {
    collections: typeof routes['scrappers.collections']
    start: typeof routes['scrappers.start']
    show: typeof routes['scrappers.show']
  }
}
