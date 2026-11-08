import type { Schema, Struct } from '@strapi/strapi';

export interface SliderHeroSlider extends Struct.ComponentSchema {
  collectionName: 'components_slider_hero_sliders';
  info: {
    displayName: 'HeroSlider';
  };
  attributes: {
    banners: Schema.Attribute.Relation<'oneToMany', 'api::banner.banner'> &
      Schema.Attribute.Required;
    interactive_banners: Schema.Attribute.Relation<
      'oneToMany',
      'api::interactive-banner.interactive-banner'
    >;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'slider.hero-slider': SliderHeroSlider;
    }
  }
}
