/* iPhone 16 Pro Max — front (screen) and back (titanium + cameras) */

export function PhoneFront({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 800"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="iPhone 16 Pro Max vista frontal"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pf-titanium" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="50%" stopColor="#71717A" />
          <stop offset="100%" stopColor="#3F3F46" />
        </linearGradient>
        <linearGradient id="pf-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="40%" stopColor="#312E81" />
          <stop offset="80%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        <radialGradient id="pf-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="765" rx="140" ry="14" fill="url(#pf-shadow)" />

      {/* Titanium frame */}
      <rect x="40" y="30" width="320" height="720" rx="62" fill="url(#pf-titanium)" />
      {/* Inner glass */}
      <rect x="48" y="38" width="304" height="704" rx="56" fill="#08080A" />
      {/* Screen */}
      <rect x="56" y="46" width="288" height="688" rx="50" fill="url(#pf-screen)" />

      {/* Wallpaper sheen */}
      <ellipse cx="200" cy="200" rx="220" ry="160" fill="rgba(255,255,255,0.12)" />

      {/* Dynamic Island */}
      <rect x="148" y="64" width="104" height="32" rx="16" fill="#0A0A0A" />
      <circle cx="170" cy="80" r="3" fill="#1F1F23" />
      <circle cx="234" cy="80" r="4" fill="#1F1F23" />
      <circle cx="234" cy="80" r="1.5" fill="#3F3F46" />

      {/* Time + status (subtle) */}
      <text x="78" y="124" fill="rgba(255,255,255,0.85)" fontSize="20" fontWeight="700" fontFamily="ui-sans-serif, system-ui">
        9:41
      </text>
      <g fill="rgba(255,255,255,0.85)">
        <rect x="284" y="113" width="14" height="11" rx="1.5" />
        <rect x="304" y="113" width="22" height="11" rx="2" />
      </g>

      {/* App grid (decorative) */}
      <g>
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => {
            const x = 80 + col * 60
            const y = 220 + row * 90
            const hue = (row * 4 + col) * 35
            return (
              <rect
                key={`app-${row}-${col}`}
                x={x}
                y={y}
                width={48}
                height={48}
                rx={12}
                fill={`hsl(${hue}, 70%, 60%)`}
                opacity="0.92"
              />
            )
          }),
        )}
      </g>

      {/* Dock */}
      <rect x="72" y="630" width="256" height="78" rx="28" fill="rgba(255,255,255,0.18)" />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect
          key={`dock-${i}`}
          x={92 + i * 56}
          y={645}
          width={48}
          height={48}
          rx={12}
          fill={`hsl(${i * 90 + 200}, 70%, 60%)`}
          opacity="0.92"
        />
      ))}

      {/* Home indicator */}
      <rect x="150" y="722" width="100" height="4" rx="2" fill="rgba(255,255,255,0.85)" />
    </svg>
  )
}

export function PhoneBack({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 800"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="iPhone 16 Pro Max vista posterior"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="pb-titanium" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52525B" />
          <stop offset="50%" stopColor="#71717A" />
          <stop offset="100%" stopColor="#3F3F46" />
        </linearGradient>
        <linearGradient id="pb-camera-bump" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#27272A" />
        </linearGradient>
        <radialGradient id="pb-lens-inner" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#71717A" />
          <stop offset="60%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#08080A" />
        </radialGradient>
        <radialGradient id="pb-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="200" cy="765" rx="140" ry="14" fill="url(#pb-shadow)" />

      {/* Frame */}
      <rect x="40" y="30" width="320" height="720" rx="62" fill="#3F3F46" />
      {/* Back panel (titanium) */}
      <rect x="48" y="38" width="304" height="704" rx="56" fill="url(#pb-titanium)" />

      {/* Subtle sheen */}
      <ellipse cx="180" cy="280" rx="220" ry="120" fill="rgba(255,255,255,0.06)" />

      {/* Camera bump */}
      <rect x="64" y="64" width="180" height="180" rx="34" fill="url(#pb-camera-bump)" stroke="#52525B" strokeWidth="1" />

      {/* Lens 1 — Wide (top-left) */}
      <g transform="translate(112, 110)">
        <circle r="34" fill="#0A0A0A" />
        <circle r="28" fill="url(#pb-lens-inner)" />
        <circle r="16" fill="#08080A" />
        <circle r="7" fill="#1F1F23" />
        <circle r="3" cx="-3" cy="-3" fill="rgba(255,255,255,0.35)" />
      </g>
      {/* Lens 2 — Ultra Wide (top-right) */}
      <g transform="translate(196, 110)">
        <circle r="34" fill="#0A0A0A" />
        <circle r="28" fill="url(#pb-lens-inner)" />
        <circle r="16" fill="#08080A" />
        <circle r="7" fill="#1F1F23" />
        <circle r="3" cx="-3" cy="-3" fill="rgba(255,255,255,0.35)" />
      </g>
      {/* Lens 3 — Telephoto (bottom) */}
      <g transform="translate(154, 192)">
        <circle r="34" fill="#0A0A0A" />
        <circle r="28" fill="url(#pb-lens-inner)" />
        <circle r="16" fill="#08080A" />
        <circle r="7" fill="#1F1F23" />
        <circle r="3" cx="-3" cy="-3" fill="rgba(255,255,255,0.35)" />
      </g>

      {/* LiDAR sensor */}
      <g transform="translate(212, 192)">
        <circle r="11" fill="#08080A" />
        <circle r="6" fill="#1A1A22" />
      </g>
      {/* Flash */}
      <g transform="translate(212, 110)">
        <circle r="11" fill="#FEF3C7" />
        <circle r="7" fill="#FDE68A" />
      </g>

      {/* Apple-ish logo placeholder (simple circle, no real logo) */}
      <circle cx="200" cy="420" r="32" fill="rgba(0,0,0,0.18)" />
      <circle cx="200" cy="420" r="22" fill="rgba(255,255,255,0.08)" />

      {/* Bottom subtle markings */}
      <text x="200" y="700" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="3">
        DESIGNED · ASSEMBLED
      </text>
    </svg>
  )
}
