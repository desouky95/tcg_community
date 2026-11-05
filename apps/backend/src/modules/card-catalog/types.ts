export type CardCatalogModuleOptions = {
    baseUrl: string
    apiKey?: string
  }
  
  export type ExternalCollection = {
    id: string
    name: string
    year?: number | null
    metadata?: Record<string, unknown> | null
  }
  
  export type ExternalCard = {
    id: string
  
    collection_id: string
  
    number: string
    name: string
  
    image_url?: string | null
    rarity?: string | null
  
    metadata?: Record<string, unknown> | null
  }
  
  export type BatchCardsResponse = {
    cards: ExternalCard[]
  }