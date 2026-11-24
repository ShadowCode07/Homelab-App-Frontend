const VARIANTS = {
  Online: "pill--online",
  Offline: "pill--offline",
  Unknown: "pill--unknown",
};

export default function StatusPill({ status, large = false }) {
  const variant = VARIANTS[status] ?? VARIANTS.Unknown;
  return (
    <span className={`pill ${variant}${large ? " pill--lg" : ""}`}>
      <span className="dot" />
      {status ?? "Unknown"}
    </span>
  );
}
