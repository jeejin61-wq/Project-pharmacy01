'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, ProductInsert, ProductUpdate } from '@/types/product'
import Link from 'next/link'

const UNITS = ['포', '캡슐', '정', '액', '병', '개', '박스']

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
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial: ProductInsert
  onSubmit: (data: ProductInsert) => void
  onCancel: () => void
  loading: boolean
}) {
  const [form, setForm] = useState<ProductInsert>(initial)

  const set = (key: keyof ProductInsert, value: string | number | null) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
  const labelCls = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className={labelCls}>바코드</label>
          <input className={inputCls} value={form.barcode ?? ''} onChange={(e) => set('barcode', e.target.value)} placeholder="바코드" />
        </div>
        <div>
          <label className={labelCls}>판매가격 (원)</label>
          <input type="number" className={inputCls} value={form.price ?? ''} onChange={(e) => set('price', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>단위</label>
          <select className={inputCls} value={form.unit ?? '정'} onChange={(e) => set('unit', e.target.value)}>
            {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>재고</label>
          <input type="number" className={inputCls} value={form.stock ?? ''} onChange={(e) => set('stock', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>적정재고</label>
          <input type="number" className={inputCls} value={form.optimal_stock ?? ''} onChange={(e) => set('optimal_stock', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>적응증</label>
          <textarea rows={3} className={inputCls} value={form.indication ?? ''} onChange={(e) => set('indication', e.target.value)} placeholder="효능효과, 적응증..." />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>참고사항 1</label>
          <input className={inputCls} value={form.note1 ?? ''} onChange={(e) => set('note1', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>참고사항 2</label>
          <input className={inputCls} value={form.note2 ?? ''} onChange={(e) => set('note2', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-2 pt-2">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-fade-in">
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
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">제조사</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">가격</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">단위</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">재고</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{p.name}</div>
                        {p.barcode && <div className="text-xs text-gray-400 font-mono">{p.barcode}</div>}
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
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-sm">등록된 제품이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Modal */}
      <Modal open={showAdd} title="제품 추가" onClose={() => setShowAdd(false)}>
        <ProductForm
          initial={emptyForm}
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editProduct} title="제품 수정" onClose={() => setEditProduct(null)}>
        {editProduct && (
          <ProductForm
            initial={{
              barcode: editProduct.barcode,
              name: editProduct.name,
              manufacturer: editProduct.manufacturer,
              stock: editProduct.stock,
              optimal_stock: editProduct.optimal_stock,
              price: editProduct.price,
              unit: editProduct.unit,
              indication: editProduct.indication,
              note1: editProduct.note1,
              note2: editProduct.note2,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditProduct(null)}
            loading={formLoading}
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
