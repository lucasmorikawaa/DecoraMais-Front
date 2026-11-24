import { api } from '../api';
import { RaridadeInsignia } from '../../components/InsigniaVisual';

export type InsigniaDTO = {
  id: number;
  titulo: string;
  frase: string;
  precoXp: number;
  iconName: string;
  cor: string;
  raridade: RaridadeInsignia;
  destaque: boolean;
  status: 'comprar' | 'equipar' | 'equipado';
};

export type LojaInsigniasDTO = {
  xp: number;
  insignias: InsigniaDTO[];
};

// Toda ação devolve a loja inteira já atualizada (saldo + situação de cada insígnia)
export const insigniaService = {
  carregarLoja: async (): Promise<LojaInsigniasDTO> => {
    const response = await api.get<LojaInsigniasDTO>('/insignias');
    return response.data;
  },

  comprar: async (id: number): Promise<LojaInsigniasDTO> => {
    const response = await api.post<LojaInsigniasDTO>(`/insignias/${id}/comprar`);
    return response.data;
  },

  // Equipa; se já estava equipada, desequipa
  alternarEquipar: async (id: number): Promise<LojaInsigniasDTO> => {
    const response = await api.post<LojaInsigniasDTO>(`/insignias/${id}/equipar`);
    return response.data;
  },
};