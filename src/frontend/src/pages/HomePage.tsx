import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { backend } from "../actorClient";
import type { MangaItem } from "../actorClient";
import MangaCard from "../components/MangaCard";
import SkeletonCard from "../components/SkeletonCard";

export default function HomePage() {
  const [allManga, setAllManga] = useState<MangaItem[]>([]);
  const [featured, setFeatured] = useState<MangaItem[]>([]);
  const [newArrivals, setNewArrivals] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        setFeatured(all.filter((m) => m.isFeatured).slice(0, 8));
        setNewArrivals(all.filter((m) => m.isNew).slice(0, 4));
      } catch (err) {
        console.error("Failed to load manga", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const skeletonKeys4 = ["sk1", "sk2", "sk3", "sk4"];
  const skeletonKeys8 = [
    "sk1",
    "sk2",
    "sk3",
    "sk4",
    "sk5",
    "sk6",
    "sk7",
    "sk8",
  ];

  return (
    <div style={{ backgroundColor: "#0B0B0C" }}>
      {/* Hero Section */}
      <section
        className="relative w-full min-h-[80vh] flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(161,43,43,0.18) 0%, rgba(26,10,26,0.75) 45%, rgba(11,11,12,1) 85%), linear-gradient(135deg, #0B0B0C 0%, #1a0a1a 50%, #0f0515 100%)",
        }}
      >
        {/* Decorative speed lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-conic-gradient(from 0deg at 75% 50%, rgba(199,162,74,0.04) 0deg 1.5deg, transparent 1.5deg 5deg)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center py-16">
            {/* Left: Hero text */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "#C7A24A" }}
                >
                  The Ultimate Manga Destination
                </p>
                <h1
                  className="font-display text-6xl sm:text-7xl lg:text-8xl leading-none"
                  style={{ color: "#F2F2F2" }}
                >
                  UNLEASH
                  <br />
                  THE POWER
                  <br />
                  <span style={{ color: "#A12B2B" }}>OF IMAGINATION</span>
                </h1>
              </div>
              <p
                className="text-base max-w-md leading-relaxed"
                style={{ color: "#A6A6AA" }}
              >
                Explore thousands of manga titles from the world&apos;s greatest
                artists. From epic shonen battles to thrilling adventures — find
                your next obsession.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link
                  to="/shop"
                  className="manga-btn-primary inline-flex items-center gap-2"
                >
                  Shop New Releases
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="manga-btn-outline inline-flex items-center gap-2"
                >
                  Browse All Manga
                </Link>
              </div>
            </div>

            {/* Right: Featured grid */}
            <div className="lg:col-span-2">
              <p
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#C7A24A" }}
              >
                Explore Featured Titles
              </p>
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  {skeletonKeys4.map((key) => (
                    <SkeletonCard key={key} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {featured.slice(0, 4).map((manga) => (
                    <MangaCard key={String(manga.id)} manga={manga} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="manga-section-heading">New Arrivals</h2>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors"
            style={{ color: "#C7A24A" }}
          >
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skeletonKeys4.map((key) => (
              <SkeletonCard key={key} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(newArrivals.length > 0 ? newArrivals : allManga.slice(0, 4)).map(
              (manga) => (
                <MangaCard key={String(manga.id)} manga={manga} />
              ),
            )}
          </div>
        )}
      </section>

      {/* Featured Titles */}
      <section className="py-16" style={{ backgroundColor: "#0E0E10" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="manga-section-heading">Featured Titles</h2>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-widest flex items-center gap-1"
              style={{ color: "#C7A24A" }}
            >
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {skeletonKeys8.map((key) => (
                <SkeletonCard key={key} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(featured.length > 0 ? featured : allManga)
                .slice(0, 8)
                .map((manga) => (
                  <MangaCard key={String(manga.id)} manga={manga} />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #1a0a0a 0%, #0f0515 50%, #0B0B0C 100%)",
          borderTop: "1px solid #2A2A2E",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-display text-4xl sm:text-5xl mb-4"
            style={{ color: "#F2F2F2" }}
          >
            YOUR STORY STARTS HERE
          </h2>
          <p
            className="text-base mb-8 max-w-xl mx-auto"
            style={{ color: "#A6A6AA" }}
          >
            Join thousands of manga fans who trust Ink and Imagination for their
            collection.
          </p>
          <Link
            to="/shop"
            className="manga-btn-primary inline-flex items-center gap-2"
          >
            Explore the Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
