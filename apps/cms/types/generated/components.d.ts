import type { Schema, Struct } from '@strapi/strapi';

export interface GeneralPageTransition extends Struct.ComponentSchema {
  collectionName: 'components_general_page_transitions';
  info: {
    displayName: 'Page Transition';
  };
  attributes: {};
}

export interface HomepageBannerStrip extends Struct.ComponentSchema {
  collectionName: 'components_homepage_banner_strips';
  info: {
    displayName: 'BannerStrip';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface HomepageLatestProducts extends Struct.ComponentSchema {
  collectionName: 'components_homepage_latest_products';
  info: {
    displayName: 'Latest products';
  };
  attributes: {
    collection: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<'global::medusa-collection'>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 48;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<8>;
    shop_link: Schema.Attribute.String;
  };
}

export interface HomepageProductSection extends Struct.ComponentSchema {
  collectionName: 'components_homepage_product_sections';
  info: {
    displayName: 'Product section';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    shop_link: Schema.Attribute.String;
  };
}

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
      'general.page-transition': GeneralPageTransition;
      'homepage.banner-strip': HomepageBannerStrip;
      'homepage.latest-products': HomepageLatestProducts;
      'homepage.product-section': HomepageProductSection;
      'slider.hero-slider': SliderHeroSlider;
    }
  }
}
