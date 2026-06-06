export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="min-h-[85vh] bg-gradient-to-br from-[#0d1b3e] to-[#1a2f5e] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            <div className="space-y-4">
              <div className="h-4 w-32 bg-white/20 rounded" />
              <div className="h-12 w-3/4 bg-white/20 rounded" />
              <div className="h-12 w-1/2 bg-white/20 rounded" />
              <div className="h-4 w-full bg-white/10 rounded mt-6" />
              <div className="h-4 w-5/6 bg-white/10 rounded" />
              <div className="h-12 w-36 bg-[#c9a84c]/40 rounded-full mt-4" />
            </div>
            <div className="aspect-square rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}
