import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { uploadImage } from "../../lib/uploadImage";
import { Plus, X, Image as ImageIcon } from "lucide-react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function storagePathFromPublicUrl(url) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/product-images/";
  const index = url.indexOf(marker);
  return index < 0 ? null : decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

async function removeStoredImages(urls) {
  const paths = [...new Set(urls.map(storagePathFromPublicUrl).filter(Boolean))];
  if (!paths.length) return;
  const { error } = await supabase.storage.from("product-images").remove(paths);
  if (error) console.error("Gagal membersihkan foto lama:", error.message);
}

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "", category_id: "", price: "", description: "",
    status: "ready_stock", stock: 0, sizes: [], colors: [], is_featured: false,
  });
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState("");
  const [details, setDetails] = useState([]);\n  const [originalDetailUrls, setOriginalDetailUrls] = useState([]);

  useEffect(() => {
    let active = true;
    async function load() {
      const categoryResult = await supabase.from("categories").select("*").order("name");
      if (!active) return;
      if (categoryResult.error) alert("Gagal memuat kategori: " + categoryResult.error.message);
      setCategories(categoryResult.data || []);
      if (isEdit) {
        const { data, error } = await supabase.from("products")
          .select("*, product_detail_images(*)").eq("id", id).single();
        if (!active) return;
        if (error) alert("Gagal memuat produk: " + error.message);
        if (data) {
          setFormData({
            name: data.name || "", category_id: data.category_id || "",
            price: data.price ?? "", description: data.description || "",
            status: data.status || "ready_stock", stock: data.stock ?? 0,
            sizes: data.sizes || [], colors: data.colors || [],
            is_featured: Boolean(data.is_featured),
          });
          setExistingMainImage(data.main_image_url || "");
          const loadedDetails = (data.product_detail_images || []).sort((a,b)=>(a.position||0)-(b.position||0)).slice(0,4);\n          setDetails(loadedDetails);\n          setOriginalDetailUrls(loadedDetails.map(item => item.image_url).filter(Boolean));
        }
      }
      if (active) setPageLoading(false);
    }
    load();
    return () => { active = false; };
  }, [id, isEdit]);

  const addVariant = (field, value, clear) => {
    const clean = value.trim();
    if (clean && !formData[field].includes(clean)) {
      setFormData(current => ({ ...current, [field]: [...current[field], clean] }));
    }
    clear("");
  };

  const validateFile = (file) => {
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) throw new Error("Format foto harus JPG, PNG, atau WebP.");
    if (file.size > MAX_IMAGE_SIZE) throw new Error("Ukuran setiap foto maksimal 2 MB.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name.trim()) return alert("Nama produk wajib diisi.");
    if (!formData.category_id) return alert("Silakan pilih kategori.");
    if (formData.price === "" || Number(formData.price) < 0 || !Number.isFinite(Number(formData.price))) return alert("Masukkan harga yang valid.");
    if (!isEdit && !mainImageFile) return alert("Foto utama produk wajib diunggah.");
    setLoading(true);
    const newlyUploaded = [];
    try {
      validateFile(mainImageFile);
      details.forEach(detail => validateFile(detail.file));

      let mainImageUrl = existingMainImage;
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
        newlyUploaded.push(mainImageUrl);
      }

      const detailRows = [];
      for (let index = 0; index < details.length; index += 1) {
        const detail = details[index];
        let imageUrl = detail.image_url || "";
        if (detail.file) {
          imageUrl = await uploadImage(detail.file, "details");
          newlyUploaded.push(imageUrl);
        }
        if (imageUrl) detailRows.push({
          image_url: imageUrl,
          caption: (detail.caption || "").trim(),
          position: detailRows.length + 1,
        });
      }

      const productPayload = {
        name: formData.name.trim(),
        category_id: formData.category_id,
        price: Number(formData.price),
        description: formData.description.trim(),
        status: formData.status,
        stock: formData.status === "ready_stock" ? Math.max(0, Number(formData.stock) || 0) : 0,
        sizes: formData.sizes,
        colors: formData.colors,
        is_featured: formData.is_featured,
        main_image_url: mainImageUrl,
      };

      let productId = id;
      let productError = null;
      if (isEdit) {
        const result = await supabase.from("products").update(productPayload).eq("id", id);
        productError = result.error;
      } else {
        const result = await supabase.from("products").insert(productPayload).select("id").single();
        productError = result.error;
        productId = result.data?.id;
      }
      if (productError) throw productError;
      if (!productId) throw new Error("Produk tersimpan tanpa ID yang dapat dibaca.");

      const retainedDetailUrls = detailRows.map(row => row.image_url);\n      const oldDetailUrls = originalDetailUrls.filter(url => !retainedDetailUrls.includes(url));
      const { error: deleteDetailsError } = await supabase.from("product_detail_images").delete().eq("product_id", productId);
      if (deleteDetailsError) throw deleteDetailsError;
      if (detailRows.length) {
        const { error: insertDetailsError } = await supabase.from("product_detail_images").insert(
          detailRows.map(row => ({ ...row, product_id: productId }))
        );
        if (insertDetailsError) throw insertDetailsError;
      }

      const replacedMain = mainImageFile && existingMainImage ? [existingMainImage] : [];
      await removeStoredImages([...replacedMain, ...oldDetailUrls]);
      navigate("/admin");
    } catch (error) {
      if (newlyUploaded.length) await removeStoredImages(newlyUploaded);
      alert("Terjadi kesalahan: " + (error.message || "Gagal menyimpan produk."));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="p-8 text-center text-brand-muted">Memuat data produk...</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-brand-text">{isEdit ? "Edit Produk" : "Tambah Produk Baru"}</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium md:col-span-2">Nama Produk
            <input required maxLength={160} value={formData.name} onChange={e=>setFormData(v=>({...v,name:e.target.value}))} className="mt-1 w-full rounded-xl border p-3"/>
          </label>
          <label className="block text-sm font-medium">Kategori
            <select required value={formData.category_id} onChange={e=>setFormData(v=>({...v,category_id:e.target.value}))} className="mt-1 w-full rounded-xl border p-3">
              <option value="">Pilih Kategori</option>{categories.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">Harga (Rp)
            <input required min="0" step="1" type="number" value={formData.price} onChange={e=>setFormData(v=>({...v,price:e.target.value}))} className="mt-1 w-full rounded-xl border p-3"/>
          </label>
          <label className="block text-sm font-medium md:col-span-2">Deskripsi
            <textarea rows="4" maxLength={3000} value={formData.description} onChange={e=>setFormData(v=>({...v,description:e.target.value}))} className="mt-1 w-full rounded-xl border p-3"/>
          </label>
          <label className="block text-sm font-medium">Status Produk
            <select value={formData.status} onChange={e=>setFormData(v=>({...v,status:e.target.value}))} className="mt-1 w-full rounded-xl border p-3">
              <option value="ready_stock">Ready Stock</option><option value="made_to_order">Pre-Order (PO)</option><option value="inquiry">Custom / Inquiry</option>
            </select>
          </label>
          {formData.status === "ready_stock" && <label className="block text-sm font-medium">Jumlah Stok
            <input min="0" step="1" type="number" value={formData.stock} onChange={e=>setFormData(v=>({...v,stock:e.target.value}))} className="mt-1 w-full rounded-xl border p-3"/>
          </label>}
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-[#eadde2] bg-[#fbf6f8] p-4 text-sm font-medium">
          <input type="checkbox" checked={formData.is_featured} onChange={e=>setFormData(v=>({...v,is_featured:e.target.checked}))} className="h-4 w-4 accent-[#b64d70]"/>
          Tampilkan di Home (Featured Collection)
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <div><label className="block text-sm font-medium">Varian Ukuran</label><div className="mt-2 flex gap-2"><input value={sizeInput} onChange={e=>setSizeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addVariant("sizes",sizeInput,setSizeInput))} placeholder="Misal: S, M, L" className="min-w-0 grow rounded-lg border p-2"/><button type="button" onClick={()=>addVariant("sizes",sizeInput,setSizeInput)} className="rounded-lg bg-gray-100 px-3"><Plus size={17}/></button></div><div className="mt-2 flex flex-wrap gap-2">{formData.sizes.map(value=><button type="button" key={value} onClick={()=>setFormData(v=>({...v,sizes:v.sizes.filter(x=>x!==value)}))} className="rounded-full bg-brand-secondary px-3 py-1 text-sm text-brand-primary">{value} ×</button>)}</div></div>
          <div><label className="block text-sm font-medium">Varian Warna</label><div className="mt-2 flex gap-2"><input value={colorInput} onChange={e=>setColorInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addVariant("colors",colorInput,setColorInput))} placeholder="Misal: Navy, Maroon" className="min-w-0 grow rounded-lg border p-2"/><button type="button" onClick={()=>addVariant("colors",colorInput,setColorInput)} className="rounded-lg bg-gray-100 px-3"><Plus size={17}/></button></div><div className="mt-2 flex flex-wrap gap-2">{formData.colors.map(value=><button type="button" key={value} onClick={()=>setFormData(v=>({...v,colors:v.colors.filter(x=>x!==value)}))} className="rounded-full bg-brand-secondary px-3 py-1 text-sm text-brand-primary">{value} ×</button>)}</div></div>
        </div>

        <div className="border-t pt-5">
          <label className="block text-sm font-semibold">Foto Utama Produk <span className="font-normal text-gray-500">(JPG, PNG, WebP · maks. 2 MB)</span></label>
          {existingMainImage && !mainImageFile && <img src={existingMainImage} alt="Foto utama saat ini" className="my-3 h-36 w-32 rounded-xl border object-cover"/>}
          {mainImageFile && <img src={URL.createObjectURL(mainImageFile)} alt="Pratinjau foto utama" className="my-3 h-36 w-32 rounded-xl border object-cover"/>}
          <input required={!isEdit && !existingMainImage} type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setMainImageFile(e.target.files?.[0]||null)} className="mt-3 block w-full text-sm"/>
        </div>

        <div className="border-t pt-5">
          <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold">Foto Detail (maksimal 4)</p><p className="text-xs text-gray-500">Foto tambahan akan tampil dalam grid 2 kolom pada detail produk.</p></div>{details.length<4&&<button type="button" onClick={()=>setDetails(v=>[...v,{file:null,image_url:"",caption:""}])} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary"><Plus size={16}/> Tambah Foto</button>}</div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {details.map((detail,index)=><div key={detail.id||index} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-white">{detail.file?<img src={URL.createObjectURL(detail.file)} alt="" className="h-full w-full object-cover"/>:detail.image_url?<img src={detail.image_url} alt="" className="h-full w-full object-cover"/>:<ImageIcon className="text-gray-300"/>}</div>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setDetails(v=>v.map((item,i)=>i===index?{...item,file:e.target.files?.[0]||null}:item))} className="mt-3 block w-full text-xs"/>
              <div className="mt-2 flex gap-2"><input value={detail.caption||""} onChange={e=>setDetails(v=>v.map((item,i)=>i===index?{...item,caption:e.target.value}:item))} placeholder="Caption foto" maxLength={100} className="min-w-0 grow rounded-lg border p-2 text-sm"/><button type="button" onClick={()=>setDetails(v=>v.filter((_,i)=>i!==index))} aria-label="Hapus foto detail" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><X size={17}/></button></div>
            </div>)}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={()=>navigate("/admin")} className="rounded-xl border px-5 py-2.5 text-gray-600">Batal</button><button type="submit" disabled={loading} className="rounded-xl bg-brand-primary px-6 py-2.5 font-semibold text-white disabled:opacity-60">{loading?"Menyimpan...":"Simpan Produk"}</button></div>
      </form>
    </div>
  );
}
