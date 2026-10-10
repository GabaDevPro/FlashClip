import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ORIGENS,
  avaliarSenha,
  criarConta,
  entrar,
  mascararTelefone,
  validarEmail,
  validarIdade,
  validarNome,
  validarTelefone,
  type DadosCadastro,
} from "../lib/inscricao";

interface Props {
  /** Chamado quando a pessoa está autenticada (login ou cadastro com sessão ativa). */
  onAutenticado: () => Promise<void> | void;
}

type Aba = "cadastro" | "login";
type Campo = keyof DadosCadastro;

const VAZIO: DadosCadastro = { nome: "", telefone: "", idade: "", origem: "", email: "", senha: "" };

function validar(aba: Aba, dados: DadosCadastro): Partial<Record<Campo, string>> {
  const erros: Partial<Record<Campo, string>> = {};
  const email = validarEmail(dados.email);
  if (email) erros.email = email;

  if (aba === "login") {
    if (!dados.senha) erros.senha = "Digite sua senha.";
    return erros;
  }

  const nome = validarNome(dados.nome);
  const telefone = validarTelefone(dados.telefone);
  const idade = validarIdade(dados.idade);
  if (nome) erros.nome = nome;
  if (telefone) erros.telefone = telefone;
  if (idade) erros.idade = idade;
  if (!dados.origem) erros.origem = "Selecione sua origem.";
  if (!avaliarSenha(dados.senha).suficiente)
    erros.senha = "Use 8+ caracteres com 3 tipos (maiúscula, minúscula, número, símbolo) ou 12+ com 2 tipos.";

  return erros;
}

export function FormularioConta({ onAutenticado }: Props) {
  const [aba, setAba] = useState<Aba>("cadastro");
  const [dados, setDados] = useState<DadosCadastro>(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [enviando, setEnviando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "erro" | "sucesso"; texto: string } | null>(null);

  const forca = avaliarSenha(dados.senha);

  const alterar = (campo: Campo, valor: string) => {
    const novo = { ...dados, [campo]: campo === "telefone" ? mascararTelefone(valor) : valor };
    setDados(novo);
    if (tocados[campo]) setErros(validar(aba, novo));
  };

  const tocar = (campo: Campo) => {
    setTocados((t) => ({ ...t, [campo]: true }));
    setErros(validar(aba, dados));
  };

  const trocarAba = (nova: Aba) => {
    setAba(nova);
    setErros({});
    setTocados({});
    setAviso(null);
  };

  const enviar = async (evento: FormEvent) => {
    evento.preventDefault();
    const encontrados = validar(aba, dados);
    setErros(encontrados);
    setTocados({ nome: true, telefone: true, idade: true, origem: true, email: true, senha: true });
    if (Object.keys(encontrados).length > 0) return;

    setEnviando(true);
    setAviso(null);

    try {
      if (aba === "login") {
        await entrar(dados.email, dados.senha);
        await onAutenticado();
        return;
      }

      const comSessao = await criarConta(dados);

      if (comSessao) {
        await onAutenticado();
      } else {
        setAba("login");
        setDados({ ...VAZIO, email: dados.email });
        setAviso({
          tipo: "sucesso",
          texto: "Conta criada! Confirme seu e-mail pelo link que enviamos e depois entre aqui para abrir seu presente.",
        });
      }
    } catch (erro) {
      setAviso({ tipo: "erro", texto: erro instanceof Error ? erro.message : "Algo deu errado. Tente novamente." });
    } finally {
      setEnviando(false);
    }
  };

  const erroDe = (campo: Campo) =>
    tocados[campo] && erros[campo] ? <small className="campo-erro">{erros[campo]}</small> : null;

  return (
    <div className="form-conta">
      <div className="abas" role="tablist">
        {(["cadastro", "login"] as Aba[]).map((a) => (
          <button key={a} type="button" role="tab" aria-selected={aba === a} onClick={() => trocarAba(a)}>
            {aba === a && <motion.span layoutId="aba-ativa" className="aba-indicador" />}
            <span>{a === "cadastro" ? "Criar conta" : "Já tenho conta"}</span>
          </button>
        ))}
      </div>

      <form onSubmit={enviar} noValidate>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={aba}
            className="campos"
            initial={{ opacity: 0, x: aba === "login" ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: aba === "login" ? -24 : 24 }}
            transition={{ duration: 0.22 }}
          >
            {aba === "cadastro" && (
              <>
                <label className="campo campo-largo">
                  <span>Nome completo</span>
                  <input
                    value={dados.nome}
                    onChange={(e) => alterar("nome", e.target.value)}
                    onBlur={() => tocar("nome")}
                    autoComplete="name"
                    placeholder="Ex.: Maria Silva"
                    aria-invalid={Boolean(tocados.nome && erros.nome)}
                  />
                  {erroDe("nome")}
                </label>
                <label className="campo">
                  <span>Telefone</span>
                  <input
                    value={dados.telefone}
                    onChange={(e) => alterar("telefone", e.target.value)}
                    onBlur={() => tocar("telefone")}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="63 999999999"
                    aria-invalid={Boolean(tocados.telefone && erros.telefone)}
                  />
                  {erroDe("telefone")}
                </label>
                <label className="campo">
                  <span>Idade</span>
                  <input
                    value={dados.idade}
                    onChange={(e) => alterar("idade", e.target.value.replace(/\D/g, "").slice(0, 3))}
                    onBlur={() => tocar("idade")}
                    inputMode="numeric"
                    placeholder="20"
                    aria-invalid={Boolean(tocados.idade && erros.idade)}
                  />
                  {erroDe("idade")}
                </label>
                <label className="campo campo-largo">
                  <span>De onde você vem?</span>
                  <select
                    value={dados.origem}
                    onChange={(e) => alterar("origem", e.target.value)}
                    onBlur={() => tocar("origem")}
                    aria-invalid={Boolean(tocados.origem && erros.origem)}
                  >
                    <option value="" disabled>
                      Selecione sua origem
                    </option>
                    {ORIGENS.map((o) => (
                      <option key={o.valor} value={o.valor}>
                        {o.rotulo}
                      </option>
                    ))}
                  </select>
                  {erroDe("origem")}
                </label>
              </>
            )}

            <label className="campo campo-largo">
              <span>E-mail</span>
              <input
                type="email"
                value={dados.email}
                onChange={(e) => alterar("email", e.target.value)}
                onBlur={() => tocar("email")}
                autoComplete="email"
                placeholder="voce@email.com"
                aria-invalid={Boolean(tocados.email && erros.email)}
              />
              {erroDe("email")}
            </label>

            <label className="campo campo-largo">
              <span>Senha</span>
              <div className="campo-senha">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={dados.senha}
                  onChange={(e) => alterar("senha", e.target.value)}
                  onBlur={() => tocar("senha")}
                  autoComplete={aba === "login" ? "current-password" : "new-password"}
                  placeholder={aba === "login" ? "Sua senha" : "Crie uma senha forte"}
                  aria-invalid={Boolean(tocados.senha && erros.senha)}
                />
                <button type="button" onClick={() => setMostrarSenha((v) => !v)}>
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              {aba === "cadastro" && dados.senha && (
                <div className="forca-senha" data-nivel={Math.min(6, forca.pontuacao)}>
                  <div className="forca-barra">
                    <motion.span animate={{ width: `${(Math.min(6, forca.pontuacao) / 6) * 100}%` }} />
                  </div>
                  <small>{forca.texto}</small>
                </div>
              )}
              {erroDe("senha")}
            </label>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {aviso && (
            <motion.p
              className={`aviso aviso-${aviso.tipo}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="status"
            >
              {aviso.texto}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" className="botao-principal botao-cheio" disabled={enviando}>
          {enviando ? "Aguarde…" : aba === "cadastro" ? "Criar conta e continuar" : "Entrar e continuar"}
        </button>
      </form>
    </div>
  );
}
