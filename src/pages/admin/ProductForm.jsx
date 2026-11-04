import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { uploadImage } from "../../lib/uploadImage";
import { Plus, X, Image as ImageIcon } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    price: "",
    description: "",
    status: "ready_stock",
    stock: 0,
    sizes: [],
    colors: [],
  });

  // State untuk Varian Input Sementara
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  // State untuk Gambar
  const [mainImageFile, setMainImageFile] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState("");

  // State untuk Detail Foto (Maks 4)
  const [details, setDetails] = useState([]); // Array of { id?, file?, image_url?, caption? }

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    }

    async function fetchProductData() {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select(`*, product_detail_images(*)`)
        .eq("id", id)
        .single();

      if (data) {
        setFormData({
          name: data.name,
          category_id: data.category_id,
          price: data.price,
          description: data.description || "",
          status: data.status,
          stock: data.stock,
          sizes: data.sizes || [],
          colors: data.colors || [],
        });
        setExistingMainImage(data.main_image_url);
        setDetails(data.product_detail_images || []);
      }
      setLoading(false);
    }

    fetchCategories();
    if (isEdit) fetchProductData();
  }, [id, isEdit]);

  // Handlers Varian
  const addSize = () => {
    if (sizeInput && !formData.sizes.includes(sizeInput)) {
      setFormData({ ...formData, sizes: [...formData.sizes, sizeInput] });
      setSizeInput("");
    }
  };
  const removeSize = (size) =>
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    });

  const addColor = () => {
    if (colorInput && !formData.colors.includes(colorInput)) {
      setFormData({ ...formData, colors: [...formData.colors, colorInput] });
      setColorInput("");
    }
  };
  const removeColor = (color) =>
    setFormData({
      ...formData,
      colors: formData.colors.filter((c) => c !== color),
    });

  // Handlers Detail Foto
  const handleAddDetail = () => {
    if (details.length < 4) {
      setDetails([...details, { file: null, image_url: "", caption: "" }]);
    }
  };
  const updateDetail = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };
  const removeDetail = (index) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainImageUrl = existingMainImage;
      // 1. Upload Foto Utama jika ada file baru
      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile);
      }

      // 2. Simpan/Update Produk
      const productPayload = {
        name: formData.name,
        category_id: formData.category_id,
        price: Number(formData.price),
        description: formData.description,
        status: formData.status,
        stock: formData.status === "ready_stock" ? Number(formData.stock) : 0,
        sizes: formData.sizes,
        colors: formData.colors,
        main_image_url: mainImageUrl,
      };

      let productId = id;
      if (isEdit) {
        await supabase.from("products").update(productPayload).eq("id", id);
      } else {
        const { data } = await supabase
          .from("products")
          .insert([productPayload])
          .select()
          .single();
        productId = data.id;
      }

      // 3. Handle Detail Foto (Hapus yang lama, Insert yang baru)
      // Cara termudah: hapus semua detail lama, lalu insert ulang
      await supabase
        .from("product_detail_images")
        .delete()
        .eq("product_id", productId);

      for (let i = 0; i < details.length; i++) {
        const d = details[i];
        let detailUrl = d.image_url;

        // Jika ada file baru di-upload
        if (d.file) {
          detailUrl = await uploadImage(d.file, "details");
        }

        if (detailUrl) {
          await supabase.from("product_detail_images").insert([
            {
              product_id: productId,
              image_url: detailUrl,
              caption: d.caption,
              position: i + 1,
            },
          ]);
        }
      }

      navigate("/admin");
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        {/* Info Dasar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Nama Produk
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-brand-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-brand-primary"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
            <input
              required
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-brand-primary"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-brand-primary"
            ></textarea>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Status & Stok */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Status Produk
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-brand-primary"
            >
              <option value="ready_stock">Ready Stock</option>
              <option value="made_to_order">Pre-Order (PO)</option>
              <option value="inquiry">Custom / Inquiry</option>
            </select>
          </div>
          {formData.status === "ready_stock" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Jumlah Stok
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full p-3 border rounded-xl focus:ring-brand-primary"
              />
            </div>
          )}
        </div>

        {/* Varian Ukuran & Warna */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Varian Ukuran
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                placeholder="Misal: S, M, L"
                className="grow p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addSize}
                className="bg-gray-100 px-4 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((s) => (
                <span
                  key={s}
                  className="bg-brand-secondary text-brand-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {s}{" "}
                  <button type="button" onClick={() => removeSize(s)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Varian Warna
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="Misal: Navy, Maroon"
                className="grow p-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addColor}
                className="bg-gray-100 px-4 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((c) => (
                <span
                  key={c}
                  className="bg-brand-secondary text-brand-primary px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {c}{" "}
                  <button type="button" onClick={() => removeColor(c)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Upload Foto Utama */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Foto Utama Produk
          </label>
          {existingMainImage && !mainImageFile && (
            <img
              src={existingMainImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all"
          />
        </div>

        {/* Upload Detail Foto (Maks 4) */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Detail Foto (Maksimal 4)
            </label>
            {details.length < 4 && (
              <button
                type="button"
                onClick={handleAddDetail}
                className="text-sm text-brand-primary font-medium flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> Tambah Foto
              </button>
            )}
          </div>

          <div className="space-y-3">
            {details.map((detail, index) => (
              <div
                key={index}
                className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl border border-gray-100"
              >
                <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                  {detail.file ? (
                    <img
                      src={URL.createObjectURL(detail.file)}
                      className="w-full h-full object-cover"
                    />
                  ) : detail.image_url ? (
                    <img
                      src={detail.image_url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
                <div className="grow space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateDetail(index, "file", e.target.files[0])
                    }
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-white file:text-gray-700 file:shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Caption (misal: Detail Kerah)"
                    value={detail.caption || ""}
                    onChange={(e) =>
                      updateDetail(index, "caption", e.target.value)
                    }
                    className="w-full p-2 text-sm border rounded-lg bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-6 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
