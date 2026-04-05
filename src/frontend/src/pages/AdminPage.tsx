import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Manga } from "../backend";
import {
  useAddManga,
  useClearAllManga,
  useDeleteManga,
  useListAllManga,
  useUpdateManga,
} from "../hooks/useQueries";

const ADMIN_PASSWORD = "Ink20152026";

const GENRES = [
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

interface FormState {
  title: string;
  author: string;
  genre: string;
  price: string;
  coverImage: string;
  description: string;
  stock: string;
}

const emptyForm: FormState = {
  title: "",
  author: "",
  genre: "Action",
  price: "",
  coverImage: "",
  description: "",
  stock: "10",
};

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
              data-ocid="admin.password.input"
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
                data-ocid="admin.password.error_state"
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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const clearedRef = useRef(false);

  const { data: mangaList = [], isLoading } = useListAllManga();
  const addManga = useAddManga();
  const updateManga = useUpdateManga();
  const deleteManga = useDeleteManga();
  const clearAllManga = useClearAllManga();

  // Auto-clear any leftover manga on first unlock
  useEffect(() => {
    if (unlocked && !isLoading && mangaList.length > 0 && !clearedRef.current) {
      clearedRef.current = true;
      clearAllManga.mutate();
    }
  }, [unlocked, isLoading, mangaList.length, clearAllManga]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEdit(manga: Manga) {
    setForm({
      title: manga.title,
      author: manga.author,
      genre: manga.genre,
      price: String(manga.price),
      coverImage: manga.coverImage,
      description: manga.description,
      stock: String(Number(manga.stock)),
    });
    setEditingId(manga.id);
    setShowForm(true);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this manga listing? This cannot be undone."))
      return;
    try {
      await deleteManga.mutateAsync(id);
      setFeedback({ type: "success", msg: "Manga deleted successfully." });
    } catch (err) {
      setFeedback({ type: "error", msg: `Failed to delete: ${String(err)}` });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const mangaData: Manga = {
      id: editingId ?? crypto.randomUUID(),
      title: form.title,
      author: form.author,
      genre: form.genre,
      price: Number.parseFloat(form.price),
      coverImage: form.coverImage,
      description: form.description,
      stock: BigInt(Number.parseInt(form.stock) || 0),
      createdAt: BigInt(Date.now()),
    };

    try {
      if (editingId !== null) {
        await updateManga.mutateAsync(mangaData);
        setFeedback({ type: "success", msg: "Manga updated successfully!" });
      } else {
        await addManga.mutateAsync(mangaData);
        setFeedback({ type: "success", msg: "Manga added successfully!" });
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setFeedback({ type: "error", msg: `Error: ${String(err)}` });
    }
  }

  const isSaving = addManga.isPending || updateManga.isPending;

  const inputStyle: React.CSSProperties = {
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
              data-ocid="admin.add.primary_button"
              className="manga-btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Manga
            </button>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              data-ocid="admin.lock.secondary_button"
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
            data-ocid={
              feedback.type === "success"
                ? "admin.success_state"
                : "admin.error_state"
            }
            style={{
              backgroundColor:
                feedback.type === "error" ? "#2A0A0A" : "#0A2A0A",
              border: `1px solid ${
                feedback.type === "error" ? "#A12B2B" : "#2A6A2A"
              }`,
              color: feedback.type === "error" ? "#f87171" : "#4ade80",
            }}
          >
            <Check className="w-4 h-4" />
            {feedback.msg}
          </div>
        )}

        {showForm && (
          <div
            className="mb-8 p-6 rounded-xl"
            data-ocid="admin.form.panel"
            style={{
              backgroundColor: "#141416",
              border: "1px solid #C7A24A",
            }}
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
                data-ocid="admin.form.close_button"
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
                    data-ocid="admin.title.input"
                    placeholder="e.g. Dragon Ascent"
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
                    data-ocid="admin.author.input"
                    placeholder="e.g. The I&I Team"
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
                    data-ocid="admin.genre.select"
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
                    Price (₹) *
                  </label>
                  <input
                    id="field-price"
                    required
                    type="number"
                    min="1"
                    step="1"
                    style={inputStyle}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    data-ocid="admin.price.input"
                    placeholder="e.g. 499"
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
                    value={form.coverImage}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, coverImage: e.target.value }))
                    }
                    data-ocid="admin.cover.input"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex flex-col gap-1">
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
                    data-ocid="admin.stock.input"
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                  <label
                    htmlFor="field-description"
                    className="text-xs uppercase tracking-wide"
                    style={{ color: "#A6A6AA" }}
                  >
                    Description
                  </label>
                  <textarea
                    id="field-description"
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    data-ocid="admin.description.textarea"
                    placeholder="Brief description of the manga..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  data-ocid="admin.form.submit_button"
                  className="manga-btn-primary flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving
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
                  data-ocid="admin.form.cancel_button"
                  className="manga-btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading || clearAllManga.isPending ? (
          <div
            className="text-center py-12"
            data-ocid="admin.loading_state"
            style={{ color: "#A6A6AA" }}
          >
            <Loader2
              className="w-8 h-8 animate-spin mx-auto mb-3"
              style={{ color: "#C7A24A" }}
            />
            Loading manga list...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="admin.manga.table">
              <thead>
                <tr style={{ borderBottom: "1px solid #2A2A2E" }}>
                  {[
                    "#",
                    "Cover",
                    "Title",
                    "Author",
                    "Genre",
                    "Price (₹)",
                    "Stock",
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
                    key={manga.id}
                    data-ocid={`admin.manga.row.${idx + 1}`}
                    style={{ borderBottom: "1px solid #1A1A1D" }}
                  >
                    <td className="py-3 px-3" style={{ color: "#A6A6AA" }}>
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3">
                      <img
                        src={
                          manga.coverImage ||
                          `https://placehold.co/40x60/141416/C7A24A?text=${encodeURIComponent(manga.title)}`
                        }
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
                        style={{
                          backgroundColor: "#A12B2B",
                          color: "#F2F2F2",
                        }}
                      >
                        {manga.genre}
                      </span>
                    </td>
                    <td
                      className="py-3 px-3 font-bold"
                      style={{ color: "#F2F2F2" }}
                    >
                      ₹{manga.price.toFixed(2)}
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
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(manga)}
                          data-ocid={`admin.manga.edit_button.${idx + 1}`}
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
                          data-ocid={`admin.manga.delete_button.${idx + 1}`}
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
              <div
                className="text-center py-12"
                data-ocid="admin.manga.empty_state"
                style={{ color: "#A6A6AA" }}
              >
                No manga listings found. Add your first one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
