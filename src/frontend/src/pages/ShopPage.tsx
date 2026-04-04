import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { backend } from "../actorClient";
import type { MangaItem } from "../actorClient";
import MangaCard from "../components/MangaCard";
import SkeletonCard from "../components/SkeletonCard";

const GENRES = [
  "All",
  "Action",
  "Fantasy",
  "Horror",
  "Sci-Fi",
  "Thriller",
  "Slice of Life",
  "Shounen",
  "Seinen",
  "Dark Fantasy",
  "Historical",
  "Comedy",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_az", label: "Title A-Z" },
];

export default function ShopPage() {
  const [allManga, setAllManga] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let all = await backend.getAllManga();
        if (all.length === 0) {
          await backend.seedSampleData();
          all = await backend.getAllManga();
        }
        setAllManga(all);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = allManga.filter((m) => {
      const genreMatch = selectedGenre === "All" || m.genre === selectedGenre;
      const priceMatch = m.price >= priceMin && m.price <= priceMax;
      return genreMatch && priceMatch;
    });

    switch (sortBy) {
      case "newest":
        result = [...result].sort((a, b) => Number(b.createdAt - a.createdAt));
        break;
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "title_az":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result = [...result].sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0),
        );
    }

    return result;
  }, [allManga, selectedGenre, priceMin, priceMax, sortBy]);

  const FilterSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Genre */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#F2F2F2" }}
        >
          Genre
        </h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setSelectedGenre(genre)}
              className="text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                backgroundColor:
                  selectedGenre === genre ? "#A12B2B" : "#1A1A1D",
                border: `1px solid ${selectedGenre === genre ? "#A12B2B" : "#2A2A2E"}`,
                color: selectedGenre === genre ? "#F2F2F2" : "#A6A6AA",
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#F2F2F2" }}
        >
          Price Range
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="price-min"
              className="text-xs"
              style={{ color: "#A6A6AA" }}
            >
              Min
            </label>
            <input
              id="price-min"
              type="number"
              min={0}
              max={priceMax}
              value={priceMin}
              onChange={(e) => setPriceMin(Number(e.target.value))}
              className="w-20 px-2 py-1.5 rounded text-sm outline-none"
              style={{
                backgroundColor: "#1D1D20",
                border: "1px solid #2A2A2E",
                color: "#F2F2F2",
              }}
            />
          </div>
          <span className="mt-4" style={{ color: "#A6A6AA" }}>
            —
          </span>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="price-max"
              className="text-xs"
              style={{ color: "#A6A6AA" }}
            >
              Max
            </label>
            <input
              id="price-max"
              type="number"
              min={priceMin}
              max={100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-20 px-2 py-1.5 rounded text-sm outline-none"
              style={{
                backgroundColor: "#1D1D20",
                border: "1px solid #2A2A2E",
                color: "#F2F2F2",
              }}
            />
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#F2F2F2" }}
        >
          Sort By
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded text-sm outline-none"
          style={{
            backgroundColor: "#1D1D20",
            border: "1px solid #2A2A2E",
            color: "#F2F2F2",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      {(selectedGenre !== "All" ||
        priceMin !== 0 ||
        priceMax !== 50 ||
        sortBy !== "featured") && (
        <button
          type="button"
          onClick={() => {
            setSelectedGenre("All");
            setPriceMin(0);
            setPriceMax(50);
            setSortBy("featured");
          }}
          className="text-xs flex items-center gap-1 mt-1"
          style={{ color: "#A6A6AA" }}
        >
          <X className="w-3 h-3" /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#0B0B0C", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="py-12"
        style={{
          background: "linear-gradient(180deg, #0E0E10 0%, #0B0B0C 100%)",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-5xl" style={{ color: "#F2F2F2" }}>
            Manga Shop
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#A6A6AA" }}>
            Discover your next favourite series
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <span className="text-sm" style={{ color: "#A6A6AA" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-xs font-bold uppercase px-3 py-2 rounded"
            style={{ border: "1px solid #2A2A2E", color: "#F2F2F2" }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Mobile filters panel */}
        {showFilters && (
          <div
            className="lg:hidden mb-6 p-4 rounded-xl"
            style={{ backgroundColor: "#141416", border: "1px solid #2A2A2E" }}
          >
            <FilterSidebar />
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-24">
            <div
              className="p-5 rounded-xl"
              style={{
                backgroundColor: "#141416",
                border: "1px solid #2A2A2E",
              }}
            >
              <FilterSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-sm" style={{ color: "#A6A6AA" }}>
                Showing{" "}
                <strong style={{ color: "#F2F2F2" }}>{filtered.length}</strong>{" "}
                result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <p
                  className="font-display text-2xl"
                  style={{ color: "#A6A6AA" }}
                >
                  No Results Found
                </p>
                <p className="text-sm" style={{ color: "#A6A6AA" }}>
                  Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((manga) => (
                  <MangaCard key={String(manga.id)} manga={manga} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
