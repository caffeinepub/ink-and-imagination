import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../actorClient";
import type { MangaItem } from "../actorClient";
import { backend } from "../actorClient";

const ADMIN_PASSWORD = "Ink20152026";

const GENRES = [
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
  "Adventure",
];

interface FormState {
  title: string;
  author: string;
  genre: string;
  price: string;
  coverImageUrl: string;
  synopsis: string;
  volumeCount: string;
  stock: string;
  isFeatured: boolean;
  isNew: boolean;
}

const emptyForm: FormState = {
  title: "",
  author: "",
  genre: "Action",
  price: "",
  coverImageUrl: "",
  synopsis: "",
  volumeCount: "1",
  stock: "10",
  isFeatured: false,
  isNew: false,
};

const spinnerCss = "@keyframes spin { to { transform: rotate(360deg); } }";

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#0B0B0C",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <style>{`
        ${spinnerCss}
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>
      <div
        className={shaking ? "shake" : ""}
        style={{
          backgroundColor: "#141416",
          border: "1px solid #2A2A2E",
          borderRadius: "1rem",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          textAlign: "center",
        }}
        data-ocid="admin.modal"
      >
        {/* Lock icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: "#1D1D20",
            border: "2px solid #C7A24A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="3"
              y="11"
              width="18"
              height="11"
              rx="2"
              stroke="#C7A24A"
              strokeWidth="2"
            />
            <path
              d="M7 11V7a5 5 0 0 1 10 0v4"
              stroke="#C7A24A"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16" r="1.5" fill="#C7A24A" />
          </svg>
        </div>

        <h1
          className="font-display"
          style={{
            color: "#F2F2F2",
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: "0.25rem",
          }}
        >
          Ink and Imagination
        </h1>
        <p
          style={{
            color: "#C7A24A",
            fontSize: "0.8rem",
            marginTop: "0.25rem",
            marginBottom: "1.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Admin Panel
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                color: "#A6A6AA",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.4rem",
              }}
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              style={{
                width: "100%",
                backgroundColor: "#1D1D20",
                border: `1px solid ${error ? "#A12B2B" : "#2A2A2E"}`,
                color: "#F2F2F2",
                borderRadius: "0.5rem",
                padding: "0.65rem 0.75rem",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  marginTop: "0.4rem",
                }}
              >
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-ocid="admin.submit_button"
            style={{
              width: "100%",
              backgroundColor: "#C7A24A",
              color: "#0B0B0C",
              border: "none",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              fontSize: "0.9rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              transition: "background-color 0.2s",
            }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [mangaList, setMangaList] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadManga = useCallback(async () => {
    setLoading(true);
    try {
      const all = await backend.getAllManga();
      setMangaList(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    async function init() {
      try {
        await backend.seedSampleData();
      } catch {
        // already seeded — ignore
      }
      await loadManga();
    }
    void init();
  }, [unlocked, loadManga]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  // ── Admin panel UI ───────────────────────────────────────────────────────────

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(manga: MangaItem) {
    setForm({
      title: manga.title,
      author: manga.author,
      genre: manga.genre,
      price: String(manga.price),
      coverImageUrl: manga.coverImage.getDirectURL(),
      synopsis: manga.synopsis,
      volumeCount: String(Number(manga.volumeCount)),
      stock: String(Number(manga.stock)),
      isFeatured: manga.isFeatured,
      isNew: manga.isNew,
    });
    setEditingId(manga.id);
    setShowForm(true);
    setFeedback("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: bigint) {
    if (!window.confirm("Delete this manga listing? This cannot be undone."))
      return;
    try {
      await backend.removeManga(id);
      await loadManga();
    } catch (err) {
      alert(`Failed to delete: ${String(err)}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      const mangaData: MangaItem = {
        id: editingId ?? BigInt(0),
        title: form.title,
        author: form.author,
        genre: form.genre,
        price: Number.parseFloat(form.price),
        coverImage: ExternalBlob.fromURL(
          form.coverImageUrl ||
            `https://placehold.co/300x450/141416/C7A24A?text=${encodeURIComponent(form.title)}`,
        ),
        synopsis: form.synopsis,
        volumeCount: BigInt(Number.parseInt(form.volumeCount) || 1),
        stock: BigInt(Number.parseInt(form.stock) || 0),
        isFeatured: form.isFeatured,
        isNew: form.isNew,
        createdAt: BigInt(Date.now()),
      };

      if (editingId !== null) {
        await backend.updateManga(mangaData);
        setFeedback("Manga updated successfully!");
      } else {
        await backend.addManga(mangaData);
        setFeedback("Manga added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadManga();
    } catch (err) {
      setFeedback(`Error: ${String(err)}`);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    backgroundColor: "#1D1D20",
    border: "1px solid #2A2A2E",
    color: "#F2F2F2",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.75rem",
    width: "100%",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div style={{ backgroundColor: "#0B0B0C", minHeight: "100vh" }}>
      <style>{spinnerCss}</style>
      <div
        className="py-10"
        style={{
          background: "linear-gradient(180deg, #0E0E10 0%, #0B0B0C 100%)",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl" style={{ color: "#F2F2F2" }}>
              Admin Panel
            </h1>
            <p className="text-sm mt-1" style={{ color: "#A6A6AA" }}>
              Content Management — Manga Listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openAdd}
              className="manga-btn-primary flex items-center gap-2"
              data-ocid="admin.primary_button"
            >
              <Plus className="w-4 h-4" /> Add Manga
            </button>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              data-ocid="admin.secondary_button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                backgroundColor: "transparent",
                border: "1px solid #2A2A2E",
                color: "#A6A6AA",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.9rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f87171";
                e.currentTarget.style.color = "#f87171";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#2A2A2E";
                e.currentTarget.style.color = "#A6A6AA";
              }}
            >
              Lock Panel
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {feedback && (
          <div
            className="mb-4 p-3 rounded-lg text-sm flex items-center gap-2"
            style={{
              backgroundColor: feedback.startsWith("Error")
                ? "#2A0A0A"
                : "#0A2A0A",
              border: `1px solid ${feedback.startsWith("Error") ? "#A12B2B" : "#2A6A2A"}`,
              color: feedback.startsWith("Error") ? "#f87171" : "#4ade80",
            }}
          >
            <Check className="w-4 h-4" />
            {feedback}
          </div>
        )}

        {showForm && (
          <div
            className="mb-8 p-6 rounded-xl"
            style={{ backgroundColor: "#141416", border: "1px solid #C7A24A" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="manga-section-heading text-lg">
                {editingId !== null ? "Edit Manga" : "Add New Manga"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                style={{ color: "#A6A6AA" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-title"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Title *
                  </label>
                  <input
                    id="field-title"
                    required
                    style={inputStyle}
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g. Attack on Titan"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-author"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Author *
                  </label>
                  <input
                    id="field-author"
                    required
                    style={inputStyle}
                    value={form.author}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, author: e.target.value }))
                    }
                    placeholder="e.g. Hajime Isayama"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-genre"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Genre *
                  </label>
                  <select
                    id="field-genre"
                    required
                    style={inputStyle}
                    value={form.genre}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, genre: e.target.value }))
                    }
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-price"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Price (USD) *
                  </label>
                  <input
                    id="field-price"
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    style={inputStyle}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="e.g. 14.99"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="field-cover"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Cover Image URL
                  </label>
                  <input
                    id="field-cover"
                    style={inputStyle}
                    value={form.coverImageUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
                    }
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label
                      htmlFor="field-volumes"
                      className="text-xs uppercase tracking-wide"
                      style={{ color: "#A6A6AA" }}
                    >
                      Volumes
                    </label>
                    <input
                      id="field-volumes"
                      type="number"
                      min="1"
                      style={inputStyle}
                      value={form.volumeCount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, volumeCount: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label
                      htmlFor="field-stock"
                      className="text-xs uppercase tracking-wide"
                      style={{ color: "#A6A6AA" }}
                    >
                      Stock
                    </label>
                    <input
                      id="field-stock"
                      type="number"
                      min="0"
                      style={inputStyle}
                      value={form.stock}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, stock: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label
                    htmlFor="field-synopsis"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Synopsis
                  </label>
                  <textarea
                    id="field-synopsis"
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={form.synopsis}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, synopsis: e.target.value }))
                    }
                    placeholder="Brief description of the manga..."
                  />
                </div>

                <div className="flex gap-6">
                  <label
                    htmlFor="field-featured"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      id="field-featured"
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isFeatured: e.target.checked }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: "#F2F2F2" }}>
                      Featured
                    </span>
                  </label>
                  <label
                    htmlFor="field-new"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      id="field-new"
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isNew: e.target.checked }))
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: "#F2F2F2" }}>
                      New Arrival
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="manga-btn-primary flex items-center gap-2"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update Manga"
                      : "Add Manga"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="manga-btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12" style={{ color: "#A6A6AA" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #2A2A2E",
                borderTopColor: "#C7A24A",
                borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
                margin: "0 auto 0.75rem",
              }}
            />
            Loading manga list...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2A2E" }}>
                  {[
                    "#",
                    "Cover",
                    "Title",
                    "Author",
                    "Genre",
                    "Price",
                    "Stock",
                    "Flags",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 text-xs uppercase tracking-wide"
                      style={{ color: "#A6A6AA" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mangaList.map((manga, idx) => (
                  <tr
                    key={String(manga.id)}
                    style={{ borderBottom: "1px solid #1A1A1D" }}
                  >
                    <td className="py-3 px-3" style={{ color: "#A6A6AA" }}>
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <img
                        src={manga.coverImage.getDirectURL()}
                        alt={manga.title}
                        className="w-8 h-12 object-cover rounded"
                        style={{ border: "1px solid #2A2A2E" }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/40x60/141416/C7A24A?text=?";
                        }}
                      />
                    </td>
                    <td className="py-3 px-3 max-w-[160px]">
                      <span
                        className="truncate block font-semibold"
                        style={{ color: "#F2F2F2" }}
                      >
                        {manga.title}
                      </span>
                    </td>
                    <td className="py-3 px-3" style={{ color: "#A6A6AA" }}>
                      {manga.author}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                        style={{ backgroundColor: "#A12B2B", color: "#F2F2F2" }}
                      >
                        {manga.genre}
                      </span>
                    </td>
                    <td
                      className="py-3 px-3 font-bold"
                      style={{ color: "#F2F2F2" }}
                    >
                      ${manga.price.toFixed(2)}
                    </td>
                    <td
                      className="py-3 px-3"
                      style={{
                        color: Number(manga.stock) > 0 ? "#4ade80" : "#f87171",
                      }}
                    >
                      {Number(manga.stock)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {manga.isFeatured && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{
                              backgroundColor: "#C7A24A",
                              color: "#0B0B0C",
                            }}
                          >
                            F
                          </span>
                        )}
                        {manga.isNew && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-bold"
                            style={{
                              backgroundColor: "#A12B2B",
                              color: "#F2F2F2",
                            }}
                          >
                            N
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(manga)}
                          className="p-1.5 rounded transition-colors"
                          style={{
                            color: "#C7A24A",
                            border: "1px solid #C7A24A",
                          }}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(manga.id)}
                          className="p-1.5 rounded transition-colors"
                          style={{
                            color: "#f87171",
                            border: "1px solid #f87171",
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {mangaList.length === 0 && (
              <div className="text-center py-12" style={{ color: "#A6A6AA" }}>
                No manga listings found. Add your first one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
