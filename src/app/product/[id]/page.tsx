import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import {
  Info,
  MapPin,
  Lightbulb,
  Clock,
  Droplets,
  Target,
  TriangleAlert,
  Ban,
  Zap,
  Sparkles,
  UserCheck,
  Wind,
  Hand,
  Footprints,
  Activity,
  FlaskConical,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react'

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

// ─── Lucide 아이콘 동적 매핑 ─────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Wind,
  Hand,
  Footprints,
  Activity,
  FlaskConical,
  MapPin,
  Target,
  Lightbulb,
  Clock,
  Droplets,
}

function UsageAreaIcon({ iconName }: { iconName: string }) {
  const Icon = ICON_MAP[iconName] ?? Activity
  return <Icon size={22} strokeWidth={1.8} />
}

// ─── 소섹션 컴포넌트 ─────────────────────────────────────────

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

function SectionHeader({
  Icon,
  title,
  iconColor = 'text-gray-400',
}: {
  Icon: LucideIcon
  title: string
  iconColor?: string
}) {
  return (
    <div className="flex items-center gap-2 px-4 pt-4 pb-2">
      <Icon size={15} strokeWidth={2} className={iconColor} />
      <span className="font-bold text-gray-700 text-sm">{title}</span>
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
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-md mx-auto pb-10">

        {/* ─── 상단 헤더 카드 ─── */}
        <div className="bg-white mb-3">
          <div className="px-4 pt-5 pb-1 flex items-center gap-2">
            {product.category && (
              <span className="inline-flex items-center bg-[#dcfce7] text-[#16a34a] text-xs font-semibold px-2.5 py-1 rounded-full">
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
                <span className="text-3xl font-extrabold text-[#16a34a]">{priceFormatted}</span>
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
                <div className="w-44 h-44 rounded-2xl bg-[#dcfce7] flex flex-col items-center justify-center">
                  <FlaskConical size={44} strokeWidth={1.5} className="text-[#16a34a] mb-2" />
                  <span className="text-xs text-[#16a34a] font-medium">{product.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── 적응증 배너 ─── */}
        {(product.description || product.indication) && (
          <div className="bg-[#dcfce7] mx-0 px-5 py-3.5 flex items-start gap-3 mb-3">
            <Info size={16} strokeWidth={2} className="text-[#16a34a] mt-0.5 flex-shrink-0" />
            <p className="text-[#16a34a] text-sm font-medium leading-snug">
              {product.description ?? product.indication}
            </p>
          </div>
        )}

        {/* ─── 사용 부위 ─── */}
        {product.usage_areas && product.usage_areas.length > 0 && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={MapPin} title="이런 부위에 사용해요" iconColor="text-[#16a34a]" />
            <div className="flex flex-wrap justify-around px-3 pb-4 pt-2 gap-2">
              {product.usage_areas.map((area, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-[56px]">
                  <div className="w-14 h-14 bg-[#dcfce7] rounded-full flex items-center justify-center text-[#16a34a]">
                    <UsageAreaIcon iconName={area.icon} />
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
            <SectionHeader Icon={Lightbulb} title="사용 방법" iconColor="text-[#ca8a04]" />
            <div className="grid grid-cols-3 gap-0 border-t border-gray-50 mx-4 mb-3">
              {product.usage_frequency && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Clock size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">사용 횟수</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{product.usage_frequency}</span>
                </div>
              )}
              {product.usage_method && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Droplets size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">사용 방법</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{product.usage_method}</span>
                </div>
              )}
              {product.usage_target && (
                <div className="flex flex-col items-center py-4 px-2">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Target size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">사용 부위</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{product.usage_target}</span>
                </div>
              )}
            </div>
            {product.usage_note && (
              <div className="mx-4 mb-4 bg-[#fef9c3] rounded-xl px-3 py-2.5 flex items-start gap-2">
                <Lightbulb size={13} strokeWidth={2} className="text-[#ca8a04] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#ca8a04] leading-snug">{product.usage_note}</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── 사용 전 체크 ─── */}
        {product.precautions && product.precautions.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#fef9c3] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <TriangleAlert size={15} strokeWidth={2} className="text-[#ca8a04]" />
                <span className="font-bold text-[#ca8a04] text-sm">사용 전 체크하세요</span>
              </div>
              <ul className="space-y-2">
                {product.precautions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#ca8a04] text-sm mt-0.5 flex-shrink-0">•</span>
                    <span className="text-sm text-[#ca8a04] leading-snug">{item}</span>
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
              <div className="bg-[#ffe4e6] rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Ban size={14} strokeWidth={2} className="text-[#e11d48]" />
                  <span className="text-xs font-bold text-[#e11d48] leading-tight">이렇게 사용하면 안돼요</span>
                </div>
                <ul className="space-y-1.5">
                  {product.donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#e11d48] text-xs mt-0.5 flex-shrink-0">✕</span>
                      <span className="text-xs text-[#e11d48] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.side_effects && product.side_effects.length > 0 && (
              <div className="bg-[#ffe4e6] rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap size={14} strokeWidth={2} className="text-[#e11d48]" />
                  <span className="text-xs font-bold text-[#e11d48] leading-tight">나타날 수 있는 부작용</span>
                </div>
                <ul className="space-y-1.5">
                  {product.side_effects.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#e11d48] text-xs mt-0.5 flex-shrink-0">!</span>
                      <span className="text-xs text-[#e11d48] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                {product.side_effects_note && (
                  <p className="text-xs text-[#e11d48] mt-2 leading-snug opacity-80">{product.side_effects_note}</p>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* ─── 사용 팁 ─── */}
        {product.tips && product.tips.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#dcfce7] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} strokeWidth={2} className="text-[#16a34a]" />
                <span className="font-bold text-[#16a34a] text-sm">사용 팁</span>
              </div>
              <ul className="space-y-2">
                {product.tips.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#16a34a] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-[#16a34a] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 추천 대상 ─── */}
        {product.recommended_for && product.recommended_for.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#dbeafe] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={15} strokeWidth={2} className="text-[#2563eb]" />
                <span className="font-bold text-[#2563eb] text-sm">이런 분들에게 추천해요</span>
              </div>
              <ul className="space-y-2">
                {product.recommended_for.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#2563eb] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-[#2563eb] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 기존 indication (구 버전 호환) ─── */}
        {product.indication && !product.description && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={Info} title="적응증 / 효능효과" iconColor="text-gray-400" />
            <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{product.indication}</p>
          </SectionCard>
        )}

        {/* ─── 참고사항 (구 버전 호환) ─── */}
        {(product.note1 || product.note2) && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={Info} title="참고사항" iconColor="text-gray-400" />
            <div className="px-4 pb-4">
              {product.note1 && <p className="text-sm text-gray-600 mb-1">{product.note1}</p>}
              {product.note2 && <p className="text-sm text-gray-600">{product.note2}</p>}
            </div>
          </SectionCard>
        )}

        {/* ─── CTA 버튼 ─── */}
        <div className="mb-3 px-0">
          <button className="w-full bg-[#dcfce7] text-[#16a34a] font-semibold text-sm py-3.5 rounded-2xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <MessageCircle size={16} strokeWidth={2} />
            약사에게 문의하기
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
