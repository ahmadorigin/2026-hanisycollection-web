import { Heart, Sparkles, ShieldCheck } from "lucide-react";

const values = [
  { icon: Heart, title: "Dibuat dengan perhatian", text: "Setiap detail dirancang dengan mempertimbangkan kenyamanan dan kebutuhan berpakaian yang santun." },
  { icon: Sparkles, title: "Anggun dan sederhana", text: "Sentuhan modern berpadu dengan inspirasi hanbok dalam koleksi modest fashion yang khas." },
  { icon: ShieldCheck, title: "Nyaman dikenakan", text: "Kami mengutamakan pilihan bahan, potongan, dan detail yang mendukung aktivitas sehari-hari." },
];

export default function About() {
  return <div className="bg-white">
    <section className="bg-[#f8edf1] px-5 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#b64d70]">Tentang Hanisy</p>
      <h1 className="mt-4 font-serif text-4xl text-[#271b20] md:text-6xl">Keanggunan yang terasa nyaman</h1>
      <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#75666d]">Hanisy Collection menghadirkan modest fashion bernuansa hanbok yang memadukan kesantunan, kenyamanan, dan sentuhan modern.</p>
    </section>
    <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:items-center">
      <div className="min-h-[360px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f2dce4] via-[#faf4f5] to-[#e8d5cc]">
        <div className="flex h-full min-h-[360px] items-end p-8"><p className="max-w-xs font-serif text-3xl leading-tight text-[#63394b]">Modest fashion, modern elegance.</p></div>
      </div>
      <div><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d70]">Cerita kami</p><h2 className="mt-4 font-serif text-4xl text-[#271b20]">Berawal dari kecintaan pada busana yang santun</h2><p className="mt-6 leading-8 text-[#75666d]">Hanisy Collection tumbuh dari keinginan menghadirkan pilihan busana yang membantu perempuan tampil anggun tanpa meninggalkan kenyamanan dan nilai kesantunan. Inspirasi hanbok memberi karakter pada siluet dan detail, sementara kebutuhan sehari-hari tetap menjadi perhatian utama.</p><p className="mt-4 leading-8 text-[#75666d]">Kami terus berupaya menyajikan koleksi yang mudah dipadukan, terasa nyaman, dan memiliki ciri khas tersendiri.</p></div>
    </section>
    <section className="bg-[#fbf7f8] px-5 py-20"><div className="mx-auto max-w-6xl"><div className="text-center"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d70]">Nilai kami</p><h2 className="mt-3 font-serif text-4xl text-[#271b20]">Yang kami jaga dalam setiap koleksi</h2></div><div className="mt-12 grid gap-6 md:grid-cols-3">{values.map(({icon:Icon,title,text})=><article key={title} className="rounded-3xl border border-[#f0e4e8] bg-white p-8"><Icon className="h-8 w-8 text-[#c45b7d]"/><h3 className="mt-5 text-lg font-semibold text-[#30232a]">{title}</h3><p className="mt-3 leading-7 text-[#75666d]">{text}</p></article>)}</div></div></section>
  </div>;
}
