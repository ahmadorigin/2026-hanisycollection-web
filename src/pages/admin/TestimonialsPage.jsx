import { TestimonialSection } from "./DashboardForms";
import { useDashboardData } from "./hooks/useDashboardData";

export default function TestimonialsPage() {
  const {
    testimonials, testimonialLoading, testimonialForm, setTestimonialForm,
    editingTestimonial, saveTestimonial, editTestimonial,
    cancelTestimonialEdit, deleteTestimonial,
  } = useDashboardData();

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">Konten beranda</p>
        <h1 className="mt-1 text-2xl font-bold text-brand-text">Kelola Testimoni</h1>
        <p className="mt-1 text-sm text-brand-muted">Kelola ulasan pelanggan yang ditampilkan di halaman utama.</p>
      </div>
      <TestimonialSection
        testimonials={testimonials}
        loading={testimonialLoading}
        form={testimonialForm}
        setForm={setTestimonialForm}
        editingId={editingTestimonial}
        onEdit={editTestimonial}
        onDelete={deleteTestimonial}
        onSave={saveTestimonial}
        onCancel={cancelTestimonialEdit}
      />
    </div>
  );
}
