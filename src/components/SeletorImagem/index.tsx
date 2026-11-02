import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { flashcardService, urlImagem } from '../../services/flashcard';

type Props = {
  value: string | null;                  // caminho salvo (ex.: "/uploads/abc.jpg")
  onChange: (caminho: string | null) => void;
  disabled?: boolean;
};

export function SeletorImagem({ value, onChange, disabled }: Props) {
  const [enviando, setEnviando] = useState(false);

  const escolher = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Permita o acesso às fotos para escolher uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7, // comprime para a foto não ficar pesada
    });
    if (resultado.canceled) return;

    const foto = resultado.assets[0];
    setEnviando(true);
    try {
      const caminho = await flashcardService.enviarImagem(
        foto.uri,
        foto.mimeType ?? 'image/jpeg',
        foto.fileName ?? 'imagem.jpg'
      );
      onChange(caminho);
    } catch (e: any) {
      const msg = !e?.response
        ? 'Não foi possível conectar ao servidor.'
        : e.response.data?.mensagem || 'Não foi possível enviar a imagem.';
      Alert.alert('Erro', msg);
    } finally {
      setEnviando(false);
    }
  };

  const uri = urlImagem(value);

  return (
    <View>
      <Text style={styles.label}>Imagem (opcional)</Text>

      {uri ? (
        <View style={styles.previewBox}>
          <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
          <TouchableOpacity
            style={styles.remover}
            onPress={() => onChange(null)}
            disabled={disabled || enviando}
            hitSlop={8}
          >
            <Feather name="x" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.botao}
          onPress={escolher}
          disabled={disabled || enviando}
          activeOpacity={0.8}
        >
          {enviando ? (
            <ActivityIndicator color="#155DFC" />
          ) : (
            <>
              <Feather name="image" size={20} color="#155DFC" />
              <Text style={styles.botaoTexto}>Escolher imagem</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SeletorImagem;

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: '#212529', marginBottom: 6, marginTop: 8 },
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#155DFC',
    backgroundColor: '#EDF2FF',
  },
  botaoTexto: { color: '#155DFC', fontWeight: '600', fontSize: 14 },
  previewBox: { borderRadius: 12, overflow: 'hidden' },
  preview: { width: '100%', height: 160, backgroundColor: '#E9ECEF' },
  remover: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});