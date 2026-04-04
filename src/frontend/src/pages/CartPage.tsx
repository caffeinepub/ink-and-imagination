import { Link } from "@tanstack/react-router";
import { ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4"
        style={{ backgroundColor: "#0B0B0C" }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#141416", border: "2px solid #2A2A2E" }}
        >
          <ShoppingBag className="w-10 h-10" style={{ color: "#A6A6AA" }} />
        </div>
        <h2 className="font-display text-3xl" style={{ color: "#F2F2F2" }}>
          Your Cart is Empty
        </h2>
        <p
          className="text-sm text-center max-w-sm"
          style={{ color: "#A6A6AA" }}
        >
          Looks like you haven&apos;t added any manga yet. Start exploring the
          shop to find your next obsession.
        </p>
        <Link
          to="/shop"
          className="manga-btn-primary inline-flex items-center gap-2"
        >
          Browse Manga <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0B0B0C", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="py-10"
        style={{
          background: "linear-gradient(180deg, #0E0E10 0%, #0B0B0C 100%)",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl" style={{ color: "#F2F2F2" }}>
            Your Cart
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#A6A6AA" }}>
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cartItems.map(({ manga, quantity }) => (
              <div
                key={String(manga.id)}
                className="flex gap-4 p-4 rounded-xl"
                style={{
                  backgroundColor: "#141416",
                  border: "1px solid #2A2A2E",
                }}
              >
                {/* Thumbnail */}
                <Link
                  to="/product/$id"
                  params={{ id: String(manga.id) }}
                  className="shrink-0"
                >
                  <img
                    src={manga.coverImage.getDirectURL()}
                    alt={manga.title}
                    className="w-16 h-24 object-cover rounded-lg"
                    style={{ border: "1px solid #C7A24A" }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/64x96/141416/C7A24A?text=?";
                    }}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link to="/product/$id" params={{ id: String(manga.id) }}>
                      <h3
                        className="font-bold text-sm hover:underline"
                        style={{ color: "#F2F2F2" }}
                      >
                        {manga.title}
                      </h3>
                    </Link>
                    <p className="text-xs mt-0.5" style={{ color: "#A6A6AA" }}>
                      {manga.author}
                    </p>
                    <span
                      className="text-xs font-bold uppercase px-2 py-0.5 rounded mt-1 inline-block"
                      style={{ backgroundColor: "#A12B2B", color: "#F2F2F2" }}
                    >
                      {manga.genre}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{ border: "1px solid #2A2A2E" }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(manga.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm"
                        style={{ backgroundColor: "#1A1A1D", color: "#F2F2F2" }}
                      >
                        −
                      </button>
                      <span
                        className="w-8 text-center text-sm font-bold"
                        style={{ color: "#F2F2F2" }}
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(manga.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-sm"
                        style={{ backgroundColor: "#1A1A1D", color: "#F2F2F6" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span
                      className="font-bold text-sm"
                      style={{ color: "#F2F2F2" }}
                    >
                      ${(manga.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeFromCart(manga.id)}
                  className="self-start p-1.5 rounded transition-colors"
                  style={{ color: "#A6A6AA" }}
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Clear cart */}
            <button
              type="button"
              onClick={clearCart}
              className="self-start text-xs uppercase tracking-widest mt-2"
              style={{ color: "#A6A6AA" }}
            >
              Clear Cart
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div
              className="p-6 rounded-xl sticky top-24"
              style={{
                backgroundColor: "#141416",
                border: "1px solid #C7A24A",
              }}
            >
              <h2 className="manga-section-heading text-lg mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#A6A6AA" }}>Subtotal</span>
                  <span style={{ color: "#F2F2F2" }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#A6A6AA" }}>Shipping</span>
                  <span style={{ color: "#4ade80" }}>Free</span>
                </div>
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#2A2A2E",
                    margin: "0.5rem 0",
                  }}
                />
                <div className="flex justify-between font-bold">
                  <span style={{ color: "#F2F2F2" }}>Total</span>
                  <span className="text-xl" style={{ color: "#C7A24A" }}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="manga-btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ChevronRight className="w-4 h-4" />
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs uppercase tracking-widest mt-4"
                style={{ color: "#A6A6AA" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
