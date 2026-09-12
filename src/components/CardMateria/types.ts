import { Feather } from '@expo/vector-icons';

export interface CardMateriaProps {
  nome: string;
  cursoSemestre: string;
  cardsParaRevisar: number;
  iconName: keyof typeof Feather.glyphMap;
  iconBgColor: string;
  onPress?: () => void;
}