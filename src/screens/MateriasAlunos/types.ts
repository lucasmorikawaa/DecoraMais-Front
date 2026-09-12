import { CardMateriaProps } from '../../components/CardMateria/types';

export interface MateriaItem extends Omit<CardMateriaProps, 'onPress'> {
  id: string;
}

export interface TodasMateriasScreenProps {
  onSelectMateria?: (materiaId: string) => void;
}