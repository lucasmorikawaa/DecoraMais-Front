import { api } from '../api';

export const recuperacaoService = {
  // Envia o código de 6 dígitos para o e-mail
  solicitarCodigo: async (email: string): Promise<void> => {
    await api.post('/auth/esqueci-senha', { email });
  },

  // Confere o código e troca a senha
  redefinirSenha: async (
    email: string,
    codigo: string,
    novaSenha: string,
  ): Promise<void> => {
    await api.post('/auth/redefinir-senha', { email, codigo, novaSenha });
  },
};