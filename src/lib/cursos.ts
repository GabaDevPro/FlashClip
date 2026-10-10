import { supabase } from "./supabase";
import type { Curso } from "./tipos";

export const PERIODO_ATUAL = "2026/02";
export const DURACAO_PADRAO = "3 horas";
export const DATA_EVENTO = new Date("2026-12-05T14:00:00-03:00");

// Ex.: "2026/02", "2026/2" e "2026-2" viram "2026/2".
export function normalizarPeriodo(valor: unknown): string {
  const periodo = String(valor ?? "").trim().toLowerCase();
  const partes = periodo.match(/^(\d{4})\s*[/.-]\s*0*(\d{1,2})$/);

  if (partes) {
    const etapa = Number(partes[2]);
    if (etapa >= 1 && etapa <= 12) return `${partes[1]}/${etapa}`;
  }

  return periodo.replace(/\s+/g, " ");
}

// Exibidos apenas quando o Supabase não responde, para a cabana nunca ficar vazia.
const CURSOS_DEMO: Curso[] = [
  ["Python", "Sintaxe limpa, scripts úteis e o primeiro contato com dados."],
  ["JavaScript", "Dê vida às páginas web com interatividade de verdade."],
  ["Java", "Orientação a objetos na prática, do zero ao primeiro projeto."],
  ["C", "Entenda o que acontece por baixo dos panos: memória e ponteiros."],
  ["Rust", "Desempenho e segurança de memória sem coletor de lixo."],
  ["Go", "Concorrência simples e programas rápidos com goroutines."],
  ["Haskell", "Programação funcional pura: funções, tipos e recursão."],
  ["Kotlin", "A linguagem moderna do Android, concisa e expressiva."],
].map(([nome, descricao], indice) => ({
  idCurso: -(indice + 1),
  nome,
  descricao,
  status: "Em breve",
  sala: "A definir",
  vagas: null,
  periodo: PERIODO_ATUAL,
  ministrantes: [],
  demo: true,
}));

export async function buscarCursos(): Promise<{ cursos: Curso[]; demo: boolean }> {
  try {
    const { data, error } = await supabase
      .from("cursos")
      .select(
        `idCurso, nome, descricao, imagem, status, sala, vagas, periodo,
         ministrantes ( idMinistrante, referenciaFoto, usuarios ( nome ) )`,
      )
      .order("idCurso", { ascending: true })
      .abortSignal(AbortSignal.timeout(10000));

    if (error) throw error;

    const cursos = (data ?? []) as unknown as Curso[];

    if (cursos.length === 0) return { cursos: CURSOS_DEMO, demo: true };

    return { cursos, demo: false };
  } catch (erro) {
    console.warn("Não foi possível carregar os cursos; exibindo exemplos.", erro);
    return { cursos: CURSOS_DEMO, demo: true };
  }
}
