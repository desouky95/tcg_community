import { BaseTransformer } from '@adonisjs/core/transformers'
import Conversation from '#models/conversation'

export default class ConversationTransformer extends BaseTransformer<Conversation> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}