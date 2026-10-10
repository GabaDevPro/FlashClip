import { useCallback, useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Jornada } from "./components/Jornada";
import { Informacoes, Rodape } from "./components/Informacoes";
import { ModalInscricao } from "./components/ModalInscricao";
import { useConta } from "./hooks/useConta";
import { useCursos } from "./hooks/useCursos";
import { iniciarRolagemSuave } from "./lib/rolagem";
import type { Curso } from "./lib/tipos";

export function App() {
  const conta = useConta();
  const { cursos, demo, carregando, recarregar } = useCursos();
  const [modal, setModal] = useState<{ aberto: boolean; curso: Curso | null }>({ aberto: false, curso: null });

  useEffect(() => iniciarRolagemSuave(), []);

  const abrirCurso = useCallback((curso: Curso) => setModal({ aberto: true, curso }), []);
  const abrirConta = useCallback(() => setModal({ aberto: true, curso: null }), []);
  const fechar = useCallback(() => setModal((m) => ({ ...m, aberto: false })), []);

  const aoInscrever = useCallback(() => {
    void conta.recarregar();
    void recarregar();
  }, [conta, recarregar]);

  return (
    <>
      <Navbar conta={conta} onEntrar={abrirConta} />
      <Jornada cursos={cursos} carregando={carregando} demo={demo} matriculas={conta.matriculas} onAbrir={abrirCurso} />
      <Informacoes />
      <Rodape />
      <ModalInscricao
        aberto={modal.aberto}
        curso={modal.curso}
        indice={modal.curso ? cursos.findIndex((c) => c.idCurso === modal.curso?.idCurso) : 0}
        cursos={cursos}
        conta={conta}
        onFechar={fechar}
        onInscrito={aoInscrever}
      />
    </>
  );
}
