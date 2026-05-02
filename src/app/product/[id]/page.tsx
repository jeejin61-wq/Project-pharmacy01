import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductClient from './ProductClient'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('products')
    .select('name, manufacturer, description')
    .eq('id', params.id)
    .single()

  if (!data) return { title: '제품 정보' }

  return {
    title: `${data.name} - 제품 정보`,
    description: data.description ?? `${data.manufacturer ?? ''} | ${data.name}`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single<Product>()

  if (error || !product) notFound()

  const priceFormatted = product.price ? `₩${product.price.toLocaleString()}` : null

  return <ProductClient product={product} priceFormatted={priceFormatted} />
}
