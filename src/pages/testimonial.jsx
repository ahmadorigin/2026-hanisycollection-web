import { useEffect, useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Testimonial() {
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  useEffect(()=>{let active=true;(async()=>{const {data,error}=await supabase.from("testimonials").select("id,customer_name,content,created_at").order("created_at",{ascending:false});if(!active)return;if(error)setError("Ulasan belum dapat dimuat saat ini.");else setItems(data||[]);setLoading(false);})();return()=>{active=false};},[]);
  return <section className="min-h-[70vh] bg-white px-5 py-20"><div className="mx-auto max-w-6xl"><div className="text-center"><p className="text-xs font-semibold uppercase tracking-[.25em] text-[#b64d70]">Cerita pelanggan</p><h1 className="mt-3 font-serif text-4xl text-[#271b20] md:text-5xl">Kesan dari mereka</h1><p className="mt-4 text-[#75666d]">Terima kasih telah menjadi bagian dari perjalanan Hanisy Collection.</p></div>
  {loading?<p className="py-16 text-center text-[#75666d]">Memuat ulasan...</p>:error?<p className="py-16 text-center text-[#75666d]">{error}</p>:items.length===0?<div className="mx-auto mt-12 max-w-xl rounded-3xl bg-[#fbf7f8] p-10 text-center"><MessageSquareQuote className="mx-auto h-10 w-10 text-[#c45b7d]"/><h2 className="mt-4 font-semibold text-[#30232a]">Cerita pelanggan segera hadir</h2><p className="mt-2 text-sm leading-6 text-[#75666d]">Kami sedang menyiapkan ruang untuk berbagi pengalaman pelanggan Hanisy Collection.</p></div>:<div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map(item=><article key={item.id} className="rounded-3xl border border-[#f0e4e8] p-7"><MessageSquareQuote className="h-7 w-7 text-[#c45b7d]"/><p className="mt-5 leading-7 text-[#5f5057]">“{item.content}”</p><p className="mt-6 font-semibold text-[#30232a]">{item.customer_name}</p></article>)}</div>}</div></section>;
}
