import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

const emptyTestimonial = {
  customer_name: "",
  customer_origin: "",
  content: "",
};

function storagePathFromPublicUrl(url) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/product-images/";
  const index = url.indexOf(marker);
  return index < 0
    ? null
    : decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

async function removeProductImages(urls) {
  const paths = [...new Set(urls.map(storagePathFromPublicUrl).filter(Boolean))];
  if (!paths.length) return;

  const { error } = await supabase.storage.from("product-images").remove(paths);
  if (error) {
    alert(
      "Produk terhapus, tetapi sebagian foto gagal dibersihkan dari Storage: " +
        error.message,
    );
  }
}

export function useDashboardData() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonial);

  const refreshTestimonials = useCallback(async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setTestimonials(data || []);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const [productResult, categoryResult, testimonialResult] =
        await Promise.all([
          supabase
            .from("products")
            .select("*, categories(name)")
            .order("created_at", { ascending: false }),
          supabase.from("categories").select("*").order("name"),
          supabase
            .from("testimonials")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

      if (!active) return;

      if (productResult.error) {
        alert("Gagal memuat produk: " + productResult.error.message);
      }
      if (categoryResult.error) {
        alert("Gagal memuat kategori: " + categoryResult.error.message);
      }
      if (testimonialResult.error) {
        alert("Gagal memuat testimoni: " + testimonialResult.error.message);
      }

      setProducts(productResult.data || []);
      setCategories(categoryResult.data || []);
      setTestimonials(testimonialResult.data || []);
      setLoading(false);
      setTestimonialLoading(false);
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;

    const { data: productFiles, error: filesError } = await supabase
      .from("products")
      .select("main_image_url, product_detail_images(image_url)")
      .eq("id", id)
      .single();

    if (filesError) {
      alert("Gagal memuat foto produk: " + filesError.message);
      return;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
      return;
    }

    setProducts((items) => items.filter((product) => product.id !== id));

    const urls = [
      productFiles?.main_image_url,
      ...(productFiles?.product_detail_images || []).map((image) => image.image_url),
    ].filter(Boolean);

    await removeProductImages(urls);
  };

  const saveTestimonial = async (event) => {
    event.preventDefault();

    const payload = {
      customer_name: testimonialForm.customer_name.trim(),
      customer_origin: testimonialForm.customer_origin.trim(),
      content: testimonialForm.content.trim(),
    };

    if (!payload.customer_name || !payload.content) return;

    const result = editingTestimonial
      ? await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingTestimonial)
      : await supabase.from("testimonials").insert(payload);

    if (result.error) {
      alert("Gagal menyimpan testimoni: " + result.error.message);
      return;
    }

    try {
      await refreshTestimonials();
      setEditingTestimonial(null);
      setTestimonialForm(emptyTestimonial);
    } catch (error) {
      alert(
        "Testimoni tersimpan, tetapi daftar gagal diperbarui: " +
          error.message,
      );
    }
  };

  const editTestimonial = (item) => {
    setEditingTestimonial(item.id);
    setTestimonialForm({
      customer_name: item.customer_name || "",
      customer_origin: item.customer_origin || "",
      content: item.content || "",
    });
  };

  const cancelTestimonialEdit = () => {
    setEditingTestimonial(null);
    setTestimonialForm(emptyTestimonial);
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Hapus testimoni ini?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
      return;
    }

    setTestimonials((items) => items.filter((item) => item.id !== id));
    if (editingTestimonial === id) cancelTestimonialEdit();
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const name = categoryName.trim();
    if (!name || categoryLoading) return;

    setCategoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name })
        .select()
        .single();

      if (error) throw error;

      setCategories((items) =>
        [...items, data].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setCategoryName("");
    } catch (error) {
      alert("Gagal menambah kategori: " + error.message);
    } finally {
      setCategoryLoading(false);
    }
  };

  const deleteCategory = async (category) => {
    if (
      products.some((product) => product.category_id === category.id)
    ) {
      alert(
        "Kategori ini masih digunakan produk. Pindahkan produk ke kategori lain sebelum menghapusnya.",
      );
      return;
    }

    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", category.id);

    if (error) {
      alert("Gagal menghapus kategori: " + error.message);
      return;
    }

    setCategories((items) =>
      items.filter((item) => item.id !== category.id),
    );
  };

  return {
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
  };
}
