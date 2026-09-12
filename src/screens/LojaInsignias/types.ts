import { Feather } from '@expo/vector-icons';
import { StatusInsignia } from '../../components/CardInsigniaGrid/types';

export interface InsigniaItem {
  id: string;
  titulo: string;
  precoXp: number;
  status: StatusInsignia;
  iconName: keyof typeof Feather.glyphMap;
  iconBgColor: string;
}

export interface LojaInsigniasScreenProps {
  usuarioXp?: number;
  onGoBack?: () => void;
}