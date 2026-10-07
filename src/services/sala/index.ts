import { api } from "../api";
import { SalaDTO, CriarSalaPayload } from "./types";

export const salaService = {
  // GET: Busca todas as salas cadastradas do usuário logado
  listarSalas: async (): Promise<SalaDTO[]> => {
    const response = await api.get<SalaDTO[]>("/salas");
    return response.data;
  },

  // POST: Cadastra uma nova sala no banco de dados
  criarSala: async (payload: CriarSalaPayload): Promise<SalaDTO> => {
    const response = await api.post<SalaDTO>("/salas", payload);
    return response.data;
  },

  // GET: Busca uma sala pelo código de convite (usado pelo aluno antes de ingressar)
  buscarSalaPorCodigo: async (codigo: string): Promise<SalaDTO> => {
    const response = await api.get<SalaDTO>(`/salas/buscar/${codigo}`);
    return response.data;
  },

  // POST: Ingressa o aluno logado na sala pelo código
  ingressarNaSala: async (codigo: string): Promise<void> => {
    await api.post("/salas/ingressar", null, {
      params: { codigo },
    });
  },

    // PUT: Atualiza uma sala existente
  atualizarSala: async (id: number, payload: CriarSalaPayload): Promise<SalaDTO> => {
    const response = await api.put<SalaDTO>(`/salas/${id}`, payload);
    return response.data;
  },

  // DELETE: Exclui uma sala
  excluirSala: async (id: number): Promise<void> => {
    await api.delete(`/salas/${id}`);
  },
};