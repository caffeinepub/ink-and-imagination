import { Link, useParams } from "@tanstack/react-router";
import { ChevronLeft, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import MangaCard from "../components/MangaCard";
import { useCart } from "../context/CartContext";
import { useGetMangaById, useListAllManga } from "../hooks/useQueries";

const SKELETON_WIDTHS = ["80%", "40%", "60%", "100%", "100%", "100%"];

export default function ProductPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { addToCart } = useCart();

  const { data: manga, isLoading } = useGetMangaById(id);
  const { data: allManga = [] } = useListAllManga();

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = manga
    ? allManga
        .filter((m) => m.genre === manga.genre && m.id !== manga.id)
        .slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (!manga) return;
    addToCart(manga, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div
            className="rounded-xl"
            style={{
              aspectRatio: "3/4",
              background:
                "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
          <div className="flex flex-col gap-4">
            {SKELETON_WIDTHS.map((w) => (
              <div
                key={w + Math.random()}
                className="h-6 rounded"
                style={{
                  width: w,
                  background:
                    "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="font-display text-3xl" style={{ color: "#A6A6AA" }}>
          Manga not found
        </p>
        <Link to="/shop" className="manga-btn-primary inline-block mt-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  const coverUrl =
    manga.coverImage ||
    `https://placehold.co/380x510/141416/C7A24A?text=${encodeURIComponent(manga.title)}`;

  return (
    <div style={{ backgroundColor: "#0B0B0C", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "#A6A6AA" }}
          data-ocid="product.back.link"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>

        {/* Product detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Cover */}
          <div className="flex justify-center">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                border: "2px solid #C7A24A",
                boxShadow: "0 0 40px rgba(199,162,74,0.15)",
                maxWidth: "380px",
                width: "100%",
              }}
            >
              <img
                src={coverUrl}
                alt={manga.title}
                className="w-full h-full object-cover"
                style={{ aspectRatio: "3/4" }}
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/380x510/141416/C7A24A?text=${encodeURIComponent(manga.title)}`;
                }}
              />
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col gap-5">
            {/* Genre badge */}
            <span
              className="text-xs font-bold uppercase px-3 py-1 rounded self-start"
              style={{ backgroundColor: "#A12B2B", color: "#F2F2F2" }}
            >
              {manga.genre}
            </span>

            <h1
              className="font-display text-4xl sm:text-5xl leading-tight"
              style={{ color: "#F2F2F2" }}
            >
              {manga.title}
            </h1>

            <p className="text-base" style={{ color: "#A6A6AA" }}>
              by{" "}
              <span className="font-semibold" style={{ color: "#C7A24A" }}>
                {manga.author}
              </span>
            </p>

            <p className="text-sm leading-relaxed" style={{ color: "#A6A6AA" }}>
              {manga.description}
            </p>

            {/* Stock info */}
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" style={{ color: "#C7A24A" }} />
              <span className="text-sm" style={{ color: "#A6A6AA" }}>
                Stock:{" "}
                <strong
                  style={{
                    color: Number(manga.stock) > 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  {Number(manga.stock) > 0
                    ? `${Number(manga.stock)} available`
                    : "Out of Stock"}
                </strong>
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "#2A2A2E" }} />

            {/* Price */}
            <p className="font-display text-4xl" style={{ color: "#F2F2F2" }}>
              ₹{manga.price.toFixed(2)}
            </p>

            {/* Quantity + Add to cart */}
            {Number(manga.stock) > 0 && (
              <div className="flex gap-3 items-center">
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{ border: "1px solid #2A2A2E" }}
                >
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    data-ocid="product.qty.button"
                    className="w-10 h-10 text-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "#1A1A1D", color: "#F2F2F2" }}
                  >
                    −
                  </button>
                  <span
                    className="w-12 text-center text-sm font-bold"
                    style={{ color: "#F2F2F2" }}
                  >
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQty((q) => Math.min(Number(manga.stock), q + 1))
                    }
                    data-ocid="product.qty.button"
                    className="w-10 h-10 text-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: "#1A1A1D", color: "#F2F2F2" }}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  data-ocid="product.add_to_cart.primary_button"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold text-sm uppercase tracking-wide transition-all duration-200"
                  style={{
                    backgroundColor: added ? "#2A6A2A" : "#A12B2B",
                    border: "1px solid #C7A24A",
                    color: "#F2F2F2",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? "Added!" : "Add to Cart"}
                </button>
              </div>
            )}

            <Link
              to="/cart"
              className="text-xs uppercase tracking-widest text-center"
              style={{ color: "#C7A24A" }}
              data-ocid="product.cart.link"
            >
              View Cart →
            </Link>
          </div>
        </div>

        {/* Related titles */}
        {related.length > 0 && (
          <section>
            <div
              style={{
                height: "1px",
                backgroundColor: "#2A2A2E",
                marginBottom: "2rem",
              }}
            />
            <h2 className="manga-section-heading mb-6">
              More in {manga.genre}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((m) => (
                <MangaCard key={m.id} manga={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
