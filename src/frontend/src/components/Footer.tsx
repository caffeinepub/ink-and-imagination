import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

const CONTACT_EMAIL = "ink.and.imagination.official2026@gmail.com";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      style={{ backgroundColor: "#0E0E10", borderTop: "1px solid #C7A24A" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5" style={{ color: "#C7A24A" }} />
              <span
                className="font-display text-sm tracking-widest"
                style={{ color: "#A12B2B" }}
              >
                INK &amp; IMAGINATION
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#A6A6AA" }}>
              We create original manga and bring it directly to you. Built from
              passion, published with purpose.
            </p>
            <p className="text-xs mt-3" style={{ color: "#A6A6AA" }}>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-white transition-colors"
                style={{ color: "#C7A24A" }}
                data-ocid="footer.contact.link"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#F2F2F2" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" as const },
                { label: "Shop All", to: "/shop" as const },
                { label: "About", to: "/about" as const },
                { label: "Cart", to: "/cart" as const },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "#A6A6AA" }}
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#F2F2F2" }}
            >
              Genres
            </h4>
            <ul className="flex flex-col gap-2">
              {["Action", "Fantasy", "Horror", "Sci-Fi"].map((genre) => (
                <li key={genre}>
                  <Link
                    to="/shop"
                    className="text-sm transition-colors duration-150 hover:text-white"
                    style={{ color: "#A6A6AA" }}
                    data-ocid="footer.link"
                  >
                    {genre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#F2F2F2" }}
            >
              Contact
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm transition-colors duration-150 hover:text-white"
                  style={{ color: "#A6A6AA" }}
                  data-ocid="footer.contact.link"
                >
                  Email Us
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm transition-colors duration-150 hover:text-white"
                  style={{ color: "#A6A6AA" }}
                  data-ocid="footer.link"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs"
          style={{ borderTop: "1px solid #2A2A2E", color: "#A6A6AA" }}
        >
          <span>&copy; {year} Ink and Imagination. All Rights Reserved.</span>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            style={{ color: "#A6A6AA" }}
          >
            Built with ♥ using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
