export default function CornerFlourish({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M2 2 L2 22 M2 2 L22 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M2 2 Q 2 16 16 16 Q 30 16 30 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      <circle cx="2" cy="2" r="2.4" fill="currentColor" />
    </svg>
  );
}
