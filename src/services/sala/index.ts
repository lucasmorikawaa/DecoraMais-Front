import { api } from '../api';
import { SalaDTO, CriarSalaPayload } from './types';

export const salaService = {
  // GET: Busca todas as salas cadastradas do usuário logado
  listarSalas: async (): Promise<SalaDTO[]> => {
    const response = await api.get<SalaDTO[]>('/salas');
    return response.data;
  },

  // POST: Cadastra uma nova sala no banco de dados
  criarSala: async (payload: CriarSalaPayload): Promise<SalaDTO> => {
    const response = await api.post<SalaDTO>('/salas', payload);
    return response.data;
  },
};