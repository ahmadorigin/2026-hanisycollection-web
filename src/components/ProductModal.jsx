import { useState } from "react";
import { X, Send } from "lucide-react";
import { formatRupiah, generateWALink } from "../lib/utils";

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || "",
  );
  const [activeImage, setActiveImage] = useState(product?.main_image_url || "");
  const details = product?.detail_images || [];

  if (!product) return null;

  const isOutOfStock = product.status === "ready_stock" && product.stock === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-200">
        {/* Tombol Close Mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 md:hidden"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Bagian Kiri: Gambar */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-50 p-4">
          <div className="aspect-3/4 rounded-xl overflow-hidden bg-white mb-4">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail Detail Foto (Maks 4) */}
          {details.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              <div
                onClick={() => setActiveImage(product.main_image_url)}
                className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${activeImage === product.main_image_url ? "border-brand-primary" : "border-transparent"}`}
              >
                <img
                  src={product.main_image_url}
                  className="w-full h-full object-cover"
                />
              </div>
              {details.map((detail, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(detail.image_url)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${activeImage === detail.image_url ? "border-brand-primary" : "border-transparent"}`}
                >
                  <img
                    src={detail.image_url}
                    className="w-full h-full object-cover"
                    title={detail.caption}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bagian Kanan: Info & Checkout */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text pr-8">
              {product.name}
            </h2>
            <button
              onClick={onClose}
              className="hidden md:block text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-2xl font-bold text-brand-primary mb-4">
            {product.status === "inquiry" ? "Mulai dari " : ""}
            {formatRupiah(product.price)}
          </p>

          <div className="prose prose-sm text-brand-muted mb-6">
            <p>
              {product.description || "Belum ada deskripsi untuk produk ini."}
            </p>
          </div>

          {/* Varian Warna */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Pilih Warna
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${selectedColor === color ? "border-brand-primary bg-brand-secondary text-brand-primary font-medium" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Varian Ukuran */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-text mb-2">
                Pilih Ukuran
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center text-sm transition-colors ${selectedSize === size ? "border-brand-primary bg-brand-secondary text-brand-primary font-medium" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-gray-100">
            <a
              href={
                isOutOfStock
                  ? "#"
                  : generateWALink(product, selectedSize, selectedColor)
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30"
              }`}
              onClick={(e) => isOutOfStock && e.preventDefault()}
            >
              <Send className="w-5 h-5" />
              {isOutOfStock
                ? "Stok Habis"
                : product.status === "inquiry"
                  ? "Tanya via WhatsApp"
                  : "Beli Sekarang via WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
