import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { formatRupiah } from "../../lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);\n  const [categories, setCategories] = useState([]);\n  const [categoryName, setCategoryName] = useState("");\n  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testimonials,setTestimonials]=useState([]);
  const [testimonialLoading,setTestimonialLoading]=useState(true);
  const [editingTestimonial,setEditingTestimonial]=useState(null);
  const [testimonialForm,setTestimonialForm]=useState({customer_name:"",customer_origin:"",content:""});

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select(`*, categories(name)`)
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
      const {data:reviews}=await supabase.from("testimonials").select("*").order("created_at",{ascending:false});
      setTestimonials(reviews||[]);setTestimonialLoading(false);
    }

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const saveTestimonial=async(e)=>{e.preventDefault();const payload={customer_name:testimonialForm.customer_name.trim(),customer_origin:testimonialForm.customer_origin.trim(),content:testimonialForm.content.trim()};if(!payload.customer_name||!payload.content)return;const result=editingTestimonial?await supabase.from("testimonials").update(payload).eq("id",editingTestimonial):await supabase.from("testimonials").insert(payload).select().single();if(result.error){alert("Gagal menyimpan testimoni: "+result.error.message);return;}const {data}=await supabase.from("testimonials").select("*").order("created_at",{ascending:false});setTestimonials(data||[]);setEditingTestimonial(null);setTestimonialForm({customer_name:"",customer_origin:"",content:""});};
  const editTestimonial=(item)=>{setEditingTestimonial(item.id);setTestimonialForm({customer_name:item.customer_name||"",customer_origin:item.customer_origin||"",content:item.content||""});};
  const deleteTestimonial=async(id)=>{if(!window.confirm("Hapus testimoni ini?"))return;const {error}=await supabase.from("testimonials").delete().eq("id",id);if(error){alert("Gagal menghapus: "+error.message);return;}setTestimonials(items=>items.filter(item=>item.id!==id));};

  const saveCategory = async (event) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name) return;
    setCategoryLoading(true);
    const { data, error } = await supabase.from("categories").insert({ name }).select().single();
    if (error) alert("Gagal menambah kategori: " + error.message);
    else { setCategories(items => [...items, data].sort((a,b)=>a.name.localeCompare(b.name))); setCategoryName(""); }
    setCategoryLoading(false);
  };

  const deleteCategory = async (category) => {
    const assigned = products.some(product => product.category_id === category.id);
    if (assigned) return alert("Kategori ini masih digunakan produk. Pindahkan produk ke kategori lain sebelum menghapusnya.");
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) alert("Gagal menghapus kategori: " + error.message);
    else setCategories(items => items.filter(item => item.id !== category.id));
  };

  const getStatusBadge = (status, stock) => {
    if (status === "ready_stock") {
      return stock > 0 ? (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
          Ready ({stock})
        </span>
      ) : (
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
          Habis
        </span>
      );
    }
    if (status === "made_to_order")
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
          Pre-Order
        </span>
      );
    return (
      <span className="bg-brand-secondary text-brand-primary px-3 py-1 rounded-full text-xs font-medium">
        Custom
      </span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-text">Daftar Produk</h1>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-brand-muted text-sm">
                <th className="p-4 font-medium">Produk</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-muted">
                    Memuat data...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-muted">
                    Belum ada produk.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={product.main_image_url}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                      />
                      <span className="font-medium text-brand-text">
                        {product.name}
                      </span>
                    </td>
                    <td className="p-4 text-brand-muted text-sm">
                      {product.categories?.name || "-"}
                    </td>
                    <td className="p-4 text-brand-text font-medium">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(product.status, product.stock)}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <section className="mt-12">
        <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Konten Beranda</p><h2 className="mt-1 text-2xl font-bold text-brand-text">Testimoni Pelanggan</h2><p className="mt-1 text-sm text-brand-muted">Testimoni di sini akan tampil sebagai card berjalan perlahan di halaman Home.</p></div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-3">
            {testimonialLoading?<p className="rounded-2xl bg-white p-6 text-sm text-brand-muted">Memuat testimoni...</p>:testimonials.length===0?<p className="rounded-2xl bg-white p-6 text-sm text-brand-muted">Belum ada testimoni. Tambahkan testimoni pertama melalui formulir.</p>:testimonials.map(item=><article key={item.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold text-brand-text">{item.customer_name}</h3><p className="mt-1 text-xs text-brand-muted">{item.customer_origin||"Asal belum diisi"}</p></div><div className="flex gap-2"><button onClick={()=>editTestimonial(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit testimoni"><Edit className="h-4 w-4"/></button><button onClick={()=>deleteTestimonial(item.id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Hapus testimoni"><Trash2 className="h-4 w-4"/></button></div></div><p className="mt-4 text-sm leading-6 text-gray-600">{item.content}</p></article>)}
          </div>
          <form onSubmit={saveTestimonial} className="h-fit space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"><h3 className="font-semibold text-brand-text">{editingTestimonial?"Edit Testimoni":"Tambah Testimoni"}</h3><label className="block text-sm font-medium text-gray-700">Nama pelanggan<input required maxLength={80} value={testimonialForm.customer_name} onChange={e=>setTestimonialForm(v=>({...v,customer_name:e.target.value}))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-400"/></label><label className="block text-sm font-medium text-gray-700">Asal / kota<input maxLength={100} value={testimonialForm.customer_origin} onChange={e=>setTestimonialForm(v=>({...v,customer_origin:e.target.value}))} placeholder="Contoh: Bandung" className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-400"/></label><label className="block text-sm font-medium text-gray-700">Deskripsi testimoni<textarea required rows={5} maxLength={600} value={testimonialForm.content} onChange={e=>setTestimonialForm(v=>({...v,content:e.target.value}))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-pink-400"/></label><div className="flex gap-2"><button type="submit" className="flex-1 rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white">{editingTestimonial?"Simpan Perubahan":"Tambah Testimoni"}</button>{editingTestimonial&&<button type="button" onClick={()=>{setEditingTestimonial(null);setTestimonialForm({customer_name:"",customer_origin:"",content:""})}} className="rounded-xl border border-gray-200 px-4 py-3 text-sm">Batal</button>}</div></form>
        </div>
      </section>
    </div>
  );
}
