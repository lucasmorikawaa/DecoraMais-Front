export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface UsuarioData {
  id: string;
  nome: string;
  email: string;
  xp: number;
  ofensivaDias: number;
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioData;
}