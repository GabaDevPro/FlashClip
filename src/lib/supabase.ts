import { createClient } from "@supabase/supabase-js";

// Mesmo projeto Supabase do FlashClip original. A chave é a "publishable"
// (pública por definição); quem protege os dados são as políticas RLS.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://mkylyczeakkgksrzffca.supabase.co";

const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_KEY ?? "sb_publishable_LD9drZgiFn7iQ5FK-PhHOA_Uuv7YeqP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Imagens relativas cadastradas no banco (ex.: "./imagens/python.png")
// continuam hospedadas no site original.
export const BASE_IMAGENS = "https://pedronapp.github.io/Paradigmas/FlashClip/imagens/";

export function montarImagem(caminho?: string | null): string | null {
  if (!caminho || !caminho.trim()) return null;

  const valor = caminho.trim();

  if (/^https?:\/\//i.test(valor)) return valor;

  const arquivo = valor.replace(/^(?:\.\.\/|\.\/)?imagens\//i, "").replace(/^\/+/, "");

  return `${BASE_IMAGENS}${arquivo}`;
}
