/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    requestOtp: typeof routes['auth.request_otp']
    signup: typeof routes['auth.signup']
    verifyOtp: typeof routes['auth.verify_otp']
    login: typeof routes['auth.login']
    logout: typeof routes['auth.logout']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    addSubcategory: typeof routes['categories.add_subcategory']
    destroy: typeof routes['categories.destroy']
  }
  checklists: {
    index: typeof routes['checklists.index']
    show: typeof routes['checklists.show']
    store: typeof routes['checklists.store']
    update: typeof routes['checklists.update']
    destroy: typeof routes['checklists.destroy']
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
}
