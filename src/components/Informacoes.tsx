import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { rolarPara } from "../lib/rolagem";

const surgir = {
  oculto: { opacity: 0, y: 40 },
  visivel: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } }),
};

const icone = (conteudo: ReactNode) => (
  <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {conteudo}
  </svg>
);

const PASSOS = [
  { titulo: "Entre na cabana", texto: "Role a página, atravesse a floresta e abra a porta da cabana do FlashClip." },
  { titulo: "Escolha um presente", texto: "Cada presente embaixo da árvore é uma linguagem ensinada por um grupo do curso." },
  { titulo: "Garanta sua vaga", texto: "Crie sua conta (ou entre), confirme a inscrição e pronto: o presente é seu." },
];

const MOTIVOS = [
  {
    titulo: "Introdução à programação",
    texto: "Aprenda os fundamentos e dê seus primeiros passos no código.",
    icone: icone(<><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></>),
  },
  {
    titulo: "Curso rápido e focado",
    texto: "Apenas 3 horas de duração, com conteúdo objetivo e prático.",
    icone: icone(<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>),
  },
  {
    titulo: "Aprendizado colaborativo",
    texto: "Aprenda na prática e compartilhe conhecimento com outras pessoas.",
    icone: icone(<><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2" /><path d="M16 4.5a3 3 0 0 1 0 7" /><path d="M17 15a5 5 0 0 1 4 5v1" /></>),
  },
  {
    titulo: "Certificado digital",
    texto: "Receba um certificado para adicionar ao seu currículo.",
    icone: icone(<><path d="M12 15l-3.5 2 1-4-3-2.5 4-.3L12 6l1.5 4.2 4 .3-3 2.5 1 4z" /><path d="M5 3h14v18l-7-4-7 4z" /></>),
  },
];

function Titulo({ categoria, titulo, texto }: { categoria: string; titulo: string; texto?: string }) {
  return (
    <motion.div className="titulo-secao" variants={surgir} initial="oculto" whileInView="visivel" viewport={{ once: true, amount: 0.4 }}>
      <span>{categoria}</span>
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
    </motion.div>
  );
}

export function Informacoes() {
  return (
    <main className="informacoes">
      <section className="secao" id="como-funciona">
        <Titulo categoria="Como funciona" titulo="Três passos até o seu presente" />
        <ol className="passos">
          {PASSOS.map((p, i) => (
            <motion.li key={p.titulo} variants={surgir} initial="oculto" whileInView="visivel" viewport={{ once: true, amount: 0.4 }} custom={i}>
              <span className="passo-numero">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </motion.li>
          ))}
        </ol>
        <motion.div className="centro" variants={surgir} initial="oculto" whileInView="visivel" viewport={{ once: true }}>
          <button type="button" className="botao-principal" onClick={() => rolarPara("presentes")}>
            Voltar para os presentes
          </button>
        </motion.div>
      </section>

      <section className="secao secao-sobre" id="sobre">
        <Titulo
          categoria="Sobre o evento"
          titulo="Muito além do código."
          texto="O FlashClip é um evento de tecnologia dos alunos de Engenharia de Software, criado na disciplina de Paradigmas de Linguagens de Programação. Cada grupo ensina uma linguagem para quem é do curso e para quem é de fora: um espaço para aprender, compartilhar experiências e se conectar com outras pessoas da área."
        />
      </section>

      <section className="secao" id="motivos">
        <Titulo categoria="FlashClip" titulo="Por que participar?" texto="Uma oportunidade para aprender, compartilhar conhecimentos e desenvolver novas habilidades." />
        <div className="motivos">
          {MOTIVOS.map((m, i) => (
            <motion.article
              key={m.titulo}
              className="motivo"
              variants={surgir}
              initial="oculto"
              whileInView="visivel"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              whileHover={{ y: -6 }}
            >
              <span className="motivo-numero">{String(i + 1).padStart(2, "0")}</span>
              <div className="motivo-icone">{m.icone}</div>
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="secao" id="parceiros">
        <Titulo categoria="Apoio ao evento" titulo="Nossos parceiros" texto="Empresas que apoiam o FlashClip e acreditam no desenvolvimento da tecnologia e da educação." />
        <motion.div className="parceiros" variants={surgir} initial="oculto" whileInView="visivel" viewport={{ once: true }}>
          <a href="https://suainternet.com.br/" target="_blank" rel="noopener noreferrer" className="parceiro">
            <img src="https://i.ibb.co/nqCT8t9f/Logo.png" alt="Sua Internet" loading="lazy" />
          </a>
        </motion.div>
      </section>
    </main>
  );
}

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-conteudo">
        <div className="rodape-marca">
          <img src="./logo-transparente.png" alt="" />
          <p>© 2026/2 FlashClip. Todos os direitos reservados.</p>
        </div>
        <div className="rodape-links">
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="mailto:contato@flashclip.com">E-mail</a>
        </div>
      </div>
    </footer>
  );
}
