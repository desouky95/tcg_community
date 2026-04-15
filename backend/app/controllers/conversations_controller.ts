import type { HttpContext } from '@adonisjs/core/http'
import Conversation from '#models/conversation'
import Message from '#models/message'
import User from '#models/user'
import SwapDeal from '#models/swap_deal'
import vine from '@vinejs/vine'

const messageValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1).maxLength(1000),
  })
)

export default class ConversationsController {
  /**
   * Retrieves or creates a conversation between the current user and the target user
   */
  async findOrCreate({ auth, request, response }: HttpContext) {
    const currentUserId = auth.user!.id
    const targetUserId = request.input('targetUserId')

    if (!targetUserId || currentUserId === targetUserId) {
      return response.badRequest('Invalid target user')
    }

    // Ensure target user exists
    await User.findOrFail(targetUserId)

    // Check if conversation exists
    let conversation = await Conversation.query()
      .where((query) => {
        query.where('user1Id', currentUserId).andWhere('user2Id', targetUserId)
      })
      .orWhere((query) => {
        query.where('user1Id', targetUserId).andWhere('user2Id', currentUserId)
      })
      .first()

    if (!conversation) {
      // Create new
      conversation = await Conversation.create({
        user1Id: currentUserId,
        user2Id: targetUserId,
      })
    }

    return response.json({ data: conversation })
  }

  /**
   * List all conversations for the current user
   */
  async index({ auth, response }: HttpContext) {
    const currentUserId = auth.user!.id

    const conversations = await Conversation.query()
      .where('user1Id', currentUserId)
      .orWhere('user2Id', currentUserId)
      .preload('user1')
      .preload('user2')
      .preload('messages', (q) => {
        q.orderBy('createdAt', 'desc').limit(1)
      })
      .orderBy('updatedAt', 'desc')

    // Find unread counts
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.query()
          .where('conversationId', conv.id)
          .where('senderId', '!=', currentUserId)
          .where('isRead', false)
          .count('* as count')

        const otherUser = conv.user1Id === currentUserId ? conv.user2 : conv.user1
        const lastMessage = conv.messages[0]

        return {
          id: conv.id,
          otherUser: {
            id: otherUser.id,
            username: otherUser.username,
            fullName: otherUser.fullName,
          },
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
                isRead: lastMessage.isRead,
              }
            : null,
          unreadCount: Number.parseInt(unreadCount[0].$extras.count, 10),
          updatedAt: conv.updatedAt,
        }
      })
    )

    // Sort by last message or updated at
    result.sort((a, b) => {
      const aTime = a.lastMessage ? a.lastMessage.createdAt.toMillis() : a.updatedAt.toMillis()
      const bTime = b.lastMessage ? b.lastMessage.createdAt.toMillis() : b.updatedAt.toMillis()
      return bTime - aTime
    })

    return response.json({ data: result })
  }

  /**
   * Show messages for a specific conversation
   */
  async show({ auth, params, request, response }: HttpContext) {
    const currentUserId = auth.user!.id
    const conversationId = params.id
    const page = request.input('page', 1)
    const limit = request.input('limit', 50)

    const conversation = await Conversation.findOrFail(conversationId)

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      return response.unauthorized('Not authorized to view this conversation')
    }

    // Mark messages as read
    await Message.query()
      .where('conversationId', conversation.id)
      .where('senderId', '!=', currentUserId)
      .where('isRead', false)
      .update({ isRead: true })

    const messages = await Message.query()
      .where('conversationId', conversation.id)
      .preload('sender', (q) => q.select('id', 'username', 'fullName'))
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    // Also get the other user info to display at top of chat
    const otherUserId =
      conversation.user1Id === currentUserId ? conversation.user2Id : conversation.user1Id
    const otherUser = await User.query()
      .select('id', 'username', 'fullName', 'lastLoginAt')
      .where('id', otherUserId)
      .first()

    const activeDeal = await SwapDeal.query()
      .where('conversationId', conversation.id)
      .whereIn('status', ['pending', 'accepted', 'shipping'])
      .first()

    return response.json({
      meta: {
        conversationId: conversation.id,
        otherUser,
        activeDeal,
        pagination: messages.getMeta(),
      },
      data: messages.all().reverse(), // We want oldest to newest for chat
    })
  }

  /**
   * Store a new message
   */
  async storeMessage({ auth, params, request, response }: HttpContext) {
    const currentUserId = auth.user!.id
    const conversationId = params.id

    // Validate request
    const { content } = await request.validateUsing(messageValidator)

    const conversation = await Conversation.findOrFail(conversationId)

    if (conversation.user1Id !== currentUserId && conversation.user2Id !== currentUserId) {
      return response.unauthorized('Not authorized to post to this conversation')
    }

    const message = await Message.create({
      conversationId: conversation.id,
      senderId: currentUserId,
      content,
      isRead: false,
    })

    // Update conversation updatedAt for sorting
    conversation.updatedAt = message.createdAt
    await conversation.save()

    return response.json({ data: message })
  }
}
