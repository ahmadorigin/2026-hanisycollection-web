import { Link } from "react-router-dom";
import {
  Package,
  Boxes,
  ClipboardList,
  MessageSquareQuote,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useDashboardData } from "./hooks/useDashboardData";
import { formatRupiah } from "../../lib/utils";
import { AdminEmptyState } from "./AdminFormUI";

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-brand-muted">{label}</p>
        <span className={`rounded-xl p-2.5 ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums text-brand-text">{value}</p>
    </article>
  );
}

const statusLabels = {
  ready_stock: "Ready Stock",
  made_to_order: "Pre-Order",
  inquiry: "Custom",
};

export default function DashboardOverview() {
  const { products, categories, testimonials, loading } = useDashboardData();

  const stats = [
    { label: "Total Produk", value: products.length, icon: Package, tone: "bg-pink-50 text-pink-700" },
    { label: "Ready Stock", value: products.filter((item) => item.status === "ready_stock").length, icon: Boxes, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Pre-Order", value: products.filter((item) => item.status === "made_to_order").length, icon: ClipboardList, tone: "bg-amber-50 text-amber-700" },
    { label: "Custom", value: products.filter((item) => item.status === "inquiry").length, icon: Package, tone: "bg-violet-50 text-violet-700" },
    { label: "Total Kategori", value: categories.length, icon: Boxes, tone: "bg-sky-50 text-sky-700" },
    { label: "Total Testimoni", value: testimonials.length, icon: MessageSquareQuote, tone: "bg-rose-50 text-rose-700" },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Ringkasan toko</p>
          <h1 className="mt-1 text-2xl font-bold text-brand-text">Dashboard</h1>
          <p className="mt-1 text-sm text-brand-muted">Pantau ringkasan data Hanisy Collection.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90">
          <Plus className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      {loading ? (
        <AdminEmptyState>Memuat statistik toko...</AdminEmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5">
          <div>
            <h2 className="font-semibold text-brand-text">Produk Terbaru</h2>
            <p className="mt-1 text-xs text-brand-muted">Lima produk terakhir yang ditambahkan.</p>
          </div>
          <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-primary hover:underline">
            Semua produk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="p-5 text-sm text-brand-muted">Memuat produk...</div>
        ) : recentProducts.length === 0 ? (
          <AdminEmptyState className="m-5">Belum ada produk. Mulai dengan menambahkan produk pertama.</AdminEmptyState>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-4 sm:px-5">
                <img src={product.main_image_url} alt="" loading="lazy" className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover" />
                <div className="min-w-0 grow">
                  <p className="truncate text-sm font-medium text-brand-text">{product.name}</p>
                  <p className="mt-1 text-xs text-brand-muted">{product.categories?.name || "Tanpa kategori"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-brand-text">{formatRupiah(product.price)}</p>
                  <p className="mt-1 text-xs text-brand-muted">{statusLabels[product.status] || product.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
