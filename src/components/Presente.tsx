import { useId, type CSSProperties } from "react";
import { motion } from "framer-motion";
import { estiloDoPresente } from "../lib/linguagens";
import type { Curso } from "../lib/tipos";

interface Props {
  curso: Curso;
  indice: number;
  inscrito: boolean;
  onAbrir: (curso: Curso) => void;
}

const tampa = {
  repouso: { y: 0, rotate: 0 },
  foco: { y: -12, rotate: -7, transition: { type: "spring" as const, stiffness: 320, damping: 14 } },
};

const brilho = {
  repouso: { opacity: 0, scale: 0.6 },
  foco: { opacity: 1, scale: 1 },
};

export function Presente({ curso, indice, inscrito, onAbrir }: Props) {
  const id = useId().replace(/:/g, "");
  const estilo = estiloDoPresente(curso.nome, indice);
  const esgotado = curso.vagas !== null && curso.vagas !== undefined && curso.vagas <= 0;

  // Alturas variadas deixam a pilha de presentes mais natural.
  const escala = [1, 0.86, 1.08, 0.92, 1.02, 0.88][indice % 6];
  const altura = 100 + ((indice * 37) % 30);

  return (
    <motion.button
      type="button"
      className={`presente${esgotado ? " presente-esgotado" : ""}${inscrito ? " presente-inscrito" : ""}`}
      style={{ "--escala": escala } as CSSProperties}
      onClick={() => onAbrir(curso)}
      initial="repouso"
      animate="repouso"
      whileHover="foco"
      whileFocus="foco"
      whileTap={{ scale: 0.94 }}
      aria-label={`${curso.nome}${esgotado ? " — vagas esgotadas" : ""}${inscrito ? " — você está inscrito" : ""}. Abrir detalhes e inscrição.`}
    >
      <span
        className="presente-flutua"
        style={{ animationDuration: `${3 + (indice % 4) * 0.4}s`, animationDelay: `${-indice * 0.23}s` }}
      >
        <motion.span className="presente-brilho" variants={brilho} aria-hidden="true" />

        <svg viewBox={`0 0 120 ${altura + 30}`} className="presente-svg" aria-hidden="true">
          <defs>
            <pattern id={`listras-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
              <rect width="14" height="14" fill={estilo.papel} />
              <rect width="5" height="14" fill="#fff" opacity="0.16" />
            </pattern>
            <pattern id={`bolinhas-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill={estilo.papel} />
              <circle cx="4" cy="4" r="2.2" fill="#fff" opacity="0.28" />
              <circle cx="12" cy="12" r="2.2" fill="#fff" opacity="0.28" />
            </pattern>
            <pattern id={`estrelas-${id}`} width="22" height="22" patternUnits="userSpaceOnUse">
              <rect width="22" height="22" fill={estilo.papel} />
              <path d="M6 2 l1.4 3 3.2.3 -2.4 2.1.8 3.1 -3-1.7 -3 1.7.8-3.1 -2.4-2.1 3.2-.3z" fill="#fff" opacity="0.25" />
              <circle cx="17" cy="16" r="1.4" fill="#fff" opacity="0.3" />
            </pattern>
            <pattern id={`liso-${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill={estilo.papel} />
            </pattern>
            <linearGradient id={`sombra-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="0.7" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          <ellipse cx="60" cy={altura + 26} rx="54" ry="5" fill="#000" opacity="0.35" />

          {/* caixa */}
          <rect x="10" y="44" width="100" height={altura - 18} rx="4" fill={`url(#${estilo.estampa}-${id})`} />
          <rect x="10" y="44" width="100" height={altura - 18} rx="4" fill={`url(#sombra-${id})`} />
          <rect x="52" y="44" width="16" height={altura - 18} fill={estilo.fita} />
          <rect x="52" y="44" width="4" height={altura - 18} fill="#fff" opacity="0.25" />

          <g className="presente-sigla">
            <circle cx="60" cy={44 + (altura - 18) / 2 + 4} r="21" fill="#fffaf0" stroke={estilo.papelEscuro} strokeWidth="3" />
            <text
              x="60"
              y={44 + (altura - 18) / 2 + 4}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Inter, sans-serif"
              fontWeight="900"
              fontSize={estilo.sigla.length > 2 ? 13 : 17}
              fill={estilo.papelEscuro}
            >
              {estilo.sigla}
            </text>
          </g>

          {/* tampa + laço */}
          <motion.g variants={tampa} style={{ originX: "60px", originY: "44px" }}>
            <rect x="4" y="28" width="112" height="22" rx="4" fill={estilo.papelEscuro} />
            <rect x="4" y="28" width="112" height="22" rx="4" fill={`url(#${estilo.estampa}-${id})`} opacity="0.7" />
            <rect x="52" y="28" width="16" height="22" fill={estilo.fita} />
            <path d="M60 28 C 40 2, 18 14, 36 26 C 44 30, 54 30, 60 28 Z" fill={estilo.fita} />
            <path d="M60 28 C 80 2, 102 14, 84 26 C 76 30, 66 30, 60 28 Z" fill={estilo.fita} />
            <path d="M60 28 C 46 12, 30 16, 40 24 Z M60 28 C 74 12, 90 16, 80 24 Z" fill="#000" opacity="0.15" />
            <circle cx="60" cy="27" r="6" fill={estilo.fita} stroke="#000" strokeOpacity="0.15" />
          </motion.g>
        </svg>
      </span>

      <span className="presente-etiqueta">
        {curso.nome}
        {esgotado && <small>Esgotado</small>}
        {inscrito && <small>Seu presente ✓</small>}
      </span>
    </motion.button>
  );
}
