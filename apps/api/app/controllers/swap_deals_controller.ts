import type { HttpContext } from '@adonisjs/core/http'
import SwapDeal from '#models/swap_deal'
import Message from '#models/message'
import Conversation from '#models/conversation'
import vine from '@vinejs/vine'

const proposeValidator = vine.compile(
  vine.object({
    conversation_id: vine.number(),
    swap_type: vine.enum(['in_person', 'postal']),
    offered_cards: vine.string().trim(),
    requested_cards: vine.string().trim(),
  })
)

export default class SwapDealsController {
  /**
   * Propose a new swap deal
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(proposeValidator)

    const conversation = await Conversation.find(payload.conversation_id)
    if (!conversation) {
      return response.notFound('Conversation not found')
    }

    // Verify user is part of the conversation
    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id) {
      return response.forbidden('Not authorized')
    }

    const ongoingDeal = await SwapDeal.query()
      .where('conversationId', payload.conversation_id)
      .whereIn('status', ['pending', 'accepted', 'shipping'])
      .first()

    if (ongoingDeal) {
      return response.badRequest('There is already an ongoing deal in this conversation.')
    }

    const deal = await SwapDeal.create({
      conversationId: payload.conversation_id,
      createdByUserId: user.id,
      swapType: payload.swap_type,
      offeredCards: payload.offered_cards,
      requestedCards: payload.requested_cards,
      status: 'pending',
    })

    // Create a plain notification message
    await Message.create({
      conversationId: payload.conversation_id,
      senderId: user.id,
      content: `I proposed a new swap deal. Click the swap banner above to view details.`,
      type: 'text',
    })

    return response.json({ data: deal })
  }

  /**
   * Accept a swap deal
   */
  async accept({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const deal = await SwapDeal.findOrFail(params.id)

    if (deal.createdByUserId === user.id) {
      return response.badRequest('You cannot accept your own deal')
    }

    if (deal.status !== 'pending') {
      return response.badRequest('Deal is no longer pending')
    }

    deal.status = 'accepted'
    await deal.save()

    await Message.create({
      conversationId: deal.conversationId,
      senderId: user.id,
      content: 'Accepted the deal',
      type: 'text',
    })

    return response.json({ data: deal })
  }

  /**
   * Update postal tracking info or photos
   */
  async updatePostal({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const deal = await SwapDeal.findOrFail(params.id)

    if (deal.swapType !== 'postal') {
      return response.badRequest('Not a postal deal')
    }

    const conversation = await Conversation.findOrFail(deal.conversationId)
    const isUser1 = conversation.user1Id === user.id
    const isUser2 = conversation.user2Id === user.id

    if (!isUser1 && !isUser2) return response.forbidden()

    const tracking = request.input('tracking')
    const photo = request.file('photo')

    if (tracking) {
      if (isUser1) deal.user1Tracking = tracking
      else deal.user2Tracking = tracking
      deal.status = 'shipping'
    }

    if (photo) {
      // Logic for saving photo would go here. Using a placeholder for now.
      const url = `uploads/deals/${deal.id}/${user.id}_${Date.now()}.png`
      if (isUser1) deal.user1PhotoUrl = url
      else deal.user2PhotoUrl = url
    }

    await deal.save()
    return response.json({ data: deal })
  }

  /**
   * Mark as received (postal)
   */
  async markReceived({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const deal = await SwapDeal.findOrFail(params.id)

    const conversation = await Conversation.findOrFail(deal.conversationId)
    const isUser1 = conversation.user1Id === user.id
    const isUser2 = conversation.user2Id === user.id

    if (!isUser1 && !isUser2) return response.forbidden()

    if (isUser1) deal.user1Received = true
    else deal.user2Received = true

    if (deal.user1Received && deal.user2Received) {
      deal.status = 'completed'
    }

    await deal.save()
    return response.json({ data: deal })
  }

  /**
   * QR Scanning (In-person)
   */
  async scanQr({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const deal = await SwapDeal.findOrFail(params.id)

    if (deal.swapType !== 'in_person') {
      return response.badRequest('Not an in-person deal')
    }

    const conversation = await Conversation.findOrFail(deal.conversationId)
    const isUser1 = conversation.user1Id === user.id
    const isUser2 = conversation.user2Id === user.id

    if (!isUser1 && !isUser2) return response.forbidden()

    if (isUser1) deal.user1QrScanned = true
    else deal.user2QrScanned = true

    if (deal.user1QrScanned && deal.user2QrScanned) {
      deal.status = 'completed'
    }

    await deal.save()
    return response.json({ data: deal })
  }
}
