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
}

export type ProductInsert = Omit<Product, 'id' | 'created_at'>
export type ProductUpdate = Partial<ProductInsert>
