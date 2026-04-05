import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Mail, Pen, Users } from "lucide-react";

const features = [
  {
    icon: <Pen className="w-6 h-6" />,
    title: "Original Creations",
    desc: "Every title in our catalog is an original story written, illustrated, and published by our own team. No reprints, no licensing — pure original manga.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Craft & Passion",
    desc: "We pour our hearts into every page. From world-building to character design, each manga is a labour of love crafted with intention and artistic commitment.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    desc: "Our readers inspire us every day. We build for you — listening to feedback, growing our universe, and creating stories that resonate.",
  },
];

const CONTACT_EMAIL = "ink.and.imagination.official2026@gmail.com";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#0B0B0C", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(161,43,43,0.12) 0%, rgba(11,11,12,1) 70%), linear-gradient(135deg, #0B0B0C 0%, #1a0a1a 50%, #0B0B0C 100%)",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#C7A24A" }}
          >
            Our Story
          </p>
          <h1
            className="font-display text-5xl sm:text-7xl mb-6"
            style={{ color: "#F2F2F2" }}
          >
            INK &amp; IMAGINATION
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#A6A6AA" }}
          >
            We Started In 2026 as a passionate team of manga creators with a
            single belief: that original stories, told with honesty and
            dedication, can move the world.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#C7A24A" }}
          >
            Our Mission
          </p>
          <h2
            className="font-display text-4xl mb-6"
            style={{ color: "#F2F2F2" }}
          >
            Creating Manga That Matters
          </h2>
          <p
            className="text-base leading-relaxed mb-4"
            style={{ color: "#A6A6AA" }}
          >
            We create original manga and bring it directly to you. Every title
            in our collection is crafted by our team — built from passion,
            published with purpose.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#A6A6AA" }}>
            At Ink &amp; Imagination, we don&apos;t curate others&apos; work —
            we make our own. Our artists and writers collaborate to build worlds
            you haven&apos;t seen before, with stories that stay with you long
            after the final page.
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#0E0E10",
          borderTop: "1px solid #2A2A2E",
          borderBottom: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="manga-section-heading text-center mb-12">
            Why Ink &amp; Imagination
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="p-8 rounded-xl flex flex-col gap-4"
                style={{
                  backgroundColor: "#141416",
                  border: "1px solid #2A2A2E",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "#1A0A0A",
                    color: "#A12B2B",
                    border: "1px solid #A12B2B",
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  className="font-bold text-base uppercase tracking-wide"
                  style={{ color: "#F2F2F2" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#A6A6AA" }}
                >
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#C7A24A" }}
          >
            Get in Touch
          </p>
          <h2
            className="font-display text-4xl mb-6"
            style={{ color: "#F2F2F2" }}
          >
            Contact Us
          </h2>
          <p
            className="text-base leading-relaxed mb-6"
            style={{ color: "#A6A6AA" }}
          >
            Have a question about our manga, a special request, or just want to
            say hello? We&apos;d love to hear from you. Reach out and we&apos;ll
            get back to you as soon as possible.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-ocid="about.contact.link"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl transition-colors duration-150"
            style={{
              backgroundColor: "#141416",
              border: "1px solid #2A2A2E",
              color: "#C7A24A",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "#C7A24A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "#2A2A2E";
            }}
          >
            <Mail className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium break-all">
              {CONTACT_EMAIL}
            </span>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #1a0a0a 0%, #0f0515 50%, #0B0B0C 100%)",
          borderTop: "1px solid #2A2A2E",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-display text-4xl mb-4"
            style={{ color: "#F2F2F2" }}
          >
            Ready to Read Our Work?
          </h2>
          <p className="text-base mb-8" style={{ color: "#A6A6AA" }}>
            Browse our original titles and find your next favourite series.
          </p>
          <Link
            to="/shop"
            className="manga-btn-primary inline-flex items-center gap-2"
            data-ocid="about.shop.primary_button"
          >
            Explore the Shop <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
