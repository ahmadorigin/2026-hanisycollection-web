import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

async function fetchCatalog() {
  const [categoriesResult, productsResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("products")
      .select("*,categories(name),product_detail_images(*)")
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (productsResult.error) throw productsResult.error;

  return {
    categories: categoriesResult.data || [],
    products: (productsResult.data || []).map((product) => ({
      ...product,
      detail_images: product.product_detail_images || [],
    })),
  };
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchCatalog()
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
        setProducts(data.products);
        setError("");
      })
      .catch((loadError) => {
        if (cancelled) return;
        setError(loadError.message || "Katalog belum dapat dimuat.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchCatalog();
      setCategories(data.categories);
      setProducts(data.products);
    } catch (loadError) {
      setError(loadError.message || "Katalog belum dapat dimuat.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (activeCategory === "Semua" ||
            product.categories?.name === activeCategory) &&
          `${product.name || ""} ${product.categories?.name || ""}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [products, activeCategory, search],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const visible = filtered.slice((page - 1) * 12, page * 12);

  return (
    <section className="min-h-[70vh] bg-[#fbf8f9] px-5 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d70]">
            Temukan gayamu
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#2d2027] md:text-5xl">
            Collection
          </h1>
          <p className="mt-4 text-[#82747b]">
            Koleksi modest fashion Hanisy dengan sentuhan modern.
          </p>
        </div>

        <div className="mx-auto mt-9 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#a18c96]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama produk atau kategori..."
              className="w-full rounded-full border border-[#eadde2] bg-white py-3.5 pl-12 pr-5 outline-none focus:border-[#c45b7d]"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {["Semua", ...categories.map((category) => category.name)].map(
            (category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setPage(1);
                }}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-[#b64d70] text-white"
                    : "border border-[#eadde2] bg-white text-[#65545d] hover:border-[#c45b7d]"
                }`}
              >
                {category}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-[#eee4e8]" />
                <div className="mt-3 h-4 w-3/4 rounded bg-[#eee4e8]" />
                <div className="mt-2 h-4 w-1/2 rounded bg-[#eee4e8]" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-[#75666d]">{error}</p>
            <button
              onClick={load}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b64d70] px-6 py-3 text-white"
            >
              <RefreshCw size={16} /> Coba Lagi
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="font-serif text-2xl text-[#30232a]">
              Koleksi sedang dipersiapkan
            </h2>
            <p className="mt-2 text-[#82747b]">
              Coba kata kunci lain atau kembali lagi nanti.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {visible.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelected(product)}
                />
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded-full border border-[#eadde2] px-5 py-2 disabled:opacity-40"
              >
                Sebelumnya
              </button>
              <span className="text-sm text-[#75666d]">
                Halaman {page} dari {pages}
              </span>
              <button
                disabled={page === pages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded-full border border-[#eadde2] px-5 py-2 disabled:opacity-40"
              >
                Berikutnya
              </button>
            </div>
          </>
        )}
      </div>

      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
