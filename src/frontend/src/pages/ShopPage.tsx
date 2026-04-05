import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import MangaCard from "../components/MangaCard";
import SkeletonCard from "../components/SkeletonCard";
import { useListAllManga } from "../hooks/useQueries";

const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Fantasy",
  "Horror",
  "Mystery",
  "Sci-Fi",
  "Seinen",
  "Shojo",
  "Shonen",
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "title_az", label: "Title A–Z" },
  { value: "newest", label: "Newest" },
];

export default function ShopPage() {
  const { data: allManga = [], isLoading } = useListAllManga();
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = allManga.filter((m) => {
      const genreMatch = selectedGenre === "All" || m.genre === selectedGenre;
      const searchMatch =
        search === "" ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.author.toLowerCase().includes(search.toLowerCase());
      return genreMatch && searchMatch;
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
        break;
    }

    return result;
  }, [allManga, selectedGenre, search, sortBy]);

  const hasActiveFilters =
    selectedGenre !== "All" || search !== "" || sortBy !== "default";

  function clearFilters() {
    setSelectedGenre("All");
    setSearch("");
    setSortBy("default");
  }

  const FilterSidebar = () => (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#F2F2F2" }}
        >
          Search
        </h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Title or author..."
          data-ocid="shop.search_input"
          className="w-full px-3 py-2 rounded text-sm outline-none"
          style={{
            backgroundColor: "#1D1D20",
            border: "1px solid #2A2A2E",
            color: "#F2F2F2",
          }}
        />
      </div>

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
              data-ocid="shop.genre.tab"
              className="text-xs font-bold uppercase px-3 py-1.5 rounded-full transition-all duration-150"
              style={{
                backgroundColor:
                  selectedGenre === genre ? "#A12B2B" : "#1A1A1D",
                border: `1px solid ${
                  selectedGenre === genre ? "#A12B2B" : "#2A2A2E"
                }`,
                color: selectedGenre === genre ? "#F2F2F2" : "#A6A6AA",
              }}
            >
              {genre}
            </button>
          ))}
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
          data-ocid="shop.sort.select"
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
      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          data-ocid="shop.filters.button"
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
            Original manga created and published by our team
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
            data-ocid="shop.filters.toggle"
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

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-24 gap-4"
                data-ocid="shop.manga.empty_state"
              >
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
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                data-ocid="shop.manga.list"
              >
                {filtered.map((manga) => (
                  <MangaCard key={manga.id} manga={manga} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
