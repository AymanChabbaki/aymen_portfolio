// Fixed ambient layer: slow-drifting gradient mesh blobs + film grain.
// Sits behind the whole page, replaces the old "DEV" watermark.
const NOISE_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const AmbientBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* Gradient mesh blobs */}
      <div
        className="absolute rounded-full"
        style={{
          width: "55vw",
          height: "55vw",
          top: "-20vw",
          right: "-15vw",
          background:
            "radial-gradient(circle, rgba(112, 0, 255, 0.09), transparent 65%)",
          animation: "ambient-drift-1 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "50vw",
          height: "50vw",
          bottom: "-18vw",
          left: "-12vw",
          background:
            "radial-gradient(circle, rgba(139, 49, 255, 0.07), transparent 65%)",
          animation: "ambient-drift-2 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: "35vw",
          height: "35vw",
          top: "40%",
          left: "30%",
          background:
            "radial-gradient(circle, rgba(159, 85, 255, 0.05), transparent 60%)",
          animation: "ambient-drift-1 38s ease-in-out infinite reverse",
        }}
      />
      {/* Film grain */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE_SVG,
          backgroundRepeat: "repeat",
          opacity: 0.04,
        }}
      />
    </div>
  );
};

export default AmbientBackground;
