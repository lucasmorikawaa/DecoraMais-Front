import { api } from '../api';

// false = usa o backend de verdade (código enviado por e-mail)
// true  = modo demonstração (aceita o código fixo 123456, sem backend)
export const MODO_DEMONSTRACAO = false;
export const CODIGO_DEMO = '123456';

const espera = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Padroniza o erro: .message com o texto do backend e .response mantido,
// então a tela funciona lendo qualquer um dos dois.
function tratarErro(e: any, padrao: string): never {
  let mensagem = padrao;

  if (e?.response) {
    const data = e.response.data;
    if (typeof data?.mensagem === 'string') {
      mensagem = data.mensagem;
    } else if (Array.isArray(data) && data[0]?.mensagem) {
      mensagem = data[0].mensagem; // erros de validação: [{campo, mensagem}]
    }
  } else if (e?.request) {
    mensagem = 'Não foi possível conectar ao servidor. Verifique sua conexão e o IP do backend.';
  }

  const erro: any = new Error(mensagem);
  erro.response = e?.response;
  throw erro;
}

export const recuperacaoService = {
  // Passo 1: pede o envio do código para o e-mail
  solicitarCodigo: async (email: string): Promise<void> => {
    if (MODO_DEMONSTRACAO) {
      await espera(800);
      return;
    }

    try {
      await api.post('/auth/esqueci-senha', { email: email.trim() });
    } catch (e: any) {
      tratarErro(e, 'Não foi possível enviar o código. Tente novamente.');
    }
  },

  // Passo 2: confere o código e grava a nova senha
  redefinirSenha: async (
    email: string,
    codigo: string,
    novaSenha: string
  ): Promise<void> => {
    if (MODO_DEMONSTRACAO) {
      await espera(800);
      if (codigo.trim() !== CODIGO_DEMO) {
        throw new Error('Código incorreto.');
      }
      return;
    }

    try {
      await api.post('/auth/redefinir-senha', {
        email: email.trim(),
        codigo: codigo.trim(),
        novaSenha,
      });
    } catch (e: any) {
      tratarErro(e, 'Não foi possível redefinir a senha. Tente novamente.');
    }
  },
};