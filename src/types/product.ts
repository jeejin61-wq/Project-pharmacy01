export interface UsageArea {
  name: string
  icon: string
}

export interface ProductTranslation {
  name?: string
  description?: string
  usage_frequency?: string
  usage_method?: string
  usage_target?: string
  usage_note?: string
  precautions?: string[]
  donts?: string[]
  side_effects?: string[]
  side_effects_note?: string
  tips?: string[]
  recommended_for?: string[]
  usage_areas?: UsageArea[]
}

export interface Product {
  id: number
  barcode: string | null
  name: string
  manufacturer: string | null
  stock: number | null
  optimal_stock: number | null
  price: number | null
  unit: string | null
  indication: string | null
  note1: string | null
  note2: string | null
  created_at: string | null

  // V2 확장 필드
  category: string | null
  volume: string | null
  price_per_unit: string | null
  image_url: string | null
  usage_areas: UsageArea[] | null
  usage_frequency: string | null
  usage_method: string | null
  usage_target: string | null
  usage_note: string | null
  precautions: string[] | null
  donts: string[] | null
  side_effects: string[] | null
  side_effects_note: string | null
  tips: string[] | null
  recommended_for: string[] | null
  store_location: string | null
  ingredients: string | null
  description: string | null

  // V2.2 다국어 번역
  translations: Record<string, ProductTranslation> | null
}

export type ProductInsert = Omit<Product, 'id' | 'created_at'>
export type ProductUpdate = Partial<ProductInsert>
