import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SettingsCard } from '../../components/ConfiguracaoCard/ConfiguracaoCard';
import { styles } from './styles';

export function Configuracoes() {
  // Estados para Informações do Perfil
  const [nome, setNome] = useState('Renato Russo');
  const [email, setEmail] = useState('julioaguiar@fatec.sp.gov');
  const [instituicao, setInstituicao] = useState('Universidade Exemplo');

  // Estados para Segurança
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título da Tela */}
        <Text style={styles.headerTitle}>Configurações</Text>
        <Text style={styles.headerSubtitle}>Gerencie suas preferências e conta</Text>

        {/* Card 1: Informações do Perfil */}
        <SettingsCard
          icon={<Text style={{ fontSize: 20 }}>👤</Text>} // Pode trocar por ícone de biblioteca depois
          title="Informações do perfil"
          subtitle="Atualize suas informações pessoais do perfil"
        >
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Instituição</Text>
          <TextInput
            style={styles.input}
            value={instituicao}
            onChangeText={setInstituicao}
          />

          <TouchableOpacity style={styles.buttonPrimary} activeOpacity={0.8}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>✏️</Text>
            <Text style={styles.buttonPrimaryText}>Editar</Text>
          </TouchableOpacity>
        </SettingsCard>

        {/* Card 2: Segurança */}
        <SettingsCard
          icon={<Text style={{ fontSize: 20 }}>🔒</Text>}
          title="Segurança"
          subtitle="Gerencie a segurança da sua conta"
        >
          <Text style={styles.label}>Senha atual</Text>
          <TextInput
            style={styles.input}
            value={senhaAtual}
            onChangeText={setSenhaAtual}
            secureTextEntry
          />

          <Text style={styles.label}>Nova senha</Text>
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Confirmar nova senha</Text>
          <TextInput
            style={styles.input}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />

          <TouchableOpacity style={styles.buttonSecondary} activeOpacity={0.8}>
            <Text style={styles.buttonSecondaryText}>Alterar senha</Text>
          </TouchableOpacity>
        </SettingsCard>

      </ScrollView>
    </View>
  );
}