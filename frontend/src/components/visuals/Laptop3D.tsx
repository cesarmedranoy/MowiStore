/* Open gaming laptop (3/4 angle) — the front face of the 3D laptop */
export function LaptopFront({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Laptop gamer abierta"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="lf-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0E0E12" />
          <stop offset="50%" stopColor="#1A1A22" />
          <stop offset="100%" stopColor="#08080A" />
        </linearGradient>
        <linearGradient id="lf-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(250,204,21,0.32)" />
          <stop offset="60%" stopColor="rgba(250,204,21,0)" />
        </linearGradient>
        <linearGradient id="lf-metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <linearGradient id="lf-deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F1F23" />
          <stop offset="100%" stopColor="#0F0F12" />
        </linearGradient>
        <linearGradient id="lf-rgb" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="30%" stopColor="#F472B6" />
          <stop offset="60%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="lf-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="400" cy="465" rx="280" ry="22" fill="url(#lf-shadow)" />

      <path d="M138 30 Q138 18 150 18 L650 18 Q662 18 662 30 L662 320 L138 320 Z" fill="url(#lf-metal)" stroke="#2A2A2E" strokeWidth="1.5" />

      <path d="M138 30 L170 30 L150 60 L138 60 Z" fill="#FACC15" opacity="0.55" />
      <path d="M662 30 L630 30 L650 60 L662 60 Z" fill="#FACC15" opacity="0.25" />

      <rect x="158" y="48" width="484" height="262" rx="6" fill="#08080A" stroke="#3A3A3F" strokeWidth="0.5" />
      <rect x="166" y="56" width="468" height="246" rx="3" fill="url(#lf-screen)" />
      <rect x="166" y="56" width="468" height="124" rx="3" fill="url(#lf-glow)" opacity="0.5" />

      <path d="M170 80 L260 80 L240 110 L170 110 Z" fill="rgba(250,204,21,0.18)" />
      <path d="M630 280 L540 280 L560 250 L630 250 Z" fill="rgba(250,204,21,0.10)" />
      <line x1="170" y1="200" x2="630" y2="200" stroke="rgba(250,204,21,0.18)" strokeWidth="0.5" />
      <line x1="170" y1="210" x2="450" y2="210" stroke="rgba(250,204,21,0.12)" strokeWidth="0.5" />

      <circle cx="400" cy="40" r="2" fill="#2A2A2E" />
      <circle cx="400" cy="40" r="0.8" fill="#FACC15" opacity="0.7" />

      <path d="M138 320 L662 320 L740 410 L60 410 Z" fill="url(#lf-deck)" stroke="#2A2A2E" strokeWidth="1.5" />
      <path d="M60 410 L740 410 L730 422 L70 422 Z" fill="#0A0A0A" />
      <rect x="80" y="412" width="640" height="3" fill="url(#lf-rgb)" rx="1.5" className="rgb-strip-pulse" />

      <rect x="340" y="355" width="120" height="22" rx="3" fill="#0E0E12" stroke="#2A2A2E" strokeWidth="0.6" />

      <g fill="#161618" stroke="#2A2A2E" strokeWidth="0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`r1-${i}`} x={170 + i * 40} y={328} width={32} height={14} rx={2.5} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`r2-${i}`} x={166 + i * 40.5} y={346} width={32} height={14} rx={2.5} />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <rect key={`r3-${i}`} x={172 + i * 42} y={364} width={34} height={14} rx={2.5} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`r4l-${i}`} x={158 + i * 32} y={382} width={26} height={14} rx={2.5} />
        ))}
        <rect x={262} y={382} width={148} height={14} rx={2.5} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={`r4r-${i}`} x={418 + i * 30} y={382} width={24} height={14} rx={2.5} />
        ))}
      </g>

      <g>
        <rect x="246" y="346" width="32" height="14" rx="2.5" fill="rgba(250,204,21,0.22)" stroke="rgba(250,204,21,0.6)" strokeWidth="0.8" />
        <rect x="206" y="364" width="34" height="14" rx="2.5" fill="rgba(250,204,21,0.22)" stroke="rgba(250,204,21,0.6)" strokeWidth="0.8" />
        <rect x="248" y="364" width="34" height="14" rx="2.5" fill="rgba(250,204,21,0.22)" stroke="rgba(250,204,21,0.6)" strokeWidth="0.8" />
        <rect x="290" y="364" width="34" height="14" rx="2.5" fill="rgba(250,204,21,0.22)" stroke="rgba(250,204,21,0.6)" strokeWidth="0.8" />
      </g>

      <g fill="#0A0A0A" opacity="0.7">
        <rect x="80" y="402" width="40" height="4" rx="1" />
        <rect x="680" y="402" width="40" height="4" rx="1" />
      </g>
    </svg>
  )
}

/* Closed laptop seen from above — the back face of the 3D laptop */
export function LaptopBack({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Laptop gamer vista posterior"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="lb-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="55%" stopColor="#18181B" />
          <stop offset="100%" stopColor="#0E0E12" />
        </linearGradient>
        <linearGradient id="lb-lid-light" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(250,204,21,0)" />
          <stop offset="50%" stopColor="rgba(250,204,21,0.18)" />
          <stop offset="100%" stopColor="rgba(250,204,21,0)" />
        </linearGradient>
        <radialGradient id="lb-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="400" cy="445" rx="280" ry="22" fill="url(#lb-shadow)" />

      {/* Closed lid */}
      <path d="M80 110 Q80 95 95 95 L705 95 Q720 95 720 110 L720 420 Q720 432 710 432 L90 432 Q80 432 80 420 Z" fill="url(#lb-lid)" stroke="#3A3A3F" strokeWidth="1.5" />

      {/* Top sheen */}
      <rect x="80" y="100" width="640" height="40" fill="url(#lb-lid-light)" opacity="0.5" rx="6" />

      {/* ROG-style angular cuts */}
      <path d="M80 95 L160 95 L120 160 L80 160 Z" fill="#FACC15" opacity="0.65" />
      <path d="M720 95 L640 95 L680 160 L720 160 Z" fill="#FACC15" opacity="0.35" />

      {/* Diagonal accent lines */}
      <g stroke="#FACC15" strokeWidth="1" opacity="0.45">
        <line x1="200" y1="180" x2="280" y2="180" />
        <line x1="520" y1="180" x2="600" y2="180" />
      </g>
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.8">
        <line x1="120" y1="240" x2="680" y2="240" />
        <line x1="120" y1="280" x2="520" y2="280" />
        <line x1="120" y1="320" x2="600" y2="320" />
      </g>

      {/* Brand mark area (geometric, no real brand) */}
      <g transform="translate(360, 230)">
        <rect x="0" y="0" width="80" height="40" rx="6" fill="#0A0A0A" stroke="rgba(250,204,21,0.55)" strokeWidth="1" />
        <text x="40" y="26" textAnchor="middle" fill="rgba(250,204,21,0.85)" fontSize="14" fontWeight="900" fontFamily="ui-monospace, monospace" letterSpacing="3">
          ROG
        </text>
      </g>

      {/* Side rear vents */}
      <g fill="#0A0A0A">
        <rect x="120" y="400" width="180" height="20" rx="3" />
        <rect x="500" y="400" width="180" height="20" rx="3" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`v1-${i}`} x={130 + i * 20} y={406} width={12} height={8} rx={1} fill="#27272A" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={`v2-${i}`} x={510 + i * 20} y={406} width={12} height={8} rx={1} fill="#27272A" />
        ))}
      </g>

      {/* Center hinge accent line */}
      <line x1="80" y1="425" x2="720" y2="425" stroke="#0A0A0A" strokeWidth="2" />
    </svg>
  )
}
