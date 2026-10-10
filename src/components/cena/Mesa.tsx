// Mesa (viewBox 320×260): vela, chocolate quente, biscoitos e um notebook com código.

export function Mesa() {
  return (
    <svg className="mesa" viewBox="0 0 320 260" aria-hidden="true">
      <defs>
        <linearGradient id="mesa-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4a2b" />
          <stop offset="1" stopColor="#4c2b17" />
        </linearGradient>
        <radialGradient id="mesa-luz-vela">
          <stop offset="0" stopColor="#ffc65c" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffc65c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* pernas */}
      <rect x="34" y="150" width="14" height="110" rx="3" fill="#3d2314" />
      <rect x="272" y="150" width="14" height="110" rx="3" fill="#3d2314" />

      {/* tampo e toalha */}
      <rect x="6" y="128" width="308" height="16" rx="5" fill="url(#mesa-madeira)" />
      <path d="M22 132 H298 L292 176 Q 278 186 264 176 Q 250 186 236 176 Q 222 186 208 176 Q 194 186 180 176 Q 166 186 152 176 Q 138 186 124 176 Q 110 186 96 176 Q 82 186 68 176 Q 54 186 40 176 Q 32 182 28 176 Z" fill="#c8202f" />
      <path d="M28 168 Q 54 178 68 168 Q 96 178 124 168 Q 152 178 180 168 Q 208 178 236 168 Q 264 178 292 168" fill="none" stroke="#f5d9a0" strokeWidth="2.5" />

      {/* vela */}
      <circle cx="56" cy="64" r="44" fill="url(#mesa-luz-vela)" className="luz-vela" />
      <rect x="49" y="76" width="14" height="54" rx="3" fill="#f5f1e8" />
      <path d="M49 82 q7 6 14 0" fill="none" stroke="#e3dccb" strokeWidth="2" />
      <path className="chama-vela" d="M56 52 q8 12 0 22 q-8 -10 0 -22Z" fill="#ffd36b" />
      <ellipse cx="56" cy="130" rx="16" ry="4" fill="#127a43" />

      {/* biscoitos */}
      <ellipse cx="114" cy="126" rx="32" ry="7" fill="#f5f1e8" />
      <ellipse cx="114" cy="124" rx="24" ry="4.5" fill="#e3dccb" />
      {[100, 114, 128].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={118 - (i === 1 ? 5 : 0)} r="9" fill="#b9773e" />
          <circle cx={x - 3} cy={116 - (i === 1 ? 5 : 0)} r="1.5" fill="#5a3520" />
          <circle cx={x + 3} cy={120 - (i === 1 ? 5 : 0)} r="1.5" fill="#5a3520" />
        </g>
      ))}

      {/* caneca */}
      <g>
        <path className="vapor" d="M170 82 q -8 -12 0 -22 q 8 -10 0 -22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        <path className="vapor vapor-2" d="M182 84 q -8 -12 0 -22 q 8 -10 0 -22" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
        <path d="M196 98 q 16 0 16 12 q 0 12 -16 12" fill="none" stroke="#c8202f" strokeWidth="5" />
        <rect x="160" y="90" width="38" height="40" rx="6" fill="#c8202f" />
        <rect x="160" y="104" width="38" height="8" fill="#f5f1e8" />
        <ellipse cx="179" cy="91" rx="19" ry="4" fill="#5a2d14" />
      </g>

      {/* notebook com código */}
      <g>
        <path d="M222 64 H302 L298 120 H226 Z" fill="#1d2230" />
        <path d="M228 70 H296 L293 114 H231 Z" fill="#0b0f18" />
        <g strokeWidth="3" strokeLinecap="round">
          <path d="M234 78 h22" stroke="#e3202f" />
          <path d="M240 86 h34" stroke="#2fd67b" />
          <path d="M240 94 h20 M264 94 h14" stroke="#f5bd3d" />
          <path d="M240 102 h28" stroke="#9fb3d9" />
          <path d="M234 108 h10" stroke="#e3202f" />
        </g>
        <path d="M214 120 H310 L304 130 H220 Z" fill="#2e3546" />
      </g>
    </svg>
  );
}
