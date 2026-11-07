import { forwardRef } from "react";

export const adminInputClass =
  "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-brand-text outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70";

export const adminPrimaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export function AdminSectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#b64d70]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-2xl font-bold text-brand-text">{title}</h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-brand-muted">{description}</p>
      )}
    </div>
  );
}

export function AdminFormPanel({ children, className = "" }) {
  return (
    <div
      className={`h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminField({ label, htmlFor, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
    </div>
  );
}

export const AdminInput = forwardRef(function AdminInput(
  { className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`${adminInputClass} ${className}`.trim()}
      {...props}
    />
  );
});

export const AdminTextarea = forwardRef(function AdminTextarea(
  { className = "", ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`${adminInputClass} ${className}`.trim()}
      {...props}
    />
  );
});

export function AdminEmptyState({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-brand-muted ${className}`}
    >
      {children}
    </div>
  );
}
