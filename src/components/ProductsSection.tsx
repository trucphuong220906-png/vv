import React, { useState } from 'react';
import { Product } from '../data/vetvietData';
import { Eye, QrCode, ShoppingBag, Check } from 'lucide-react';

interface ProductsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenQrModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  onSelectProduct,
  onOpenQrModal,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'Tất Cả Sản Phẩm' },
    { key: 'keychain', label: 'Móc Khóa Lẻ (22k)' },
    { key: 'combo', label: 'Combo Cặp (40k/cặp)' },
  ];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1500);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  return (
    <section id="products" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header and Category Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C04A37] uppercase mb-2">
            <span>Bộ Sưu Tập Vết 01</span>
            <span aria-hidden="true">·</span>
            <span>Đờn Ca Tài Tử Tâm Hồn Việt</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#2D1E18] font-semibold tracking-tight">
            Sản phẩm & Combo ưu đãi
          </h2>
          <p className="text-sm text-[#7A695C] mt-2 max-w-lg">
            2 mẫu móc khóa thủ công Đàn Kìm và Đàn Cò mức giá <strong>22.000₫/cái</strong>, hoặc mua <strong>Combo cặp đôi chỉ 40.000₫/cặp</strong> (tiết kiệm hơn).
          </p>
        </div>

        {/* Categories segmented buttons */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#F3EDE2] rounded-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.key
                  ? 'bg-white text-[#C04A37] shadow-xs'
                  : 'text-[#7A695C] hover:text-[#2D1E18]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid - Centered 3 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => {
          const isAdded = addedProductId === product.id;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col bg-white rounded-xl border border-[#4A3728]/10 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#F3EDE2]/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-medium text-[#4A3728] border border-[#4A3728]/15 shadow-2xs">
                  {product.heritageOrigin}
                </div>

                {/* Hover overlay with quick actions */}
                <div className="absolute inset-0 bg-[#2D1E18]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="p-3 bg-white hover:bg-[#FAF7F2] text-[#2D1E18] rounded-full shadow-md hover:scale-105 transition-transform"
                    title="Xem chi tiết"
                    aria-label="Xem chi tiết sản phẩm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQrModal(product);
                    }}
                    className="p-3 bg-[#C04A37] hover:bg-[#9C3322] text-white rounded-full shadow-md hover:scale-105 transition-transform"
                    title="Xem QR Story"
                    aria-label="Xem QR Story"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#7A695C] mb-1.5">
                    <span>{product.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="line-clamp-1">{product.material.split(',')[0]}</span>
                  </div>
                  <h3 className="font-display font-semibold text-base text-[#2D1E18] group-hover:text-[#C04A37] transition-colors line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#7A695C] mt-2 line-clamp-2 leading-relaxed">
                    {product.storySnippet}
                  </p>
                </div>

                {/* Price and Cart button */}
                <div className="mt-4 pt-4 border-t border-[#4A3728]/10 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-semibold text-[#C04A37] tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#7A695C]/60 line-through tabular-nums">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isAdded}
                    className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#F3EDE2] hover:bg-[#C04A37] text-[#4A3728] hover:text-white'
                    }`}
                    aria-label={`Thêm ${product.name} vào giỏ`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Đã thêm</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm giỏ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
