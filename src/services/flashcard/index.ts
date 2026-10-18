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
};