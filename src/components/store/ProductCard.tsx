'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { useCartStore } from '@/store/cart'
import type { ProductWithImages } from '@/types/database'

interface ProductCardProps {
  product: ProductWithImages
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const primaryImage = product.product_images.find((i) => i.is_primary) ?? product.product_images[0]
  const isOutOfStock = product.inventory.every((i) => i.quantity <= 0)
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: primaryImage?.url,
      slug: product.slug,
    })
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block product-card">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text ?? product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a2f5e]/20 to-[#c9a84c]/20 flex items-center justify-center">
              <span className="text-gray-400 text-sm">暫無圖片</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                -{discount}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-[#c9a84c] text-[#0d1b3e] text-xs px-2 py-0.5 rounded-full font-bold">
                精選
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                已售完
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition-colors"
              aria-label="加入收藏"
              onClick={(e) => e.preventDefault()}
            >
              <Heart size={14} className="text-gray-600" />
            </button>
          </div>

          {/* Add to cart overlay (on hover) */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-0 left-0 right-0 bg-[#0d1b3e]/90 backdrop-blur-sm text-white text-sm py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 font-medium"
            >
              <ShoppingCart size={14} />
              加入購物車
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-[#c9a84c] mb-1">{product.categories?.name}</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0d1b3e]">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
