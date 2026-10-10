import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FormularioConta } from "./FormularioConta";
import { DURACAO_PADRAO, normalizarPeriodo } from "../lib/cursos";
import { matricular } from "../lib/inscricao";
import { estiloDoPresente } from "../lib/linguagens";
import { montarImagem } from "../lib/supabase";
import { travarRolagem } from "../lib/rolagem";
import type { Conta } from "../hooks/useConta";
import type { Curso } from "../lib/tipos";

interface Props {
  aberto: boolean;
  curso: Curso | null;
  indice: number;
  cursos: Curso[];
  conta: Conta;
  onFechar: () => void;
  onInscrito: () => void;
}

const CORES_CONFETE = ["#e3202f", "#2fd67b", "#f5bd3d", "#f5d9a0", "#fff"];

function Confete() {
  const pedacos = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const angulo = (i / 46) * Math.PI * 2 + Math.random() * 0.4;
        const distancia = 120 + Math.random() * 160;
        return {
          x: Math.cos(angulo) * distancia,
          y: Math.sin(angulo) * distancia - 60,
          rotacao: Math.random() * 720 - 360,
          cor: CORES_CONFETE[i % CORES_CONFETE.length],
          largura: 6 + Math.random() * 6,
          redondo: i % 3 === 0,
        };
      }),
    [],
  );

  return (
    <div className="confete" aria-hidden="true">
      {pedacos.map((p, i) => (
        <motion.span
          key={i}
          style={{ background: p.cor, width: p.largura, height: p.redondo ? p.largura : p.largura * 0.45, borderRadius: p.redondo ? "50%" : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 140], opacity: [1, 1, 0], rotate: p.rotacao, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.55, 1] }}
        />
      ))}
    </div>
  );
}

export function ModalInscricao({ aberto, curso, indice, cursos, conta, onFechar, onInscrito }: Props) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const fecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;

    setErro(null);
    setSucesso(false);
    travarRolagem(true);
    fecharRef.current?.focus();

    const aoTeclar = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    window.addEventListener("keydown", aoTeclar);

    return () => {
      travarRolagem(false);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto, onFechar]);

  // Aberto pelo botão "Entrar": fecha sozinho quando a conta estiver pronta.
  useEffect(() => {
    if (aberto && !curso && conta.sessao && !conta.carregando) onFechar();
  }, [aberto, curso, conta.sessao, conta.carregando, onFechar]);

  const estilo = curso ? estiloDoPresente(curso.nome, indice) : null;
  const imagem = curso ? montarImagem(curso.imagem) : null;
  const esgotado = curso?.vagas !== null && curso?.vagas !== undefined && curso.vagas <= 0;

  const matriculaNoPeriodo = curso
    ? conta.matriculas.find((m) => m.periodo === normalizarPeriodo(curso.periodo))
    : undefined;
  const cursoDoPeriodo = matriculaNoPeriodo && cursos.find((c) => c.idCurso === matriculaNoPeriodo.idCurso);

  const confirmar = async () => {
    if (!curso || !conta.usuario) return;
    setEnviando(true);
    setErro(null);

    try {
      await matricular(curso, conta.usuario);
      setSucesso(true);
      onInscrito();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Não foi possível realizar sua inscrição.");
    } finally {
      setEnviando(false);
    }
  };

  const acao = () => {
    if (!curso) return <FormularioConta onAutenticado={conta.recarregar} />;

    if (curso.demo)
      return (
        <p className="aviso aviso-info">
          Esta é uma prévia da cabana. As inscrições abrem quando os cursos oficiais forem publicados.
        </p>
      );

    if (conta.carregando) return <p className="aviso aviso-info">Verificando sua conta…</p>;

    if (!conta.sessao)
      return (
        <>
          <p className="acao-titulo">Para abrir este presente, crie sua conta ou entre.</p>
          <FormularioConta onAutenticado={conta.recarregar} />
        </>
      );

    if (conta.erro)
      return <p className="aviso aviso-erro">Não conseguimos verificar suas inscrições. Atualize a página.</p>;

    if (!conta.usuario)
      return (
        <p className="aviso aviso-erro">
          Você entrou, mas não encontramos seu cadastro. Fale com a organização do FlashClip.
        </p>
      );

    if (matriculaNoPeriodo?.idCurso === curso.idCurso)
      return <p className="aviso aviso-sucesso">Este presente já é seu! Sua vaga está garantida. 🎄</p>;

    if (matriculaNoPeriodo)
      return (
        <p className="aviso aviso-info">
          Você já abriu o presente <strong>{cursoDoPeriodo?.nome ?? "de outro curso"}</strong> neste período. Cada
          pessoa pode se inscrever em apenas um curso.
        </p>
      );

    if (esgotado) return <p className="aviso aviso-erro">As vagas deste curso se esgotaram. Escolha outro presente.</p>;

    return (
      <div className="confirmacao">
        <p>
          Inscrevendo como <strong>{conta.usuario.nome}</strong>
          <span>{conta.usuario.email}</span>
        </p>
        {erro && (
          <p className="aviso aviso-erro" role="alert">
            {erro}
          </p>
        )}
        <button type="button" className="botao-principal botao-cheio" onClick={confirmar} disabled={enviando}>
          {enviando ? "Abrindo presente…" : "Abrir presente e confirmar inscrição"}
        </button>
        <button type="button" className="botao-link" onClick={() => void conta.sair()}>
          Não é você? Sair
        </button>
      </div>
    );
  };

  const instrutores = curso?.ministrantes ?? [];

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="modal-fundo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onFechar()}
        >
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            data-lenis-prevent
            initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            <button ref={fecharRef} type="button" className="modal-fechar" onClick={onFechar} aria-label="Fechar">
              ×
            </button>

            {sucesso && curso ? (
              <div className="sucesso">
                <Confete />
                <motion.div
                  className="sucesso-icone"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.1 }}
                >
                  🎁
                </motion.div>
                <h2 id="modal-titulo">Presente aberto!</h2>
                <p>
                  Sua inscrição em <strong>{curso.nome}</strong> está confirmada. Te esperamos no dia 05/12 às 14h na
                  Ulbra Palmas.
                </p>
                <button type="button" className="botao-principal" onClick={onFechar}>
                  Voltar para a cabana
                </button>
              </div>
            ) : (
              <>
                <div
                  className="modal-topo"
                  style={
                    estilo
                      ? ({ "--papel": estilo.papel, "--papel-escuro": estilo.papelEscuro, "--fita": estilo.fita } as CSSProperties)
                      : undefined
                  }
                >
                  <div className="modal-fita" />
                  <div className="modal-selo">
                    {imagem ? <img src={imagem} alt="" /> : estilo ? estilo.sigla : <img src="./logo-transparente.png" alt="" />}
                  </div>
                  <div>
                    <span className="modal-categoria">{curso ? curso.status || "Curso" : "Sua conta"}</span>
                    <h2 id="modal-titulo">{curso ? curso.nome : "Entrar no FlashClip"}</h2>
                  </div>
                </div>

                <div className="modal-corpo">
                  {curso && (
                    <>
                      <p className="modal-descricao">{curso.descricao || "Sem descrição disponível."}</p>
                      <dl className="modal-detalhes">
                        <div>
                          <dt>Duração</dt>
                          <dd>{DURACAO_PADRAO}</dd>
                        </div>
                        <div>
                          <dt>Sala</dt>
                          <dd>{curso.sala || "A definir"}</dd>
                        </div>
                        <div>
                          <dt>Vagas</dt>
                          <dd>{curso.vagas ?? "—"}</dd>
                        </div>
                      </dl>
                      {instrutores.length > 0 && (
                        <div className="modal-instrutores">
                          <span>Instrutores</span>
                          <ul>
                            {instrutores.map((m) => {
                              const foto = montarImagem(m.referenciaFoto);
                              const nome = m.usuarios?.nome ?? "Instrutor";
                              return (
                                <li key={m.idMinistrante}>
                                  {foto ? <img src={foto} alt="" /> : <span>{nome[0]}</span>}
                                  {nome}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  <div className="modal-acao">{acao()}</div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
