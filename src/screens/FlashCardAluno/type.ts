export interface Flashcard {
  id: string;
  pergunta: string;
  resposta: string;
}

export type Dificuldade = 'NAO_LEMBRO' | 'DIFICIL' | 'REGULAR' | 'FACIL';

export interface FlashcardScreenProps {
  cards?: Flashcard[];
  onClose?: () => void;
  onFinish?: () => void;
}