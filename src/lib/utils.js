// Format harga ke Rupiah
export const formatRupiah = (price) => {
  if (!price) return "Hubungi Admin";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Generator Link WhatsApp
export const generateWALink = (
  product,
  selectedSize = "",
  selectedColor = "",
  customNote = "",
) => {
  const waNumber = import.meta.env.VITE_WA_NUMBER || "62895635913111";

  let message = `Halo Admin Hanisy Collection, saya ingin memesan:\n`;
  message += `- Produk: ${product.name}\n`;
  if (selectedColor) message += `- Warna: ${selectedColor}\n`;
  if (selectedSize) message += `- Ukuran: ${selectedSize}\n`;
  message += `- Harga: ${formatRupiah(product.price)}\n`;

  if (customNote) {
    message += `\nCatatan: ${customNote}\n`;
  }

  message += `\nApakah stok ini masih tersedia?`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
};

// Generator Link WA untuk Custom Order / Family Set
export const generateCustomWALink = () => {
  const waNumber = import.meta.env.VITE_WA_NUMBER || "62895635913111";
  const message = `Halo Admin Hanisy Collection, saya ingin konsultasi untuk pembuatan Custom Order / Family Set. Boleh dibantu?`;
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
};
