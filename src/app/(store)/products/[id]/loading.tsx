export default function ProductDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl bg-gray-200" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-gray-200" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-4 pt-2">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-7 w-28 bg-gray-200 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
          <div className="h-12 bg-gray-200 rounded-full mt-6" />
        </div>
      </div>
    </div>
  )
}
