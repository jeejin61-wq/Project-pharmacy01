import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">약국 QR 시스템</h1>
        <p className="text-gray-500 mb-8 text-sm">제품 정보 조회 및 QR코드 관리</p>
        <div className="space-y-3">
          <Link
            href="/admin/products"
            className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl font-medium transition-colors"
          >
            <span>제품 관리</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/qr"
            className="flex items-center justify-between w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-5 py-3.5 rounded-xl font-medium transition-colors"
          >
            <span>QR코드 생성</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/product/1"
            className="flex items-center justify-between w-full bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 px-5 py-3.5 rounded-xl font-medium transition-colors text-sm"
          >
            <span>제품 조회 예시 (ID: 1)</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  )
}
