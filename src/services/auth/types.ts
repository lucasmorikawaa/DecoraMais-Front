export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface UsuarioData {
  id: number;
  nome: string;
  email: string;
  tipo: string; // 'ALUNO' ou 'PROFESSOR'
  xp?: number;
  ofensivaDias?: number;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioData;
}