import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { generateCustomWALink } from "../lib/utils";

export default function Home() {
  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <span className="text-brand-primary font-semibold tracking-wider uppercase text-sm mb-4">
            Koleksi Eksklusif
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-text leading-tight mb-6 max-w-3xl">
            Keanggunan dalam Balutan{" "}
            <span className="text-brand-primary">Hanbok</span> untuk Si Kecil
          </h1>
          <p className="text-brand-muted text-lg mb-10 max-w-2xl">
            Dibuat dengan tangan dan penuh cinta oleh penjahit lokal.
            Menghadirkan kenyamanan, keamanan, dan gaya untuk buah hati
            tercinta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/30"
            >
              Lihat Katalog
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={generateCustomWALink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-brand-text border-2 border-gray-200 px-8 py-4 rounded-full font-semibold hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              <HeartHandshake className="w-5 h-5" />
              Konsultasi Custom Order
            </a>
          </div>
        </div>
      </section>

      {/* Banner Family Set / Custom */}
      <section className="py-20 bg-brand-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-4">
            Family Set & Custom Request
          </h2>
          <p className="text-brand-text/80 mb-8 max-w-2xl mx-auto">
            Ingin matching outfit dengan si kecil? Atau butuh gamis, outer, atau
            bawahan custom? Kami menerima pesanan khusus (Made to Order) sesuai
            keinginan Anda.
          </p>
          <a
            href={generateCustomWALink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            Mulai Konsultasi Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
