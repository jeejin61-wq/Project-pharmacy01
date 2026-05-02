'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, ProductInsert, ProductUpdate, ProductTranslation } from '@/types/product'
import Link from 'next/link'

// ─── 이미지 업로드 컴포넌트 ──────────────────────────────────

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function ImageUploader({
  productId,
  currentUrl,
  onUploaded,
}: {
  productId?: number
  currentUrl: string | null
  onUploaded: (url: string | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('JPG, PNG, WEBP 파일만 업로드 가능합니다.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    const ext = file.name.split('.').pop()
    const timestamp = Date.now()
    const idPart = productId ?? 'new'
    const fileName = `product_${idPart}_${timestamp}.${ext}`

    setUploading(true)
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setError('업로드 실패: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    const publicUrl = urlData.publicUrl
    setPreview(publicUrl)
    onUploaded(publicUrl)
    setUploading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    setPreview(null)
    onUploaded(null)
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">제품 이미지</label>
      {preview ? (
        <div className="flex items-start gap-3">
          <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="제품 이미지" className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              이미지 교체
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              이미지 삭제
            </button>
            {uploading && <span className="text-xs text-gray-400">업로드 중...</span>}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center gap-2 hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
          ) : (
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          <span className="text-xs text-gray-400">
            {uploading ? '업로드 중...' : '클릭하여 이미지 업로드 (JPG, PNG, WEBP · 최대 5MB)'}
          </span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  )
}

// ─── 상수 ───────────────────────────────────────────────────

const UNITS = ['포', '캡슐', '정', '액', '병', '개', '박스', 'mL', 'g']
const CATEGORIES = ['일반의약품', '전문의약품', '건강기능식품', '기타']
const TABS = ['기본정보', '사용방법', '주의사항', '부가정보', '번역'] as const
type Tab = typeof TABS[number]

type TransLang = 'en' | 'zh' | 'ja'
const TRANS_LANGS: { key: TransLang; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '中文' },
  { key: 'ja', label: '日本語' },
]

// ─── 빈 폼 ──────────────────────────────────────────────────

const emptyTranslation: ProductTranslation = {
  name: '',
  description: '',
  usage_frequency: '',
  usage_method: '',
  usage_target: '',
  usage_note: '',
  precautions: [],
  donts: [],
  side_effects: [],
  side_effects_note: '',
  tips: [],
  recommended_for: [],
  usage_areas: [],
}

const emptyForm: ProductInsert = {
  barcode: '',
  name: '',
  manufacturer: '',
  stock: null,
  optimal_stock: null,
  price: null,
  unit: '정',
  indication: '',
  note1: '',
  note2: '',
  category: null,
  volume: null,
  price_per_unit: null,
  image_url: null,
  usage_areas: null,
  usage_frequency: null,
  usage_method: null,
  usage_target: null,
  usage_note: null,
  precautions: null,
  donts: null,
  side_effects: null,
  side_effects_note: null,
  tips: null,
  recommended_for: null,
  store_location: null,
  ingredients: null,
  description: null,
  translations: null,
}

// ─── 유틸 ───────────────────────────────────────────────────

function Modal({
  open, title, onClose, children,
}: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// 동적 문자열 리스트 편집기
function StringListEditor({
  label, values, onChange, placeholder,
}: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string
}) {
  const add = () => onChange([...values, ''])
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))
  const update = (i: number, val: string) => onChange(values.map((v, idx) => idx === i ? val : v))

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-gray-500">{label}</label>
        <button type="button" onClick={add} className="text-xs text-blue-600 hover:underline font-medium">
          + 항목 추가
        </button>
      </div>
      <div className="space-y-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex gap-1.5">
            <input
              className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
            />
            <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 px-2">✕</button>
          </div>
        ))}
        {values.length === 0 && (
          <p className="text-xs text-gray-400 italic py-1">항목 없음 — 위 버튼으로 추가하세요</p>
        )}
      </div>
    </div>
  )
}

// ─── 번역 편집기 (단일 언어) ──────────────────────────────────

function TranslationEditor({
  lang,
  label,
  value,
  onChange,
  inputCls,
  labelCls,
}: {
  lang: TransLang
  label: string
  value: ProductTranslation
  onChange: (v: ProductTranslation) => void
  inputCls: string
  labelCls: string
}) {
  const set = (key: keyof ProductTranslation, val: unknown) => onChange({ ...value, [key]: val })

  const getArr = (key: keyof ProductTranslation): string[] => {
    const v = value[key]
    if (Array.isArray(v)) return v as string[]
    return []
  }

  const usageAreas = value.usage_areas ?? []
  const setUsageAreas = (areas: { name: string; icon: string }[]) => set('usage_areas', areas)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold bg-[#0ea5e9] text-white px-2.5 py-1 rounded-full">{label}</span>
        <span className="text-xs text-gray-400">번역 입력 (비워두면 한국어로 표시)</span>
      </div>

      {/* 제품명 */}
      <div>
        <label className={labelCls}>제품명 ({label})</label>
        <input className={inputCls} value={value.name ?? ''} onChange={(e) => set('name', e.target.value)} placeholder="Product name" />
      </div>

      {/* 한줄 설명 */}
      <div>
        <label className={labelCls}>한줄 설명 ({label})</label>
        <input className={inputCls} value={value.description ?? ''} onChange={(e) => set('description', e.target.value)} placeholder="Short description" />
      </div>

      {/* 사용 횟수 */}
      <div>
        <label className={labelCls}>사용 횟수 ({label})</label>
        <input className={inputCls} value={value.usage_frequency ?? ''} onChange={(e) => set('usage_frequency', e.target.value)} placeholder="Usage frequency" />
      </div>

      {/* 사용 방법 */}
      <div>
        <label className={labelCls}>사용 방법 ({label})</label>
        <input className={inputCls} value={value.usage_method ?? ''} onChange={(e) => set('usage_method', e.target.value)} placeholder="Usage method" />
      </div>

      {/* 사용 부위/타이밍 */}
      <div>
        <label className={labelCls}>사용 부위/타이밍 ({label})</label>
        <input className={inputCls} value={value.usage_target ?? ''} onChange={(e) => set('usage_target', e.target.value)} placeholder="Usage target / timing" />
      </div>

      {/* 추가 안내 */}
      <div>
        <label className={labelCls}>추가 안내 ({label})</label>
        <input className={inputCls} value={value.usage_note ?? ''} onChange={(e) => set('usage_note', e.target.value)} placeholder="Additional usage note" />
      </div>

      {/* 사용 부위 아이콘 */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-medium text-gray-500">사용 부위 아이콘 ({label})</label>
          <button type="button" onClick={() => setUsageAreas([...usageAreas, { name: '', icon: 'Activity' }])} className="text-xs text-blue-600 hover:underline font-medium">
            + 항목 추가
          </button>
        </div>
        <div className="space-y-2">
          {usageAreas.map((area, i) => (
            <div key={i} className="flex gap-1.5 items-center">
              <input
                className="w-24 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={area.icon}
                onChange={(e) => setUsageAreas(usageAreas.map((a, idx) => idx === i ? { ...a, icon: e.target.value } : a))}
                placeholder="Wind"
              />
              <input
                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={area.name}
                onChange={(e) => setUsageAreas(usageAreas.map((a, idx) => idx === i ? { ...a, name: e.target.value } : a))}
                placeholder="Area name"
              />
              <button type="button" onClick={() => setUsageAreas(usageAreas.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-2">✕</button>
            </div>
          ))}
          {usageAreas.length === 0 && <p className="text-xs text-gray-400 italic py-1">항목 없음</p>}
        </div>
      </div>

      {/* 사용 전 체크사항 */}
      <StringListEditor
        label={`사용 전 체크사항 (${label})`}
        values={getArr('precautions')}
        onChange={(v) => set('precautions', v)}
        placeholder="Precaution item"
      />

      {/* 금기 */}
      <StringListEditor
        label={`금기 (${label})`}
        values={getArr('donts')}
        onChange={(v) => set('donts', v)}
        placeholder="Don't item"
      />

      {/* 부작용 */}
      <StringListEditor
        label={`부작용 (${label})`}
        values={getArr('side_effects')}
        onChange={(v) => set('side_effects', v)}
        placeholder="Side effect"
      />

      {/* 부작용 참고 */}
      <div>
        <label className={labelCls}>부작용 참고 문구 ({label})</label>
        <textarea rows={2} className={inputCls} value={value.side_effects_note ?? ''} onChange={(e) => set('side_effects_note', e.target.value)} placeholder="Side effects note..." />
      </div>

      {/* 팁 */}
      <StringListEditor
        label={`사용 팁 (${label})`}
        values={getArr('tips')}
        onChange={(v) => set('tips', v)}
        placeholder="Tip item"
      />

      {/* 추천 대상 */}
      <StringListEditor
        label={`추천 대상 (${label})`}
        values={getArr('recommended_for')}
        onChange={(v) => set('recommended_for', v)}
        placeholder="Recommended for..."
      />
    </div>
  )
}

// ─── 폼 ─────────────────────────────────────────────────────

function ProductForm({
  initial, onSubmit, onCancel, loading, productId,
}: {
  initial: ProductInsert; onSubmit: (data: ProductInsert) => void; onCancel: () => void; loading: boolean; productId?: number
}) {
  const [form, setForm] = useState<ProductInsert>(initial)
  const [tab, setTab] = useState<Tab>('기본정보')
  const [transLang, setTransLang] = useState<TransLang>('en')

  const set = (key: keyof ProductInsert, value: unknown) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

  // JSONB 리스트 헬퍼
  const getList = (key: keyof ProductInsert): string[] => {
    const v = form[key]
    if (!v) return []
    if (Array.isArray(v)) return v as string[]
    return []
  }

  // usage_areas 전용 (객체 배열)
  const usageAreas = form.usage_areas ?? []
  const setUsageAreas = (areas: { name: string; icon: string }[]) => set('usage_areas', areas)

  // 번역 상태 관리
  const translations: Record<string, ProductTranslation> = (form.translations as Record<string, ProductTranslation>) ?? {}

  const getTranslation = (lang: TransLang): ProductTranslation => ({
    ...emptyTranslation,
    ...(translations[lang] ?? {}),
  })

  const setTranslation = (lang: TransLang, t: ProductTranslation) => {
    const updated = { ...translations, [lang]: t }
    set('translations', updated)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* 탭 */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl">
        {TABS.map((t) => (
          <button
            key={t} type="button"
            onClick={() => setTab(t)}
            className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${tab === t ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4 min-h-[320px]">

        {/* ── 기본정보 탭 ── */}
        {tab === '기본정보' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>제품명 *</label>
              <input required className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="제품명" />
            </div>
            <div>
              <label className={labelCls}>제조사</label>
              <input className={inputCls} value={form.manufacturer ?? ''} onChange={(e) => set('manufacturer', e.target.value)} placeholder="제조사" />
            </div>
            <div>
              <label className={labelCls}>카테고리</label>
              <select className={inputCls} value={form.category ?? ''} onChange={(e) => set('category', e.target.value || null)}>
                <option value="">선택 안함</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>바코드</label>
              <input className={inputCls} value={form.barcode ?? ''} onChange={(e) => set('barcode', e.target.value)} placeholder="바코드" />
            </div>
            <div>
              <label className={labelCls}>단위</label>
              <select className={inputCls} value={form.unit ?? '정'} onChange={(e) => set('unit', e.target.value)}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>판매가격 (원)</label>
              <input type="number" className={inputCls} value={form.price ?? ''} onChange={(e) => set('price', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>단위당 가격</label>
              <input className={inputCls} value={form.price_per_unit ?? ''} onChange={(e) => set('price_per_unit', e.target.value || null)} placeholder="1포당 약 833원" />
            </div>
            <div>
              <label className={labelCls}>재고</label>
              <input type="number" className={inputCls} value={form.stock ?? ''} onChange={(e) => set('stock', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>적정재고</label>
              <input type="number" className={inputCls} value={form.optimal_stock ?? ''} onChange={(e) => set('optimal_stock', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>용량</label>
              <input className={inputCls} value={form.volume ?? ''} onChange={(e) => set('volume', e.target.value || null)} placeholder="13g, 20mL 등" />
            </div>
            <div className="col-span-2">
              <ImageUploader
                productId={productId}
                currentUrl={form.image_url ?? null}
                onUploaded={(url) => set('image_url', url)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>제품 한줄 설명</label>
              <input className={inputCls} value={form.description ?? ''} onChange={(e) => set('description', e.target.value || null)} placeholder="여드름·뾰루지 완화 / 국소 도포용 항여드름제" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>적응증 (구 버전 호환)</label>
              <textarea rows={3} className={inputCls} value={form.indication ?? ''} onChange={(e) => set('indication', e.target.value)} placeholder="효능효과, 적응증..." />
            </div>
          </div>
        )}

        {/* ── 사용방법 탭 ── */}
        {tab === '사용방법' && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>사용 횟수</label>
              <input className={inputCls} value={form.usage_frequency ?? ''} onChange={(e) => set('usage_frequency', e.target.value || null)} placeholder="1~2회/일, 1일 3회 등" />
            </div>
            <div>
              <label className={labelCls}>사용 방법</label>
              <input className={inputCls} value={form.usage_method ?? ''} onChange={(e) => set('usage_method', e.target.value || null)} placeholder="얇게 톡톡 도포, 1회 1포 복용 등" />
            </div>
            <div>
              <label className={labelCls}>사용 부위 / 타이밍</label>
              <input className={inputCls} value={form.usage_target ?? ''} onChange={(e) => set('usage_target', e.target.value || null)} placeholder="여드름 부위만, 식후 30분 등" />
            </div>
            <div>
              <label className={labelCls}>추가 안내 (usage_note)</label>
              <input className={inputCls} value={form.usage_note ?? ''} onChange={(e) => set('usage_note', e.target.value || null)} placeholder="세안 후 피부를 건조시킨 뒤 사용하세요" />
            </div>

            {/* usage_areas */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-500">사용 부위 아이콘 목록</label>
                <button type="button" onClick={() => setUsageAreas([...usageAreas, { name: '', icon: '💊' }])} className="text-xs text-blue-600 hover:underline font-medium">
                  + 항목 추가
                </button>
              </div>
              <div className="space-y-2">
                {usageAreas.map((area, i) => (
                  <div key={i} className="flex gap-1.5 items-center">
                    <input
                      className="w-14 border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={area.icon}
                      onChange={(e) => setUsageAreas(usageAreas.map((a, idx) => idx === i ? { ...a, icon: e.target.value } : a))}
                      placeholder="💊"
                    />
                    <input
                      className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={area.name}
                      onChange={(e) => setUsageAreas(usageAreas.map((a, idx) => idx === i ? { ...a, name: e.target.value } : a))}
                      placeholder="부위 이름"
                    />
                    <button type="button" onClick={() => setUsageAreas(usageAreas.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-2">✕</button>
                  </div>
                ))}
                {usageAreas.length === 0 && <p className="text-xs text-gray-400 italic py-1">항목 없음</p>}
              </div>
            </div>

            <StringListEditor
              label="사용 팁"
              values={getList('tips')}
              onChange={(v) => set('tips', v.length ? v : null)}
              placeholder="자기 전에 바르면 효과가 더 좋아요"
            />
          </div>
        )}

        {/* ── 주의사항 탭 ── */}
        {tab === '주의사항' && (
          <div className="space-y-5">
            <StringListEditor
              label="사용 전 체크사항"
              values={getList('precautions')}
              onChange={(v) => set('precautions', v.length ? v : null)}
              placeholder="민감성 피부"
            />
            <StringListEditor
              label="이렇게 사용하면 안돼요"
              values={getList('donts')}
              onChange={(v) => set('donts', v.length ? v : null)}
              placeholder="넓은 부위에 퍼 바르기"
            />
            <StringListEditor
              label="나타날 수 있는 부작용"
              values={getList('side_effects')}
              onChange={(v) => set('side_effects', v.length ? v : null)}
              placeholder="피부 건조함"
            />
            <div>
              <label className={labelCls}>부작용 참고 문구</label>
              <textarea rows={2} className={inputCls} value={form.side_effects_note ?? ''} onChange={(e) => set('side_effects_note', e.target.value || null)} placeholder="초기에 나타날 수 있으며..." />
            </div>
          </div>
        )}

        {/* ── 부가정보 탭 ── */}
        {tab === '부가정보' && (
          <div className="space-y-4">
            <StringListEditor
              label="이런 분들에게 추천해요"
              values={getList('recommended_for')}
              onChange={(v) => set('recommended_for', v.length ? v : null)}
              placeholder="갑자기 올라온 여드름이 고민인 분"
            />
            <div>
              <label className={labelCls}>약국 내 위치</label>
              <input className={inputCls} value={form.store_location ?? ''} onChange={(e) => set('store_location', e.target.value || null)} placeholder="여드름·피부 코너" />
            </div>
            <div>
              <label className={labelCls}>성분 정보</label>
              <input className={inputCls} value={form.ingredients ?? ''} onChange={(e) => set('ingredients', e.target.value || null)} placeholder="이소트레티노인 0.1%" />
            </div>
            <div>
              <label className={labelCls}>참고사항 1 (구 버전)</label>
              <input className={inputCls} value={form.note1 ?? ''} onChange={(e) => set('note1', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>참고사항 2 (구 버전)</label>
              <input className={inputCls} value={form.note2 ?? ''} onChange={(e) => set('note2', e.target.value)} />
            </div>
          </div>
        )}

        {/* ── 번역 탭 ── */}
        {tab === '번역' && (
          <div>
            {/* 언어 서브탭 */}
            <div className="flex gap-1 mb-4 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {TRANS_LANGS.map(({ key, label }) => (
                <button
                  key={key} type="button"
                  onClick={() => setTransLang(key)}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${transLang === key ? 'bg-[#0ea5e9] text-white shadow-sm' : 'text-gray-500 hover:text-[#0ea5e9]'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <TranslationEditor
              lang={transLang}
              label={TRANS_LANGS.find((l) => l.key === transLang)!.label}
              value={getTranslation(transLang)}
              onChange={(v) => setTranslation(transLang, v)}
              inputCls={inputCls}
              labelCls={labelCls}
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
        <button type="button" onClick={onCancel} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          취소
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
          {loading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}

// ─── 메인 페이지 ─────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [showAdd, setShowAdd] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('id')
    if (error) setError('제품 목록 로딩 실패')
    else setProducts(data as Product[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleAdd = async (form: ProductInsert) => {
    setFormLoading(true)
    const { error } = await supabase.from('products').insert([form])
    if (error) { setError('추가 실패: ' + error.message) }
    else { setShowAdd(false); showToast('제품이 추가되었습니다.'); fetchProducts() }
    setFormLoading(false)
  }

  const handleEdit = async (form: ProductInsert) => {
    if (!editProduct) return
    setFormLoading(true)
    const { error } = await supabase.from('products').update(form as ProductUpdate).eq('id', editProduct.id)
    if (error) { setError('수정 실패: ' + error.message) }
    else { setEditProduct(null); showToast('제품이 수정되었습니다.'); fetchProducts() }
    setFormLoading(false)
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    if (error) { setError('삭제 실패: ' + error.message) }
    else { setDeleteId(null); showToast('제품이 삭제되었습니다.'); fetchProducts() }
  }

  const makeInitialForm = (p: Product): ProductInsert => ({
    barcode: p.barcode,
    name: p.name,
    manufacturer: p.manufacturer,
    stock: p.stock,
    optimal_stock: p.optimal_stock,
    price: p.price,
    unit: p.unit,
    indication: p.indication,
    note1: p.note1,
    note2: p.note2,
    category: p.category ?? null,
    volume: p.volume ?? null,
    price_per_unit: p.price_per_unit ?? null,
    image_url: p.image_url ?? null,
    usage_areas: p.usage_areas ?? null,
    usage_frequency: p.usage_frequency ?? null,
    usage_method: p.usage_method ?? null,
    usage_target: p.usage_target ?? null,
    usage_note: p.usage_note ?? null,
    precautions: p.precautions ?? null,
    donts: p.donts ?? null,
    side_effects: p.side_effects ?? null,
    side_effects_note: p.side_effects_note ?? null,
    tips: p.tips ?? null,
    recommended_for: p.recommended_for ?? null,
    store_location: p.store_location ?? null,
    ingredients: p.ingredients ?? null,
    description: p.description ?? null,
    translations: p.translations ?? null,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">제품 관리</h1>
              <p className="text-xs text-gray-400">{products.length}개 등록됨</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            제품 추가
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">제품명</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">카테고리</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">제조사</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">가격</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">단위</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">재고</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">번역</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                      <td className="px-4 py-3">
                        <a href={`/product/${p.id}`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">{p.name}</a>
                        {p.barcode && <div className="text-xs text-gray-400 font-mono">{p.barcode}</div>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {p.category ? (
                          <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-lg">{p.category}</span>
                        ) : <span className="text-gray-300">-</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.manufacturer ?? '-'}</td>
                      <td className="px-4 py-3 text-right text-gray-700 font-medium hidden md:table-cell">
                        {p.price ? `₩${p.price.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-lg">{p.unit ?? '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className={`text-sm font-medium ${
                          p.stock !== null && p.optimal_stock !== null && p.stock < p.optimal_stock * 0.3
                            ? 'text-red-600' : p.stock !== null && p.optimal_stock !== null && p.stock < p.optimal_stock * 0.7
                            ? 'text-amber-600' : 'text-gray-700'
                        }`}>
                          {p.stock ?? '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center hidden lg:table-cell">
                        <div className="flex items-center justify-center gap-0.5">
                          {(['en', 'zh', 'ja'] as TransLang[]).map((lang) => (
                            <span
                              key={lang}
                              className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                p.translations?.[lang] && Object.keys(p.translations[lang]).length > 0
                                  ? 'bg-[#e0f2fe] text-[#0284c7]'
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditProduct(p)}
                            className="text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg transition-colors text-xs font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg transition-colors text-xs font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {products.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-sm">등록된 제품이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Modal */}
      <Modal open={showAdd} title="제품 추가" onClose={() => setShowAdd(false)}>
        <ProductForm initial={emptyForm} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} loading={formLoading} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editProduct} title="제품 수정" onClose={() => setEditProduct(null)}>
        {editProduct && (
          <ProductForm
            initial={makeInitialForm(editProduct)}
            onSubmit={handleEdit}
            onCancel={() => setEditProduct(null)}
            loading={formLoading}
            productId={editProduct.id}
          />
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={deleteId !== null} title="제품 삭제" onClose={() => setDeleteId(null)}>
        <div className="text-center">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <p className="text-gray-700 mb-1 font-medium">제품을 삭제하시겠습니까?</p>
          <p className="text-gray-400 text-sm mb-6">이 작업은 되돌릴 수 없습니다.</p>
          <div className="flex gap-2">
            <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              취소
            </button>
            <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors">
              삭제
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
