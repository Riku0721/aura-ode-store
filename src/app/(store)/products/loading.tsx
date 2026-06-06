export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header */}
      <div className="bg-[#0d1b3e] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-32 bg-white/20 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded mt-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="h-5 w-16 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid skeleton */}
          <div className="flex-1">
            <div className="flex gap-3 mb-6">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
              <div className="w-36 h-10 bg-gray-200 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
