// Formato retornado pelo backend (FlashcardResponseDTO)
export interface FlashcardDTO {
  id: number;
  pergunta: string;
  resposta: string;
  dataCriacao: string;
  imagem?: string | null;
  dataDisponibilidade?: string | null; // formato yyyy-MM-dd
  salaIds: number[];
}

// Enviado no POST/PUT (FlashcardRequestDTO)
export interface FlashcardPayload {
  pergunta: string;
  resposta: string;
  imagem?: string;
  dataDisponibilidade?: string; // formato yyyy-MM-dd
  salaIds: number[];
}