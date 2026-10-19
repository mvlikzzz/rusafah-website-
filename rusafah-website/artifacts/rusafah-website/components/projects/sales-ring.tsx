import { formatPercent } from "@/lib/format";

/** The small circular "نسبة البيع 10%" gauge over the project image. */
export function SalesRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <svg
      viewBox="0 0 64 64"
      className="size-20"
      role="img"
      aria-label={`نسبة البيع ${formatPercent(clamped)}`}
    >
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="rgb(238 227 211 / 0.25)"
        stroke="rgb(238 227 211 / 0.6)"
        strokeWidth="2"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="#f4eee6"
        strokeWidth="3"
        strokeDasharray={`${(clamped / 100) * c} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text x="32" y="36" textAnchor="middle" className="font-latin" fontSize="14" fill="#f4eee6">
        {formatPercent(clamped)}
      </text>
    </svg>
  );
}
