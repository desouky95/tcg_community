import { BaseTransformer } from '@adonisjs/core/transformers'
import type Checklist from '#models/checklist'

export default class ChecklistTransformer extends BaseTransformer<Checklist> {
  toObject() {
    return {
      ...this.pick(this.resource, [
        'id',
        'name',
        'year',
        'type',
        'totalCards',
        'cards',
        'coverImageUrl',
      ]),
      // userChecklist: UserChecklistTransformer.transform(
      //   this.whenLoaded(this.resource.userChecklist[0])
      // ),
    }
  }
}
