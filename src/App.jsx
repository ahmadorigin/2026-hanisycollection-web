import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/home";
import Catalog from "./pages/catalog";

// Admin Pages
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";

// Layout Sederhana untuk Publik
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a
            href="/"
            className="text-2xl font-bold text-brand-primary tracking-tight"
          >
            Hanisy
            <span className="text-brand-text font-light"> Collection</span>
          </a>
          <nav className="hidden md:flex gap-8">
            <a
              href="/"
              className="text-brand-text hover:text-brand-primary font-medium transition-colors"
            >
              Beranda
            </a>
            <a
              href="/catalog"
              className="text-brand-text hover:text-brand-primary font-medium transition-colors"
            >
              Katalog
            </a>
          </nav>
        </div>
      </header>

      <main className="grow">{children}</main>

      <footer className="bg-white border-t border-gray-100 py-8 text-center text-brand-muted text-sm">
        <p>
          &copy; {new Date().getFullYear()} Hanisy Collection. All rights
          reserved.
        </p>
        <a
          href="/admin"
          className="text-gray-300 hover:text-brand-primary mt-2 inline-block transition-colors"
        >
          Admin Login
        </a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/catalog"
            element={
              <PublicLayout>
                <Catalog />
              </PublicLayout>
            }
          />

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
