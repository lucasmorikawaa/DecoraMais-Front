import { Feather } from '@expo/vector-icons';

export type StatusInsignia = 'comprar' | 'equipar' | 'equipado' | 'insuficiente';

export interface CardInsigniaGridProps {
  titulo: string;
  precoXp: number;
  status: StatusInsignia;
  iconName: keyof typeof Feather.glyphMap;
  iconBgColor?: string;
  onPress?: () => void;
}