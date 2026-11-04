import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { formatRupiah } from "../../lib/utils";
import { Edit, Trash2, Plus } from "lucide-react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select(`*, categories(name)`)
        .order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
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
    </div>
  );
}
