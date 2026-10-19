import { api } from '../api';

export type CardDificil = {
  cardId: number;
  pergunta: string;
  notaMedia: number;
};

export type RelatorioTurma = {
  salaId: number;
  nomeSala: string;
  totalAlunos: number;
  mediaFatorFacilidade: number;
  cardsMaisDificeis: CardDificil[];
};

export const relatorioService = {
  obterRelatorioTurma: async (salaId: number): Promise<RelatorioTurma> => {
    const { data } = await api.get(`/relatorios/sala/${salaId}`);
    return data;
  },
};