import { CategorySection } from "./DashboardForms";
import { useDashboardData } from "./hooks/useDashboardData";

export default function CategoriesPage() {
  const {
    products, categories, loading, categoryLoading, categoryName,
    setCategoryName, saveCategory, deleteCategory,
  } = useDashboardData();

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Manajemen katalog</p>
        <h1 className="mt-1 text-2xl font-bold text-brand-text">Kelola Kategori</h1>
        <p className="mt-1 text-sm text-brand-muted">Atur kategori untuk mengelompokkan produk.</p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-brand-muted">Memuat kategori...</div>
      ) : (
        <CategorySection
          categories={categories}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryLoading={categoryLoading}
          onSave={saveCategory}
          onDelete={deleteCategory}
          productCount={products.length}
        />
      )}
    </div>
  );
}
