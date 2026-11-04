import { formatRupiah } from "../lib/utils";
// import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product, onClick }) {
  // Logika Badge Status
  const getBadge = () => {
    if (product.status === "ready_stock") {
      if (product.stock === 0)
        return (
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
            Habis
          </span>
        );
      return (
        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
          Ready Stock
        </span>
      );
    }
    if (product.status === "made_to_order") {
      return (
        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
          Pre-Order (PO)
        </span>
      );
    }
    return (
      <span className="bg-brand-secondary text-brand-primary text-xs px-3 py-1 rounded-full font-medium">
        Custom / Inquiry
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      <div className="relative aspect-3/4 overflow-hidden bg-gray-100">
        {product.main_image_url ? (
          <img
            src={product.main_image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3">{getBadge()}</div>
      </div>

      <div className="p-4 flex flex-col grow">
        <h3 className="font-semibold text-brand-text text-lg mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-brand-muted text-sm mb-3 line-clamp-2">
          {product.description || "Tanpa deskripsi"}
        </p>
        <div className="mt-auto">
          <p className="font-bold text-brand-primary text-lg">
            {product.status === "inquiry" ? "Mulai dari " : ""}
            {formatRupiah(product.price)}
          </p>
        </div>
      </div>
    </div>
  );
}
