import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { buscarMatriculas, buscarUsuario, sair } from "../lib/inscricao";
import type { MatriculaResumo, Usuario } from "../lib/tipos";

export interface Conta {
  sessao: Session | null;
  usuario: Usuario | null;
  matriculas: MatriculaResumo[];
  carregando: boolean;
  erro: boolean;
  recarregar: () => Promise<void>;
  sair: () => Promise<void>;
}

export function useConta(): Conta {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [matriculas, setMatriculas] = useState<MatriculaResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregarDados = useCallback(async (atual: Session | null) => {
    setSessao(atual);
    setErro(false);

    if (!atual?.user.email) {
      setUsuario(null);
      setMatriculas([]);
      setCarregando(false);
      return;
    }

    setCarregando(true);

    try {
      const encontrado = await buscarUsuario(atual.user.email);
      setUsuario(encontrado);
      setMatriculas(encontrado ? await buscarMatriculas(encontrado.idUsuario) : []);
    } catch (falha) {
      console.error("Erro ao carregar a conta:", falha);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  const recarregar = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    await carregarDados(data.session);
  }, [carregarDados]);

  useEffect(() => {
    void recarregar().catch(() => setCarregando(false));

    const { data } = supabase.auth.onAuthStateChange((evento, novaSessao) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT" || evento === "USER_UPDATED") {
        // Fora do callback: chamadas ao Supabase dentro dele podem travar o cliente.
        setTimeout(() => void carregarDados(novaSessao), 0);
      }
    });

    return () => data.subscription.unsubscribe();
  }, [recarregar, carregarDados]);

  const encerrar = useCallback(async () => {
    await sair();
    await carregarDados(null);
  }, [carregarDados]);

  return { sessao, usuario, matriculas, carregando, erro, recarregar, sair: encerrar };
}
