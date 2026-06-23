/* Sony WH-1000XM5 inspired — front (band view) and side (single earcup) */

export function HeadphonesFront({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Audífonos vista frontal"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hf-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="hf-cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="60%" stopColor="#1F1F23" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="hf-pad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>
        <radialGradient id="hf-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="400" cy="465" rx="260" ry="18" fill="url(#hf-shadow)" />

      {/* Headband — arch */}
      <path
        d="M 180 200 Q 180 90 400 90 Q 620 90 620 200"
        stroke="url(#hf-band)"
        strokeWidth="22"
        fill="none"
        strokeLinecap="round"
      />
      {/* Headband cushion */}
      <path
        d="M 290 110 Q 400 80 510 110"
        stroke="#3F3F46"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Sliders */}
      <rect x="170" y="180" width="20" height="50" rx="6" fill="#27272A" />
      <rect x="610" y="180" width="20" height="50" rx="6" fill="#27272A" />

      {/* Left earcup (oval) */}
      <ellipse cx="180" cy="290" rx="100" ry="120" fill="url(#hf-cup)" stroke="#3F3F46" strokeWidth="1.5" />
      <ellipse cx="180" cy="290" rx="86" ry="106" fill="url(#hf-pad)" />
      <ellipse cx="180" cy="290" rx="74" ry="94" fill="#161618" />
      {/* Driver area */}
      <ellipse cx="180" cy="290" rx="40" ry="55" fill="#1A1A22" />
      <g opacity="0.4">
        <circle cx="180" cy="290" r="3" fill="#FACC15" />
        <circle cx="180" cy="270" r="1.5" fill="#FACC15" />
      </g>

      {/* Right earcup (oval) */}
      <ellipse cx="620" cy="290" rx="100" ry="120" fill="url(#hf-cup)" stroke="#3F3F46" strokeWidth="1.5" />
      <ellipse cx="620" cy="290" rx="86" ry="106" fill="url(#hf-pad)" />
      <ellipse cx="620" cy="290" rx="74" ry="94" fill="#161618" />
      {/* Touch surface hint on right */}
      <g opacity="0.35">
        <circle cx="620" cy="285" r="32" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
        <circle cx="620" cy="285" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <circle cx="620" cy="285" r="12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      </g>

      {/* Brand mark (generic, no real brand) */}
      <text x="180" y="295" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11" fontWeight="700" fontFamily="ui-monospace, monospace" letterSpacing="4">
        AUDIO
      </text>

      {/* Mic dots */}
      <g fill="#FACC15" opacity="0.5">
        <circle cx="115" cy="240" r="1.5" />
        <circle cx="115" cy="340" r="1.5" />
        <circle cx="685" cy="240" r="1.5" />
        <circle cx="685" cy="340" r="1.5" />
      </g>
    </svg>
  )
}

export function HeadphonesSide({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Audífonos vista lateral"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="hs-cup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="50%" stopColor="#1F1F23" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>
        <linearGradient id="hs-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3F3F46" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>
        <radialGradient id="hs-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="400" cy="455" rx="220" ry="16" fill="url(#hs-shadow)" />

      {/* Big side cup */}
      <ellipse cx="400" cy="260" rx="180" ry="170" fill="url(#hs-cup)" stroke="#3F3F46" strokeWidth="2" />
      {/* Cushion ring */}
      <ellipse cx="400" cy="260" rx="160" ry="150" fill="#27272A" />
      <ellipse cx="400" cy="260" rx="140" ry="130" fill="#161618" />

      {/* Touch surface */}
      <g opacity="0.5">
        <circle cx="400" cy="255" r="80" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <circle cx="400" cy="255" r="58" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        <circle cx="400" cy="255" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" />
      </g>

      {/* Brand mark */}
      <text x="400" y="265" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="16" fontWeight="800" fontFamily="ui-monospace, monospace" letterSpacing="5">
        AUDIO
      </text>

      {/* Headband peeking from top */}
      <path
        d="M 280 110 Q 400 50 520 110"
        stroke="url(#hs-band)"
        strokeWidth="28"
        fill="none"
        strokeLinecap="round"
      />

      {/* Slider hinge */}
      <rect x="390" y="92" width="20" height="40" rx="6" fill="#27272A" />

      {/* Power / NC buttons on cup edge */}
      <g fill="#27272A">
        <rect x="555" y="290" width="22" height="6" rx="2" />
        <rect x="555" y="306" width="22" height="6" rx="2" />
      </g>

      {/* Mic dots */}
      <g fill="#FACC15" opacity="0.55">
        <circle cx="240" cy="200" r="1.8" />
        <circle cx="240" cy="320" r="1.8" />
      </g>

      {/* USB-C port hint */}
      <rect x="380" y="425" width="40" height="6" rx="1.5" fill="#0A0A0A" />
    </svg>
  )
}
