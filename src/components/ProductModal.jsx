import { useEffect, useState } from "react";
import { X, Send, ZoomIn } from "lucide-react";
import { formatRupiah, generateWALink } from "../lib/utils";

export default function ProductModal({ product, onClose }) {
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [color, setColor] = useState(product?.colors?.[0] || "");
  const [lightbox, setLightbox] = useState("");
  const details = (product?.detail_images || []).slice(0, 4);
  const photos = [
    product?.main_image_url,
    ...details.map((d) => d.image_url),
  ].filter(Boolean);
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") {
        if (lightbox) setLightbox("");
        else onClose();
      }
    };
    document.addEventListener("keydown", key);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = old;
    };
  }, [lightbox, onClose]);
  if (!product) return null;
  const unavailable = product.status === "ready_stock" && product.stock === 0;
  const wa = generateWALink(product, size, color, window.location.href);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-0 backdrop-blur-sm md:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-dvh w-full max-w-6xl flex-col overflow-hidden bg-white md:h-[min(90vh,850px)] md:flex-row md:rounded-3xl">
        <button
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 shadow md:hidden"
        >
          <X />
        </button>
        <div className="w-full shrink-0 overflow-y-auto bg-[#faf6f7] p-4 md:w-1/2 md:p-6">
          <button
            onClick={() => setLightbox(product.main_image_url)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-white"
          >
            <img
              src={product.main_image_url}
              alt={product.name}
              className="mx-auto max-h-[58vh] w-full object-contain md:max-h-[62vh]"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#6e4b5b] opacity-0 shadow transition group-hover:opacity-100">
              <ZoomIn size={18} />
            </span>
          </button>
          {photos.length > 1 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {details.map((d, i) => (
                <button
                  key={d.id || d.image_url || i}
                  onClick={() => setLightbox(d.image_url)}
                  className="overflow-hidden rounded-xl bg-white"
                >
                  <img
                    src={d.image_url}
                    alt={d.caption || `Detail ${i + 1} ${product.name}`}
                    className="aspect-4/3 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto p-6 md:w-1/2 md:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-[#b64d70]">
                {product.categories?.name || "Hanisy Collection"}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#30232a]">
                {product.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup detail"
              className="hidden rounded-full p-2 text-[#806d76] hover:bg-[#f8edf1] md:block"
            >
              <X />
            </button>
          </div>
          <p className="mt-4 text-2xl font-semibold text-[#b64d70]">
            {product.status === "inquiry" ? "Mulai dari " : ""}
            {formatRupiah(product.price)}
          </p>
          <p className="mt-5 whitespace-pre-line leading-7 text-[#75666d]">
            {product.description || "Belum ada deskripsi untuk produk ini."}
          </p>
          {product.colors?.length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-semibold text-[#30232a]">Warna</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border transition px-4 py-2 text-sm ${color === c ? "border-[#b64d70] bg-[#f8edf1] text-[#a34665]" : "border-[#eadde2] text-[#65545d]"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-[#30232a]">
                Ukuran
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 rounded-xl border transition px-4 py-3 text-sm ${size === s ? "border-[#b64d70] bg-[#f8edf1] text-[#a34665]" : "border-[#eadde2] text-[#65545d]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto pt-8">
            <a
              href={unavailable ? "#" : wa}
              onClick={(e) => unavailable && e.preventDefault()}
              target="_blank"
              rel="noreferrer"
              className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold text-white ${unavailable ? "cursor-not-allowed bg-gray-300" : "bg-[#b64d70] hover:bg-[#963c5c]"}`}
            >
              <Send size={18} />
              {unavailable ? "Stok Habis" : "Pesan via WhatsApp"}
            </a>
          </div>
        </div>
      </div>
      {lightbox && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setLightbox("");
          }}
        >
          <button
            onClick={() => setLightbox("")}
            aria-label="Tutup gambar"
            className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white"
          >
            <X />
          </button>
          <img
            src={lightbox}
            alt={product.name}
            className="max-h-[90vh] max-w-[95vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
