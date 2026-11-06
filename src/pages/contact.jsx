import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import { generateCustomWALink } from "../lib/utils";

const socials = [
  { label: "WhatsApp", value: "Chat dengan Hanisy Collection", href: generateCustomWALink(), icon: MessageCircle },
  { label: "Instagram", value: "", href: "", icon: Instagram },
  { label: "Email", value: "", href: "", icon: Mail },
  { label: "Alamat", value: "", href: "", icon: MapPin },
];

export default function Contact() {
  return <section className="min-h-[70vh] bg-[#fbf7f8] px-5 py-20">
    <div className="mx-auto max-w-5xl"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d70]">Hubungi kami</p><h1 className="mt-3 font-serif text-4xl text-[#271b20] md:text-5xl">Kami siap membantu</h1><p className="mt-5 max-w-2xl leading-8 text-[#75666d]">Ada pertanyaan tentang koleksi, ukuran, atau pesanan khusus? Silakan hubungi Hanisy Collection melalui kanal yang tersedia.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">{socials.filter(s=>s.value || s.href).map(({label,value,href,icon:Icon})=><a key={label} href={href || undefined} target={href ? "_blank" : undefined} rel={href ? "noreferrer" : undefined} className="flex items-center gap-4 rounded-2xl border border-[#f0e4e8] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"><span className="rounded-xl bg-[#f8edf1] p-3 text-[#b64d70]"><Icon className="h-6 w-6"/></span><span><span className="block font-semibold text-[#30232a]">{label}</span><span className="mt-1 block text-sm text-[#75666d]">{value}</span></span></a>)}</div>
    </div>
  </section>;
}
