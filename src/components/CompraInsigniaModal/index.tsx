import React, { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from 'react-native';
import { InsigniaVisual } from '../InsigniaVisual';

export type InsigniaComprada = {
  nome: string;
  descricao?: string;
  icone?: string; // nome de um ícone Feather (ex.: 'award', 'star', 'zap')
  raridade?: 'comum' | 'rara' | 'epica' | 'lendaria';
  custo?: number;
  cor?: string; // cor principal da insígnia
};

type Props = {
  visible: boolean;
  insignia: InsigniaComprada | null;
  onFechar: () => void;
  onEquipar?: () => void; // opcional: mostra o botão "Equipar agora"
};

const RARIDADES = {
  comum: { label: 'Comum', cor: '#868E96' },
  rara: { label: 'Rara', cor: '#4C8DF6' },
  epica: { label: 'Épica', cor: '#9C36B5' },
  lendaria: { label: 'Lendária', cor: '#F5B800' },
} as const;

const CORES_CONFETE = ['#FA5252', '#F5B800', '#63C35C', '#4C8DF6', '#9C36B5', '#15AABF'];
const QTD_CONFETES = 28;
const TAMANHO_BRILHO = 260;

export function CompraInsigniaModal({ visible, insignia, onFechar, onEquipar }: Props) {
  const overlay = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(0)).current;
  const inclinacao = useRef(new Animated.Value(0)).current;
  const giroBrilho = useRef(new Animated.Value(0)).current;
  const textos = useRef(new Animated.Value(0)).current;
  const botoes = useRef(new Animated.Value(0)).current;

  const confetes = useMemo(
    () =>
      Array.from({ length: QTD_CONFETES }, (_, i) => ({
        progresso: new Animated.Value(0),
        angulo: (Math.PI * 2 * i) / QTD_CONFETES + Math.random() * 0.4,
        distancia: 100 + Math.random() * 90,
        queda: 70 + Math.random() * 80,
        giro: 360 + Math.random() * 540,
        cor: CORES_CONFETE[i % CORES_CONFETE.length],
        largura: 6 + Math.random() * 6,
        altura: 10 + Math.random() * 8,
      })),
    []
  );

  useEffect(() => {
    if (!visible) return;

    overlay.setValue(0);
    escala.setValue(0);
    inclinacao.setValue(0);
    textos.setValue(0);
    botoes.setValue(0);
    giroBrilho.setValue(0);
    confetes.forEach((c) => c.progresso.setValue(0));

    const loopBrilho = Animated.loop(
      Animated.timing(giroBrilho, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loopBrilho.start();

    Animated.sequence([
      Animated.timing(overlay, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(escala, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(inclinacao, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(inclinacao, { toValue: -1, duration: 220, useNativeDriver: true }),
          Animated.timing(inclinacao, { toValue: 0, duration: 180, useNativeDriver: true }),
        ]),
        Animated.stagger(
          12,
          confetes.map((c) =>
            Animated.timing(c.progresso, {
              toValue: 1,
              duration: 1400,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            })
          )
        ),
        Animated.sequence([
          Animated.delay(350),
          Animated.timing(textos, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(botoes, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]).start();

    return () => loopBrilho.stop();
  }, [visible]);

  if (!insignia) return null;

  const raridade = RARIDADES[insignia.raridade ?? 'comum'];
  const rotBrilho = giroBrilho.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const rotInsignia = inclinacao.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });
  const subirTexto = textos.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const subirBotoes = botoes.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onFechar}>
      <Animated.View style={[styles.overlay, { opacity: overlay }]}>
        <View style={styles.palco}>
          {/* Raios girando atrás da insígnia */}
          <Animated.View
            style={[styles.brilho, { transform: [{ rotate: rotBrilho }] }]}
            pointerEvents="none"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.raio,
                  { backgroundColor: raridade.cor, transform: [{ rotate: `${i * 22.5}deg` }] },
                ]}
              />
            ))}
          </Animated.View>

          {/* Confetes */}
          {confetes.map((c, i) => {
            const x = c.progresso.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(c.angulo) * c.distancia],
            });
            const y = c.progresso.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [
                0,
                Math.sin(c.angulo) * c.distancia,
                Math.sin(c.angulo) * c.distancia + c.queda,
              ],
            });
            const opacidade = c.progresso.interpolate({
              inputRange: [0, 0.1, 0.75, 1],
              outputRange: [0, 1, 1, 0],
            });
            const giro = c.progresso.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', `${c.giro}deg`],
            });
            return (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: c.largura,
                  height: c.altura,
                  borderRadius: 2,
                  backgroundColor: c.cor,
                  opacity: opacidade,
                  transform: [{ translateX: x }, { translateY: y }, { rotate: giro }],
                }}
              />
            );
          })}

          {/* Insígnia */}
          <Animated.View
            style={{ transform: [{ scale: escala }, { rotate: rotInsignia }] }}
          >
            <InsigniaVisual
              iconName={insignia.icone || 'award'}
              cor={insignia.cor || raridade.cor}
              raridade={insignia.raridade ?? 'comum'}
              tamanho={150}
              semRaios
            />
          </Animated.View>
        </View>

        <Animated.View
          style={[styles.textos, { opacity: textos, transform: [{ translateY: subirTexto }] }]}
        >
          <Text style={styles.titulo}>Nova insígnia!</Text>
          <Text style={styles.nome}>{insignia.nome}</Text>
          <View style={[styles.chip, { backgroundColor: raridade.cor }]}>
            <Text style={styles.chipTexto}>{raridade.label}</Text>
          </View>
          {!!insignia.descricao && <Text style={styles.descricao}>{insignia.descricao}</Text>}
          {typeof insignia.custo === 'number' && (
            <Text style={styles.custo}>-{insignia.custo} XP</Text>
          )}
        </Animated.View>

        <Animated.View
          style={[styles.botoes, { opacity: botoes, transform: [{ translateY: subirBotoes }] }]}
        >
          {onEquipar && (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.botao, { backgroundColor: raridade.cor }]}
              onPress={() => {
                onEquipar();
                onFechar();
              }}
            >
              <Text style={styles.botaoTexto}>Equipar agora</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.botao, styles.botaoSecundario]}
            onPress={onFechar}
          >
            <Text style={[styles.botaoTexto, { color: '#FFFFFF' }]}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

export default CompraInsigniaModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 30, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  palco: {
    width: TAMANHO_BRILHO,
    height: TAMANHO_BRILHO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brilho: {
    position: 'absolute',
    width: TAMANHO_BRILHO,
    height: TAMANHO_BRILHO,
    justifyContent: 'center',
    alignItems: 'center',
  },
  raio: {
    position: 'absolute',
    width: 8,
    height: TAMANHO_BRILHO,
    borderRadius: 4,
    opacity: 0.22,
  },
  textos: { alignItems: 'center', marginTop: 8 },
  titulo: { fontSize: 14, fontWeight: '700', color: '#FFD43B', letterSpacing: 2, textTransform: 'uppercase' },
  nome: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF', marginTop: 6, textAlign: 'center' },
  chip: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 4, borderRadius: 12 },
  chipTexto: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  descricao: { fontSize: 14, color: '#CED4DA', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  custo: { fontSize: 13, color: '#ADB5BD', marginTop: 8 },
  botoes: { width: '100%', marginTop: 28, gap: 10 },
  botao: { height: 52, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  botaoSecundario: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
  botaoTexto: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});