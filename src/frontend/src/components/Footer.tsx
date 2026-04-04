import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

const CONTACT_EMAIL = "ink.and.imagination.official2026@gmail.com";

type InternalLink = { label: string; kind: "internal"; to: string };
type MailtoLink = { label: string; kind: "mailto"; email: string };
type FooterLink = InternalLink | MailtoLink;

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home", kind: "internal", to: "/" },
      { label: "Shop All", kind: "internal", to: "/shop" },
      { label: "About", kind: "internal", to: "/about" },
      { label: "Cart", kind: "internal", to: "/cart" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "Action", kind: "internal", to: "/shop?genre=Action" },
      { label: "Fantasy", kind: "internal", to: "/shop?genre=Fantasy" },
      { label: "Horror", kind: "internal", to: "/shop?genre=Horror" },
      { label: "Sci-Fi", kind: "internal", to: "/shop?genre=Sci-Fi" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "FAQ", kind: "internal", to: "/about" },
      { label: "Shipping Info", kind: "internal", to: "/about" },
      { label: "Returns", kind: "internal", to: "/about" },
      { label: "Contact Us", kind: "mailto", email: CONTACT_EMAIL },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const className = "text-sm transition-colors duration-150 hover:text-white";
  const style = { color: "#A6A6AA" };

  if (link.kind === "mailto") {
    return (
      <a
        href={`mailto:${link.email}`}
        data-ocid="footer.contact.link"
        className={className}
        style={style}
      >
        {link.label}
      </a>
    );
  }

  return (
    <Link
      to={link.to as "/" | "/shop" | "/about" | "/cart"}
      className={className}
      style={style}
    >
      {link.label}
    </Link>
  );
}

export default function Footer() {
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
              Your gateway to the world&apos;s finest manga. Curated collections
              for every fan.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#F2F2F2" }}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="mt-8 pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={{ borderTop: "1px solid #2A2A2E" }}
        >
          <div className="flex-1">
            <h4
              className="text-sm font-bold uppercase tracking-widest mb-1"
              style={{ color: "#F2F2F2" }}
            >
              Newsletter
            </h4>
            <p className="text-xs" style={{ color: "#A6A6AA" }}>
              New arrivals, sales, and manga culture updates.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="text-sm px-3 py-2 rounded-lg outline-none w-48"
              style={{
                backgroundColor: "#1D1D20",
                border: "1px solid #2A2A2E",
                color: "#F2F2F2",
              }}
            />
            <button
              type="button"
              className="manga-btn-outline text-xs px-4 py-2"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-8 pt-4 text-center text-xs"
          style={{ borderTop: "1px solid #2A2A2E", color: "#A6A6AA" }}
        >
          &copy; {new Date().getFullYear()} Ink and Imagination. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
