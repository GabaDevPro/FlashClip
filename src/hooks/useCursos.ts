import { useCallback, useEffect, useState } from "react";
import { buscarCursos } from "../lib/cursos";
import type { Curso } from "../lib/tipos";

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [demo, setDemo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const recarregar = useCallback(async () => {
    const resultado = await buscarCursos();
    setCursos(resultado.cursos);
    setDemo(resultado.demo);
    setCarregando(false);
  }, []);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { cursos, demo, carregando, recarregar };
}
