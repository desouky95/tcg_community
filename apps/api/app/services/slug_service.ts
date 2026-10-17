import type { LucidModel } from '@adonisjs/lucid/types/model'

class SlugService {
  async checkSlug<T extends LucidModel>(id: number, slug: string, model: T) {
    const isExist = await model.query().whereNot('id', id).where('slug', slug).first()

    if (isExist) {
      throw new Error('Slug already exist')
    }

    return isExist
  }
}

export const slugService = new SlugService()
