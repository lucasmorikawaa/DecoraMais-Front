import { api } from "../api";
import { FlashcardDTO, FlashcardPayload } from "./types";

// Converte o caminho guardado ("/uploads/x.jpg") em URL completa.
// Guardar só o caminho evita que as imagens quebrem se o IP do servidor mudar.
export function urlImagem(caminho?: string | null): string | null {
  if (!caminho) return null;
  if (caminho.startsWith("http")) return caminho;
  return `${api.defaults.baseURL}${caminho}`;
}

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

  // POST: envia a foto ao servidor e devolve o caminho público (ex.: "/uploads/abc.jpg")
  enviarImagem: async (
    uri: string,
    mimeType: string = "image/jpeg",
    nomeArquivo: string = "imagem.jpg",
  ): Promise<string> => {
    const form = new FormData();
    form.append("arquivo", { uri, name: nomeArquivo, type: mimeType } as any);

    const response = await api.post<{ url: string }>("/flashcards/imagem", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30000,
    });
    return response.data.url;
  },
};