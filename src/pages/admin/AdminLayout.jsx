import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LayoutDashboard, PlusCircle, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin", label: "Daftar Produk", icon: LayoutDashboard },
    { path: "/admin/products/new", label: "Tambah Produk", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-primary">Hanisy Admin</h2>
          <p className="text-xs text-brand-muted mt-1 truncate">
            {user?.email}
          </p>
        </div>
        <nav className="grow p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location.pathname === item.path ? "bg-brand-secondary text-brand-primary font-medium" : "text-brand-muted hover:bg-gray-50 hover:text-brand-text"}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-brand-muted hover:bg-gray-50 rounded-xl transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Lihat Toko
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="grow p-4 md:p-8 overflow-y-auto h-screen">
        <Outlet />
      </main>
    </div>
  );
}
