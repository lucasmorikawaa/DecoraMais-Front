import { api } from "../api";
import { CriarSalaPayload } from "./types";

type SalaDTO = {
  id: number;
  nome: string;
  disciplina: string;
  ano: number;
  codigConvite: string;
  professorNome?: string | null;
  quantidadeAlunos?: number | null;
};

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
    const { data } = await api.get(
      `/salas/buscar/${encodeURIComponent(codigo)}`,
    );
    return data;
  },

  ingressarNaSala: async (codigo: string): Promise<SalaDTO> => {
    const { data } = await api.post("/salas/ingressar", null, {
      params: { codigo },
    });
    return data;
  },

  // PUT: Atualiza uma sala existente
  atualizarSala: async (
    id: number,
    payload: CriarSalaPayload,
  ): Promise<SalaDTO> => {
    const response = await api.put<SalaDTO>(`/salas/${id}`, payload);
    return response.data;
  },

  // DELETE: Exclui uma sala
  excluirSala: async (id: number): Promise<void> => {
    await api.delete(`/salas/${id}`);
  },
};
