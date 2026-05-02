import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'

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

// ─── 소섹션 컴포넌트 ─────────────────────────────────────────

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-gray-800 text-sm">{title}</span>
    </div>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single<Product>()

  if (error || !product) notFound()

  const priceFormatted = product.price ? `₩${product.price.toLocaleString()}` : null

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="max-w-md mx-auto pb-10">

        {/* ─── 상단 헤더 카드 ─── */}
        <div className="bg-white mb-3">
          {/* 카테고리 태그 */}
          <div className="px-4 pt-5 pb-1 flex items-center gap-2">
            {product.category && (
              <span className="inline-flex items-center bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          <div className="px-4 pb-4">
            <h1 className="text-xl font-bold text-gray-900 leading-tight mt-1">{product.name}</h1>
            {product.volume && (
              <p className="text-sm text-gray-400 mt-0.5">{product.volume}</p>
            )}

            <div className="flex items-end gap-2 mt-3">
              {priceFormatted ? (
                <span className="text-3xl font-extrabold text-green-600">{priceFormatted}</span>
              ) : (
                <span className="text-xl font-bold text-gray-400">가격 정보 없음</span>
              )}
              {product.price_per_unit && (
                <span className="text-xs text-gray-400 mb-1">{product.price_per_unit}</span>
              )}
            </div>

            {/* 제품 이미지 */}
            {product.image_url ? (
              <div className="mt-4 flex justify-center">
                <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-2"
                    sizes="176px"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 flex justify-center">
                <div className="w-44 h-44 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border border-green-100 flex flex-col items-center justify-center">
                  <span className="text-5xl mb-2">💊</span>
                  <span className="text-xs text-green-500 font-medium">{product.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── 적응증 배너 ─── */}
        {(product.description || product.indication) && (
          <div className="bg-green-600 mx-0 px-5 py-3.5 flex items-start gap-3 mb-3">
            <span className="text-white text-lg mt-0.5 flex-shrink-0">✅</span>
            <p className="text-white text-sm font-medium leading-snug">
              {product.description ?? product.indication}
            </p>
          </div>
        )}

        {/* ─── 사용 부위 ─── */}
        {product.usage_areas && product.usage_areas.length > 0 && (
          <SectionCard className="mb-3">
            <SectionHeader icon="📍" title="이런 부위에 사용해요" />
            <div className="flex flex-wrap justify-around px-3 pb-4 pt-2 gap-2">
              {product.usage_areas.map((area, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[56px]">
                  <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-2xl border-2 border-green-100">
                    {area.icon}
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{area.name}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ─── 사용 방법 ─── */}
        {(product.usage_frequency || product.usage_method || product.usage_target) && (
          <SectionCard className="mb-3">
            <SectionHeader icon="💡" title="사용 방법" />
            <div className="grid grid-cols-3 gap-0 border-t border-gray-50 mx-4 mb-3">
              {product.usage_frequency && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <span className="text-2xl mb-1.5">🕐</span>
                  <span className="text-xs text-gray-400 mb-1">사용 횟수</span>
                  <span className="text-sm font-bold text-gray-800 text-center leading-tight">{product.usage_frequency}</span>
                </div>
              )}
              {product.usage_method && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <span className="text-2xl mb-1.5">🤲</span>
                  <span className="text-xs text-gray-400 mb-1">사용 방법</span>
                  <span className="text-sm font-bold text-gray-800 text-center leading-tight">{product.usage_method}</span>
                </div>
              )}
              {product.usage_target && (
                <div className="flex flex-col items-center py-4 px-2">
                  <span className="text-2xl mb-1.5">🎯</span>
                  <span className="text-xs text-gray-400 mb-1">사용 부위</span>
                  <span className="text-sm font-bold text-gray-800 text-center leading-tight">{product.usage_target}</span>
                </div>
              )}
            </div>
            {product.usage_note && (
              <div className="mx-4 mb-4 bg-green-50 rounded-xl px-3 py-2.5 flex items-start gap-2">
                <span className="text-green-500 text-sm mt-0.5 flex-shrink-0">✔</span>
                <p className="text-xs text-green-700 leading-snug">{product.usage_note}</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── 사용 전 체크 ─── */}
        {product.precautions && product.precautions.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-amber-50 px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⚠️</span>
                <span className="font-bold text-amber-800 text-sm">사용 전 체크하세요</span>
              </div>
              <ul className="space-y-2">
                {product.precautions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 text-sm mt-0.5 flex-shrink-0">•</span>
                    <span className="text-sm text-amber-900 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 금기 + 부작용 (2열) ─── */}
        {(product.donts?.length || product.side_effects?.length) ? (
          <div className="grid grid-cols-2 gap-3 mb-3 px-0">
            {product.donts && product.donts.length > 0 && (
              <div className="bg-red-50 rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">🚫</span>
                  <span className="text-xs font-bold text-red-700 leading-tight">이렇게 사용하면 안돼요</span>
                </div>
                <ul className="space-y-1.5">
                  {product.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✕</span>
                      <span className="text-xs text-red-800 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.side_effects && product.side_effects.length > 0 && (
              <div className="bg-red-50 rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">💢</span>
                  <span className="text-xs font-bold text-red-700 leading-tight">나타날 수 있는 부작용</span>
                </div>
                <ul className="space-y-1.5">
                  {product.side_effects.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">!</span>
                      <span className="text-xs text-red-800 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                {product.side_effects_note && (
                  <p className="text-xs text-red-500 mt-2 leading-snug">{product.side_effects_note}</p>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* ─── 사용 팁 ─── */}
        {product.tips && product.tips.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-green-50 px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✨</span>
                <span className="font-bold text-green-800 text-sm">사용 팁</span>
              </div>
              <ul className="space-y-2">
                {product.tips.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-green-900 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 추천 대상 ─── */}
        {product.recommended_for && product.recommended_for.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-blue-50 px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">👤</span>
                <span className="font-bold text-blue-800 text-sm">이런 분들에게 추천해요</span>
              </div>
              <ul className="space-y-2">
                {product.recommended_for.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-blue-900 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 위치 + 성분 (2칸) ─── */}
        {(product.store_location || product.ingredients) && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            {product.store_location && (
              <SectionCard>
                <div className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">🗺️</span>
                    <span className="text-xs font-bold text-gray-600">약국 내 위치</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{product.store_location}</p>
                </div>
              </SectionCard>
            )}
            {product.ingredients && (
              <SectionCard>
                <div className="px-3 py-3.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-base">🔬</span>
                    <span className="text-xs font-bold text-gray-600">주요 성분</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-snug">{product.ingredients}</p>
                </div>
              </SectionCard>
            )}
          </div>
        )}

        {/* ─── 기존 indication (구 버전 호환) ─── */}
        {product.indication && !product.description && (
          <SectionCard className="mb-3">
            <SectionHeader icon="📋" title="적응증 / 효능효과" />
            <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{product.indication}</p>
          </SectionCard>
        )}

        {/* ─── 참고사항 (구 버전 호환) ─── */}
        {(product.note1 || product.note2) && (
          <SectionCard className="mb-3">
            <SectionHeader icon="ℹ️" title="참고사항" />
            <div className="px-4 pb-4">
              {product.note1 && <p className="text-sm text-gray-600 mb-1">{product.note1}</p>}
              {product.note2 && <p className="text-sm text-gray-600">{product.note2}</p>}
            </div>
          </SectionCard>
        )}

        {/* ─── CTA 버튼 ─── */}
        <div className="grid grid-cols-2 gap-3 mb-3 px-0">
          <button className="bg-green-600 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-sm active:scale-95 transition-transform">
            🗺️ 약국 내 위치 보기
          </button>
          <button className="bg-white border-2 border-green-600 text-green-700 font-semibold text-sm py-3.5 rounded-2xl shadow-sm active:scale-95 transition-transform">
            💬 약사에게 문의하기
          </button>
        </div>

        {/* ─── 면책 문구 ─── */}
        <div className="bg-white rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            본 정보는 일반적인 안내 목적으로 제공됩니다.<br />
            정확한 복약 지도는 약사에게 문의하세요.
          </p>
          <p className="text-xs text-gray-300 mt-1">약국 QR 제품 조회 시스템 V2</p>
        </div>
      </div>
    </div>
  )
}
