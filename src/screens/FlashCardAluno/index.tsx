import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { FlashcardScreenProps, Flashcard, Dificuldade } from './type';

// Dados de exemplo
const CARDS_MOCK: Flashcard[] = [
  {
    id: '1',
    pergunta: 'O que é uma Pilha (Stack) ?',
    resposta: 'Uma estrutura de dados LIFO (Last In, First Out) onde o último elemento inserido é o primeiro a ser removido. Pense em uma pilha de pratos!',
  },
  {
    id: '2',
    pergunta: 'O que é uma Fila (Queue) ?',
    resposta: 'Uma estrutura de dados FIFO (First In, First Out) onde o primeiro elemento a entrar é o primeiro a sair. Pense em uma fila de banco!',
  },
];

export function FlashcardScreen({
  cards = CARDS_MOCK,
  onClose,
  onFinish,
}: FlashcardScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = cards[currentIndex];
  const totalCards = cards.length;
  const progressPercent = ((currentIndex + 1) / totalCards) * 100;

  const handleEvaluate = (nivel: Dificuldade) => {
    // Aqui no futuro você pode integrar o algoritmo SM-2 passando o nível selecionado
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      Alert.alert('Parabéns!', 'Você concluiu a revisão dessa matéria.', [
        { text: 'OK', onPress: onFinish || onClose },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Topo: Botão de Fechar e Contador */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={26} color="#495057" />
          </TouchableOpacity>

          <Text style={styles.counterText}>
            {currentIndex + 1}/{totalCards}
          </Text>

          <View style={styles.placeholderView} />
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Card Central */}
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() => setShowAnswer(!showAnswer)}
      >
        <Text style={[styles.cardTag, showAnswer ? styles.cardTagResposta : styles.cardTagPergunta]}>
          {showAnswer ? 'Resposta' : 'Pergunta'}
        </Text>

        <Text style={styles.cardTextMain}>
          {showAnswer ? currentCard.resposta : currentCard.pergunta}
        </Text>

        {!showAnswer && (
          <Text style={styles.cardTextSub}>Toque para ver a resposta</Text>
        )}
      </TouchableOpacity>

      {/* Botões de Avaliação (visíveis apenas ao revelar a resposta) */}
      <View style={styles.actionsContainer}>
        {showAnswer && (
          <>
            <TouchableOpacity
              style={[styles.btn, styles.btnNaoLembro]}
              onPress={() => handleEvaluate('NAO_LEMBRO')}
            >
              <View style={styles.btnLeftContent}>
                <Feather name="refresh-cw" size={20} color="#FFF" />
                <Text style={styles.btnText}>Não lembro</Text>
              </View>
              <Text style={styles.btnXpText}>0 XP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnDificil]}
              onPress={() => handleEvaluate('DIFICIL')}
            >
              <View style={styles.btnLeftContent}>
                <Feather name="alert-triangle" size={20} color="#FFF" />
                <Text style={styles.btnText}>Difícil</Text>
              </View>
              <Text style={styles.btnXpText}>+5 XP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnRegular]}
              onPress={() => handleEvaluate('REGULAR')}
            >
              <View style={styles.btnLeftContent}>
                <Feather name="clock" size={20} color="#FFF" />
                <Text style={styles.btnText}>Regular</Text>
              </View>
              <Text style={styles.btnXpText}>+10 XP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnFacil]}
              onPress={() => handleEvaluate('FACIL')}
            >
              <View style={styles.btnLeftContent}>
                <Feather name="check-circle" size={20} color="#FFF" />
                <Text style={styles.btnText}>Fácil</Text>
              </View>
              <Text style={styles.btnXpText}>+20 XP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}