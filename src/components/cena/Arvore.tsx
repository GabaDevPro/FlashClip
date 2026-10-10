import { useMemo } from "react";
import { aleatorio } from "../../lib/desenho";

// Árvore de Natal (viewBox 400×560) com a estrela-raio do FlashClip no topo.

const CAMADAS = [
  { topo: 62, base: 150, meia: 72 },
  { topo: 112, base: 222, meia: 104 },
  { topo: 172, base: 298, meia: 134 },
  { topo: 240, base: 382, meia: 162 },
  { topo: 318, base: 474, meia: 192 },
];

const CORES_BOLAS = ["#e3202f", "#f5bd3d", "#f5f1e8", "#c8202f", "#f5d9a0", "#2fd67b"];
const CORES_LUZES = ["#ffd36b", "#ff3b4e", "#7dffb2", "#fff4d6"];

/** Ponto aleatório dentro da silhueta da árvore. */
function pontoNaArvore(rnd: () => number) {
  for (;;) {
    const y = 90 + rnd() * 370;
    const camada = [...CAMADAS].reverse().find((c) => y >= c.topo + 20 && y <= c.base - 6);
    if (!camada) continue;
    const meia = camada.meia * ((y - camada.topo) / (camada.base - camada.topo)) * 0.86;
    return { x: 200 + (rnd() * 2 - 1) * meia, y };
  }
}

export function Arvore() {
  const enfeites = useMemo(() => {
    const rnd = aleatorio(1225);

    const bolas = Array.from({ length: 24 }, (_, i) => ({
      ...pontoNaArvore(rnd),
      r: 7 + rnd() * 5,
      cor: CORES_BOLAS[i % CORES_BOLAS.length],
    }));

    const luzes = Array.from({ length: 44 }, (_, i) => ({
      ...pontoNaArvore(rnd),
      cor: CORES_LUZES[i % CORES_LUZES.length],
      fase: i % 3,
    }));

    return { bolas, luzes };
  }, []);

  return (
    <div className="arvore" aria-hidden="true">
    <svg viewBox="0 0 400 560">
      <defs>
        <linearGradient id="arv-folha" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f8f4e" />
          <stop offset="0.55" stopColor="#14703c" />
          <stop offset="1" stopColor="#0a4426" />
        </linearGradient>
        <radialGradient id="arv-brilho-estrela">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arv-bola" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      {/* saia da árvore */}
      <ellipse cx="200" cy="528" rx="172" ry="26" fill="#8e1b2a" />
      <ellipse cx="200" cy="524" rx="172" ry="22" fill="#c8202f" />
      <ellipse cx="200" cy="524" rx="172" ry="22" fill="none" stroke="#f5f1e8" strokeWidth="5" strokeDasharray="2 10" />

      <rect x="182" y="468" width="36" height="58" rx="4" fill="#5a3520" />

      {/* camadas de galhos */}
      {CAMADAS.map((c, i) => (
        <g key={i}>
          <path
            d={`M200 ${c.topo} L${200 + c.meia} ${c.base} Q${200 + c.meia * 0.5} ${c.base + 10} 200 ${c.base + 4} Q${
              200 - c.meia * 0.5
            } ${c.base + 10} ${200 - c.meia} ${c.base} Z`}
            fill="url(#arv-folha)"
          />
          <path
            d={`M${200 - c.meia * 0.82} ${c.base - 6} q${c.meia * 0.2} 10 ${c.meia * 0.4} 0 q${c.meia * 0.2} 10 ${
              c.meia * 0.4
            } 0 q${c.meia * 0.2} 10 ${c.meia * 0.4} 0 q${c.meia * 0.2} 10 ${c.meia * 0.4} 0`}
            fill="none"
            stroke="#0a4426"
            strokeWidth="3"
            opacity="0.6"
          />
        </g>
      ))}

      {/* festões dourados */}
      {CAMADAS.slice(1).map((c, i) => (
        <path
          key={i}
          d={`M${200 - c.meia * 0.62} ${c.topo + (c.base - c.topo) * 0.55} Q200 ${c.base + 6} ${200 + c.meia * 0.7} ${
            c.topo + (c.base - c.topo) * 0.42
          }`}
          fill="none"
          stroke="#f5d9a0"
          strokeWidth="3.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      ))}

      {enfeites.bolas.map((b, i) => (
        <g key={i}>
          <line x1={b.x} y1={b.y - b.r - 5} x2={b.x} y2={b.y - b.r} stroke="#f5d9a0" strokeWidth="1.2" />
          <circle cx={b.x} cy={b.y} r={b.r} fill={b.cor} />
          <circle cx={b.x} cy={b.y} r={b.r} fill="url(#arv-bola)" />
        </g>
      ))}

      {/* enfeites de programador */}
      <g fontFamily="Inter, sans-serif" fontWeight="800" textAnchor="middle">
        <circle cx="160" cy="262" r="15" fill="#f5bd3d" />
        <text x="160" y="267" fontSize="12" fill="#5a3520">{"{ }"}</text>
        <circle cx="252" cy="372" r="15" fill="#e3202f" />
        <text x="252" y="377" fontSize="11" fill="#fff">{"</>"}</text>
        <circle cx="178" cy="430" r="14" fill="#f5f1e8" />
        <text x="178" y="435" fontSize="12" fill="#127a43">{"( )"}</text>
      </g>

    </svg>

    {/* luzes e estrela numa camada à parte: só ela repinta quando pisca */}
    <svg className="arvore-luzes" viewBox="0 0 400 560">
      <defs>
        <radialGradient id="arv-halo">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1, 2].map((fase) => (
        <g key={fase} className={`luzes-fase luzes-fase-${fase}`}>
          {enfeites.luzes
            .filter((l) => l.fase === fase)
            .map((l, i) => (
              <g key={i}>
                <circle cx={l.x} cy={l.y} r="9" fill="url(#arv-halo)" opacity="0.55" />
                <circle cx={l.x} cy={l.y} r="3.4" fill={l.cor} />
              </g>
            ))}
        </g>
      ))}
      {/* estrela-raio */}
      <g className="estrela-topo">
        <circle cx="200" cy="44" r="54" fill="url(#arv-brilho-estrela)" />
        <path
          d="M200 6 L211 34 L241 36 L218 55 L226 84 L200 68 L174 84 L182 55 L159 36 L189 34 Z"
          fill="#f5d9a0"
          stroke="#f5bd3d"
          strokeWidth="2"
        />
        <path d="M206 22 L190 50 L201 50 L194 70 L212 40 L201 40 Z" fill="#c8202f" />
      </g>
    </svg>
    </div>
  );
}
