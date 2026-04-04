import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type { MangaItem } from "../actorClient";
import { useCart } from "../context/CartContext";

interface MangaCardProps {
  manga: MangaItem;
  compact?: boolean;
}

export default function MangaCard({ manga, compact = false }: MangaCardProps) {
  const { addToCart } = useCart();

  const imageUrl = manga.coverImage.getDirectURL();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(manga, 1);
  };

  return (
    <Link
      to="/product/$id"
      params={{ id: String(manga.id) }}
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
      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {manga.isNew && (
          <span
            className="text-xs font-bold uppercase px-2 py-0.5 rounded"
            style={{ backgroundColor: "#A12B2B", color: "#F2F2F2" }}
          >
            NEW
          </span>
        )}
        {manga.isFeatured && (
          <span
            className="text-xs font-bold uppercase px-2 py-0.5 rounded"
            style={{ backgroundColor: "#C7A24A", color: "#0B0B0C" }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Cover image */}
      <div
        className="w-full overflow-hidden"
        style={{ aspectRatio: "3/4", backgroundColor: "#1A1A1D" }}
      >
        <img
          src={imageUrl}
          alt={manga.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = `https://placehold.co/300x400/141416/C7A24A?text=${encodeURIComponent(manga.title)}`;
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
            ${manga.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1">
            <Star
              className="w-3 h-3 fill-current"
              style={{ color: "#C7A24A" }}
            />
            <span className="text-xs" style={{ color: "#C7A24A" }}>
              4.8
            </span>
          </div>
        </div>

        {!compact && (
          <button
            type="button"
            onClick={handleAddToCart}
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
