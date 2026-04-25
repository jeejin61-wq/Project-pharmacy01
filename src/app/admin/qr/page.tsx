'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
import QRCode from 'qrcode'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

interface QRItem {
  product: Product
  qrDataUrl: string
}

function QRCard({ item, onDownload }: { item: QRItem; onDownload: (item: QRItem) => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3 print:shadow-none print:border print:border-gray-300">
      <img
        src={item.qrDataUrl}
        alt={`QR - ${item.product.name}`}
        className="w-36 h-36"
      />
      <div className="text-center">
        <div className="font-semibold text-gray-900 text-sm leading-tight">{item.product.name}</div>
        {item.product.manufacturer && (
          <div className="text-xs text-gray-400 mt-0.5">{item.product.manufacturer}</div>
        )}
        {item.product.barcode && (
          <div className="font-mono text-xs text-gray-400 mt-1">{item.product.barcode}</div>
        )}
      </div>
      <button
        onClick={() => onDownload(item)}
        className="no-print w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl py-2 px-3 font-medium transition-colors"
      >
        QR 다운로드
      </button>
    </div>
  )
}

export default function AdminQRPage() {
  const [qrItems, setQrItems] = useState<QRItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id')

        if (error) throw error

        const items: QRItem[] = await Promise.all(
          (data as Product[]).map(async (product) => {
            const url = `${BASE_URL}/product/${product.id}`
            const qrDataUrl = await QRCode.toDataURL(url, {
              width: 300,
              margin: 2,
              color: {
                dark: '#1e3a8a',
                light: '#ffffff',
              },
              errorCorrectionLevel: 'M',
            })
            return { product, qrDataUrl }
          })
        )

        setQrItems(items)
      } catch (err) {
        setError('제품 목록을 불러오는 데 실패했습니다.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleDownloadOne = (item: QRItem) => {
    const link = document.createElement('a')
    link.href = item.qrDataUrl
    link.download = `QR_${item.product.id}_${item.product.name}.png`
    link.click()
  }

  const handleDownloadAll = async () => {
    setDownloading(true)
    for (const item of qrItems) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = item.qrDataUrl
          link.download = `QR_${item.product.id}_${item.product.name}.png`
          link.click()
          resolve()
        }, 100)
      })
    }
    setDownloading(false)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">QR코드 생성</h1>
              <p className="text-xs text-gray-400">{qrItems.length}개 제품</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              인쇄
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={downloading || loading}
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {downloading ? '다운로드 중...' : '전체 다운로드'}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-700 text-sm">
                QR코드를 스캔하면 <strong>{BASE_URL}/product/[id]</strong> 로 연결됩니다.
                배포 후에는 <code className="bg-blue-100 px-1 rounded">.env.local</code>의 <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_BASE_URL</code>을 실제 도메인으로 변경하세요.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {qrItems.map((item) => (
                <QRCard key={item.product.id} item={item} onDownload={handleDownloadOne} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Print layout */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          header { display: none; }
          .no-print { display: none !important; }
          .grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
