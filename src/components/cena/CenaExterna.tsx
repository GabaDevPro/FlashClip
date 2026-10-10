import { useMemo } from "react";
import { aleatorio, desenharFloresta, type Pinheiro } from "../../lib/desenho";

// Cena externa em SVG (viewBox 1600×900). Cada camada tem uma classe
// que a timeline de scroll (Jornada.tsx) anima para criar profundidade.
// A porta da cabana fica em (800, 698): é o ponto para onde a câmera "voa".

const MONTANHAS: [number, number][] = [
  [0, 610], [110, 500], [200, 560], [330, 420], [455, 545], [560, 455], [690, 585],
  [820, 470], [940, 575], [1070, 400], [1200, 545], [1310, 465], [1430, 575],
  [1530, 490], [1600, 540],
];

const CORES_LUZES = ["#ff3b4e", "#2fd67b", "#ffd36b"];

export function CenaExterna() {
  const cena = useMemo(() => {
    const rnd = aleatorio(2026);

    const estrelas = Array.from({ length: 150 }, () => ({
      x: rnd() * 1600,
      y: rnd() * 520,
      r: 0.5 + rnd() * 1.4,
      o: 0.35 + rnd() * 0.65,
      piscar: rnd() < 0.3,
      atraso: rnd() * 4,
    }));

    const distantes: Pinheiro[] = [];
    for (let x = -20; x < 1640; x += 22 + rnd() * 26) {
      distantes.push({ x, base: 700 + rnd() * 10, altura: 80 + rnd() * 80, largura: 40 + rnd() * 26 });
    }

    const medias: Pinheiro[] = [];
    for (let x = -40; x < 1660; x += 55 + rnd() * 50) {
      if (x > 610 && x < 990) continue; // clareira da cabana
      medias.push({ x, base: 780 + rnd() * 30, altura: 190 + rnd() * 120, largura: 95 + rnd() * 50 });
    }

    const esquerda: Pinheiro[] = [
      { x: -30, base: 960, altura: 860, largura: 430 },
      { x: 190, base: 950, altura: 640, largura: 330 },
    ];

    const direita: Pinheiro[] = [
      { x: 1630, base: 960, altura: 860, largura: 430 },
      { x: 1410, base: 950, altura: 660, largura: 330 },
    ];

    const caps = MONTANHAS.slice(1, -1)
      .filter(([, y]) => y < 520)
      .map(([x, y]) => {
        const h = (560 - y) * 0.35;
        return `M${x} ${y}L${x + h * 0.9} ${y + h}L${x + h * 0.35} ${y + h * 0.8}L${x} ${y + h * 1.05}L${
          x - h * 0.4
        } ${y + h * 0.78}L${x - h * 0.9} ${y + h}Z`;
      })
      .join("");

    // Luzinhas ao longo do telhado (de um beiral ao outro, passando pelo topo).
    const luzes = Array.from({ length: 17 }, (_, i) => {
      const t = i / 16;
      const x = 690 + t * 220;
      const y = t <= 0.5 ? 640 - (t / 0.5) * 80 : 560 + ((t - 0.5) / 0.5) * 80;
      return { x, y: y + 8, cor: CORES_LUZES[i % 3], atraso: (i % 5) * 0.35 };
    });

    return {
      estrelas,
      distantes: desenharFloresta(distantes),
      medias: desenharFloresta(medias),
      esquerda: desenharFloresta(esquerda),
      direita: desenharFloresta(direita),
      montanhas: `M${MONTANHAS.map(([x, y]) => `${x} ${y}`).join("L")}L1600 720L0 720Z`,
      caps,
      luzes,
    };
  }, []);

  return (
    <svg
      className="cena-externa"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ext-lua-brilho">
          <stop offset="0" stopColor="#fdf3d0" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#c9d8ff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#c9d8ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ext-montanha" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24345a" />
          <stop offset="1" stopColor="#111b33" />
        </linearGradient>
        <linearGradient id="ext-neve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f0fb" />
          <stop offset="0.5" stopColor="#bccbe2" />
          <stop offset="1" stopColor="#8698b8" />
        </linearGradient>
        <linearGradient id="ext-neve-frente" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d5e0f2" />
          <stop offset="1" stopColor="#6f82a6" />
        </linearGradient>
        <linearGradient id="ext-madeira" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a4a2b" />
          <stop offset="1" stopColor="#4c2b17" />
        </linearGradient>
        <linearGradient id="ext-janela" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe3a1" />
          <stop offset="1" stopColor="#ffab3d" />
        </linearGradient>
        <radialGradient id="ext-luz-quente">
          <stop offset="0" stopColor="#ffc65c" stopOpacity="0.85" />
          <stop offset="0.45" stopColor="#ff9a3c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ext-porta-luz" cx="0.5" cy="0.6" r="0.75">
          <stop offset="0" stopColor="#fff2cf" />
          <stop offset="0.6" stopColor="#ffc66e" />
          <stop offset="1" stopColor="#f08a2c" />
        </radialGradient>
        <linearGradient id="ext-aurora" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2fd67b" stopOpacity="0" />
          <stop offset="0.3" stopColor="#2fd67b" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#1fa3a0" stopOpacity="0.35" />
          <stop offset="0.85" stopColor="#ff3b4e" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ff3b4e" stopOpacity="0" />
        </linearGradient>
        <filter id="ext-desfoque" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="ext-fumaca" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* CÉU */}
      <g className="camada-ceu">
        {cena.estrelas.map((e, i) => (
          <circle
            key={i}
            cx={e.x}
            cy={e.y}
            r={e.r}
            fill="#fff"
            opacity={e.o}
            className={e.piscar ? "estrela-pisca" : undefined}
            style={e.piscar ? { animationDelay: `${e.atraso}s` } : undefined}
          />
        ))}
        <g className="aurora" filter="url(#ext-desfoque)">
          <path d="M-50 260 C 300 140, 600 300, 900 190 S 1400 120, 1700 230 L1700 300 C 1400 200, 1000 330, 700 290 S 200 250, -50 330Z" fill="url(#ext-aurora)" />
        </g>
        <circle cx="1240" cy="250" r="190" fill="url(#ext-lua-brilho)" />
        <circle cx="1240" cy="250" r="46" fill="#fbf4dc" />
        <circle cx="1226" cy="238" r="9" fill="#e9dfc0" opacity="0.7" />
        <circle cx="1256" cy="266" r="6" fill="#e9dfc0" opacity="0.6" />
        <circle cx="1252" cy="232" r="4" fill="#e9dfc0" opacity="0.5" />
      </g>

      {/* MONTANHAS */}
      <g className="camada-montanhas">
        <path d={cena.montanhas} fill="url(#ext-montanha)" />
        <path d={cena.caps} fill="#c6d3ea" opacity="0.75" />
      </g>

      {/* FLORESTA DISTANTE */}
      <g className="camada-distante">
        <path d="M0 690 Q 400 670 800 685 T 1600 680 L1600 760 L0 760Z" fill="#9fb0cc" />
        <path d={cena.distantes.caule} fill="#0e1628" />
        <path d={cena.distantes.folhas} fill="#16243d" />
        <path d={cena.distantes.neve} fill="#b4c3dc" opacity="0.55" />
      </g>

      {/* CLAREIRA + CABANA */}
      <g className="camada-cabana">
        <path d="M-200 722 Q 300 695 800 712 T 1800 718 L1800 1100 L-200 1100Z" fill="url(#ext-neve)" />
        <ellipse cx="800" cy="752" rx="230" ry="34" fill="url(#ext-luz-quente)" opacity="0.6" />
        <path d="M782 731 L818 731 L930 910 L670 910Z" fill="#f4f8ff" opacity="0.55" />

        {/* boneco de neve */}
        <g className="boneco">
          <ellipse cx="640" cy="733" rx="20" ry="6" fill="#7b8fb3" opacity="0.35" />
          <circle cx="640" cy="718" r="16" fill="#f3f7fd" />
          <circle cx="640" cy="694" r="11" fill="#f3f7fd" />
          <circle cx="640" cy="676" r="8" fill="#f3f7fd" />
          <path d="M628 684 h24 v4 h-24Z" fill="#c8202f" />
          <path d="M646 684 h5 v12 h-5Z" fill="#c8202f" />
          <path d="M633 669 h14 v-2 h-3 v-8 h-8 v8 h-3Z" fill="#1b1b1b" />
          <path d="M640 677 l7 1.5 l-7 1.5Z" fill="#f08a2c" />
          <circle cx="637" cy="674" r="1.2" fill="#1b1b1b" />
          <circle cx="643" cy="674" r="1.2" fill="#1b1b1b" />
          <path d="M630 694 l-14 -10 M650 694 l14 -12" stroke="#4c2b17" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* chaminé e fumaça */}
        <rect x="856" y="572" width="22" height="46" fill="#5e5752" />
        <path d="M856 582h22M856 594h22M856 606h22" stroke="#3f3a36" strokeWidth="1.2" />
        <rect x="852" y="566" width="30" height="9" rx="3" fill="#eef4fb" />
        <g className="fumaca" filter="url(#ext-fumaca)">
          <circle cx="867" cy="556" r="8" />
          <circle cx="870" cy="556" r="10" />
          <circle cx="866" cy="556" r="12" />
          <circle cx="872" cy="556" r="9" />
        </g>

        {/* paredes de toras */}
        <path d="M708 632 L800 566 L892 632Z" fill="#5a3520" />
        <path d="M760 604h80M738 619h124" stroke="#2f1a0d" strokeWidth="1.5" opacity="0.6" />
        <circle cx="800" cy="604" r="9" fill="url(#ext-janela)" stroke="#2b1a10" strokeWidth="2.5" />
        <rect x="700" y="630" width="200" height="101" fill="url(#ext-madeira)" />
        <path
          d="M700 642.5h200M700 655h200M700 667.5h200M700 680h200M700 692.5h200M700 705h200M700 717.5h200"
          stroke="#2f1a0d"
          strokeWidth="1.6"
          opacity="0.55"
        />
        {[636, 649, 661, 674, 686, 699, 711, 724].map((y) => (
          <g key={y}>
            <circle cx="700" cy={y} r="5.6" fill="#8a5a36" stroke="#4c2b17" strokeWidth="1" />
            <circle cx="900" cy={y} r="5.6" fill="#8a5a36" stroke="#4c2b17" strokeWidth="1" />
          </g>
        ))}

        {/* telhado com neve */}
        <polyline points="684,644 800,558 916,644" fill="none" stroke="#2b1a10" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points="682,637 800,551 918,637" fill="none" stroke="#f1f6fd" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M700 636 q3 9 6 0 M735 611 q3 8 6 0 M862 611 q3 10 6 0 M892 632 q3 8 6 0" fill="#f1f6fd" stroke="#f1f6fd" strokeWidth="2" />

        {/* janelas */}
        {[716, 840].map((x) => (
          <g key={x}>
            <circle cx={x + 22} cy="672" r="46" fill="url(#ext-luz-quente)" opacity="0.55" />
            <rect x={x} y="654" width="44" height="36" fill="url(#ext-janela)" stroke="#2b1a10" strokeWidth="3" />
            <path d={`M${x + 22} 654v36M${x} 672h44`} stroke="#2b1a10" strokeWidth="2.5" />
            <rect x={x - 3} y="689" width="50" height="5" rx="2" fill="#f1f6fd" />
          </g>
        ))}

        {/* porta: atrás dela, a luz da lareira */}
        <rect x="777" y="661" width="46" height="70" fill="#2b1a10" />
        <rect x="782" y="666" width="36" height="65" fill="url(#ext-porta-luz)" />
        <g className="porta">
          <rect x="782" y="666" width="36" height="65" fill="#7a4a2b" />
          <path d="M791 666v65M800 666v65M809 666v65" stroke="#4c2b17" strokeWidth="1.2" />
          <rect x="785" y="671" width="30" height="55" fill="none" stroke="#4c2b17" strokeWidth="1.5" />
          <circle cx="800" cy="684" r="7" fill="none" stroke="#127a43" strokeWidth="3.5" />
          <path d="M796 690 l4 -3 l4 3 l-2 5 l-2 -3 l-2 3Z" fill="#c8202f" />
          <circle cx="812" cy="701" r="1.8" fill="#f5bd3d" />
        </g>
        <rect x="826" y="676" width="7" height="10" rx="2" fill="#ffe3a1" className="lanterna" />
        <circle cx="829.5" cy="681" r="16" fill="url(#ext-luz-quente)" className="lanterna" />

        {cena.luzes.map((l, i) => (
          <circle
            key={i}
            cx={l.x}
            cy={l.y}
            r="2.6"
            fill={l.cor}
            className="luzinha"
            style={{ animationDelay: `${l.atraso}s` }}
          />
        ))}

        <path d="M600 735 Q 700 724 780 732 L 820 732 Q 900 724 1000 736 L1000 760 L600 760Z" fill="#dfe8f6" opacity="0.9" />
      </g>

      {/* FLORESTA MÉDIA */}
      <g className="camada-media">
        <path d={cena.medias.caule} fill="#0a0f1c" />
        <path d={cena.medias.folhas} fill="#0d1729" />
        <path d={cena.medias.neve} fill="#c9d6ea" opacity="0.75" />
        <path d="M-100 790 Q 200 770 470 800 Q 560 812 640 940 L-100 1000Z M960 940 Q 1040 812 1130 800 Q 1400 765 1700 790 L1700 1000Z" fill="url(#ext-neve-frente)" />
      </g>

      {/* PRIMEIRO PLANO */}
      <g className="camada-frente-esq">
        <path d={cena.esquerda.caule} fill="#04070e" />
        <path d={cena.esquerda.folhas} fill="#060b16" />
        <path d={cena.esquerda.neve} fill="#dce6f5" opacity="0.85" />
      </g>
      <g className="camada-frente-dir">
        <path d={cena.direita.caule} fill="#04070e" />
        <path d={cena.direita.folhas} fill="#060b16" />
        <path d={cena.direita.neve} fill="#dce6f5" opacity="0.85" />
      </g>
      <path className="camada-chao" d="M-100 870 Q 400 840 800 868 T 1700 860 L1700 1000 L-100 1000Z" fill="#e8eef9" />
    </svg>
  );
}
