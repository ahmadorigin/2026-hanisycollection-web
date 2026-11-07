import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { formatRupiah } from "../../../lib/utils";
import { AdminEmptyState } from "../AdminFormUI";

function ProductStatus({ status, stock }) {
  if (status === "ready_stock") {
    return stock > 0 ? (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Ready ({stock})
      </span>
    ) : (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        Habis
      </span>
    );
  }

  if (status === "made_to_order") {
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
        Pre-Order
      </span>
    );
  }

  return (
    <span className="rounded-full bg-brand-secondary px-3 py-1 text-xs font-medium text-brand-primary">
      Custom
    </span>
  );
}

export default function DashboardProductTable({
  products,
  loading,
  onDelete,
}) {
  return (
    <section aria-label="Daftar produk" className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {loading ? (
        <AdminEmptyState className="m-4">Memuat data produk...</AdminEmptyState>
      ) : products.length === 0 ? (
        <AdminEmptyState className="m-4">Belum ada produk.</AdminEmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-sm text-brand-muted">
                <th className="p-4 font-medium">Produk</th>
                <th className="p-4 font-medium">Kategori</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-center font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50">
                  <td className="p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={product.main_image_url}
                        alt=""
                        loading="lazy"
                        className="h-12 w-12 shrink-0 rounded-lg bg-gray-100 object-cover"
                      />
                      <span className="font-medium text-brand-text">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-brand-muted">
                    {product.categories?.name || "-"}
                  </td>
                  <td className="p-4 font-medium text-brand-text">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="p-4">
                    <ProductStatus status={product.status} stock={product.stock} />
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        aria-label={`Edit ${product.name}`}
                        className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(product.id)}
                        aria-label={`Hapus ${product.name}`}
                        className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
