import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { rolarPara } from "../lib/rolagem";
import type { Conta } from "../hooks/useConta";

interface Props {
  conta: Conta;
  onEntrar: () => void;
}

const LINKS = [
  { rotulo: "Início", destino: "inicio" },
  { rotulo: "Presentes", destino: "presentes" },
  { rotulo: "Como funciona", destino: "#como-funciona" },
  { rotulo: "Sobre", destino: "#sobre" },
  { rotulo: "Parceiros", destino: "#parceiros" },
];

export function Navbar({ conta, onEntrar }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [contaAberta, setContaAberta] = useState(false);
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const ir = (destino: string) => {
    setMenuAberto(false);
    rolarPara(destino);
  };

  const primeiroNome = conta.usuario?.nome?.split(" ")[0];
  const logado = Boolean(conta.sessao);

  const botaoConta = logado ? (
    <div className="conta">
      <button
        type="button"
        className="conta-botao"
        onClick={() => setContaAberta((v) => !v)}
        aria-expanded={contaAberta}
      >
        <span className="conta-avatar">{(primeiroNome ?? conta.sessao?.user.email ?? "?")[0].toUpperCase()}</span>
        {primeiroNome ?? "Minha conta"}
      </button>
      <AnimatePresence>
        {contaAberta && (
          <motion.div
            className="conta-menu"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
          >
            <p>
              <strong>{conta.usuario?.nome ?? "Conta sem cadastro completo"}</strong>
              <span>{conta.sessao?.user.email}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setContaAberta(false);
                void conta.sair();
              }}
            >
              Sair
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    <button type="button" className="conta-botao" onClick={onEntrar}>
      Entrar
    </button>
  );

  return (
    <header className={`navbar${rolou ? " navbar-rolou" : ""}`}>
      <button type="button" className="navbar-marca" onClick={() => ir("inicio")}>
        <img src="./logo-transparente.png" alt="" />
        <span>FlashClip</span>
      </button>

      <nav className="navbar-links" aria-label="Principal">
        {LINKS.map((l) => (
          <button key={l.destino} type="button" onClick={() => ir(l.destino)}>
            {l.rotulo}
          </button>
        ))}
      </nav>

      <div className="navbar-acoes">
        {botaoConta}
        <button type="button" className="botao-inscricoes" onClick={() => ir("presentes")}>
          Inscrições
        </button>
        <button
          type="button"
          className="navbar-menu"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto((v) => !v)}
        >
          <span className={menuAberto ? "aberto" : ""} />
        </button>
      </div>

      <AnimatePresence>
        {menuAberto && (
          <motion.nav
            className="menu-mobile"
            aria-label="Menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.destino}
                type="button"
                onClick={() => ir(l.destino)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.04 * i } }}
              >
                {l.rotulo}
              </motion.button>
            ))}
            <button type="button" className="botao-principal" onClick={() => ir("presentes")}>
              Escolher meu presente
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
