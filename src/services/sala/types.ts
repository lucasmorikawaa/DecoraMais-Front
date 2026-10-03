// Formato retornado pelo backend tanto em GET /salas quanto em POST /salas
export interface SalaDTO {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
  codigConvite: string;
  professorNome?: string;
  quantidadeAlunos: number;
}

// Interface enviada no POST para criar a sala
export interface CriarSalaPayload {
  nome: string;
  disciplina: string;
  ano: number;
}