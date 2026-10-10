import { useMemo } from "react";
import { aleatorio, desenharFloresta } from "../../lib/desenho";

// Janela da cabana (viewBox 240×300): lá fora continua nevando.

export function Janela() {
  const { floresta, flocos } = useMemo(() => {
    const rnd = aleatorio(9);

    const floresta = desenharFloresta(
      Array.from({ length: 9 }, (_, i) => ({
        x: 22 + i * 25 + rnd() * 8,
        base: 248,
        altura: 50 + rnd() * 45,
        largura: 30 + rnd() * 14,
      })),
    );

    const flocos = Array.from({ length: 26 }, () => ({
      x: 20 + rnd() * 200,
      r: 0.9 + rnd() * 1.6,
      duracao: 4 + rnd() * 5,
      atraso: -rnd() * 9,
    }));

    return { floresta, flocos };
  }, []);

  return (
    <svg className="janela" viewBox="0 0 240 300" aria-hidden="true">
      <defs>
        <linearGradient id="jan-ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081227" />
          <stop offset="1" stopColor="#24375d" />
        </linearGradient>
        <clipPath id="jan-vidro">
          <rect x="18" y="18" width="204" height="252" />
        </clipPath>
      </defs>

      <rect x="0" y="0" width="240" height="288" rx="6" fill="#5a3520" />
      <rect x="18" y="18" width="204" height="252" fill="url(#jan-ceu)" />

      <g clipPath="url(#jan-vidro)">
        <circle cx="172" cy="62" r="18" fill="#fbf4dc" />
        <circle cx="172" cy="62" r="40" fill="#fbf4dc" opacity="0.08" />
        <path d={floresta.folhas} fill="#0d1729" />
        <path d={floresta.neve} fill="#c9d6ea" opacity="0.7" />
        <path d="M18 246 Q 120 232 222 246 V270 H18Z" fill="#dfe8f6" />
        {flocos.map((f, i) => (
          <circle
            key={i}
            cx={f.x}
            cy="10"
            r={f.r}
            fill="#fff"
            className="floco-janela"
            style={{ animationDuration: `${f.duracao}s`, animationDelay: `${f.atraso}s` }}
          />
        ))}
      </g>

      {/* reflexo no vidro */}
      <path d="M30 30 L80 30 L30 110Z" fill="#fff" opacity="0.05" />

      <path d="M120 18 V270 M18 144 H222" stroke="#5a3520" strokeWidth="9" />
      <rect x="18" y="18" width="204" height="252" fill="none" stroke="#3d2314" strokeWidth="4" />

      {/* parapeito com neve acumulada */}
      <rect x="-6" y="276" width="252" height="18" rx="4" fill="#6b4026" />
      <path d="M24 270 q 20 -10 40 0 q 25 -12 50 0 q 30 -10 60 0 q 20 -8 40 0 Z" fill="#f1f6fd" />
    </svg>
  );
}
