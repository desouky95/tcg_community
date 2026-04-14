import { BaseTransformer } from '@adonisjs/core/transformers'
import type UserChecklist from '#models/user_checklist'

export default class UserChecklistTransformer extends BaseTransformer<UserChecklist> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'subCategory', 'checklist', 'checklistId']),
      missingListArray: this.resource.missingList?.split(','),
      duplicatesListArray: this.resource.duplicatesList?.split(','),
      collectedListArray: this.resource.collectedList?.split(','),
    }
  }
}
