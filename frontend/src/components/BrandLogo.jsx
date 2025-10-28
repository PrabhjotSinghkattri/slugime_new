export default function BrandLogo({ size = 28 }) {
  const s = Number(size);
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" role="img" aria-label="Sluglime logo">
      <path d="M6 44c8-10 20-2 29-8 9-6 8-18-1-18-12 0-10 16 7 16 11 0 17-6 17-14"
            fill="none" stroke="var(--cyan)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="52" cy="12" r="6" fill="var(--contrast)" />
    </svg>
  );
}