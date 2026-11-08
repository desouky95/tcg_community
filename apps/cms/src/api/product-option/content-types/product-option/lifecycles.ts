interface LifecycleEvent {
  action: string;
  model: any;
  params: {
    data?: any;
    where?: any;
    select?: string[];
    populate?: any;
  };
  result?: any;
}
export default {
  async beforeDelete(event : LifecycleEvent) {
    const { where } = event.params
    
    // Find the option with its values
    const option = await strapi.db.query("api::product-option.product-option").findOne({
      where: {
        id: where.id,
      },
      populate: {
        values: true,
      },
    })

    if (option && option.values && option.values.length > 0) {
      // Delete all option values
      for (const value of option.values) {
        await strapi.documents("api::product-option-value.product-option-value").delete({
          documentId: value.documentId,
        })
      }
    }
  },
}