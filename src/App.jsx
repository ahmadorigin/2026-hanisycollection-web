import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Catalog from "./pages/catalog";
import About from "./pages/about";
import Contact from "./pages/contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductForm from "./pages/admin/ProductForm";

function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    ["Beranda", "/"],
    ["Collection", "/collection"],
    ["About", "/about"],
    ["Contact", "/contact"],
  ];

  return (
    <div className="min-h-screen bg-white text-[#30232a]">
      <header
        className={`sticky top-0 z-40 border-b transition-all ${
          scrolled
            ? "border-black/5 bg-white/95 shadow-sm backdrop-blur"
            : "border-white/20 bg-white"
        }`}
      >
        <div className="mx-auto flex h-19 max-w-7xl items-center justify-between px-5">
          <Link
            to="/"
            aria-label="Hanisy Collection - Beranda"
            className="flex items-center gap-3"
          >
            <span className="text-left leading-none">
              <span className="block font-serif text-[1.35rem] tracking-[0.08em] text-[#301b26]">
                HANISY
              </span>
              <span className="mt-1 block text-[0.6rem] font-sans tracking-[0.3em] text-[#b64d70]">
                COLLECTION
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/"}
                className={({ isActive }) =>
                  `text-sm transition hover:text-[#b64d70] ${
                    isActive ? "font-semibold text-[#b64d70]" : "text-[#40343a]"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="rounded-full p-2 md:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <nav className="grid gap-1 border-t border-[#f0e4e8] bg-white px-5 py-4 md:hidden">
            {links.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 hover:bg-[#fbf2f5]"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-[#21191e] px-5 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <div>
            <p className="font-serif text-2xl">HANISY COLLECTION</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
              Modest fashion dengan sentuhan modern, anggun, dan nyaman untuk
              keseharian.
            </p>
          </div>

          <div>
            <p className="font-semibold">Jelajahi</p>
            <div className="mt-4 grid gap-2 text-sm text-white/70">
              {links.map(([label, path]) => (
                <Link key={path} to={path} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold">Ikuti perjalanan kami</p>
            <a
              href="https://wa.me/62895635913111"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
            >
              <MessageCircle size={17} /> WhatsApp Hanisy
            </a>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/45">
          © {new Date().getFullYear()} Hanisy Collection. Hak cipta dilindungi.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="collection" element={<Catalog />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="testimonial"
              element={<Navigate to="/#testimonials" replace />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />

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
