// Utilidades de desenho para as cenas em SVG.

/** Gerador pseudoaleatório com semente: a floresta é sempre igual. */
export function aleatorio(semente: number) {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Pinheiro {
  x: number;
  base: number;
  altura: number;
  largura: number;
}

const r = (n: number) => Math.round(n * 10) / 10;

/** Copa, neve e tronco de um pinheiro em camadas, como strings de path. */
export function desenharPinheiro({ x, base, altura, largura }: Pinheiro) {
  const tronco = altura * 0.08;
  const topo = base - altura;
  const copa = altura - tronco;
  const camadas = 4;

  let folhas = "";
  let neve = "";

  for (let i = 0; i < camadas; i++) {
    const cima = topo + i * copa * 0.2;
    const baixo = topo + copa * (0.35 + i * (0.65 / (camadas - 1)));
    const meia = (largura / 2) * (0.38 + (0.62 * (i + 1)) / camadas);

    folhas += `M${r(x)} ${r(cima)}L${r(x + meia)} ${r(baixo)}Q${r(x)} ${r(baixo + altura * 0.02)} ${r(
      x - meia,
    )} ${r(baixo)}Z`;

    const ny = cima + (baixo - cima) * 0.5;
    const nm = meia * 0.5;
    const onda = altura * 0.012;

    neve += `M${r(x)} ${r(cima)}L${r(x + nm)} ${r(ny)}Q${r(x + nm * 0.5)} ${r(ny + onda * 2)} ${r(x)} ${r(
      ny - onda,
    )}Q${r(x - nm * 0.5)} ${r(ny + onda * 2)} ${r(x - nm)} ${r(ny)}Z`;
  }

  const lt = Math.max(2, largura * 0.07);
  const caule = `M${r(x - lt / 2)} ${r(base - tronco - 2)}h${r(lt)}v${r(tronco + 2)}h${r(-lt)}Z`;

  return { folhas, neve, caule };
}

/** Junta vários pinheiros em três paths (uma camada inteira em poucos nós). */
export function desenharFloresta(arvores: Pinheiro[]) {
  return arvores.reduce(
    (acc, arvore) => {
      const p = desenharPinheiro(arvore);
      acc.folhas += p.folhas;
      acc.neve += p.neve;
      acc.caule += p.caule;
      return acc;
    },
    { folhas: "", neve: "", caule: "" },
  );
}
