export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">제품을 찾을 수 없습니다</h2>
        <p className="text-gray-500 text-sm">QR코드가 유효하지 않거나 제품이 삭제되었습니다.</p>
      </div>
    </div>
  )
}
