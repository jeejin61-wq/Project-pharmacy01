import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await supabase
    .from('products')
    .select('name, manufacturer')
    .eq('id', params.id)
    .single()

  if (!data) return { title: '제품 정보' }

  return {
    title: `${data.name} - 제품 정보`,
    description: `${data.manufacturer ?? ''} | ${data.name}`,
  }
}

function StockIndicator({ stock, optimal }: { stock: number | null; optimal: number | null }) {
  if (stock === null) return null
  const ratio = optimal ? stock / optimal : 1
  const color = ratio >= 0.7 ? 'bg-emerald-500' : ratio >= 0.3 ? 'bg-amber-400' : 'bg-red-500'
  const label = ratio >= 0.7 ? '충분' : ratio >= 0.3 ? '보통' : '부족'
  const textColor = ratio >= 0.7 ? 'text-emerald-600' : ratio >= 0.3 ? 'text-amber-600' : 'text-red-600'
  const bgColor = ratio >= 0.7 ? 'bg-emerald-50' : ratio >= 0.3 ? 'bg-amber-50' : 'bg-red-50'
  const percent = Math.min(100, Math.round(ratio * 100))

  return (
    <div className={`rounded-2xl p-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">재고 현황</span>
        <span className={`text-sm font-bold ${textColor}`}>{label}</span>
      </div>
      <div className="flex items-end gap-2 mb-3">
        <span className={`text-2xl font-bold ${textColor}`}>{stock.toLocaleString()}</span>
        {optimal && <span className="text-sm text-gray-400 mb-0.5">/ {optimal.toLocaleString()} 적정</span>}
      </div>
      <div className="h-2 bg-white/70 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default async function ProductPage({ params }: Props) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single<Product>()

  if (error || !product) notFound()

  const priceFormatted = product.price ? `₩${product.price.toLocaleString()}` : '가격 정보 없음'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700">
      {/* Header */}
      <div className="px-5 pt-12 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-white/80 text-sm font-medium">약국 제품 정보</span>
        </div>

        <div className="text-white/60 text-xs font-mono mb-1 tracking-wider">
          PRODUCT #{String(product.id).padStart(4, '0')}
        </div>
        <h1 className="text-white text-2xl font-bold leading-tight mb-1">{product.name}</h1>
        {product.manufacturer && (
          <p className="text-blue-200 text-sm">{product.manufacturer}</p>
        )}
      </div>

      {/* Content Card */}
      <div className="bg-gray-50 min-h-screen rounded-t-3xl px-5 pt-8 pb-10">
        {/* Price + Unit */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
          <div>
            <div className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">판매가격</div>
            <div className="text-3xl font-bold text-blue-700">{priceFormatted}</div>
          </div>
          {product.unit && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
              <div className="text-xs text-blue-400 mb-0.5">단위</div>
              <div className="text-lg font-bold text-blue-700">{product.unit}</div>
            </div>
          )}
        </div>

        {/* Stock */}
        <div className="mb-4">
          <StockIndicator stock={product.stock} optimal={product.optimal_stock} />
        </div>

        {/* Indication */}
        {product.indication && (
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">적응증 / 효능효과</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{product.indication}</p>
          </div>
        )}

        {/* Notes */}
        {(product.note1 || product.note2) && (
          <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">참고사항</span>
            </div>
            {product.note1 && <p className="text-gray-600 text-sm leading-relaxed mb-2">{product.note1}</p>}
            {product.note2 && <p className="text-gray-600 text-sm leading-relaxed">{product.note2}</p>}
          </div>
        )}

        {/* Barcode */}
        {product.barcode && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1 font-medium uppercase tracking-wide">바코드</div>
            <div className="font-mono text-gray-700 text-sm tracking-widest">{product.barcode}</div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            약국 QR 제품 조회 시스템
          </div>
        </div>
      </div>
    </div>
  )
}
