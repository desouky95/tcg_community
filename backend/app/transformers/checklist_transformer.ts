import { BaseTransformer } from '@adonisjs/core/transformers'
import type Checklist from '#models/checklist'
import UserChecklistTransformer from './user_checklist_transformer.ts'

export default class ChecklistTransformer extends BaseTransformer<Checklist> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'name', 'year', 'type', 'totalCards', 'cards']),
      // userChecklist: UserChecklistTransformer.transform(
      //   this.whenLoaded(this.resource.userChecklist[0])
      // ),
    }
  }
}
