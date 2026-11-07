import { Edit, Plus, X, Trash2 } from "lucide-react";
import {
  AdminEmptyState,
  AdminField,
  AdminFormPanel,
  AdminInput,
  AdminTextarea,
  adminPrimaryButtonClass,
} from "./AdminFormUI";

export function CategorySection({
  categories,
  categoryName,
  setCategoryName,
  categoryLoading,
  onSave,
  onDelete,
}) {
  return (
    <section className="mt-12">
      <AdminFormPanel className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap content-start gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm"
            >
              <span>{category.name}</span>
              <button
                type="button"
                onClick={() => onDelete(category)}
                aria-label={`Hapus kategori ${category.name}`}
                className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <X size={15} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-brand-muted">Belum ada kategori.</p>
          )}
        </div>

        <form
          onSubmit={onSave}
          className="flex flex-col items-end gap-3 sm:flex-row"
        >
          <AdminField
            label="Nama kategori"
            htmlFor="dashboard-category-name"
            className="w-full min-w-0 grow"
          >
            <AdminInput
              id="dashboard-category-name"
              required
              maxLength={60}
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Contoh: Hanbok"
            />
          </AdminField>
          <button
            type="submit"
            disabled={categoryLoading}
            className={`${adminPrimaryButtonClass} w-full shrink-0 sm:w-auto`}
          >
            <Plus size={16} />
            {categoryLoading ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </AdminFormPanel>
    </section>
  );
}

export function TestimonialSection({
  testimonials,
  loading,
  form,
  setForm,
  editingId,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) {
  return (
    <section className="mt-12">
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {loading ? (
            <AdminEmptyState>Memuat testimoni...</AdminEmptyState>
          ) : testimonials.length === 0 ? (
            <AdminEmptyState>
              Belum ada testimoni. Tambahkan testimoni pertama melalui formulir.
            </AdminEmptyState>
          ) : (
            testimonials.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-brand-text">
                      {item.customer_name}
                    </h3>
                    <p className="mt-1 text-xs text-brand-muted">
                      {item.customer_origin || "Asal belum diisi"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label={`Edit testimoni ${item.customer_name}`}
                      className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label={`Hapus testimoni ${item.customer_name}`}
                      className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                  {item.content}
                </p>
              </article>
            ))
          )}
        </div>

        <AdminFormPanel>
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <h3 className="font-semibold text-brand-text">
                {editingId ? "Edit Testimoni" : "Tambah Testimoni"}
              </h3>
              <p className="mt-1 text-xs text-brand-muted">
                Lengkapi informasi pelanggan dan ulasannya.
              </p>
            </div>

            <AdminField
              label="Nama pelanggan"
              htmlFor="testimonial-customer-name"
            >
              <AdminInput
                id="testimonial-customer-name"
                required
                maxLength={80}
                value={form.customer_name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customer_name: event.target.value,
                  }))
                }
              />
            </AdminField>

            <AdminField
              label="Asal / kota"
              htmlFor="testimonial-customer-origin"
            >
              <AdminInput
                id="testimonial-customer-origin"
                maxLength={100}
                value={form.customer_origin}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    customer_origin: event.target.value,
                  }))
                }
                placeholder="Contoh: Bandung"
              />
            </AdminField>

            <AdminField
              label="Deskripsi testimoni"
              htmlFor="testimonial-content"
            >
              <AdminTextarea
                id="testimonial-content"
                required
                rows={5}
                maxLength={600}
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
              />
            </AdminField>

            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="submit"
                className={`${adminPrimaryButtonClass} flex-1`}
              >
                {editingId ? "Simpan Perubahan" : "Tambah Testimoni"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </AdminFormPanel>
      </div>
    </section>
  );
}
