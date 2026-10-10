export interface UsuarioResumo {
  idUsuario?: number;
  nome?: string | null;
  email?: string | null;
}

export interface Ministrante {
  idMinistrante: number;
  referenciaFoto?: string | null;
  usuarios?: UsuarioResumo | null;
}

export interface Curso {
  idCurso: number;
  nome: string;
  descricao?: string | null;
  imagem?: string | null;
  status?: string | null;
  sala?: string | null;
  vagas?: number | null;
  periodo?: string | null;
  ministrantes?: Ministrante[];
  /** Curso de exemplo, exibido quando o banco não responde. */
  demo?: boolean;
}

export interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
}

export interface MatriculaResumo {
  idCurso: number;
  periodo: string;
}
