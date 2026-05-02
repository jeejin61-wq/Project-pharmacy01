'use client'

import { useState } from 'react'
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
import type { Product, ProductTranslation, UsageArea } from '@/types/product'

// ─── 언어 설정 ────────────────────────────────────────────────

type Lang = 'ko' | 'en' | 'zh' | 'ja'

const LANG_LABELS: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
}

// ─── Lucide 아이콘 동적 매핑 ──────────────────────────────────

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

// ─── 소섹션 컴포넌트 ──────────────────────────────────────────

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

// ─── 번역 병합 헬퍼 ───────────────────────────────────────────
// ko: 항상 원본 product 필드 사용
// en/zh/ja: translations.{lang} 값 우선, 없으면 ko 원본으로 폴백
// 번역 예시 없는 언어: 한국어 표시 + 번역 안내 배너

function getField<K extends keyof ProductTranslation>(
  product: Product,
  lang: Lang,
  key: K
): ProductTranslation[K] | string | string[] | UsageArea[] | null {
  if (lang === 'ko') {
    return (product as unknown as Record<string, unknown>)[key] as ProductTranslation[K] ?? null
  }
  const t = product.translations?.[lang]
  if (t && t[key] !== undefined && t[key] !== null) return t[key]!
  return (product as unknown as Record<string, unknown>)[key] as ProductTranslation[K] ?? null
}

function hasTranslation(product: Product, lang: Lang): boolean {
  if (lang === 'ko') return true
  return !!(product.translations?.[lang] && Object.keys(product.translations[lang]).length > 0)
}

// ─── 언어 선택 버튼 ───────────────────────────────────────────

function LangSelector({ lang, onChange, product }: { lang: Lang; onChange: (l: Lang) => void; product: Product }) {
  const langs: Lang[] = ['ko', 'en', 'zh', 'ja']
  return (
    <div className="flex gap-1.5 px-4 pb-3 pt-1">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          className={`flex-1 text-xs font-medium py-1.5 rounded-full transition-colors border ${
            lang === l
              ? 'bg-[#0ea5e9] text-white border-[#0ea5e9]'
              : 'bg-white text-gray-500 border-gray-200 hover:border-[#0ea5e9] hover:text-[#0ea5e9]'
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  )
}

// ─── 번역 없음 배너 ───────────────────────────────────────────

function NoTranslationBanner({ lang }: { lang: Lang }) {
  const msg: Record<Exclude<Lang, 'ko'>, string> = {
    en: 'Translation not available. Showing Korean.',
    zh: '暂无翻译，显示韩文内容。',
    ja: '翻訳が未登録です。韓国語で表示しています。',
  }
  return (
    <div className="mx-0 px-5 py-2.5 bg-[#fff7ed] flex items-center gap-2 mb-3">
      <Info size={13} strokeWidth={2} className="text-[#f97316] flex-shrink-0" />
      <p className="text-xs text-[#c2410c]">{msg[lang as Exclude<Lang, 'ko'>]}</p>
    </div>
  )
}

// ─── 라벨 다국어 ─────────────────────────────────────────────

const LABELS: Record<Lang, {
  usageAreas: string
  usageMethod: string
  usageCount: string
  usageHow: string
  usagePart: string
  precautions: string
  donts: string
  sideEffects: string
  tips: string
  recommended: string
  indication: string
  notes: string
  consult: string
  disclaimer: string
  disclaimerSub: string
  noPrice: string
}> = {
  ko: {
    usageAreas: '이런 부위에 사용해요',
    usageMethod: '사용 방법',
    usageCount: '사용 횟수',
    usageHow: '사용 방법',
    usagePart: '사용 부위',
    precautions: '사용 전 체크하세요',
    donts: '이렇게 사용하면 안돼요',
    sideEffects: '나타날 수 있는 부작용',
    tips: '사용 팁',
    recommended: '이런 분들에게 추천해요',
    indication: '적응증 / 효능효과',
    notes: '참고사항',
    consult: '약사에게 문의하기',
    disclaimer: '본 정보는 일반적인 안내 목적으로 제공됩니다.\n정확한 복약 지도는 약사에게 문의하세요.',
    disclaimerSub: '약국 QR 제품 조회 시스템 V2',
    noPrice: '가격 정보 없음',
  },
  en: {
    usageAreas: 'Application Areas',
    usageMethod: 'How to Use',
    usageCount: 'Frequency',
    usageHow: 'Method',
    usagePart: 'Area',
    precautions: 'Before Use – Check These',
    donts: 'Do NOT Do This',
    sideEffects: 'Possible Side Effects',
    tips: 'Usage Tips',
    recommended: 'Recommended For',
    indication: 'Indication / Efficacy',
    notes: 'Notes',
    consult: 'Ask a Pharmacist',
    disclaimer: 'This information is for general guidance only.\nPlease consult a pharmacist for precise medication instructions.',
    disclaimerSub: 'Pharmacy QR Product Info System V2',
    noPrice: 'Price not available',
  },
  zh: {
    usageAreas: '使用部位',
    usageMethod: '使用方法',
    usageCount: '使用频率',
    usageHow: '使用方式',
    usagePart: '使用部位',
    precautions: '使用前请确认',
    donts: '禁忌事项',
    sideEffects: '可能出现的副作用',
    tips: '使用小贴士',
    recommended: '推荐人群',
    indication: '适应症 / 功效',
    notes: '注意事项',
    consult: '咨询药剂师',
    disclaimer: '本信息仅供一般参考。\n请向药剂师咨询准确的用药指导。',
    disclaimerSub: '药局 QR 产品查询系统 V2',
    noPrice: '暂无价格信息',
  },
  ja: {
    usageAreas: '使用部位',
    usageMethod: '使い方',
    usageCount: '使用頻度',
    usageHow: '使用方法',
    usagePart: '使用部位',
    precautions: '使用前のチェック',
    donts: 'やってはいけないこと',
    sideEffects: '起こりうる副作用',
    tips: '使用のコツ',
    recommended: 'こんな方におすすめ',
    indication: '適応症 / 効能効果',
    notes: '参考事項',
    consult: '薬剤師に相談する',
    disclaimer: 'この情報は一般的な案内を目的として提供されています。\n正確な服薬指導は薬剤師にご相談ください。',
    disclaimerSub: '薬局 QR 製品照会システム V2',
    noPrice: '価格情報なし',
  },
}

// ─── 메인 클라이언트 컴포넌트 ─────────────────────────────────

export default function ProductClient({ product, priceFormatted }: { product: Product; priceFormatted: string | null }) {
  const [lang, setLang] = useState<Lang>('ko')

  const L = LABELS[lang]
  const translated = hasTranslation(product, lang)

  // 번역된 필드 가져오기
  const name = lang === 'ko' ? product.name : ((getField(product, lang, 'name') as string | null) ?? product.name)
  const description = getField(product, lang, 'description') as string | null
  const usage_frequency = getField(product, lang, 'usage_frequency') as string | null
  const usage_method = getField(product, lang, 'usage_method') as string | null
  const usage_target = getField(product, lang, 'usage_target') as string | null
  const usage_note = getField(product, lang, 'usage_note') as string | null
  const precautions = getField(product, lang, 'precautions') as string[] | null
  const donts = getField(product, lang, 'donts') as string[] | null
  const side_effects = getField(product, lang, 'side_effects') as string[] | null
  const side_effects_note = getField(product, lang, 'side_effects_note') as string | null
  const tips = getField(product, lang, 'tips') as string[] | null
  const recommended_for = getField(product, lang, 'recommended_for') as string[] | null
  const raw_usage_areas = getField(product, lang, 'usage_areas') as UsageArea[] | null
  const ko_usage_areas = product.usage_areas as UsageArea[] | null
  const usage_areas = raw_usage_areas?.map((area, i) => ({
    ...area,
    icon: ko_usage_areas?.[i]?.icon ?? area.icon,
  })) ?? null

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-md mx-auto pb-10 px-4">

        <div className="bg-white mb-3 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-5 pb-1 flex items-center gap-2">
            {product.category && (
              <span className="inline-flex items-center bg-[#e0f2fe] text-[#0284c7] text-xs font-semibold px-2.5 py-1 rounded-full">
                {product.category}
              </span>
            )}
          </div>

          <div className="px-4 pb-2">
            <h1 className="text-xl font-bold text-gray-900 leading-tight mt-1">{name}</h1>
            {product.volume && (
              <p className="text-sm text-gray-400 mt-0.5">{product.volume}</p>
            )}

            <div className="flex items-end gap-2 mt-3">
              {priceFormatted ? (
                <span className="text-3xl font-extrabold text-[#0ea5e9]">{priceFormatted}</span>
              ) : (
                <span className="text-xl font-bold text-gray-400">{L.noPrice}</span>
              )}
            </div>

            {product.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <div className="mt-4 flex justify-center">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm">
                  <img
                    src={product.image_url}
                    alt={name}
                    className="object-contain w-full h-full p-3"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 언어 선택 버튼 */}
          <LangSelector lang={lang} onChange={setLang} product={product} />
        </div>

        {/* ─── 번역 없음 배너 ─── */}
        {lang !== 'ko' && !translated && <NoTranslationBanner lang={lang} />}

        {/* ─── 적응증 배너 ─── */}
        {(description || product.indication) && (
          <div className="bg-[#f0fdf4] mx-0 px-5 py-3.5 flex items-start gap-3 mb-3">
            <Info size={16} strokeWidth={2} className="text-[#4ade80] mt-0.5 flex-shrink-0" />
            <p className="text-[#15803d] text-sm font-medium leading-snug">
              {description ?? product.indication}
            </p>
          </div>
        )}

        {/* ─── 사용 부위 ─── */}
        {usage_areas && usage_areas.length > 0 && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={MapPin} title={L.usageAreas} iconColor="text-[#16a34a]" />
            <div className="flex flex-wrap justify-around px-3 pb-4 pt-2 gap-2">
              {usage_areas.map((area, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 min-w-[56px]">
                  <div className="w-14 h-14 bg-[#f0f9ff] rounded-full flex items-center justify-center text-[#0ea5e9]">
                    <UsageAreaIcon iconName={area.icon} />
                  </div>
                  <span className="text-xs text-gray-600 font-medium text-center leading-tight">{area.name}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ─── 사용 방법 ─── */}
        {(usage_frequency || usage_method || usage_target) && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={Lightbulb} title={L.usageMethod} iconColor="text-[#ca8a04]" />
            <div className="grid grid-cols-3 gap-0 border-t border-gray-50 mx-4 mb-3">
              {usage_frequency && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Clock size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">{L.usageCount}</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{usage_frequency}</span>
                </div>
              )}
              {usage_method && (
                <div className="flex flex-col items-center py-4 px-2 border-r border-gray-100 last:border-r-0">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Droplets size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">{L.usageHow}</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{usage_method}</span>
                </div>
              )}
              {usage_target && (
                <div className="flex flex-col items-center py-4 px-2">
                  <div className="w-9 h-9 rounded-full bg-[#fef9c3] flex items-center justify-center mb-1.5">
                    <Target size={16} strokeWidth={2} className="text-[#ca8a04]" />
                  </div>
                  <span className="text-xs text-gray-400 mb-1">{L.usagePart}</span>
                  <span className="text-xs font-bold text-gray-800 text-center leading-tight">{usage_target}</span>
                </div>
              )}
            </div>
            {usage_note && (
              <div className="mx-4 mb-4 bg-[#fef9c3] rounded-xl px-3 py-2.5 flex items-start gap-2">
                <Lightbulb size={13} strokeWidth={2} className="text-[#ca8a04] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#ca8a04] leading-snug">{usage_note}</p>
              </div>
            )}
          </SectionCard>
        )}

        {/* ─── 사용 전 체크 ─── */}
        {precautions && precautions.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#fffbeb] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <TriangleAlert size={15} strokeWidth={2} className="text-[#d97706]" />
                <span className="font-bold text-[#92400e] text-sm">{L.precautions}</span>
              </div>
              <ul className="space-y-2">
                {precautions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#d97706] text-sm mt-0.5 flex-shrink-0">•</span>
                    <span className="text-sm text-[#78350f] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 금기 + 부작용 (2열) ─── */}
        {(donts?.length || side_effects?.length) ? (
          <div className="grid grid-cols-2 gap-3 mb-3 px-0">
            {donts && donts.length > 0 && (
              <div className="bg-[#fff1f2] rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Ban size={14} strokeWidth={2} className="text-[#f43f5e]" />
                  <span className="text-xs font-bold text-[#9f1239] leading-tight">{L.donts}</span>
                </div>
                <ul className="space-y-1.5">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#f43f5e] text-xs mt-0.5 flex-shrink-0">✕</span>
                      <span className="text-xs text-[#881337] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {side_effects && side_effects.length > 0 && (
              <div className="bg-[#fff1f2] rounded-2xl shadow-sm px-3 pt-3 pb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap size={14} strokeWidth={2} className="text-[#f43f5e]" />
                  <span className="text-xs font-bold text-[#9f1239] leading-tight">{L.sideEffects}</span>
                </div>
                <ul className="space-y-1.5">
                  {side_effects.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#f43f5e] text-xs mt-0.5 flex-shrink-0">!</span>
                      <span className="text-xs text-[#881337] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
                {side_effects_note && (
                  <p className="text-xs text-[#881337] mt-2 leading-snug opacity-80">{side_effects_note}</p>
                )}
              </div>
            )}
          </div>
        ) : null}

        {/* ─── 사용 팁 ─── */}
        {tips && tips.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#f0fdf4] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} strokeWidth={2} className="text-[#4ade80]" />
                <span className="font-bold text-[#15803d] text-sm">{L.tips}</span>
              </div>
              <ul className="space-y-2">
                {tips.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#4ade80] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-[#166534] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 추천 대상 ─── */}
        {recommended_for && recommended_for.length > 0 && (
          <SectionCard className="mb-3">
            <div className="bg-[#eff6ff] px-4 pt-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={15} strokeWidth={2} className="text-[#60a5fa]" />
                <span className="font-bold text-[#1e40af] text-sm">{L.recommended}</span>
              </div>
              <ul className="space-y-2">
                {recommended_for.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#60a5fa] text-sm mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-sm text-[#1e3a5f] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        )}

        {/* ─── 기존 indication (구 버전 호환) ─── */}
        {product.indication && !product.description && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={Info} title={L.indication} iconColor="text-gray-400" />
            <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{product.indication}</p>
          </SectionCard>
        )}

        {/* ─── 참고사항 (구 버전 호환) ─── */}
        {(product.note1 || product.note2) && (
          <SectionCard className="mb-3">
            <SectionHeader Icon={Info} title={L.notes} iconColor="text-gray-400" />
            <div className="px-4 pb-4">
              {product.note1 && <p className="text-sm text-gray-600 mb-1">{product.note1}</p>}
              {product.note2 && <p className="text-sm text-gray-600">{product.note2}</p>}
            </div>
          </SectionCard>
        )}

        {/* ─── CTA 버튼 ─── */}
        <div className="mb-3 px-0">
          <button className="w-full bg-[#0ea5e9] text-white font-semibold text-sm py-3.5 rounded-2xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
            <MessageCircle size={16} strokeWidth={2} />
            {L.consult}
          </button>
        </div>

        {/* ─── 면책 문구 ─── */}
        <div className="bg-white rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line">
            {L.disclaimer}
          </p>
          <p className="text-xs text-gray-300 mt-1">{L.disclaimerSub}</p>
        </div>
      </div>
    </div>
  )
}
