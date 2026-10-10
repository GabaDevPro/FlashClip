import { Arvore } from "./cena/Arvore";
import { Lareira } from "./cena/Lareira";
import { Janela } from "./cena/Janela";
import { Mesa } from "./cena/Mesa";
import { Presente } from "./Presente";
import type { Curso, MatriculaResumo } from "../lib/tipos";

interface Props {
  cursos: Curso[];
  carregando: boolean;
  demo: boolean;
  matriculas: MatriculaResumo[];
  onAbrir: (curso: Curso) => void;
}

export function Sala({ cursos, carregando, demo, matriculas, onAbrir }: Props) {
  return (
    <div className="sala" id="presentes">
      <div className="sala-parede" />
      <div className="sala-chao">
        <div className="sala-tapete" />
      </div>
      <div className="sala-luz-lareira" />

      <svg className="sala-guirlanda" viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={Array.from({ length: 16 }, (_, i) => `M${i * 100} 6 Q ${i * 100 + 50} 52 ${i * 100 + 100} 6`).join(" ")}
          fill="none"
          stroke="#127a43"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
      <div className="sala-luzes-teto" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${(i % 6) * 0.3}s` }} />
        ))}
      </div>

      <Janela />
      <figure className="sala-quadro" aria-hidden="true">
        <img src="./logo-512.png" alt="" />
      </figure>
      <Lareira />
      <Mesa />
      <Arvore />

      <header className="sala-titulo">
        <span>Bem-vindo à cabana</span>
        <h2>Escolha seu presente</h2>
        <p>Cada presente é uma linguagem de programação. Abra um para ver os detalhes e garantir sua vaga.</p>
        {demo && !carregando && <small>Prévia: os cursos oficiais aparecem aqui assim que forem carregados.</small>}
      </header>

      <div className="presentes">
        {carregando
          ? Array.from({ length: 6 }, (_, i) => <div key={i} className="presente-esqueleto" />)
          : cursos.map((curso, i) => (
              <Presente
                key={curso.idCurso}
                curso={curso}
                indice={i}
                inscrito={matriculas.some((m) => m.idCurso === curso.idCurso)}
                onAbrir={onAbrir}
              />
            ))}
      </div>
    </div>
  );
}
