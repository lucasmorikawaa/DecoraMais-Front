import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface SettingsCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode; 
}

export function SettingsCard({ icon, title, subtitle, children }: SettingsCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}