import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import { Search } from "lucide-react";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Fetch Categories
      const { data: cats } = await supabase.from("categories").select("*");
      if (cats) setCategories(cats);

      // Fetch Products (termasuk detail images)
      const { data: prods } = await supabase
        .from("products")
        .select(
          `
          *,
          categories (name),
          product_detail_images (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (prods) setProducts(prods);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchCategory =
      activeCategory === "Semua" || p.categories?.name === activeCategory;
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="bg-brand-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-brand-text">
            Katalog Koleksi
          </h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary bg-white"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 hide-scrollbar">
          <button
            onClick={() => setActiveCategory("Semua")}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === "Semua" ? "bg-brand-primary text-white" : "bg-white text-brand-text border border-gray-200 hover:border-brand-primary"}`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${activeCategory === cat.name ? "bg-brand-primary text-white" : "bg-white text-brand-text border border-gray-200 hover:border-brand-primary"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20 text-brand-muted">
            Memuat katalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-brand-muted">
            Tidak ada produk yang ditemukan.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  detail_images: product.product_detail_images, // mapping untuk modal
                }}
                onClick={() =>
                  setSelectedProduct({
                    ...product,
                    detail_images: product.product_detail_images,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
