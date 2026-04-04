import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight, Mail, Truck, Users } from "lucide-react";

const features = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Curated Selection",
    desc: "Every title in our catalog is handpicked by passionate manga fans. We only stock the best from every genre.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Shipping",
    desc: "Orders dispatched within 24 hours. Worldwide shipping available with tracking on every order.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community First",
    desc: "More than a store — we're a home for manga fans. Join our community, discover new series, share your love.",
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
            Born from a love of manga and a belief that great stories deserve
            great homes. We Started In 2026 as a small passion project and have
            grown into one of the most trusted manga destinations on the web.
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
            Celebrating Manga Culture Worldwide
          </h2>
          <p
            className="text-base leading-relaxed mb-4"
            style={{ color: "#A6A6AA" }}
          >
            Manga is more than entertainment — it's a cultural force that has
            shaped storytelling across the globe. From the epic battles of
            shonen to the quiet beauty of slice-of-life, every manga contains a
            universe worth exploring.
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#A6A6AA" }}>
            At Ink &amp; Imagination, our mission is to make that universe
            accessible to everyone. We curate, we celebrate, and we bring the
            best of manga directly to your doorstep — no matter where in the
            world you are.
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
            Have a question, a special request, or just want to say hello? We'd
            love to hear from you. Reach out and we'll get back to you as soon
            as possible.
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
            Ready to Start Your Collection?
          </h2>
          <p className="text-base mb-8" style={{ color: "#A6A6AA" }}>
            Browse hundreds of titles and find your next favourite series.
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
