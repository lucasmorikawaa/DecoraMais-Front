import { api } from "../api";
import { FlashcardDTO, FlashcardPayload } from "./types";

export const flashcardService = {
  // POST: cria o flashcard e já distribui para as salas informadas
  criarFlashcard: async (payload: FlashcardPayload): Promise<FlashcardDTO> => {
    const response = await api.post<FlashcardDTO>("/flashcards", payload);
    return response.data;
  },

  // PUT: atualiza um flashcard existente
  atualizarFlashcard: async (
    id: number,
    payload: FlashcardPayload,
  ): Promise<FlashcardDTO> => {
    const response = await api.put<FlashcardDTO>(`/flashcards/${id}`, payload);
    return response.data;
  },

  // GET: cards que o aluno deve revisar hoje, em todas as salas dele
  listarPendentesRevisao: async (): Promise<FlashcardDTO[]> => {
    const response = await api.get<FlashcardDTO[]>("/flashcards/revisao");
    return response.data;
  },

  // POST: envia a nota do aluno (0 = não lembro ... 5 = muito fácil)
  avaliarFlashcard: async (flashcardId: number, nota: number) => {
    const response = await api.post("/estudo/revisar", { flashcardId, nota });
    return response.data;
  },
};