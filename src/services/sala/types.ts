// Interface que mapeia o que vem do seu DTO no Spring Boot (SalaResponseDTO)
export interface SalaDTO {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
  codigConvite: string;
}

// Interface enviada no POST para criar a sala (CriarSalaDTO)
export interface CriarSalaPayload {
  nome: string;
  disciplina: string;
  anoLetivo: string;
}