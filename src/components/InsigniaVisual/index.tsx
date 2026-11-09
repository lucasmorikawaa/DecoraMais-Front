import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export type RaridadeInsignia = 'comum' | 'rara' | 'epica' | 'lendaria';

type Props = {
  iconName: string; // nome de ícone Feather
  cor: string; // cor principal da insígnia
  raridade: RaridadeInsignia;
  tamanho?: number; // diâmetro da insígnia (o espaço total é 1,6x)
  bloqueada?: boolean; // cinza, sem animação, com cadeado
  semRaios?: boolean; // desliga os raios (ex.: quando a tela já tem os seus)
};

const ANEL: Record<RaridadeInsignia, { cor: string; escuro: string; glow: number; faiscas: number }> = {
  comum: { cor: '#CED4DA', escuro: '#868E96', glow: 0, faiscas: 0 },
  rara: { cor: '#74A8FF', escuro: '#1C5FD1', glow: 0.22, faiscas: 0 },
  epica: { cor: '#C77DEB', escuro: '#7B2D9E', glow: 0.35, faiscas: 3 },
  lendaria: { cor: '#FFE066', escuro: '#E08E00', glow: 0.45, faiscas: 5 },
};

// Posições das faíscas (fração do tamanho, a partir do centro)
const FAISCAS = [
  { x: -0.58, y: -0.42, s: 0.24 },
  { x: 0.56, y: -0.5, s: 0.19 },
  { x: 0.6, y: 0.34, s: 0.21 },
  { x: -0.6, y: 0.4, s: 0.17 },
  { x: 0.02, y: -0.68, s: 0.16 },
];

export function InsigniaVisual({
  iconName,
  cor,
  raridade,
  tamanho = 96,
  bloqueada = false,
  semRaios = false,
}: Props) {
  const S = tamanho;
  const W = S * 1.6;
  const cfg = ANEL[raridade];
  const animar = !bloqueada && raridade !== 'comum';

  const corAnel = bloqueada ? '#CED4DA' : cfg.cor;
  const corAnelEscuro = bloqueada ? '#868E96' : cfg.escuro;
  const corBase = bloqueada ? '#ADB5BD' : cor;

  const pulso = useRef(new Animated.Value(0)).current;
  const giro = useRef(new Animated.Value(0)).current;
  const brilho = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animar) return;

    const loops: Animated.CompositeAnimation[] = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulso, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulso, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ),
    ];

    if (raridade === 'lendaria' && !semRaios) {
      loops.push(
        Animated.loop(
          Animated.timing(giro, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true })
        )
      );
    }

    if (raridade === 'epica' || raridade === 'lendaria') {
      loops.push(
        Animated.loop(
          Animated.sequence([
            Animated.timing(brilho, { toValue: 1, duration: 1500, easing: Easing.linear, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(brilho, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        )
      );
    }

    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [animar, raridade, semRaios]);

  const rotacao = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const glowOpacidade = pulso.interpolate({
    inputRange: [0, 1],
    outputRange: [cfg.glow * 0.6, cfg.glow * 1.5],
  });
  const glowEscala = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const brilhoX = brilho.interpolate({ inputRange: [0, 1], outputRange: [-S * 0.7, S * 0.7] });
  const faiscaOpacidadeA = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const faiscaOpacidadeB = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] });
  const faiscaEscalaA = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] });
  const faiscaEscalaB = pulso.interpolate({ inputRange: [0, 1], outputRange: [1.15, 0.7] });

  const borda = Math.max(2, S * 0.03);

  return (
    <View style={{ width: W, height: W, alignItems: 'center', justifyContent: 'center' }}>
      {/* Raios girando (lendária) */}
      {animar && raridade === 'lendaria' && !semRaios && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: W,
            height: W,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ rotate: rotacao }],
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: S * 0.09,
                height: W,
                borderRadius: S * 0.05,
                backgroundColor: cfg.cor,
                opacity: 0.28,
                transform: [{ rotate: `${i * 22.5}deg` }],
              }}
            />
          ))}
        </Animated.View>
      )}

      {/* Aura pulsante */}
      {animar && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: S * 1.3,
            height: S * 1.3,
            borderRadius: S * 0.65,
            backgroundColor: cfg.cor,
            opacity: glowOpacidade,
            transform: [{ scale: glowEscala }],
          }}
        />
      )}

      {/* Moeda: anel escuro > anel claro > miolo colorido */}
      <View
        style={{
          width: S,
          height: S,
          borderRadius: S / 2,
          backgroundColor: corAnelEscuro,
          alignItems: 'center',
          justifyContent: 'center',
          elevation: bloqueada ? 2 : 8,
          shadowColor: corAnelEscuro,
          shadowOpacity: 0.6,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <View
          style={{
            width: S * 0.93,
            height: S * 0.93,
            borderRadius: (S * 0.93) / 2,
            backgroundColor: corAnel,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: S * 0.78,
              height: S * 0.78,
              borderRadius: (S * 0.78) / 2,
              backgroundColor: corBase,
              borderWidth: borda,
              borderColor: 'rgba(255,255,255,0.55)',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Reflexo que passa pela insígnia (épica e lendária) */}
            {animar && (raridade === 'epica' || raridade === 'lendaria') && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  width: S * 0.22,
                  height: S * 1.2,
                  backgroundColor: '#FFFFFF',
                  opacity: 0.45,
                  transform: [{ translateX: brilhoX }, { rotate: '20deg' }],
                }}
              />
            )}

            {/* Brilho fixo no canto */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: S * 0.06,
                left: S * 0.1,
                width: S * 0.34,
                height: S * 0.15,
                borderRadius: S * 0.1,
                backgroundColor: '#FFFFFF',
                opacity: 0.3,
                transform: [{ rotate: '-28deg' }],
              }}
            />

            <Feather name={iconName as any} size={S * 0.4} color="#FFFFFF" />

            {bloqueada && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: 'rgba(33,37,41,0.55)', alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <Feather name="lock" size={S * 0.3} color="#FFFFFF" />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Faíscas piscando (épica e lendária) */}
      {animar &&
        FAISCAS.slice(0, cfg.faiscas).map((f, i) => {
          const tam = S * f.s;
          const par = i % 2 === 0;
          return (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: W / 2 + f.x * S - tam / 2,
                top: W / 2 + f.y * S - tam / 2,
                opacity: par ? faiscaOpacidadeA : faiscaOpacidadeB,
                transform: [{ scale: par ? faiscaEscalaA : faiscaEscalaB }],
              }}
            >
              <Ionicons
                name="sparkles"
                size={tam}
                color={raridade === 'lendaria' ? '#FFD43B' : cfg.cor}
              />
            </Animated.View>
          );
        })}
    </View>
  );
}

export default InsigniaVisual;