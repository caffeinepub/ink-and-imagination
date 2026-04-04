import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/", label: "HOME" },
  { to: "/shop", label: "SHOP" },
  { to: "/about", label: "ABOUT" },
];

export default function Navigation() {
  const { cartCount } = useCart();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav
      style={{
        backgroundColor: "#0E0E10",
        borderBottom: "1px solid #C7A24A",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="w-6 h-6" style={{ color: "#C7A24A" }} />
            <span
              className="font-display text-lg tracking-widest"
              style={{ color: "#A12B2B", fontSize: "1.1rem" }}
            >
              INK &amp; IMAGINATION
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-bold tracking-widest uppercase transition-colors duration-150"
                style={{
                  color: isActive(link.to) ? "#A12B2B" : "#F2F2F2",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: isActive("/cart") ? "#A12B2B" : "#F2F2F2" }}
              />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    backgroundColor: "#A12B2B",
                    color: "#F2F2F2",
                    fontSize: "10px",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{ color: "#F2F2F2" }}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden py-4 flex flex-col gap-4"
            style={{ borderTop: "1px solid #2A2A2E" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold tracking-widest uppercase py-1"
                style={{
                  color: isActive(link.to) ? "#A12B2B" : "#F2F2F2",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
