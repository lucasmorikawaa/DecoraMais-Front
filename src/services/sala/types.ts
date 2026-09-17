// Interface que mapeia o que vem do seu DTO no Spring Boot (SalaResponseDTO)
export interface SalaDTO {
  id: string;
  nome: string;       // equivale ao período/nome da sala
  disciplina: string; // equivale à matéria
  anoLetivo: string;  // equivale ao ano
  numAlunos: number;
  codigoConvite: string;
}

// Interface enviada no POST para criar a sala (CriarSalaDTO)
export interface CriarSalaPayload {
  nome: string;
  disciplina: string;
  anoLetivo: string;
}