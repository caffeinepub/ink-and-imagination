import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import type { Manga } from "../backend";
import { useCart } from "../context/CartContext";

interface MangaCardProps {
  manga: Manga;
  compact?: boolean;
}

export default function MangaCard({ manga, compact = false }: MangaCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(manga, 1);
  };

  const coverUrl =
    manga.coverImage ||
    `https://placehold.co/300x450/141416/C7A24A?text=${encodeURIComponent(manga.title)}`;

  return (
    <Link
      to="/manga/$id"
      params={{ id: manga.id }}
      className="relative flex flex-col group transition-transform duration-200 hover:-translate-y-1"
      style={{
        backgroundColor: "#141416",
        border: "1px solid #C7A24A",
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        textDecoration: "none",
      }}
    >
      {/* Cover image */}
      <div
        className="w-full overflow-hidden"
        style={{ aspectRatio: "3/4", backgroundColor: "#1A1A1D" }}
      >
        <img
          src={coverUrl}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/300x450/141416/C7A24A?text=${encodeURIComponent(manga.title)}`;
          }}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <span
          className="text-xs font-bold uppercase px-2 py-0.5 rounded self-start"
          style={{ backgroundColor: "#A12B2B", color: "#F2F2F2" }}
        >
          {manga.genre}
        </span>

        <p
          className="font-bold text-sm truncate mt-1"
          style={{ color: "#F2F2F2" }}
        >
          {manga.title}
        </p>
        <p className="text-xs truncate" style={{ color: "#A6A6AA" }}>
          {manga.author}
        </p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-sm" style={{ color: "#F2F2F2" }}>
            ₹{manga.price.toFixed(2)}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: Number(manga.stock) > 0 ? "#0a2a0a" : "#2a0a0a",
              color: Number(manga.stock) > 0 ? "#4ade80" : "#f87171",
            }}
          >
            {Number(manga.stock) > 0 ? "In Stock" : "Out"}
          </span>
        </div>

        {!compact && (
          <button
            type="button"
            onClick={handleAddToCart}
            data-ocid="shop.add_to_cart.button"
            className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wide rounded transition-all duration-200"
            style={{
              border: "1px solid #C7A24A",
              color: "#C7A24A",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C7A24A";
              e.currentTarget.style.color = "#0B0B0C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#C7A24A";
            }}
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}
