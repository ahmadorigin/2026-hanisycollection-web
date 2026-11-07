import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { CategorySection, TestimonialSection } from "./DashboardForms";
import DashboardProductTable from "./components/DashboardProductTable";
import { useDashboardData } from "./hooks/useDashboardData";

export default function Dashboard() {
  const {
    products,
    categories,
    testimonials,
    loading,
    testimonialLoading,
    categoryLoading,
    categoryName,
    setCategoryName,
    testimonialForm,
    setTestimonialForm,
    editingTestimonial,
    deleteProduct,
    saveTestimonial,
    editTestimonial,
    cancelTestimonialEdit,
    deleteTestimonial,
    saveCategory,
    deleteCategory,
  } = useDashboardData();

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">
            Manajemen toko
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-text">
            Daftar Produk
          </h1>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Link>
      </div>

      <DashboardProductTable
        products={products}
        loading={loading}
        onDelete={deleteProduct}
      />

      <CategorySection
        categories={categories}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryLoading={categoryLoading}
        onSave={saveCategory}
        onDelete={deleteCategory}
      />

      <TestimonialSection
        testimonials={testimonials}
        loading={testimonialLoading}
        form={testimonialForm}
        setForm={setTestimonialForm}
        editingId={editingTestimonial}
        onEdit={editTestimonial}
        onDelete={deleteTestimonial}
        onSave={saveTestimonial}
        onCancel={cancelTestimonialEdit}
      />
    </div>
  );
}
