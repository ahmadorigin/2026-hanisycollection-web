import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { formatRupiah } from "../../lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";
import { CategorySection, TestimonialSection } from "./DashboardForms";

const emptyTestimonial = { customer_name: "", customer_origin: "", content: "" };

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      const [productResult, categoryResult, testimonialResult] = await Promise.all([
        supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("name"),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false }),
      ]);
      if (!active) return;
      if (productResult.error) alert("Gagal memuat produk: " + productResult.error.message);
      if (categoryResult.error) alert("Gagal memuat kategori: " + categoryResult.error.message);
      if (testimonialResult.error) alert("Gagal memuat testimoni: " + testimonialResult.error.message);
      setProducts(productResult.data || []);
      setCategories(categoryResult.data || []);
      setTestimonials(testimonialResult.data || []);
      setLoading(false);
      setTestimonialLoading(false);
    }
    loadDashboard();
    return () => { active = false; };
  }, []);

  const handleDelete = async id => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    const { data: productFiles } = await supabase.from("products").select("main_image_url, product_detail_images(image_url)").eq("id", id).single();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return alert("Gagal menghapus: " + error.message);
    setProducts(items => items.filter(product => product.id !== id));
    const urls = [productFiles?.main_image_url, ...(productFiles?.product_detail_images || []).map(image => image.image_url)].filter(Boolean);
    const marker = "/storage/v1/object/public/product-images/";
    const paths = [...new Set(urls.map(url => { const at = url.indexOf(marker); return at < 0 ? null : decodeURIComponent(url.slice(at + marker.length).split("?")[0]); }).filter(Boolean))];
    if (paths.length) {
      const { error: storageError } = await supabase.storage.from("product-images").remove(paths);
      if (storageError) alert("Produk terhapus, tetapi sebagian foto gagal dibersihkan dari Storage: " + storageError.message);
    }
  };

  const saveTestimonial = async event => {
    event.preventDefault();
    const payload = { customer_name: testimonialForm.customer_name.trim(), customer_origin: testimonialForm.customer_origin.trim(), content: testimonialForm.content.trim() };
    if (!payload.customer_name || !payload.content) return;
    const result = editingTestimonial
      ? await supabase.from("testimonials").update(payload).eq("id", editingTestimonial)
      : await supabase.from("testimonials").insert(payload);
    if (result.error) return alert("Gagal menyimpan testimoni: " + result.error.message);
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error) return alert("Testimoni tersimpan, tetapi daftar gagal diperbarui: " + error.message);
    setTestimonials(data || []);
    setEditingTestimonial(null);
    setTestimonialForm(emptyTestimonial);
  };

  const editTestimonial = item => {
    setEditingTestimonial(item.id);
    setTestimonialForm({ customer_name: item.customer_name || "", customer_origin: item.customer_origin || "", content: item.content || "" });
  };
  const cancelTestimonialEdit = () => { setEditingTestimonial(null); setTestimonialForm(emptyTestimonial); };
  const deleteTestimonial = async id => {
    if (!window.confirm("Hapus testimoni ini?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return alert("Gagal menghapus: " + error.message);
    setTestimonials(items => items.filter(item => item.id !== id));
    if (editingTestimonial === id) cancelTestimonialEdit();
  };

  const saveCategory = async event => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    setCategoryLoading(true);
    const { data, error } = await supabase.from("categories").insert({ name }).select().single();
    if (error) alert("Gagal menambah kategori: " + error.message);
    else { setCategories(items => [...items, data].sort((a, b) => a.name.localeCompare(b.name))); setCategoryName(""); }
    setCategoryLoading(false);
  };
  const deleteCategory = async category => {
    if (products.some(product => product.category_id === category.id)) return alert("Kategori ini masih digunakan produk. Pindahkan produk ke kategori lain sebelum menghapusnya.");
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) alert("Gagal menghapus kategori: " + error.message);
    else setCategories(items => items.filter(item => item.id !== category.id));
  };

  const getStatusBadge = (status, stock) => {
    if (status === "ready_stock") return stock > 0
      ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Ready ({stock})</span>
      : <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">Habis</span>;
    if (status === "made_to_order") return <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">Pre-Order</span>;
    return <span className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-medium text-brand-primary">Custom</span>;
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brand-text">Daftar Produk</h1>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary/90"><Plus className="h-4 w-4" /> Tambah Produk</Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead><tr className="border-b border-gray-100 bg-gray-50 text-sm text-brand-muted"><th className="p-4 font-medium">Produk</th><th className="p-4 font-medium">Kategori</th><th className="p-4 font-medium">Harga</th><th className="p-4 font-medium">Status</th><th className="p-4 text-center font-medium">Aksi</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan="5" className="p-8 text-center text-brand-muted">Memuat data...</td></tr>
                : products.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-brand-muted">Belum ada produk.</td></tr>
                : products.map(product => <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="p-4"><div className="flex min-w-0 items-center gap-3"><img src={product.main_image_url} alt="" className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover"/><span className="font-medium text-brand-text">{product.name}</span></div></td>
                  <td className="p-4 text-sm text-brand-muted">{product.categories?.name || "-"}</td><td className="p-4 font-medium text-brand-text">{formatRupiah(product.price)}</td><td className="p-4">{getStatusBadge(product.status, product.stock)}</td>
                  <td className="p-4"><div className="flex justify-center gap-2"><Link to={`/admin/products/edit/${product.id}`} aria-label={`Edit ${product.name}`} className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"><Edit className="h-4 w-4"/></Link><button type="button" onClick={() => handleDelete(product.id)} aria-label={`Hapus ${product.name}`} className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"><Trash2 className="h-4 w-4"/></button></div></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <CategorySection categories={categories} categoryName={categoryName} setCategoryName={setCategoryName} categoryLoading={categoryLoading} onSave={saveCategory} onDelete={deleteCategory}/>
      <TestimonialSection testimonials={testimonials} loading={testimonialLoading} form={testimonialForm} setForm={setTestimonialForm} editingId={editingTestimonial} onEdit={editTestimonial} onDelete={deleteTestimonial} onSave={saveTestimonial} onCancel={cancelTestimonialEdit}/>
    </div>
  );
}