import { useEffect, useMemo, useState } from "react";
import { X, Send, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { formatRupiah, generateWALink } from "../lib/utils";

export default function ProductModal({ product, onClose }) {
  const [size, setSize] = useState(product?.sizes?.[0] || "");
  const [color, setColor] = useState(product?.colors?.[0] || "");
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightbox, setLightbox] = useState("");
  const [touchStart, setTouchStart] = useState(null);

  const carouselPhotos = useMemo(
    () => [
      product?.main_image_url,
      product?.front_image_url,
      product?.back_image_url,
    ].filter(Boolean),
    [product?.main_image_url, product?.front_image_url, product?.back_image_url],
  );
  const details = (product?.detail_images || [])
    .filter((item) => item.image_url)
    .slice(0, 4);

  useEffect(() => {
    setSize(product?.sizes?.[0] || "");
    setColor(product?.colors?.[0] || "");
    setActiveSlide(0);
    setLightbox("");
  }, [product?.id]);

  useEffect(() => {
    const key = (event) => {
      if (event.key === "Escape") {
        if (lightbox) setLightbox("");
        else onClose();
      }
      if (!lightbox && event.key === "ArrowRight") {
        setActiveSlide((current) => Math.min(current + 1, carouselPhotos.length - 1));
      }
      if (!lightbox && event.key === "ArrowLeft") {
        setActiveSlide((current) => Math.max(current - 1, 0));
      }
    };
    document.addEventListener("keydown", key);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox, onClose, carouselPhotos.length]);

  if (!product) return null;

  const unavailable = product.status === "ready_stock" && product.stock === 0;
  const wa = generateWALink(product, size, color);
  const changeSlide = (direction) => {
    setActiveSlide((current) =>
      Math.min(Math.max(current + direction, 0), carouselPhotos.length - 1),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-0 backdrop-blur-sm md:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-dvh w-full max-w-4xl flex-col overflow-hidden bg-white md:h-[min(94vh,920px)] md:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[#f0e4e8] px-4 py-3 md:px-6">
          <button onClick={onClose} className="inline-flex items-center gap-2 text-sm font-medium text-[#65545d] hover:text-[#b64d70]">
            <ChevronLeft size={19} /> Kembali ke koleksi
          </button>
          <button onClick={onClose} aria-label="Tutup detail" className="rounded-full p-2 text-[#806d76] hover:bg-[#f8edf1]">
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <section className="bg-[#faf6f7] px-3 py-3 md:px-8 md:py-5">
            <div
              className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl bg-white"
              onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
              onTouchEnd={(event) => {
                if (touchStart === null) return;
                const delta = event.changedTouches[0].clientX - touchStart;
                if (Math.abs(delta) > 45) changeSlide(delta < 0 ? 1 : -1);
                setTouchStart(null);
              }}
            >
              {carouselPhotos.length > 0 ? (
                <button onClick={() => setLightbox(carouselPhotos[activeSlide])} className="group block w-full" aria-label="Perbesar foto produk">
                  <img
                    src={carouselPhotos[activeSlide]}
                    alt={`${product.name} - foto ${activeSlide + 1}`}
                    className="h-[34vh] min-h-56 max-h-[430px] w-full object-contain md:h-[min(48vh,430px)]"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-[#6e4b5b] opacity-100 shadow md:opacity-0 md:transition group-hover:opacity-100">
                    <ZoomIn size={18} />
                  </span>
                </button>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-gray-400">Foto produk belum tersedia</div>
              )}
              {carouselPhotos.length > 1 && (
                <>
                  <button onClick={() => changeSlide(-1)} disabled={activeSlide === 0} aria-label="Foto sebelumnya" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow disabled:opacity-30">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => changeSlide(1)} disabled={activeSlide === carouselPhotos.length - 1} aria-label="Foto berikutnya" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow disabled:opacity-30">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5">
                    {carouselPhotos.map((photo, index) => (
                      <button key={photo} onClick={() => setActiveSlide(index)} aria-label={`Lihat foto ${index + 1}`} className={`h-2 w-2 rounded-full transition ${index === activeSlide ? "bg-white" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            {carouselPhotos.length > 1 && (
              <p className="mt-2 text-center text-xs text-[#8b747f]">{activeSlide + 1} / {carouselPhotos.length}</p>
            )}
          </section>

          <div className="mx-auto max-w-3xl space-y-6 px-4 py-5 pb-7 md:px-8 md:py-7">
            <section>
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">{product.categories?.name || "Hanisy Collection"}</p>
              <h2 className="mt-1 font-serif text-2xl leading-tight text-[#30232a] md:text-3xl">{product.name}</h2>
              <p className="mt-1 text-xs font-medium text-[#8b747f]">Kode Produk: {product.code}</p>
              <p className="mt-3 text-2xl font-semibold text-[#b64d70]">
                {product.status === "inquiry" ? "Mulai dari " : ""}
                {formatRupiah(product.price)}
              </p>
            </section>

            {(product.colors?.length > 0 || product.sizes?.length > 0) && (
              <section className="grid gap-5 sm:grid-cols-2">
                {product.colors?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#30232a]">Warna</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((value) => (
                        <button key={value} onClick={() => setColor(value)} className={`rounded-full border px-4 py-2 text-sm transition ${color === value ? "border-[#b64d70] bg-[#f8edf1] text-[#a34665]" : "border-[#eadde2] text-[#65545d]"}`}>{value}</button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes?.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#30232a]">Ukuran</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((value) => (
                        <button key={value} onClick={() => setSize(value)} className={`min-w-11 rounded-xl border px-4 py-2 text-sm transition ${size === value ? "border-[#b64d70] bg-[#f8edf1] text-[#a34665]" : "border-[#eadde2] text-[#65545d]"}`}>{value}</button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {product.description?.trim() && (
              <section className="border-t border-[#f0e4e8] pt-5">
                <h3 className="text-base font-semibold text-[#30232a]">Deskripsi Produk</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#75666d]">{product.description}</p>
              </section>
            )}

            {details.length > 0 && (
              <section className="border-t border-[#f0e4e8] pt-5">
                <h3 className="text-base font-semibold text-[#30232a]">Detail & Aksesori</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 md:gap-4">
                  {details.map((detail, index) => (
                    <button key={detail.id || detail.image_url || index} onClick={() => setLightbox(detail.image_url)} className="overflow-hidden rounded-xl border border-[#f0e4e8] bg-white text-left">
                      <img src={detail.image_url} alt={detail.caption || `Detail ${index + 1} ${product.name}`} className="aspect-[4/3] w-full object-cover" loading="lazy"/>
                      {detail.caption?.trim() && <span className="block px-3 py-2.5 text-xs font-medium text-[#65545d] md:text-sm">{detail.caption}</span>}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-[#f0e4e8] bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(48,35,42,0.06)] md:px-8">
          <a
            href={unavailable ? undefined : wa}
            onClick={(event) => unavailable && event.preventDefault()}
            target="_blank"
            rel="noreferrer"
            aria-disabled={unavailable}
            className={`mx-auto flex w-full max-w-3xl items-center justify-center gap-2 rounded-full py-3.5 font-semibold text-white transition ${unavailable ? "cursor-not-allowed bg-gray-300" : "bg-[#b64d70] hover:bg-[#963c5c]"}`}
          >
            <Send size={18} />
            {unavailable ? "Stok Habis" : "Pesan via WhatsApp"}
          </a>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onMouseDown={(event) => event.target === event.currentTarget && setLightbox("")}>
          <button onClick={() => setLightbox("")} aria-label="Tutup gambar" className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white"><X /></button>
          <img src={lightbox} alt={product.name} className="max-h-[90vh] max-w-[95vw] object-contain"/>
        </div>
      )}
    </div>
  );
}
