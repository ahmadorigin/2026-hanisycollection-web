import { Edit, Plus, X, Trash2 } from "lucide-react";

const inputClass = "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-text outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60";

function FormPanel({ children, className = "" }) {
  return <div className={`h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function Field({ label, children, className = "" }) {
  return <label className={`block text-sm font-medium text-gray-700 ${className}`}>{label}{children}</label>;
}

export function CategorySection({ categories, categoryName, setCategoryName, categoryLoading, onSave, onDelete }) {
  return (
    <section className="mt-12">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Pengaturan katalog</p><h2 className="mt-1 text-2xl font-bold text-brand-text">Kategori Produk</h2><p className="mt-1 text-sm text-brand-muted">Kategori yang masih dipakai produk tidak dapat dihapus.</p></div>
      <FormPanel className="grid gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-wrap content-start gap-2">
          {categories.map(category => <div key={category.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm"><span>{category.name}</span><button type="button" onClick={() => onDelete(category)} aria-label={`Hapus kategori ${category.name}`} className="text-red-500 hover:text-red-700"><X size={15}/></button></div>)}
          {categories.length === 0 && <p className="text-sm text-brand-muted">Belum ada kategori.</p>}
        </div>
        <form onSubmit={onSave} className="flex items-end gap-2">
          <Field label="Nama kategori" className="min-w-0 grow"><input required maxLength={60} value={categoryName} onChange={event => setCategoryName(event.target.value)} placeholder="Contoh: Hanbok" className={inputClass}/></Field>
          <button type="submit" disabled={categoryLoading} className={buttonClass}><Plus size={16}/>{categoryLoading ? "Menyimpan..." : "Tambah"}</button>
        </form>
      </FormPanel>
    </section>
  );
}

export function TestimonialSection({ testimonials, loading, form, setForm, editingId, onEdit, onDelete, onSave, onCancel }) {
  return (
    <section className="mt-12">
      <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Konten Beranda</p><h2 className="mt-1 text-2xl font-bold text-brand-text">Testimoni Pelanggan</h2><p className="mt-1 text-sm text-brand-muted">Testimoni di sini akan tampil sebagai card berjalan perlahan di halaman Home.</p></div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          {loading ? <p className="rounded-2xl bg-white p-6 text-sm text-brand-muted">Memuat testimoni...</p> : testimonials.length === 0 ? <p className="rounded-2xl bg-white p-6 text-sm text-brand-muted">Belum ada testimoni. Tambahkan testimoni pertama melalui formulir.</p> : testimonials.map(item => (
            <article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-brand-text">{item.customer_name}</h3><p className="mt-1 text-xs text-brand-muted">{item.customer_origin || "Asal belum diisi"}</p></div><div className="flex gap-2">
                <button type="button" onClick={() => onEdit(item)} aria-label="Edit testimoni" className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"><Edit className="h-4 w-4"/></button>
                <button type="button" onClick={() => onDelete(item.id)} aria-label="Hapus testimoni" className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"><Trash2 className="h-4 w-4"/></button>
              </div></div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">{item.content}</p>
            </article>
          ))}
        </div>
        <FormPanel>
          <form onSubmit={onSave} className="space-y-4">
            <div><h3 className="font-semibold text-brand-text">{editingId ? "Edit Testimoni" : "Tambah Testimoni"}</h3><p className="mt-1 text-xs text-brand-muted">Lengkapi informasi pelanggan dan ulasannya.</p></div>
            <Field label="Nama pelanggan"><input required maxLength={80} value={form.customer_name} onChange={event => setForm(current => ({...current, customer_name:event.target.value}))} className={inputClass}/></Field>
            <Field label="Asal / kota"><input maxLength={100} value={form.customer_origin} onChange={event => setForm(current => ({...current, customer_origin:event.target.value}))} placeholder="Contoh: Bandung" className={inputClass}/></Field>
            <Field label="Deskripsi testimoni"><textarea required rows={5} maxLength={600} value={form.content} onChange={event => setForm(current => ({...current, content:event.target.value}))} className={inputClass}/></Field>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button type="submit" className={`${buttonClass} flex-1`}>{editingId ? "Simpan Perubahan" : "Tambah Testimoni"}</button>
              {editingId && <button type="button" onClick={onCancel} className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Batal</button>}
            </div>
          </form>
        </FormPanel>
      </div>
    </section>
  );
}