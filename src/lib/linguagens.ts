// Visual de cada presente. Linguagens conhecidas ganham as cores da marca;
// as demais recebem uma combinação natalina da paleta do FlashClip.

export interface EstiloPresente {
  papel: string;
  papelEscuro: string;
  fita: string;
  estampa: "listras" | "bolinhas" | "estrelas" | "liso";
  sigla: string;
}

const CONHECIDAS: Record<string, Omit<EstiloPresente, "sigla"> & { sigla?: string }> = {
  python: { papel: "#3776ab", papelEscuro: "#245a87", fita: "#ffd43b", estampa: "bolinhas", sigla: "Py" },
  javascript: { papel: "#f0d23c", papelEscuro: "#c9ad1f", fita: "#1e1e1e", estampa: "listras", sigla: "JS" },
  typescript: { papel: "#3178c6", papelEscuro: "#215a99", fita: "#f5f5f5", estampa: "liso", sigla: "TS" },
  java: { papel: "#e76f00", papelEscuro: "#b35600", fita: "#2f5d8c", estampa: "estrelas", sigla: "Jv" },
  kotlin: { papel: "#7f52ff", papelEscuro: "#5a35c9", fita: "#f88a2c", estampa: "listras", sigla: "Kt" },
  rust: { papel: "#b7410e", papelEscuro: "#86300a", fita: "#f2d7b0", estampa: "estrelas", sigla: "Rs" },
  go: { papel: "#00add8", papelEscuro: "#0083a3", fita: "#f5f5f5", estampa: "bolinhas", sigla: "Go" },
  golang: { papel: "#00add8", papelEscuro: "#0083a3", fita: "#f5f5f5", estampa: "bolinhas", sigla: "Go" },
  "c#": { papel: "#68217a", papelEscuro: "#4b1659", fita: "#e8c75a", estampa: "estrelas", sigla: "C#" },
  "c++": { papel: "#00599c", papelEscuro: "#003f70", fita: "#e3202f", estampa: "listras", sigla: "C++" },
  c: { papel: "#5c6bc0", papelEscuro: "#3f4d99", fita: "#f5d9a0", estampa: "liso", sigla: "C" },
  haskell: { papel: "#5e5086", papelEscuro: "#433864", fita: "#e3202f", estampa: "bolinhas", sigla: "λ" },
  swift: { papel: "#f05138", papelEscuro: "#c13a24", fita: "#f5f5f5", estampa: "listras", sigla: "Sw" },
  php: { papel: "#777bb4", papelEscuro: "#585c94", fita: "#1f8a4c", estampa: "bolinhas", sigla: "php" },
  ruby: { papel: "#cc342d", papelEscuro: "#992520", fita: "#f5d9a0", estampa: "estrelas", sigla: "Rb" },
  lua: { papel: "#000080", papelEscuro: "#00005a", fita: "#d8dee9", estampa: "bolinhas", sigla: "Lua" },
  dart: { papel: "#0175c2", papelEscuro: "#01558c", fita: "#13b9fd", estampa: "liso", sigla: "Dt" },
  elixir: { papel: "#4b275f", papelEscuro: "#341a43", fita: "#c9a2e6", estampa: "estrelas", sigla: "Ex" },
  r: { papel: "#276dc3", papelEscuro: "#1b4f8f", fita: "#c9ced6", estampa: "liso", sigla: "R" },
  sql: { papel: "#336791", papelEscuro: "#244a69", fita: "#f5d9a0", estampa: "listras", sigla: "SQL" },
  scratch: { papel: "#f5a623", papelEscuro: "#c7841a", fita: "#4c97ff", estampa: "bolinhas", sigla: "Sc" },
  prolog: { papel: "#9f1d20", papelEscuro: "#741417", fita: "#f5d9a0", estampa: "estrelas", sigla: "Pl" },
  lisp: { papel: "#3f7f3f", papelEscuro: "#2c5c2c", fita: "#e3202f", estampa: "bolinhas", sigla: "()" },
  scala: { papel: "#dc322f", papelEscuro: "#a82220", fita: "#f5f5f5", estampa: "listras", sigla: "Sc" },
  julia: { papel: "#9558b2", papelEscuro: "#6f3f87", fita: "#389826", estampa: "bolinhas", sigla: "Jl" },
  assembly: { papel: "#4a4a4a", papelEscuro: "#2f2f2f", fita: "#e3202f", estampa: "listras", sigla: "asm" },
  html: { papel: "#e34f26", papelEscuro: "#b23b1a", fita: "#f5f5f5", estampa: "liso", sigla: "<>" },
};

const NATALINAS: Omit<EstiloPresente, "sigla">[] = [
  { papel: "#c8202f", papelEscuro: "#911621", fita: "#f5d9a0", estampa: "estrelas" },
  { papel: "#127a43", papelEscuro: "#0c5530", fita: "#e3202f", estampa: "bolinhas" },
  { papel: "#e9d3a2", papelEscuro: "#c4ab76", fita: "#c8202f", estampa: "listras" },
  { papel: "#1d3b5c", papelEscuro: "#132a42", fita: "#f5bd3d", estampa: "estrelas" },
  { papel: "#8e1b2a", papelEscuro: "#66121e", fita: "#2fbf71", estampa: "listras" },
  { papel: "#f5f1e8", papelEscuro: "#d6cfbf", fita: "#127a43", estampa: "bolinhas" },
];

function chaveDaLinguagem(nome: string): string | null {
  const texto = nome.toLowerCase();

  // Procura o nome da linguagem como palavra (ex.: "Introdução a Python").
  const candidatas = Object.keys(CONHECIDAS).sort((a, b) => b.length - a.length);

  for (const chave of candidatas) {
    const escapada = chave.replace(/[.*+?^${}()|[\]\\#]/g, "\\$&");
    if (new RegExp(`(^|[^a-z0-9+#])${escapada}($|[^a-z0-9+#])`, "i").test(texto)) return chave;
  }

  return null;
}

export function estiloDoPresente(nome: string, indice: number): EstiloPresente {
  const chave = chaveDaLinguagem(nome);

  if (chave) {
    const estilo = CONHECIDAS[chave];
    return { ...estilo, sigla: estilo.sigla ?? nome.slice(0, 2) };
  }

  const sigla = nome
    .replace(/[^A-Za-zÀ-ÿ0-9#+ ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return { ...NATALINAS[indice % NATALINAS.length], sigla: sigla || "{}" };
}
