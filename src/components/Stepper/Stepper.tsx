import React from 'react';
import { View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <View style={styles.container}>
      {/* Etapa 1: Criar */}
      <View style={[styles.circle, currentStep >= 1 && styles.activeCircle]}>
        <Feather 
          name="plus" 
          size={20} 
          color={currentStep >= 1 ? "#FFFFFF" : "#6C757D"} 
        />
      </View>

      <View style={[styles.line, currentStep >= 2 && styles.activeLine]} />

      {/* Etapa 2: Turmas / Usuários */}
      <View style={[styles.circle, currentStep >= 2 && styles.activeCircle]}>
        <Feather 
          name="users" 
          size={18} 
          color={currentStep >= 2 ? "#FFFFFF" : "#6C757D"} 
        />
      </View>

      <View style={[styles.line, currentStep >= 3 && styles.activeLine]} />

      {/* Etapa 3: Sucesso */}
      <View style={[styles.circle, currentStep >= 3 && styles.completedCircle]}>
        <Feather 
          name="check" 
          size={20} 
          color={currentStep >= 3 ? "#FFFFFF" : "#6C757D"} 
        />
      </View>
    </View>
  );
}