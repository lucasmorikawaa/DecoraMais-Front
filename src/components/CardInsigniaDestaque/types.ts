import { Feather } from '@expo/vector-icons';

export interface CardInsigniaDestaqueProps {
  titulo: string;
  descricao: string;
  precoXp: number;
  usuarioXp: number;
  iconName: keyof typeof Feather.glyphMap;
  iconBgColor?: string;
  onPress?: () => void;
}