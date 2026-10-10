import { useMemo } from "react";
import { aleatorio } from "../../lib/desenho";

// Lareira de pedra (viewBox 360×400) com fogo animado, meias e guirlanda.

const CORES_PEDRA = ["#7b716b", "#6c635e", "#857a72", "#625a55", "#736a64"];
const CORES_MEIAS = ["#c8202f", "#127a43", "#c8202f"];

export function Lareira() {
  const pedras = useMemo(() => {
    const rnd = aleatorio(77);
    const lista: { x: number; y: number; w: number; h: number; cor: string }[] = [];

    for (let y = 96, linha = 0; y < 388; y += 30, linha++) {
      let x = 22 - (linha % 2) * 22;
      while (x < 338) {
        const w = 38 + rnd() * 30;
        lista.push({
          x: Math.max(22, x),
          y,
          w: Math.min(w, 338 - Math.max(22, x)),
          h: 27,
          cor: CORES_PEDRA[Math.floor(rnd() * CORES_PEDRA.length)],
        });
        x += w + 3;
      }
    }

    return lista;
  }, []);

  return (
    <div className="lareira" aria-hidden="true">
    <svg viewBox="0 0 360 400">
      <defs>
        <radialGradient id="lar-boca" cx="0.5" cy="0.85" r="0.8">
          <stop offset="0" stopColor="#ff9a3c" stopOpacity="0.9" />
          <stop offset="0.45" stopColor="#7a2a0c" />
          <stop offset="1" stopColor="#1a0b05" />
        </radialGradient>
        <linearGradient id="lar-chama-ext" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff5a1f" />
          <stop offset="1" stopColor="#e3202f" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="lar-chama-meio" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ff7a1f" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="lar-chama-int" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="1" stopColor="#ffd36b" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lar-cornija" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4026" />
          <stop offset="1" stopColor="#3d2314" />
        </linearGradient>
      </defs>

      <rect x="18" y="92" width="324" height="300" fill="#4d4541" />
      {pedras.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="7" fill={p.cor} />
      ))}

      {/* boca da lareira */}
      <path d="M86 392 V262 Q86 206 180 206 Q274 206 274 262 V392 Z" fill="#2a1a12" />
      <path d="M96 392 V266 Q96 218 180 218 Q264 218 264 266 V392 Z" fill="url(#lar-boca)" />

      <rect x="0" y="384" width="360" height="16" rx="3" fill="#3f3834" />

      {/* cornija */}
      <rect x="0" y="70" width="360" height="26" rx="4" fill="url(#lar-cornija)" />
      <rect x="6" y="94" width="348" height="5" fill="#2b1a10" opacity="0.6" />

      {/* guirlanda sobre a cornija */}
      <path d="M4 74 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0 q 22 22 44 0" fill="none" stroke="#127a43" strokeWidth="9" strokeLinecap="round" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle
          key={i}
          cx={14 + i * 22}
          cy={i % 2 ? 87 : 78}
          r="3"
          fill={["#ffd36b", "#ff3b4e", "#7dffb2"][i % 3]}
        />
      ))}

      {/* meias */}
      {[52, 308].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 96 v6`} stroke="#f5d9a0" strokeWidth="2" />
          <path
            d={`M${x - 14} 104 h28 v42 q0 10 10 14 q16 6 12 18 q-4 10 -22 6 l-22 -8 q-8 -4 -6 -14 Z`}
            fill={CORES_MEIAS[i]}
          />
          <rect x={x - 17} y="100" width="34" height="13" rx="5" fill="#f5f1e8" />
        </g>
      ))}

      {/* velas na cornija */}
      {[140, 220].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="46" width="10" height="24" rx="2" fill="#f5f1e8" />
          <circle cx={x} cy="40" r="12" fill="#ffc65c" opacity="0.25" />
        </g>
      ))}
    </svg>

    {/* fogo e chamas das velas: camada própria, a única que se mexe */}
    <svg className="lareira-fogo" viewBox="0 0 360 400">
      {/* fogo */}
      <g className="fogo">
        <path className="chama chama-ext" d="M120 372 C 110 330 140 320 135 280 C 160 300 158 260 180 236 C 186 270 214 268 212 300 C 232 292 246 330 240 372 Z" fill="url(#lar-chama-ext)" />
        <path className="chama chama-meio" d="M136 372 C 130 340 150 330 152 300 C 168 318 172 290 184 270 C 190 300 210 300 208 326 C 222 330 228 352 224 372 Z" fill="url(#lar-chama-meio)" />
        <path className="chama chama-int" d="M156 372 C 152 350 166 342 168 322 C 178 334 184 316 190 304 C 194 326 208 334 206 372 Z" fill="url(#lar-chama-int)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} className="brasa" cx={150 + i * 16} cy="350" r="2" fill="#ffd36b" style={{ animationDelay: `${i * 0.6}s` }} />
        ))}
      </g>

      {/* lenha */}
      <rect x="112" y="366" width="140" height="16" rx="8" fill="#5a3520" transform="rotate(-6 182 374)" />
      <rect x="108" y="370" width="140" height="16" rx="8" fill="#6b4026" transform="rotate(7 178 378)" />
      <circle cx="248" cy="364" r="7" fill="#a0704a" stroke="#5a3520" strokeWidth="2" />

      {[140, 220].map((x) => (
        <path key={x} className="chama-vela" d={`M${x} 32 q6 8 0 14 q-6 -6 0 -14Z`} fill="#ffd36b" />
      ))}
    </svg>
    </div>
  );
}
