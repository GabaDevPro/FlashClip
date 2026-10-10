import { supabase } from "./supabase";
import { normalizarPeriodo } from "./cursos";
import type { Curso, MatriculaResumo, Usuario } from "./tipos";

// =====================================================
// VALIDAÇÕES (mesmas regras do cadastro original)
// =====================================================

export const ORIGENS = [
  { valor: "ulbra-ti", rotulo: "ULBRA - TI" },
  { valor: "ulbra-outro", rotulo: "ULBRA - Outro curso" },
  { valor: "outra-faculdade", rotulo: "Outra faculdade" },
  { valor: "externo", rotulo: "Externo" },
];

export function formatarNome(valor: string): string {
  return valor
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

export function validarNome(valor: string): string | null {
  const partes = valor.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "Digite seu nome completo.";
  if (partes.length < 2) return "Digite seu nome e sobrenome.";
  if (!partes.every((p) => /^[A-Za-zÀ-ÿ]{2,}$/.test(p))) return "Digite um nome válido.";
  return null;
}

export function mascararTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, "").substring(0, 11);
  return numeros.length > 2 ? `${numeros.substring(0, 2)} ${numeros.substring(2)}` : numeros;
}

export function validarTelefone(valor: string): string | null {
  const numeros = valor.replace(/\D/g, "");
  return numeros.length < 10 || numeros.length > 11 ? "Digite um telefone válido com DDD." : null;
}

function formatarTelefone(valor: string): string {
  const numeros = valor.replace(/\D/g, "");
  return `(${numeros.substring(0, 2)}) ${numeros.substring(2)}`;
}

export function validarIdade(valor: string): string | null {
  const numero = Number(valor);
  return valor === "" || !Number.isInteger(numero) || numero < 1 || numero > 100
    ? "A idade deve estar entre 1 e 100 anos."
    : null;
}

export function validarEmail(valor: string): string | null {
  if (!valor.trim()) return "Digite seu e-mail.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim()) ? null : "Digite um e-mail válido.";
}

export interface ForcaSenha {
  pontuacao: number;
  texto: string;
  suficiente: boolean;
}

export function avaliarSenha(valor: string): ForcaSenha {
  const caracteres = Array.from(valor);
  const total = caracteres.length;
  const tem = (regex: RegExp) => caracteres.some((c) => regex.test(c));

  const categorias = [tem(/\p{Ll}/u), tem(/\p{Lu}/u), tem(/\d/u), tem(/[^\p{L}\p{N}\s]/u)].filter(
    Boolean,
  ).length;

  const pontuacao = [total >= 8, total >= 12].filter(Boolean).length + categorias;
  const textos = ["Digite uma senha", "Muito fraca", "Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];

  return {
    pontuacao,
    texto: total === 0 ? textos[0] : textos[Math.max(1, pontuacao)],
    // 8+ caracteres com 3 tipos, ou 12+ caracteres com 2 tipos.
    suficiente: (total >= 8 && categorias >= 3) || (total >= 12 && categorias >= 2),
  };
}

// =====================================================
// CONTA
// =====================================================

export interface DadosCadastro {
  nome: string;
  telefone: string;
  idade: string;
  origem: string;
  email: string;
  senha: string;
}

function traduzirErroAuth(mensagem: string): string {
  const texto = mensagem.toLowerCase();
  if (texto.includes("already registered") || texto.includes("already been registered"))
    return "Este e-mail já está cadastrado. Use a aba “Já tenho conta”.";
  if (texto.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (texto.includes("email not confirmed"))
    return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (/rate.?limit|too many requests/.test(texto))
    return "Muitas tentativas seguidas. Aguarde um pouco e tente novamente.";
  return "Não foi possível concluir agora. Verifique sua conexão e tente novamente.";
}

/** Cria a conta. Retorna `true` se a sessão já está ativa (sem confirmação de e-mail). */
export async function criarConta(dados: DadosCadastro): Promise<boolean> {
  const email = dados.email.trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({ email, password: dados.senha });

  if (error) throw new Error(traduzirErroAuth(error.message));
  if (!data.user) throw new Error("Não foi possível criar a conta.");

  const { error: erroUsuario } = await supabase.from("usuarios").insert({
    nome: formatarNome(dados.nome),
    telefone: formatarTelefone(dados.telefone),
    origem: dados.origem,
    idade: Number(dados.idade),
    email,
  });

  if (erroUsuario) {
    console.error("Erro ao salvar usuário:", erroUsuario);
    throw new Error("Sua conta foi criada, mas não conseguimos salvar seus dados. Fale com a organização.");
  }

  return Boolean(data.session);
}

export async function entrar(email: string, senha: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: senha,
  });

  if (error) throw new Error(traduzirErroAuth(error.message));
}

export async function sair(): Promise<void> {
  await supabase.auth.signOut();
}

export async function buscarUsuario(email: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("idUsuario, nome, email")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data as Usuario | null;
}

export async function buscarMatriculas(idUsuario: number): Promise<MatriculaResumo[]> {
  const { data, error } = await supabase
    .from("matriculas")
    .select("idCurso, cursos ( periodo )")
    .eq("idUsuario", idUsuario);

  if (error) throw error;

  return (data ?? []).map((linha) => {
    const relacao = (linha as { cursos: unknown }).cursos;
    const curso = (Array.isArray(relacao) ? relacao[0] : relacao) as { periodo?: string } | null;

    return {
      idCurso: Number((linha as { idCurso: number }).idCurso),
      periodo: normalizarPeriodo(curso?.periodo),
    };
  });
}

// =====================================================
// MATRÍCULA
// =====================================================

export async function matricular(curso: Curso, usuario: Usuario): Promise<void> {
  const periodo = normalizarPeriodo(curso.periodo);
  if (!periodo) throw new Error("Não foi possível identificar o período deste curso.");

  // Confere as vagas direto no banco, não no que está em tela.
  const { data: atual, error: erroVagas } = await supabase
    .from("cursos")
    .select("vagas")
    .eq("idCurso", curso.idCurso)
    .single();

  if (erroVagas) throw new Error("Não foi possível confirmar as vagas. Tente novamente.");
  if (!Number.isFinite(Number(atual?.vagas)) || Number(atual.vagas) <= 0)
    throw new Error("As vagas deste curso se esgotaram. Escolha outro presente.");

  const matriculas = await buscarMatriculas(usuario.idUsuario);

  if (matriculas.some((m) => !m.periodo))
    throw new Error("Não foi possível verificar todas as suas matrículas. Atualize a página.");

  if (matriculas.some((m) => m.periodo === periodo))
    throw new Error("Você já possui uma matrícula neste período. Cada pessoa pode abrir apenas um presente.");

  const { error } = await supabase.from("matriculas").insert({
    idUsuario: usuario.idUsuario,
    idCurso: curso.idCurso,
    dataInscricao: new Date().toISOString(),
  });

  if (error) {
    console.error("Erro ao realizar matrícula:", error);
    const mensagem = String(error.message ?? "").toLowerCase();

    if (mensagem.includes("já possui uma matrícula neste período"))
      throw new Error("Você já possui uma matrícula neste período.");
    if (mensagem.includes("não há vagas disponíveis"))
      throw new Error("As vagas deste curso se esgotaram. Escolha outro presente.");

    throw new Error("Não foi possível realizar sua inscrição. Tente novamente.");
  }
}
