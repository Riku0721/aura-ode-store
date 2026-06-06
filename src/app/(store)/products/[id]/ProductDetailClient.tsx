'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Minus, Plus, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils/format'
import type { ProductWithImages } from '@/types/database'

export default function ProductDetailClient({ product }: { product: ProductWithImages }) {
  const addItem = useCartStore((s) => s.addItem)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const images = product.product_images.sort((a, b) => a.sort_order - b.sort_order)
  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null
  const currentInventory = product.inventory.find(
    (i) => i.variant_id === selectedVariant || (!selectedVariant && !i.variant_id)
  )
  const inStock = (currentInventory?.quantity ?? 0) > 0

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      variant_id: selectedVariant,
      name: product.name,
      variant_name: product.product_variants.find((v) => v.id === selectedVariant)?.name,
      price: product.price,
      quantity: qty,
      image_url: images[0]?.url,
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0d1b3e] mb-6 transition-colors">
        <ChevronLeft size={16} />
        返回商品列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt_text ?? product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1a2f5e]/10 to-[#c9a84c]/10" />
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? 'border-[#c9a84c]' : 'border-transparent'
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.categories && (
            <p className="text-[#c9a84c] text-sm font-medium mb-2">{product.categories.name}</p>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0d1b3e] mb-3">{product.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-[#0d1b3e]">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_price)}</span>
                <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full font-semibold">
                  省 {discount}%
                </span>
              </>
            )}
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.short_description}</p>
          )}

          {/* Variants */}
          {product.product_variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">款式選擇</p>
              <div className="flex flex-wrap gap-2">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedVariant === v.id
                        ? 'border-[#0d1b3e] bg-[#0d1b3e] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#0d1b3e]'
                    }`}
                  >
                    {v.name}
                    {v.price_adjustment > 0 && ` (+${formatPrice(v.price_adjustment)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <div className="mb-6">
            {inStock ? (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                庫存充足
                {currentInventory && currentInventory.quantity <= 5 && (
                  <span className="text-orange-500 ml-2">（僅剩 {currentInventory.quantity} 件）</span>
                )}
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">已售完</span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-semibold text-gray-700">數量</span>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 font-medium text-sm min-w-[3rem] text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(currentInventory?.quantity ?? 99, qty + 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all ${
              added
                ? 'bg-green-500 text-white'
                : inStock
                ? 'bg-[#0d1b3e] text-white hover:bg-[#1a2f5e] hover:shadow-lg hover:shadow-[#0d1b3e]/30'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} />
            {added ? '已加入購物車 ✓' : inStock ? '加入購物車' : '商品已售完'}
          </button>

          {/* Full description */}
          {product.description && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="font-bold text-[#0d1b3e] mb-3">商品描述</h2>
              <div
                className="text-gray-600 text-sm leading-relaxed prose prose-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
