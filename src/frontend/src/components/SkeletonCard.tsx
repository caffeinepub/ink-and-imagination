export default function SkeletonCard() {
  return (
    <div
      className="flex flex-col"
      style={{
        backgroundColor: "#141416",
        border: "1px solid #2A2A2E",
        borderRadius: "0.75rem",
        overflow: "hidden",
      }}
    >
      <div
        className="w-full"
        style={{
          aspectRatio: "3/4",
          background:
            "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div className="p-3 flex flex-col gap-2">
        <div
          className="h-3 rounded"
          style={{
            width: "40%",
            background:
              "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
        <div
          className="h-4 rounded"
          style={{
            width: "80%",
            background:
              "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
        <div
          className="h-3 rounded"
          style={{
            width: "60%",
            background:
              "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
        <div
          className="mt-2 h-8 rounded"
          style={{
            background:
              "linear-gradient(90deg, #1A1A1D 25%, #222226 50%, #1A1A1D 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </div>
    </div>
  );
}
