import { useEffect, useState } from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { path: "/admin", label: "Daftar Produk", icon: LayoutDashboard, end: true },
  { path: "/admin/products/new", label: "Tambah Produk", icon: PlusCircle, end: false },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    await logout();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <>
      <div className="border-b border-gray-100 p-6">
        <h2 className="text-xl font-bold text-brand-primary">Hanisy Admin</h2>
        <p className="mt-1 truncate text-xs text-brand-muted">{user?.email}</p>
      </div>

      <nav
        aria-label="Menu admin"
        className="min-h-0 grow space-y-2 overflow-y-auto overscroll-contain p-4"
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${
                isActive
                  ? "bg-brand-secondary font-medium text-brand-primary"
                  : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-gray-100 bg-white p-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-brand-muted transition-colors hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Lihat Toko
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-bg md:flex">
      <header className="sticky top-0 z-[60] flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <div className="min-w-0">
          <p className="font-semibold text-brand-primary">Hanisy Admin</p>
          <p className="max-w-[220px] truncate text-[11px] text-brand-muted">
            {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          aria-label={mobileOpen ? "Tutup menu admin" : "Buka menu admin"}
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-sidebar"
          className="shrink-0 rounded-xl p-2 text-brand-text transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          <span className="block transition-transform duration-200">
            {mobileOpen ? <X /> : <Menu />}
          </span>
        </button>
      </header>

      <button
        type="button"
        tabIndex={mobileOpen ? 0 : -1}
        aria-label="Tutup menu admin"
        onClick={closeMobileMenu}
        className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="admin-mobile-sidebar"
        className={`fixed bottom-0 left-0 top-16 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-gray-200 bg-white shadow-xl transition-[transform,visibility] duration-300 ease-out md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:translate-x-0 md:shadow-none ${
          mobileOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full md:visible md:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

      <main className="min-w-0 grow p-4 pb-10 md:h-screen md:overflow-y-auto md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
