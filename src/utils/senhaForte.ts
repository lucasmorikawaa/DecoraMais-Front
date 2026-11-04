// Para desligar a validação sem apagar nada, troque true por false
export const EXIGIR_SENHA_FORTE = true;

export type RequisitoSenha = { id: string; texto: string; ok: boolean };

export function avaliarSenha(senha: string) {
  const requisitos: RequisitoSenha[] = [
    { id: 'tamanho', texto: 'Pelo menos 8 caracteres', ok: senha.length >= 8 },
    { id: 'maiuscula', texto: 'Uma letra maiúscula', ok: /[A-Z]/.test(senha) },
    { id: 'minuscula', texto: 'Uma letra minúscula', ok: /[a-z]/.test(senha) },
    { id: 'numero', texto: 'Um número', ok: /\d/.test(senha) },
    { id: 'especial', texto: 'Um caractere especial (!@#$%...)', ok: /[^A-Za-z0-9]/.test(senha) },
  ];

  const cumpridos = requisitos.filter((r) => r.ok).length;
  const todosRequisitos = cumpridos === requisitos.length;
  const forte = EXIGIR_SENHA_FORTE ? todosRequisitos : true;

  let nivel: 'vazia' | 'fraca' | 'media' | 'forte' = 'vazia';
  if (senha.length > 0) {
    nivel = todosRequisitos ? 'forte' : cumpridos >= 3 ? 'media' : 'fraca';
  }

  return { requisitos, cumpridos, forte, nivel };
}