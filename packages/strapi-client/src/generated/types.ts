/* eslint-disable */
// Auto-generated TypeScript types from Strapi schema
// Do not edit manually
// Base types

/**
 * Scalar identifier accepted by the Strapi v5 REST API for relations and media.
 * Strings are treated as documentId; numbers fall back to the legacy numeric id.
 */
export type StrapiID = string | number

/**
 * Where a connected relation lands in an ordered relation list.
 */
export interface RelationPosition {
  before?: StrapiID | undefined
  after?: StrapiID | undefined
  start?: true | undefined
  end?: true | undefined
}

/**
 * Object form of a relation target. Strapi v5 accepts it wherever a plain id is accepted;
 * `locale` / `status` pick the localized or draft version of the target document.
 */
export interface RelationRef {
  documentId?: string | undefined
  id?: number | undefined
  locale?: string | null | undefined
  status?: 'draft' | 'published' | undefined
  position?: RelationPosition | undefined
}

/**
 * Explicit relation operations supported by Strapi v5.
 * See: https://docs.strapi.io/cms/api/rest/relations
 */
export interface RelationOperations {
  connect?: (StrapiID | RelationRef)[] | undefined
  disconnect?: (StrapiID | RelationRef)[] | undefined
  set?: (StrapiID | RelationRef)[] | undefined
}

/**
 * A single relation target: an id, a documentId or a reference object.
 */
export type RelationTarget = StrapiID | RelationRef

/**
 * Relation operations on a to-one field. Strapi keeps one entry in a to-one
 * relation, so `connect` and `set` take at most one target.
 */
export interface ToOneRelationOperations {
  connect?: [] | [RelationTarget] | undefined
  disconnect?: RelationTarget[] | undefined
  set?: [] | [RelationTarget] | undefined
}

/**
 * Cardinality of a relation field, as seen from the field being written.
 * `oneToMany` and `manyToOne` are opposite sides of the same relationship, so the
 * input type follows the kind of the field itself, not of the relationship.
 */
export type RelationKind = 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany'

/**
 * Input value for a relation field in create/update payloads, shaped by its cardinality:
 * - to-one (`oneToOne`, `manyToOne`): one id or reference, at most one in a list or in connect/set, or null to clear.
 *   Strapi silently keeps only the last entry when a to-one gets more than one, so the types reject that.
 * - to-many (`oneToMany`, `manyToMany`): an id or reference (shorthand for a one-element set), an array of them, the explicit { connect | disconnect | set } form, or null to clear.
 * Passing a plain id or array is equivalent to 'set' — it overwrites existing relations.
 * Without a type argument it accepts every shape, for hand-written helpers that handle any relation.
 */
export type RelationInput<K extends RelationKind = RelationKind> = K extends
  'oneToOne' | 'manyToOne'
  ? RelationTarget | [] | [RelationTarget] | ToOneRelationOperations | null
  : RelationTarget | RelationTarget[] | RelationOperations | null

/**
 * Input value for a single media file field. Accepts a documentId (string) or
 * legacy numeric id.
 */
export type MediaInput = StrapiID | null

/**
 * Input value for a multi-media field. Accepts an array of ids.
 */
export type MultiMediaInput = StrapiID[] | null

export interface MediaFormat {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string | null
  size: number
  width: number
  height: number
  sizeInBytes: number
}

export interface BaseMediaFormats {
  thumbnail?: MediaFormat
  small?: MediaFormat
  medium?: MediaFormat
  large?: MediaFormat
  [key: string]: MediaFormat | undefined
}

export interface MediaFile {
  id: number
  name: string
  alternativeText: string | null
  caption: string | null
  focalPoint: { x: number; y: number } | null
  width: number | null
  height: number | null
  formats: BaseMediaFormats | null
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  createdAt: string
  updatedAt: string
}

/**
 * A locale as returned by the i18n plugin's content API.
 * Shape follows the response validator @strapi/i18n applies to GET /i18n/locales.
 */
export interface I18nLocale {
  id: number
  documentId: string
  name: string
  code: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

/**
 * The admin user behind `createdBy` / `updatedBy`, as the content API returns it.
 * Only the four attributes admin::user leaves non-private survive sanitization —
 * email, roles and the token fields are private and never sent. The document
 * base fields come with it: Strapi's own guide lists neither documentId nor
 * publishedAt, but a live 5.44 backend returns both.
 */
export interface AdminUser {
  id: number
  documentId: string
  firstname: string | null
  lastname: string | null
  username: string | null
  preferedLanguage: string | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

// Strapi Blocks Editor API Types
// Based on: https://docs.strapi.io/dev-docs/api/document/blocks

/**
 * Main type for Strapi Blocks content
 */
export type BlocksContent = Block[]

/**
 * All possible block types
 */
export type Block = ParagraphBlock | HeadingBlock | QuoteBlock | CodeBlock | ListBlock | ImageBlock

/**
 * Paragraph block - default text block
 */
export interface ParagraphBlock {
  type: 'paragraph'
  children: InlineNode[]
}

/**
 * Heading block - h1 to h6
 */
export interface HeadingBlock {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: InlineNode[]
}

/**
 * Quote block - blockquote
 */
export interface QuoteBlock {
  type: 'quote'
  children: InlineNode[]
}

/**
 * Code block - preformatted code with optional language
 */
export interface CodeBlock {
  type: 'code'
  language?: string
  children: InlineNode[]
}

/**
 * List block - ordered or unordered (supports nesting)
 */
export interface ListBlock {
  type: 'list'
  format: 'ordered' | 'unordered'
  children: (ListItemBlock | ListBlock)[]
}

/**
 * List item - individual item in a list
 */
export interface ListItemBlock {
  type: 'list-item'
  children: InlineNode[]
}

/**
 * Image block - embedded image
 */
export interface ImageBlock {
  type: 'image'
  image: {
    name: string
    alternativeText?: string | null
    url: string
    caption?: string | null
    width: number
    height: number
    formats?: BaseMediaFormats
    hash: string
    ext: string
    mime: string
    size: number
    previewUrl?: string | null
    provider: string
    provider_metadata?: unknown | null
    createdAt: string
    updatedAt: string
  }
  children: [{ type: 'text'; text: '' }]
}

/**
 * Inline nodes - text formatting and inline elements
 */
export type InlineNode = TextNode | LinkInline

/**
 * Plain text node with optional formatting
 */
export interface TextNode {
  type: 'text'
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
}

/**
 * Inline link
 */
export interface LinkInline {
  type: 'link'
  url: string
  children: TextNode[]
}
// Helper types for field and sort options in populate
type _EntityField<T> = Exclude<keyof T & string, '__typename'>
type _SortValue<T> = _EntityField<T> | `${_EntityField<T>}:${'asc' | 'desc'}`

// Apply fields narrowing from populate entry (e.g. populate: { item: { fields: ["title"] } })
type _ApplyFields<TFull, TBase, TEntry> = TEntry extends true
  ? TFull
  : TEntry extends { fields: readonly (infer F extends string)[] }
    ? Pick<TBase, Extract<F | 'id' | 'documentId', keyof TBase>> & Omit<TFull, keyof TBase>
    : TFull

export interface GeneralPageTransition {
  id: number
}

export interface HomepageBannerStrip {
  id: number
}

export interface HomepageCollectionSection {
  id: number
  collection: string | null
  /** @default 4 */
  limit: number
  heading: string
  description: string | null
  shop_link: string | null
  variant: 'dark' | 'default' | null
}

export interface HomepageLatestProducts {
  id: number
  heading: string
  description: string | null
  shop_link: string | null
  collection: string
  /**
   * @minimum 1
   * @maximum 48
   * @default 8
   */
  limit: number
}

export interface HomepageProductSection {
  id: number
  heading: string
  description: string | null
  shop_link: string | null
}

export interface SliderHeroSlider {
  id: number
}

export type HomepageBannerStripDz = HomepageBannerStrip & { __component: 'homepage.banner-strip' }
export type HomepageCollectionSectionDz = HomepageCollectionSection & {
  __component: 'homepage.collection-section'
}
export type HomepageLatestProductsDz = HomepageLatestProducts & {
  __component: 'homepage.latest-products'
}
export type HomepageProductSectionDz = HomepageProductSection & {
  __component: 'homepage.product-section'
}
export type SliderHeroSliderDz = SliderHeroSlider & { __component: 'slider.hero-slider' }

/** Create input for GeneralPageTransition */
export interface GeneralPageTransitionCreateInput {
  id?: number | undefined
}

/** Update input for GeneralPageTransition */
export interface GeneralPageTransitionUpdateInput {
  id?: number | undefined
}

/** Create input for HomepageBannerStrip */
export interface HomepageBannerStripCreateInput {
  id?: number | undefined
  image?: MediaInput | undefined
}

/** Update input for HomepageBannerStrip */
export interface HomepageBannerStripUpdateInput {
  id?: number | undefined
  image?: MediaInput | undefined
}

/** Create input for HomepageCollectionSection */
export interface HomepageCollectionSectionCreateInput {
  id?: number | undefined
  collection?: string | null | undefined
  /** @default 4 */
  limit?: number | undefined
  heading: string
  description?: string | null | undefined
  shop_link?: string | null | undefined
  variant?: 'dark' | 'default' | null | undefined
  banner?: MediaInput | undefined
}

/** Update input for HomepageCollectionSection */
export interface HomepageCollectionSectionUpdateInput {
  id?: number | undefined
  collection?: string | null | undefined
  /** @default 4 */
  limit?: number | undefined
  heading?: string | undefined
  description?: string | null | undefined
  shop_link?: string | null | undefined
  variant?: 'dark' | 'default' | null | undefined
  banner?: MediaInput | undefined
}

/** Create input for HomepageLatestProducts */
export interface HomepageLatestProductsCreateInput {
  id?: number | undefined
  heading: string
  description?: string | null | undefined
  shop_link?: string | null | undefined
  collection: string
  /**
   * @minimum 1
   * @maximum 48
   * @default 8
   */
  limit?: number | undefined
}

/** Update input for HomepageLatestProducts */
export interface HomepageLatestProductsUpdateInput {
  id?: number | undefined
  heading?: string | undefined
  description?: string | null | undefined
  shop_link?: string | null | undefined
  collection?: string | undefined
  /**
   * @minimum 1
   * @maximum 48
   * @default 8
   */
  limit?: number | undefined
}

/** Create input for HomepageProductSection */
export interface HomepageProductSectionCreateInput {
  id?: number | undefined
  heading: string
  description?: string | null | undefined
  shop_link?: string | null | undefined
  products?: RelationInput<'oneToMany'> | undefined
}

/** Update input for HomepageProductSection */
export interface HomepageProductSectionUpdateInput {
  id?: number | undefined
  heading?: string | undefined
  description?: string | null | undefined
  shop_link?: string | null | undefined
  products?: RelationInput<'oneToMany'> | undefined
}

/** Create input for SliderHeroSlider */
export interface SliderHeroSliderCreateInput {
  id?: number | undefined
  banners?: RelationInput<'oneToMany'> | undefined
  interactive_banners?: RelationInput<'oneToMany'> | undefined
}

/** Update input for SliderHeroSlider */
export interface SliderHeroSliderUpdateInput {
  id?: number | undefined
  banners?: RelationInput<'oneToMany'> | undefined
  interactive_banners?: RelationInput<'oneToMany'> | undefined
}

export type HomepageBannerStripDzCreateInput = HomepageBannerStripCreateInput & {
  __component: 'homepage.banner-strip'
}
export type HomepageBannerStripDzUpdateInput = HomepageBannerStripUpdateInput & {
  __component: 'homepage.banner-strip'
}
export type HomepageCollectionSectionDzCreateInput = HomepageCollectionSectionCreateInput & {
  __component: 'homepage.collection-section'
}
export type HomepageCollectionSectionDzUpdateInput = HomepageCollectionSectionUpdateInput & {
  __component: 'homepage.collection-section'
}
export type HomepageLatestProductsDzCreateInput = HomepageLatestProductsCreateInput & {
  __component: 'homepage.latest-products'
}
export type HomepageLatestProductsDzUpdateInput = HomepageLatestProductsUpdateInput & {
  __component: 'homepage.latest-products'
}
export type HomepageProductSectionDzCreateInput = HomepageProductSectionCreateInput & {
  __component: 'homepage.product-section'
}
export type HomepageProductSectionDzUpdateInput = HomepageProductSectionUpdateInput & {
  __component: 'homepage.product-section'
}
export type SliderHeroSliderDzCreateInput = SliderHeroSliderCreateInput & {
  __component: 'slider.hero-slider'
}
export type SliderHeroSliderDzUpdateInput = SliderHeroSliderUpdateInput & {
  __component: 'slider.hero-slider'
}

export interface Banner {
  readonly __typename?: 'Banner'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  Title: string | null
  subtitle: string | null
  /** @default false */
  active: boolean | null
  /** @default "eg" */
  country: string
  url: string | null
  locale: string | null
}

export interface Homepage {
  readonly __typename?: 'Homepage'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface InteractiveBanner {
  readonly __typename?: 'InteractiveBanner'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  /** @default "url" */
  url: string
  type: 'open_pack' | 'card_3d' | null
}

export interface PageTransition {
  readonly __typename?: 'PageTransition'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}

export interface ProductOptionValue {
  readonly __typename?: 'ProductOptionValue'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  medusaId: string
  value: string
}

export interface ProductOption {
  readonly __typename?: 'ProductOption'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  medusaId: string
  title: string
}

export interface ProductVariant {
  readonly __typename?: 'ProductVariant'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  medusaId: string
  title: string
  sku: string | null
  imageUrls: unknown | null
  thumbnailUrl: string | null
  /** @default false */
  managedByMedusa: boolean | null
}

export interface Product {
  readonly __typename?: 'Product'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  medusaId: string
  title: string
  subtitle: string | null
  description: string | null
  handle: string
  imageUrls: unknown | null
  thumbnailUrl: string | null
}

export interface Permission {
  readonly __typename?: 'Permission'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  action: string
}

export interface Role {
  readonly __typename?: 'Role'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  /** @minLength 3 */
  name: string
  description: string | null
  type: string | null
}

export interface User {
  readonly __typename?: 'User'
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  /** @minLength 3 */
  username: string
  /** @minLength 6 */
  email: string
  provider: string | null
  /** @default false */
  confirmed: boolean | null
  /** @default false */
  blocked: boolean | null
}

/** Create input for Banner */
export interface BannerCreateInput {
  Title?: string | null | undefined
  subtitle?: string | null | undefined
  /** @default false */
  active?: boolean | null | undefined
  /** @default "eg" */
  country?: string | undefined
  url?: string | null | undefined
  web_image?: MediaInput | undefined
  mobile_image?: MediaInput | undefined
}

/** Update input for Banner */
export interface BannerUpdateInput {
  Title?: string | null | undefined
  subtitle?: string | null | undefined
  /** @default false */
  active?: boolean | null | undefined
  /** @default "eg" */
  country?: string | undefined
  url?: string | null | undefined
  web_image?: MediaInput | undefined
  mobile_image?: MediaInput | undefined
}

/** Create input for Homepage */
export interface HomepageCreateInput {
  sections?:
    | (
        | SliderHeroSliderDzCreateInput
        | HomepageProductSectionDzCreateInput
        | HomepageLatestProductsDzCreateInput
        | HomepageBannerStripDzCreateInput
        | HomepageCollectionSectionDzCreateInput
      )[]
    | undefined
}

/** Update input for Homepage */
export interface HomepageUpdateInput {
  sections?:
    | (
        | SliderHeroSliderDzUpdateInput
        | HomepageProductSectionDzUpdateInput
        | HomepageLatestProductsDzUpdateInput
        | HomepageBannerStripDzUpdateInput
        | HomepageCollectionSectionDzUpdateInput
      )[]
    | undefined
}

/** Create input for InteractiveBanner */
export interface InteractiveBannerCreateInput {
  /** @default "url" */
  url?: string | undefined
  type?: 'open_pack' | 'card_3d' | null | undefined
}

/** Update input for InteractiveBanner */
export interface InteractiveBannerUpdateInput {
  /** @default "url" */
  url?: string | undefined
  type?: 'open_pack' | 'card_3d' | null | undefined
}

/** Create input for PageTransition */
export interface PageTransitionCreateInput {
  packs?: MultiMediaInput | undefined
}

/** Update input for PageTransition */
export interface PageTransitionUpdateInput {
  packs?: MultiMediaInput | undefined
}

/** Create input for ProductOptionValue */
export interface ProductOptionValueCreateInput {
  medusaId: string
  value: string
  option?: RelationInput<'manyToOne'> | undefined
  variants?: RelationInput<'manyToMany'> | undefined
}

/** Update input for ProductOptionValue */
export interface ProductOptionValueUpdateInput {
  medusaId?: string | undefined
  value?: string | undefined
  option?: RelationInput<'manyToOne'> | undefined
  variants?: RelationInput<'manyToMany'> | undefined
}

/** Create input for ProductOption */
export interface ProductOptionCreateInput {
  medusaId: string
  title: string
  products?: RelationInput<'manyToMany'> | undefined
  values?: RelationInput<'oneToMany'> | undefined
}

/** Update input for ProductOption */
export interface ProductOptionUpdateInput {
  medusaId?: string | undefined
  title?: string | undefined
  products?: RelationInput<'manyToMany'> | undefined
  values?: RelationInput<'oneToMany'> | undefined
}

/** Create input for ProductVariant */
export interface ProductVariantCreateInput {
  medusaId: string
  title: string
  sku?: string | null | undefined
  imageUrls?: unknown | null | undefined
  thumbnailUrl?: string | null | undefined
  /** @default false */
  managedByMedusa?: boolean | null | undefined
  images?: MultiMediaInput | undefined
  thumbnail?: MediaInput | undefined
  product?: RelationInput<'manyToOne'> | undefined
  option_values?: RelationInput<'manyToMany'> | undefined
}

/** Update input for ProductVariant */
export interface ProductVariantUpdateInput {
  medusaId?: string | undefined
  title?: string | undefined
  sku?: string | null | undefined
  imageUrls?: unknown | null | undefined
  thumbnailUrl?: string | null | undefined
  /** @default false */
  managedByMedusa?: boolean | null | undefined
  images?: MultiMediaInput | undefined
  thumbnail?: MediaInput | undefined
  product?: RelationInput<'manyToOne'> | undefined
  option_values?: RelationInput<'manyToMany'> | undefined
}

/** Create input for Product */
export interface ProductCreateInput {
  medusaId: string
  title: string
  subtitle?: string | null | undefined
  description?: string | null | undefined
  handle: string
  imageUrls?: unknown | null | undefined
  thumbnailUrl?: string | null | undefined
  images?: MultiMediaInput | undefined
  thumbnail?: MediaInput | undefined
  variants?: RelationInput<'oneToMany'> | undefined
  options?: RelationInput<'manyToMany'> | undefined
}

/** Update input for Product */
export interface ProductUpdateInput {
  medusaId?: string | undefined
  title?: string | undefined
  subtitle?: string | null | undefined
  description?: string | null | undefined
  handle?: string | undefined
  imageUrls?: unknown | null | undefined
  thumbnailUrl?: string | null | undefined
  images?: MultiMediaInput | undefined
  thumbnail?: MediaInput | undefined
  variants?: RelationInput<'oneToMany'> | undefined
  options?: RelationInput<'manyToMany'> | undefined
}

/** Create input for Permission */
export interface PermissionCreateInput {
  action: string
  role?: RelationInput<'manyToOne'> | undefined
}

/** Update input for Permission */
export interface PermissionUpdateInput {
  action?: string | undefined
  role?: RelationInput<'manyToOne'> | undefined
}

/** Create input for Role */
export interface RoleCreateInput {
  /** @minLength 3 */
  name: string
  description?: string | null | undefined
  type?: string | null | undefined
  permissions?: RelationInput<'oneToMany'> | undefined
  users?: RelationInput<'oneToMany'> | undefined
}

/** Update input for Role */
export interface RoleUpdateInput {
  /** @minLength 3 */
  name?: string | undefined
  description?: string | null | undefined
  type?: string | null | undefined
  permissions?: RelationInput<'oneToMany'> | undefined
  users?: RelationInput<'oneToMany'> | undefined
}

/** Create input for User */
export interface UserCreateInput {
  /** @minLength 3 */
  username: string
  /** @minLength 6 */
  email: string
  provider?: string | null | undefined
  /** @default false */
  confirmed?: boolean | null | undefined
  /** @default false */
  blocked?: boolean | null | undefined
  /** @minLength 6 */
  password?: string | null | undefined
  resetPasswordToken?: string | null | undefined
  confirmationToken?: string | null | undefined
  role?: RelationInput<'manyToOne'> | undefined
}

/** Update input for User */
export interface UserUpdateInput {
  /** @minLength 3 */
  username?: string | undefined
  /** @minLength 6 */
  email?: string | undefined
  provider?: string | null | undefined
  /** @default false */
  confirmed?: boolean | null | undefined
  /** @default false */
  blocked?: boolean | null | undefined
  /** @minLength 6 */
  password?: string | null | undefined
  resetPasswordToken?: string | null | undefined
  confirmationToken?: string | null | undefined
  role?: RelationInput<'manyToOne'> | undefined
}
export const BannerDefaults = {
  active: false,
  country: 'eg',
} as const satisfies Partial<BannerCreateInput>
export const InteractiveBannerDefaults = {
  url: 'url',
} as const satisfies Partial<InteractiveBannerCreateInput>
export const ProductVariantDefaults = {
  managedByMedusa: false,
} as const satisfies Partial<ProductVariantCreateInput>
export const UserDefaults = {
  confirmed: false,
  blocked: false,
} as const satisfies Partial<UserCreateInput>
export const HomepageCollectionSectionDefaults = {
  limit: 4,
} as const satisfies Partial<HomepageCollectionSectionCreateInput>
export const HomepageLatestProductsDefaults = {
  limit: 8,
} as const satisfies Partial<HomepageLatestProductsCreateInput>
export const HomepageBannerStripDzDefaults = {
  __component: 'homepage.banner-strip',
} as const satisfies Partial<HomepageBannerStripDzCreateInput>
export const HomepageCollectionSectionDzDefaults = {
  __component: 'homepage.collection-section',
  limit: 4,
} as const satisfies Partial<HomepageCollectionSectionDzCreateInput>
export const HomepageLatestProductsDzDefaults = {
  __component: 'homepage.latest-products',
  limit: 8,
} as const satisfies Partial<HomepageLatestProductsDzCreateInput>
export const HomepageProductSectionDzDefaults = {
  __component: 'homepage.product-section',
} as const satisfies Partial<HomepageProductSectionDzCreateInput>
export const SliderHeroSliderDzDefaults = {
  __component: 'slider.hero-slider',
} as const satisfies Partial<SliderHeroSliderDzCreateInput>
// ============================================
// PopulateParam types for type-safe populate
// ============================================
export type HomepageBannerStripPopulateParam = {
  image?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type HomepageCollectionSectionPopulateParam = {
  banner?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type HomepageProductSectionPopulateParam = {
  products?:
    | true
    | {
        count: true
        filters?: ProductFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Product>[]
        populate?: ProductPopulateParam | (keyof ProductPopulateParam & string)[] | '*'
        filters?: ProductFilters
        sort?: _SortValue<Product> | _SortValue<Product>[]
        limit?: number
        start?: number
      }
}
export type SliderHeroSliderPopulateParam = {
  banners?:
    | true
    | {
        count: true
        filters?: BannerFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Banner>[]
        populate?: BannerPopulateParam | (keyof BannerPopulateParam & string)[] | '*'
        filters?: BannerFilters
        sort?: _SortValue<Banner> | _SortValue<Banner>[]
        limit?: number
        start?: number
      }
  interactive_banners?:
    | true
    | {
        count: true
        filters?: InteractiveBannerFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<InteractiveBanner>[]
        filters?: InteractiveBannerFilters
        sort?: _SortValue<InteractiveBanner> | _SortValue<InteractiveBanner>[]
        limit?: number
        start?: number
      }
}
export type BannerPopulateParam = {
  localizations?:
    | true
    | {
        count: true
        filters?: BannerFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Banner>[]
        populate?: BannerPopulateParam | (keyof BannerPopulateParam & string)[] | '*'
        filters?: BannerFilters
        sort?: _SortValue<Banner> | _SortValue<Banner>[]
        limit?: number
        start?: number
      }
  web_image?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
  mobile_image?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type HomepagePopulateParam = {
  sections?:
    | true
    | {
        on?: {
          'slider.hero-slider'?:
            | true
            | {
                fields?: (keyof SliderHeroSlider & string)[]
                populate?:
                  | SliderHeroSliderPopulateParam
                  | (keyof SliderHeroSliderPopulateParam & string)[]
                  | '*'
                count?: never
              }
          'homepage.product-section'?:
            | true
            | {
                fields?: (keyof HomepageProductSection & string)[]
                populate?:
                  | HomepageProductSectionPopulateParam
                  | (keyof HomepageProductSectionPopulateParam & string)[]
                  | '*'
                count?: never
              }
          'homepage.latest-products'?:
            true | { fields?: (keyof HomepageLatestProducts & string)[]; count?: never }
          'homepage.banner-strip'?:
            | true
            | {
                fields?: (keyof HomepageBannerStrip & string)[]
                populate?:
                  | HomepageBannerStripPopulateParam
                  | (keyof HomepageBannerStripPopulateParam & string)[]
                  | '*'
                count?: never
              }
          'homepage.collection-section'?:
            | true
            | {
                fields?: (keyof HomepageCollectionSection & string)[]
                populate?:
                  | HomepageCollectionSectionPopulateParam
                  | (keyof HomepageCollectionSectionPopulateParam & string)[]
                  | '*'
                count?: never
              }
        }
        count?: never
      }
}
export type PageTransitionPopulateParam = {
  packs?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type ProductOptionValuePopulateParam = {
  option?:
    | true
    | {
        count: true
        filters?: ProductOptionFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductOption>[]
        populate?: ProductOptionPopulateParam | (keyof ProductOptionPopulateParam & string)[] | '*'
        filters?: ProductOptionFilters
        sort?: _SortValue<ProductOption> | _SortValue<ProductOption>[]
        limit?: number
        start?: number
      }
  variants?:
    | true
    | {
        count: true
        filters?: ProductVariantFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductVariant>[]
        populate?:
          ProductVariantPopulateParam | (keyof ProductVariantPopulateParam & string)[] | '*'
        filters?: ProductVariantFilters
        sort?: _SortValue<ProductVariant> | _SortValue<ProductVariant>[]
        limit?: number
        start?: number
      }
}
export type ProductOptionPopulateParam = {
  products?:
    | true
    | {
        count: true
        filters?: ProductFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Product>[]
        populate?: ProductPopulateParam | (keyof ProductPopulateParam & string)[] | '*'
        filters?: ProductFilters
        sort?: _SortValue<Product> | _SortValue<Product>[]
        limit?: number
        start?: number
      }
  values?:
    | true
    | {
        count: true
        filters?: ProductOptionValueFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductOptionValue>[]
        populate?:
          ProductOptionValuePopulateParam | (keyof ProductOptionValuePopulateParam & string)[] | '*'
        filters?: ProductOptionValueFilters
        sort?: _SortValue<ProductOptionValue> | _SortValue<ProductOptionValue>[]
        limit?: number
        start?: number
      }
}
export type ProductVariantPopulateParam = {
  product?:
    | true
    | {
        count: true
        filters?: ProductFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Product>[]
        populate?: ProductPopulateParam | (keyof ProductPopulateParam & string)[] | '*'
        filters?: ProductFilters
        sort?: _SortValue<Product> | _SortValue<Product>[]
        limit?: number
        start?: number
      }
  option_values?:
    | true
    | {
        count: true
        filters?: ProductOptionValueFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductOptionValue>[]
        populate?:
          ProductOptionValuePopulateParam | (keyof ProductOptionValuePopulateParam & string)[] | '*'
        filters?: ProductOptionValueFilters
        sort?: _SortValue<ProductOptionValue> | _SortValue<ProductOptionValue>[]
        limit?: number
        start?: number
      }
  images?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
  thumbnail?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type ProductPopulateParam = {
  variants?:
    | true
    | {
        count: true
        filters?: ProductVariantFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductVariant>[]
        populate?:
          ProductVariantPopulateParam | (keyof ProductVariantPopulateParam & string)[] | '*'
        filters?: ProductVariantFilters
        sort?: _SortValue<ProductVariant> | _SortValue<ProductVariant>[]
        limit?: number
        start?: number
      }
  options?:
    | true
    | {
        count: true
        filters?: ProductOptionFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<ProductOption>[]
        populate?: ProductOptionPopulateParam | (keyof ProductOptionPopulateParam & string)[] | '*'
        filters?: ProductOptionFilters
        sort?: _SortValue<ProductOption> | _SortValue<ProductOption>[]
        limit?: number
        start?: number
      }
  images?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
  thumbnail?: true | { fields?: (keyof MediaFile & string)[]; count?: never }
}
export type PermissionPopulateParam = {
  role?:
    | true
    | {
        count: true
        filters?: RoleFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Role>[]
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*'
        filters?: RoleFilters
        sort?: _SortValue<Role> | _SortValue<Role>[]
        limit?: number
        start?: number
      }
}
export type RolePopulateParam = {
  permissions?:
    | true
    | {
        count: true
        filters?: PermissionFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Permission>[]
        populate?: PermissionPopulateParam | (keyof PermissionPopulateParam & string)[] | '*'
        filters?: PermissionFilters
        sort?: _SortValue<Permission> | _SortValue<Permission>[]
        limit?: number
        start?: number
      }
  users?:
    | true
    | {
        count: true
        filters?: UserFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<User>[]
        populate?: UserPopulateParam | (keyof UserPopulateParam & string)[] | '*'
        filters?: UserFilters
        sort?: _SortValue<User> | _SortValue<User>[]
        limit?: number
        start?: number
      }
}
export type UserPopulateParam = {
  role?:
    | true
    | {
        count: true
        filters?: RoleFilters
        fields?: never
        populate?: never
        sort?: never
        limit?: never
        start?: never
      }
    | {
        count?: false
        fields?: _EntityField<Role>[]
        populate?: RolePopulateParam | (keyof RolePopulateParam & string)[] | '*'
        filters?: RoleFilters
        sort?: _SortValue<Role> | _SortValue<Role>[]
        limit?: number
        start?: number
      }
}
// Prisma-like Payload types for populate support
// These types allow type-safe population of relations
//
// Usage example:
// type ItemWithCategory = ItemGetPayload<{ populate: { category: true } }>
// const items = await strapi.items.find({ populate: { category: true } }) as ItemWithCategory[]
//
// This ensures that relations are only included in the type when populate is used
// Payload type for HomepageBannerStrip with populate support
export type HomepageBannerStripGetPayload<P extends { populate?: unknown } = {}> =
  HomepageBannerStrip &
    (P extends { populate: infer Pop }
      ? Pop extends '*' | true
        ? {
            image?: MediaFile | null
          }
        : Pop extends readonly (infer _)[]
          ? {
              image?: 'image' extends Pop[number] ? MediaFile | null : never
            }
          : {
              image?: 'image' extends keyof Pop
                ? _ApplyFields<MediaFile, MediaFile, Pop['image']> | null
                : never
            }
      : {})
// Payload type for HomepageCollectionSection with populate support
export type HomepageCollectionSectionGetPayload<P extends { populate?: unknown } = {}> =
  HomepageCollectionSection &
    (P extends { populate: infer Pop }
      ? Pop extends '*' | true
        ? {
            banner?: MediaFile | null
          }
        : Pop extends readonly (infer _)[]
          ? {
              banner?: 'banner' extends Pop[number] ? MediaFile | null : never
            }
          : {
              banner?: 'banner' extends keyof Pop
                ? _ApplyFields<MediaFile, MediaFile, Pop['banner']> | null
                : never
            }
      : {})
// Payload type for HomepageProductSection with populate support
export type HomepageProductSectionGetPayload<P extends { populate?: unknown } = {}> =
  HomepageProductSection &
    (P extends { populate: infer Pop }
      ? Pop extends '*' | true
        ? {
            products?: Product[]
          }
        : Pop extends readonly (infer _)[]
          ? {
              products?: 'products' extends Pop[number] ? Product[] : never
            }
          : {
              products?: 'products' extends keyof Pop
                ? Pop['products'] extends { count: true }
                  ? { count: number }
                  : _ApplyFields<
                      Pop['products'] extends { populate: infer NestedPop }
                        ? ProductGetPayload<{ populate: NestedPop }>
                        : Product,
                      Product,
                      Pop['products']
                    >[]
                : never
            }
      : {})
// Payload type for SliderHeroSlider with populate support
export type SliderHeroSliderGetPayload<P extends { populate?: unknown } = {}> = SliderHeroSlider &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          banners?: Banner[]
          interactive_banners?: InteractiveBanner[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            banners?: 'banners' extends Pop[number] ? Banner[] : never
            interactive_banners?: 'interactive_banners' extends Pop[number]
              ? InteractiveBanner[]
              : never
          }
        : {
            banners?: 'banners' extends keyof Pop
              ? Pop['banners'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['banners'] extends { populate: infer NestedPop }
                      ? BannerGetPayload<{ populate: NestedPop }>
                      : Banner,
                    Banner,
                    Pop['banners']
                  >[]
              : never
            interactive_banners?: 'interactive_banners' extends keyof Pop
              ? Pop['interactive_banners'] extends { count: true }
                ? { count: number }
                : _ApplyFields<InteractiveBanner, InteractiveBanner, Pop['interactive_banners']>[]
              : never
          }
    : {})
// Payload type for Banner with populate support
export type BannerGetPayload<P extends { populate?: unknown } = {}> = Banner &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          localizations?: Banner[]
          web_image?: MediaFile | null
          mobile_image?: MediaFile | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            localizations?: 'localizations' extends Pop[number] ? Banner[] : never
            web_image?: 'web_image' extends Pop[number] ? MediaFile | null : never
            mobile_image?: 'mobile_image' extends Pop[number] ? MediaFile | null : never
          }
        : {
            localizations?: 'localizations' extends keyof Pop
              ? Pop['localizations'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['localizations'] extends { populate: infer NestedPop }
                      ? BannerGetPayload<{ populate: NestedPop }>
                      : Banner,
                    Banner,
                    Pop['localizations']
                  >[]
              : never
            web_image?: 'web_image' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['web_image']> | null
              : never
            mobile_image?: 'mobile_image' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['mobile_image']> | null
              : never
          }
    : {})
// Payload type for Homepage with populate support
export type HomepageGetPayload<P extends { populate?: unknown } = {}> = Homepage &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          sections?: (
            | SliderHeroSliderDz
            | HomepageProductSectionDz
            | HomepageLatestProductsDz
            | HomepageBannerStripDz
            | HomepageCollectionSectionDz
          )[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            sections?: 'sections' extends Pop[number]
              ? (
                  | SliderHeroSliderDz
                  | HomepageProductSectionDz
                  | HomepageLatestProductsDz
                  | HomepageBannerStripDz
                  | HomepageCollectionSectionDz
                )[]
              : never
          }
        : {
            sections?: 'sections' extends keyof Pop
              ? (
                  | (Pop['sections'] extends { on: infer On }
                      ? 'slider.hero-slider' extends keyof On
                        ? On['slider.hero-slider'] extends { populate: infer NestedPop }
                          ? SliderHeroSliderGetPayload<{ populate: NestedPop }> & {
                              __component: 'slider.hero-slider'
                            }
                          : SliderHeroSliderDz
                        : SliderHeroSliderDz
                      : SliderHeroSliderDz)
                  | (Pop['sections'] extends { on: infer On }
                      ? 'homepage.product-section' extends keyof On
                        ? On['homepage.product-section'] extends { populate: infer NestedPop }
                          ? HomepageProductSectionGetPayload<{ populate: NestedPop }> & {
                              __component: 'homepage.product-section'
                            }
                          : HomepageProductSectionDz
                        : HomepageProductSectionDz
                      : HomepageProductSectionDz)
                  | HomepageLatestProductsDz
                  | (Pop['sections'] extends { on: infer On }
                      ? 'homepage.banner-strip' extends keyof On
                        ? On['homepage.banner-strip'] extends { populate: infer NestedPop }
                          ? HomepageBannerStripGetPayload<{ populate: NestedPop }> & {
                              __component: 'homepage.banner-strip'
                            }
                          : HomepageBannerStripDz
                        : HomepageBannerStripDz
                      : HomepageBannerStripDz)
                  | (Pop['sections'] extends { on: infer On }
                      ? 'homepage.collection-section' extends keyof On
                        ? On['homepage.collection-section'] extends { populate: infer NestedPop }
                          ? HomepageCollectionSectionGetPayload<{ populate: NestedPop }> & {
                              __component: 'homepage.collection-section'
                            }
                          : HomepageCollectionSectionDz
                        : HomepageCollectionSectionDz
                      : HomepageCollectionSectionDz)
                )[]
              : never
          }
    : {})
// Payload type for PageTransition with populate support
export type PageTransitionGetPayload<P extends { populate?: unknown } = {}> = PageTransition &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          packs?: MediaFile[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            packs?: 'packs' extends Pop[number] ? MediaFile[] : never
          }
        : {
            packs?: 'packs' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['packs']>[]
              : never
          }
    : {})
// Payload type for ProductOptionValue with populate support
export type ProductOptionValueGetPayload<P extends { populate?: unknown } = {}> =
  ProductOptionValue &
    (P extends { populate: infer Pop }
      ? Pop extends '*' | true
        ? {
            option?: ProductOption | null
            variants?: ProductVariant[]
          }
        : Pop extends readonly (infer _)[]
          ? {
              option?: 'option' extends Pop[number] ? ProductOption | null : never
              variants?: 'variants' extends Pop[number] ? ProductVariant[] : never
            }
          : {
              option?: 'option' extends keyof Pop
                ? Pop['option'] extends { count: true }
                  ? { count: number }
                  : _ApplyFields<
                      Pop['option'] extends { populate: infer NestedPop }
                        ? ProductOptionGetPayload<{ populate: NestedPop }>
                        : ProductOption,
                      ProductOption,
                      Pop['option']
                    > | null
                : never
              variants?: 'variants' extends keyof Pop
                ? Pop['variants'] extends { count: true }
                  ? { count: number }
                  : _ApplyFields<
                      Pop['variants'] extends { populate: infer NestedPop }
                        ? ProductVariantGetPayload<{ populate: NestedPop }>
                        : ProductVariant,
                      ProductVariant,
                      Pop['variants']
                    >[]
                : never
            }
      : {})
// Payload type for ProductOption with populate support
export type ProductOptionGetPayload<P extends { populate?: unknown } = {}> = ProductOption &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          products?: Product[]
          values?: ProductOptionValue[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            products?: 'products' extends Pop[number] ? Product[] : never
            values?: 'values' extends Pop[number] ? ProductOptionValue[] : never
          }
        : {
            products?: 'products' extends keyof Pop
              ? Pop['products'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['products'] extends { populate: infer NestedPop }
                      ? ProductGetPayload<{ populate: NestedPop }>
                      : Product,
                    Product,
                    Pop['products']
                  >[]
              : never
            values?: 'values' extends keyof Pop
              ? Pop['values'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['values'] extends { populate: infer NestedPop }
                      ? ProductOptionValueGetPayload<{ populate: NestedPop }>
                      : ProductOptionValue,
                    ProductOptionValue,
                    Pop['values']
                  >[]
              : never
          }
    : {})
// Payload type for ProductVariant with populate support
export type ProductVariantGetPayload<P extends { populate?: unknown } = {}> = ProductVariant &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          product?: Product | null
          option_values?: ProductOptionValue[]
          images?: MediaFile[]
          thumbnail?: MediaFile | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            product?: 'product' extends Pop[number] ? Product | null : never
            option_values?: 'option_values' extends Pop[number] ? ProductOptionValue[] : never
            images?: 'images' extends Pop[number] ? MediaFile[] : never
            thumbnail?: 'thumbnail' extends Pop[number] ? MediaFile | null : never
          }
        : {
            product?: 'product' extends keyof Pop
              ? Pop['product'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['product'] extends { populate: infer NestedPop }
                      ? ProductGetPayload<{ populate: NestedPop }>
                      : Product,
                    Product,
                    Pop['product']
                  > | null
              : never
            option_values?: 'option_values' extends keyof Pop
              ? Pop['option_values'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['option_values'] extends { populate: infer NestedPop }
                      ? ProductOptionValueGetPayload<{ populate: NestedPop }>
                      : ProductOptionValue,
                    ProductOptionValue,
                    Pop['option_values']
                  >[]
              : never
            images?: 'images' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['images']>[]
              : never
            thumbnail?: 'thumbnail' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['thumbnail']> | null
              : never
          }
    : {})
// Payload type for Product with populate support
export type ProductGetPayload<P extends { populate?: unknown } = {}> = Product &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          variants?: ProductVariant[]
          options?: ProductOption[]
          images?: MediaFile[]
          thumbnail?: MediaFile | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            variants?: 'variants' extends Pop[number] ? ProductVariant[] : never
            options?: 'options' extends Pop[number] ? ProductOption[] : never
            images?: 'images' extends Pop[number] ? MediaFile[] : never
            thumbnail?: 'thumbnail' extends Pop[number] ? MediaFile | null : never
          }
        : {
            variants?: 'variants' extends keyof Pop
              ? Pop['variants'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['variants'] extends { populate: infer NestedPop }
                      ? ProductVariantGetPayload<{ populate: NestedPop }>
                      : ProductVariant,
                    ProductVariant,
                    Pop['variants']
                  >[]
              : never
            options?: 'options' extends keyof Pop
              ? Pop['options'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['options'] extends { populate: infer NestedPop }
                      ? ProductOptionGetPayload<{ populate: NestedPop }>
                      : ProductOption,
                    ProductOption,
                    Pop['options']
                  >[]
              : never
            images?: 'images' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['images']>[]
              : never
            thumbnail?: 'thumbnail' extends keyof Pop
              ? _ApplyFields<MediaFile, MediaFile, Pop['thumbnail']> | null
              : never
          }
    : {})
// Payload type for Permission with populate support
export type PermissionGetPayload<P extends { populate?: unknown } = {}> = Permission &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          role?: Role | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            role?: 'role' extends Pop[number] ? Role | null : never
          }
        : {
            role?: 'role' extends keyof Pop
              ? Pop['role'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['role'] extends { populate: infer NestedPop }
                      ? RoleGetPayload<{ populate: NestedPop }>
                      : Role,
                    Role,
                    Pop['role']
                  > | null
              : never
          }
    : {})
// Payload type for Role with populate support
export type RoleGetPayload<P extends { populate?: unknown } = {}> = Role &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          permissions?: Permission[]
          users?: User[]
        }
      : Pop extends readonly (infer _)[]
        ? {
            permissions?: 'permissions' extends Pop[number] ? Permission[] : never
            users?: 'users' extends Pop[number] ? User[] : never
          }
        : {
            permissions?: 'permissions' extends keyof Pop
              ? Pop['permissions'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['permissions'] extends { populate: infer NestedPop }
                      ? PermissionGetPayload<{ populate: NestedPop }>
                      : Permission,
                    Permission,
                    Pop['permissions']
                  >[]
              : never
            users?: 'users' extends keyof Pop
              ? Pop['users'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['users'] extends { populate: infer NestedPop }
                      ? UserGetPayload<{ populate: NestedPop }>
                      : User,
                    User,
                    Pop['users']
                  >[]
              : never
          }
    : {})
// Payload type for User with populate support
export type UserGetPayload<P extends { populate?: unknown } = {}> = User &
  (P extends { populate: infer Pop }
    ? Pop extends '*' | true
      ? {
          role?: Role | null
        }
      : Pop extends readonly (infer _)[]
        ? {
            role?: 'role' extends Pop[number] ? Role | null : never
          }
        : {
            role?: 'role' extends keyof Pop
              ? Pop['role'] extends { count: true }
                ? { count: number }
                : _ApplyFields<
                    Pop['role'] extends { populate: infer NestedPop }
                      ? RoleGetPayload<{ populate: NestedPop }>
                      : Role,
                    Role,
                    Pop['role']
                  > | null
              : never
          }
    : {})
// ============================================
// Filter Utility Types
// ============================================

/** String filter operators */
export interface StringFilterOperators {
  $eq?: string
  $eqi?: string
  $ne?: string
  $nei?: string
  $in?: string[]
  $notIn?: string[]
  $contains?: string
  $notContains?: string
  $containsi?: string
  $notContainsi?: string
  $startsWith?: string
  $startsWithi?: string
  $endsWith?: string
  $endsWithi?: string
  $null?: boolean
  $notNull?: boolean
}

/** Number filter operators */
export interface NumberFilterOperators {
  $eq?: number
  $ne?: number
  $lt?: number
  $lte?: number
  $gt?: number
  $gte?: number
  $in?: number[]
  $notIn?: number[]
  $between?: [number, number]
  $null?: boolean
  $notNull?: boolean
}

/** biginteger filter operators — Strapi reads bigintegers as strings, accepts either */
export interface BigIntFilterOperators {
  $eq?: string | number
  $ne?: string | number
  $lt?: string | number
  $lte?: string | number
  $gt?: string | number
  $gte?: string | number
  $in?: (string | number)[]
  $notIn?: (string | number)[]
  $between?: [string | number, string | number]
  $null?: boolean
  $notNull?: boolean
}

/** Boolean filter operators */
export interface BooleanFilterOperators {
  $eq?: boolean
  $ne?: boolean
  $null?: boolean
  $notNull?: boolean
}

/** Date filter operators (dates are strings in Strapi) */
export interface DateFilterOperators {
  $eq?: string
  $ne?: string
  $lt?: string
  $lte?: string
  $gt?: string
  $gte?: string
  $in?: string[]
  $notIn?: string[]
  $between?: [string, string]
  $null?: boolean
  $notNull?: boolean
}

/** ID filter operators (for relations) */
export interface IdFilterOperators {
  $eq?: number | string
  $ne?: number | string
  $in?: (number | string)[]
  $notIn?: (number | string)[]
  $null?: boolean
  $notNull?: boolean
}

/** Relation filter - filter by nested fields */
export type RelationFilter<T> = {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
} & {
  // A related biginteger reads as string, but its filters take numbers too
  [K in keyof T]?: T[K] extends string
    ? string | number | StringFilterOperators | BigIntFilterOperators
    : T[K] extends number
      ? number | NumberFilterOperators
      : T[K] extends boolean
        ? boolean | BooleanFilterOperators
        : any
}

/** Logical operators for combining filters */
export interface LogicalOperators<T> {
  $and?: T[]
  $or?: T[]
  $not?: T
}

/** Filters for the admin user behind createdBy / updatedBy */
export interface AdminUserFilters {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  firstname?: string | StringFilterOperators
  lastname?: string | StringFilterOperators
  username?: string | StringFilterOperators
  preferedLanguage?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  $and?: AdminUserFilters[]
  $or?: AdminUserFilters[]
  $not?: AdminUserFilters
}
// ============================================
// Typed Query Parameters
// ============================================

/** Sort direction */
export type SortDirection = 'asc' | 'desc'

/** Sort option - can be a field name or field:direction */
export type SortOption<T> = (keyof T & string) | `${keyof T & string}:${SortDirection}`

/** Typed query parameters */
export interface TypedQueryParams<TEntity, TFilters = Record<string, any>, TPopulate = any> {
  /** Type-safe filters */
  filters?: TFilters
  /** Sort by field(s) */
  sort?: SortOption<TEntity> | SortOption<TEntity>[]
  /** Pagination options */
  pagination?: {
    page?: number
    pageSize?: number
    limit?: number
    start?: number
  }
  /** Populate relations */
  populate?: TPopulate
  /** Select specific fields */
  fields?: (keyof TEntity)[]
}
/** Type-safe filters for the GeneralPageTransition component */
export interface GeneralPageTransitionFilters extends LogicalOperators<GeneralPageTransitionFilters> {
  id?: number | IdFilterOperators
}
/** Type-safe filters for the HomepageBannerStrip component */
export interface HomepageBannerStripFilters extends LogicalOperators<HomepageBannerStripFilters> {
  id?: number | IdFilterOperators
  image?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for the HomepageCollectionSection component */
export interface HomepageCollectionSectionFilters extends LogicalOperators<HomepageCollectionSectionFilters> {
  id?: number | IdFilterOperators
  collection?: string | StringFilterOperators
  limit?: number | NumberFilterOperators
  heading?: string | StringFilterOperators
  description?: string | StringFilterOperators
  shop_link?: string | StringFilterOperators
  variant?: ('dark' | 'default') | StringFilterOperators
  banner?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for the HomepageLatestProducts component */
export interface HomepageLatestProductsFilters extends LogicalOperators<HomepageLatestProductsFilters> {
  id?: number | IdFilterOperators
  heading?: string | StringFilterOperators
  description?: string | StringFilterOperators
  shop_link?: string | StringFilterOperators
  collection?: string | StringFilterOperators
  limit?: number | NumberFilterOperators
}
/** Type-safe filters for the HomepageProductSection component */
export interface HomepageProductSectionFilters extends LogicalOperators<HomepageProductSectionFilters> {
  id?: number | IdFilterOperators
  heading?: string | StringFilterOperators
  description?: string | StringFilterOperators
  shop_link?: string | StringFilterOperators
  products?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for the SliderHeroSlider component */
export interface SliderHeroSliderFilters extends LogicalOperators<SliderHeroSliderFilters> {
  id?: number | IdFilterOperators
  banners?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  interactive_banners?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Banner */
export interface BannerFilters extends LogicalOperators<BannerFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  Title?: string | StringFilterOperators
  subtitle?: string | StringFilterOperators
  active?: boolean | BooleanFilterOperators
  country?: string | StringFilterOperators
  url?: string | StringFilterOperators
  locale?: string | StringFilterOperators
  localizations?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  web_image?: { id?: number | IdFilterOperators; [key: string]: any }
  mobile_image?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for Homepage */
export interface HomepageFilters extends LogicalOperators<HomepageFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
}
/** Type-safe filters for InteractiveBanner */
export interface InteractiveBannerFilters extends LogicalOperators<InteractiveBannerFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  url?: string | StringFilterOperators
  type?: ('open_pack' | 'card_3d') | StringFilterOperators
}
/** Type-safe filters for PageTransition */
export interface PageTransitionFilters extends LogicalOperators<PageTransitionFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  packs?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for ProductOptionValue */
export interface ProductOptionValueFilters extends LogicalOperators<ProductOptionValueFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  medusaId?: string | StringFilterOperators
  value?: string | StringFilterOperators
  option?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  variants?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for ProductOption */
export interface ProductOptionFilters extends LogicalOperators<ProductOptionFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  medusaId?: string | StringFilterOperators
  title?: string | StringFilterOperators
  products?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  values?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for ProductVariant */
export interface ProductVariantFilters extends LogicalOperators<ProductVariantFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  medusaId?: string | StringFilterOperators
  title?: string | StringFilterOperators
  sku?: string | StringFilterOperators
  imageUrls?: any
  thumbnailUrl?: string | StringFilterOperators
  managedByMedusa?: boolean | BooleanFilterOperators
  product?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  option_values?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  images?: { id?: number | IdFilterOperators; [key: string]: any }
  thumbnail?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for Product */
export interface ProductFilters extends LogicalOperators<ProductFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  medusaId?: string | StringFilterOperators
  title?: string | StringFilterOperators
  subtitle?: string | StringFilterOperators
  description?: string | StringFilterOperators
  handle?: string | StringFilterOperators
  imageUrls?: any
  thumbnailUrl?: string | StringFilterOperators
  variants?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  options?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  images?: { id?: number | IdFilterOperators; [key: string]: any }
  thumbnail?: { id?: number | IdFilterOperators; [key: string]: any }
}
/** Type-safe filters for Permission */
export interface PermissionFilters extends LogicalOperators<PermissionFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  action?: string | StringFilterOperators
  role?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for Role */
export interface RoleFilters extends LogicalOperators<RoleFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  name?: string | StringFilterOperators
  description?: string | StringFilterOperators
  type?: string | StringFilterOperators
  permissions?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  users?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
/** Type-safe filters for User */
export interface UserFilters extends LogicalOperators<UserFilters> {
  id?: number | IdFilterOperators
  documentId?: string | StringFilterOperators
  createdAt?: string | DateFilterOperators
  updatedAt?: string | DateFilterOperators
  publishedAt?: string | DateFilterOperators
  username?: string | StringFilterOperators
  email?: string | StringFilterOperators
  provider?: string | StringFilterOperators
  confirmed?: boolean | BooleanFilterOperators
  blocked?: boolean | BooleanFilterOperators
  role?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
}
