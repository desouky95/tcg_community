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

export interface SliderHeroSlider {
  id: number
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
  locale: string | null
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
  web_image?: MediaInput | undefined
  mobile_image?: MediaInput | undefined
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
export const UserDefaults = {
  confirmed: false,
  blocked: false,
} as const satisfies Partial<UserCreateInput>
// ============================================
// PopulateParam types for type-safe populate
// ============================================
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
  locale?: string | StringFilterOperators
  localizations?: {
    id?: number | IdFilterOperators
    documentId?: string | StringFilterOperators
    [key: string]: any
  }
  web_image?: { id?: number | IdFilterOperators; [key: string]: any }
  mobile_image?: { id?: number | IdFilterOperators; [key: string]: any }
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
