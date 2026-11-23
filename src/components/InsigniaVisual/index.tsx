import React, { useEffect, useMemo, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Circle,
  Ellipse,
  G,
  ClipPath,
  Rect,
} from 'react-native-svg';

export type RaridadeInsignia = 'comum' | 'rara' | 'epica' | 'lendaria';

type Props = {
  iconName: string; // nome de ícone Feather (é trocado automaticamente por um ícone mais temático)
  cor: string; // cor principal da insígnia (hex)
  raridade: RaridadeInsignia;
  tamanho?: number; // diâmetro do emblema (o espaço total é ~1,7x, por causa da coroa, asas e fita)
  bloqueada?: boolean; // cinza, sem animação, com cadeado
  semRaios?: boolean; // desliga os raios girando (ex.: quando a tela já tem os seus)
};

/* ------------------------------------------------------------------ */
/*  Paletas por raridade                                               */
/* ------------------------------------------------------------------ */

type Paleta = {
  rimLuz: string;
  rimMeio: string;
  rimEscuro: string;
  fita: string;
  estrela: string;
  gema: string;
  aura: string;
  glow: number;
  estrelas: number;
};

const PALETAS: Record<RaridadeInsignia, Paleta> = {
  comum: {
    rimLuz: '#F6D9B0',
    rimMeio: '#D19A5B',
    rimEscuro: '#8E5524',
    fita: '#9A5F2C',
    estrela: '#FFE9BE',
    gema: '#FFE9BE',
    aura: '#FFC078',
    glow: 0,
    estrelas: 1,
  },
  rara: {
    rimLuz: '#FFFFFF',
    rimMeio: '#C5CDD8',
    rimEscuro: '#6F7C8C',
    fita: '#2F6FDE',
    estrela: '#FFE066',
    gema: '#74C0FC',
    aura: '#5C9DFF',
    glow: 0.45,
    estrelas: 2,
  },
  epica: {
    rimLuz: '#FBE6FF',
    rimMeio: '#D08BF0',
    rimEscuro: '#7B2D9E',
    fita: '#8E2DB3',
    estrela: '#FFE066',
    gema: '#FF8AC2',
    aura: '#C77DEB',
    glow: 0.65,
    estrelas: 3,
  },
  lendaria: {
    rimLuz: '#FFF6BF',
    rimMeio: '#FFC832',
    rimEscuro: '#C77700',
    fita: '#D9480F',
    estrela: '#FFF3A3',
    gema: '#FF5C5C',
    aura: '#FFD43B',
    glow: 0.85,
    estrelas: 4,
  },
};

const PALETA_BLOQUEADA: Paleta = {
  rimLuz: '#E9ECEF',
  rimMeio: '#ADB5BD',
  rimEscuro: '#6C757D',
  fita: '#868E96',
  estrela: '#CED4DA',
  gema: '#CED4DA',
  aura: '#ADB5BD',
  glow: 0,
  estrelas: 1,
};

// Troca os ícones simples (Feather) por ícones mais temáticos, sem você precisar mexer na loja
const ICONES_TEMATICOS: Record<string, string> = {
  award: 'medal',
  shield: 'shield-star',
  zap: 'rocket-launch',
  'trending-up': 'fire',
  star: 'brain',
  sun: 'crown',
  target: 'bullseye-arrow',
};

/* ------------------------------------------------------------------ */
/*  Cores                                                              */
/* ------------------------------------------------------------------ */

function hexParaRgb(hex: string): [number, number, number] {
  let h = (hex || '').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  if (isNaN(n) || h.length !== 6) return [128, 128, 128];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function misturar(hex: string, alvo: string, t: number) {
  const a = hexParaRgb(hex);
  const b = hexParaRgb(alvo);
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const clarear = (hex: string, t: number) => misturar(hex, '#FFFFFF', t);
const escurecer = (hex: string, t: number) => misturar(hex, '#000000', t);

/* ------------------------------------------------------------------ */
/*  Formas (viewBox 200 x 200, centro em 100,100)                      */
/* ------------------------------------------------------------------ */

const CX = 100;
const CY = 100;

function circulo(r: number) {
  return `M ${CX - r} ${CY} A ${r} ${r} 0 1 0 ${CX + r} ${CY} A ${r} ${r} 0 1 0 ${CX - r} ${CY} Z`;
}

function poligono(n: number, r: number, rotacao = -90) {
  const pts = Array.from({ length: n }, (_, i) => {
    const a = ((rotacao + (360 / n) * i) * Math.PI) / 180;
    return `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M ${pts.join(' L ')} Z`;
}

// Selo serrilhado (estrela de pontas curtas)
function selo(n: number, rExt: number, rInt: number) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 === 0 ? rExt : rInt;
    const a = (-90 + (180 / n) * i) * (Math.PI / 180);
    return `${(CX + r * Math.cos(a)).toFixed(2)} ${(CY + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M ${pts.join(' L ')} Z`;
}

function estrela(cx: number, cy: number, rExt: number, rInt: number) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? rExt : rInt;
    const a = (-90 + 36 * i) * (Math.PI / 180);
    return `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  });
  return `M ${pts.join(' L ')} Z`;
}

const ESCUDO = 'M 46 50 Q 100 36 154 50 L 154 98 C 154 132 128 150 100 162 C 72 150 46 132 46 98 Z';

function formaDe(raridade: RaridadeInsignia) {
  switch (raridade) {
    case 'rara':
      return poligono(6, 60);
    case 'epica':
      return selo(12, 63, 54);
    case 'lendaria':
      return ESCUDO;
    default:
      return circulo(58);
  }
}

// Gemas na borda de cada formato
function gemasDe(raridade: RaridadeInsignia): { x: number; y: number; r: number }[] {
  if (raridade === 'rara') {
    return Array.from({ length: 6 }, (_, i) => {
      const a = ((-90 + 60 * i) * Math.PI) / 180;
      return { x: CX + 60 * Math.cos(a), y: CY + 60 * Math.sin(a), r: 3.6 };
    });
  }
  if (raridade === 'epica') {
    return Array.from({ length: 4 }, (_, i) => {
      const a = ((-90 + 90 * i) * Math.PI) / 180;
      return { x: CX + 62 * Math.cos(a), y: CY + 62 * Math.sin(a), r: 4 };
    });
  }
  if (raridade === 'lendaria') {
    return [
      { x: 46, y: 51, r: 4.6 },
      { x: 154, y: 51, r: 4.6 },
      { x: 100, y: 161, r: 5 },
    ];
  }
  return [];
}

const TRANSFORMA_MIOLO = `translate(${CX} ${CY}) scale(0.8) translate(${-CX} ${-CY})`;
const TRANSFORMA_LINHA = `translate(${CX} ${CY}) scale(0.73) translate(${-CX} ${-CY})`;

// Pena da asa (aponta para a direita)
const PENA = 'M 0 0 C 8 -13 32 -17 52 -8 C 40 1 20 7 0 0 Z';
const PENAS = [
  { ang: -58, esc: 0.85 },
  { ang: -33, esc: 0.95 },
  { ang: -8, esc: 0.85 },
  { ang: 17, esc: 0.7 },
];

/* ------------------------------------------------------------------ */
/*  Componente                                                         */
/* ------------------------------------------------------------------ */

// Posições das faíscas (fração do tamanho, a partir do centro)
const FAISCAS = [
  { x: -0.62, y: -0.5, s: 0.26 },
  { x: 0.62, y: -0.55, s: 0.2 },
  { x: 0.68, y: 0.3, s: 0.22 },
  { x: -0.66, y: 0.28, s: 0.18 },
  { x: 0.02, y: -0.78, s: 0.17 },
];
const QTD_FAISCAS: Record<RaridadeInsignia, number> = { comum: 0, rara: 0, epica: 3, lendaria: 5 };

export function InsigniaVisual({
  iconName,
  cor,
  raridade,
  tamanho = 96,
  bloqueada = false,
  semRaios = false,
}: Props) {
  const S = tamanho;
  const W = S * 1.72;
  const px = W / 200; // 1 unidade do viewBox em pixels

  const pal = bloqueada ? PALETA_BLOQUEADA : PALETAS[raridade];
  const corBase = bloqueada ? '#6C757D' : cor;
  const animar = !bloqueada && raridade !== 'comum';
  const comRaios = animar && raridade === 'lendaria' && !semRaios;

  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), []);
  const gid = (nome: string) => `${nome}${uid}`;
  const ref = (nome: string) => `url(#${gid(nome)})`;

  const forma = useMemo(() => formaDe(raridade), [raridade]);
  const gemas = useMemo(() => gemasDe(raridade), [raridade]);

  const pulso = useRef(new Animated.Value(0)).current;
  const giro = useRef(new Animated.Value(0)).current;
  const brilho = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animar) return;

    const loops: Animated.CompositeAnimation[] = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulso, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(pulso, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      ),
    ];

    if (comRaios) {
      loops.push(
        Animated.loop(
          Animated.timing(giro, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true })
        )
      );
    }

    if (raridade === 'epica' || raridade === 'lendaria') {
      loops.push(
        Animated.loop(
          Animated.sequence([
            Animated.timing(brilho, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true }),
            Animated.delay(1600),
            Animated.timing(brilho, { toValue: 0, duration: 0, useNativeDriver: true }),
          ])
        )
      );
    }

    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [animar, comRaios, raridade]);

  const rotacao = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const auraOpacidade = pulso.interpolate({
    inputRange: [0, 1],
    outputRange: [Math.min(1, pal.glow * 0.6), Math.min(1, pal.glow * 1.3)],
  });
  const auraEscala = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.08] });
  const brilhoX = brilho.interpolate({ inputRange: [0, 1], outputRange: [-W * 0.3, W * 0.3] });
  const faiscaA = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const faiscaB = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] });
  const escalaA = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] });
  const escalaB = pulso.interpolate({ inputRange: [0, 1], outputRange: [1.15, 0.7] });

  // Ícone: troca por um mais temático quando existir
  const nomeTematico = ICONES_TEMATICOS[iconName];
  const usaTematico = !!nomeTematico && !!(MaterialCommunityIcons as any).glyphMap?.[nomeTematico];
  const tamIcone = S * 0.44;
  const sombraIcone = {
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  };

  // Estrelas da fita
  const qtdEstrelas = pal.estrelas;
  const passoEstrela = 19;
  const xInicio = CX - ((qtdEstrelas - 1) * passoEstrela) / 2;

  const faceClaro = clarear(corBase, 0.38);
  const faceEscuro = escurecer(corBase, 0.38);
  const faceBorda = escurecer(corBase, 0.5);

  return (
    <View style={{ width: W, height: W, alignItems: 'center', justifyContent: 'center' }}>
      {/* Aura pulsante */}
      {animar && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: W,
            height: W,
            opacity: auraOpacidade,
            transform: [{ scale: auraEscala }],
          }}
        >
          <Svg width={W} height={W} viewBox="0 0 200 200">
            <Defs>
              <RadialGradient id={gid('aura')} cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                <Stop offset="0.3" stopColor={pal.aura} stopOpacity="0.95" />
                <Stop offset="1" stopColor={pal.aura} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx="100" cy="100" r="100" fill={ref('aura')} />
          </Svg>
        </Animated.View>
      )}

      {/* Raios girando (lendária) */}
      {comRaios && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: W,
            height: W,
            transform: [{ rotate: rotacao }],
          }}
        >
          <Svg width={W} height={W} viewBox="0 0 200 200">
            <Defs>
              <RadialGradient id={gid('raio')} cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                <Stop offset="0.35" stopColor="#FFE066" stopOpacity="0.7" />
                <Stop offset="1" stopColor="#FFE066" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            {Array.from({ length: 12 }, (_, i) => {
              const a1 = ((i * 30 - 7) * Math.PI) / 180;
              const a2 = ((i * 30 + 7) * Math.PI) / 180;
              const d = `M 100 100 L ${100 + 100 * Math.cos(a1)} ${100 + 100 * Math.sin(a1)} L ${
                100 + 100 * Math.cos(a2)
              } ${100 + 100 * Math.sin(a2)} Z`;
              return <Path key={i} d={d} fill={ref('raio')} />;
            })}
          </Svg>
        </Animated.View>
      )}

      {/* Emblema */}
      <Svg width={W} height={W} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id={gid('rim')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={pal.rimLuz} />
            <Stop offset="0.5" stopColor={pal.rimMeio} />
            <Stop offset="1" stopColor={pal.rimEscuro} />
          </LinearGradient>
          <RadialGradient id={gid('face')} cx="50%" cy="32%" r="75%">
            <Stop offset="0" stopColor={faceClaro} />
            <Stop offset="0.55" stopColor={corBase} />
            <Stop offset="1" stopColor={faceEscuro} />
          </RadialGradient>
          <LinearGradient id={gid('fita')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={clarear(pal.fita, 0.3)} />
            <Stop offset="1" stopColor={escurecer(pal.fita, 0.25)} />
          </LinearGradient>
          <LinearGradient id={gid('ouro')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFF3A3" />
            <Stop offset="0.55" stopColor="#FFC832" />
            <Stop offset="1" stopColor="#D98300" />
          </LinearGradient>
          <LinearGradient id={gid('gloss')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
          <ClipPath id={gid('clip')}>
            <Path d={forma} transform={TRANSFORMA_MIOLO} />
          </ClipPath>
        </Defs>

        {/* Asas (lendária) */}
        {raridade === 'lendaria' && !bloqueada && (
          <>
            {[false, true].map((espelho) => (
              <G key={String(espelho)} transform={espelho ? 'translate(200 0) scale(-1 1)' : undefined}>
                {PENAS.map((p, i) => (
                  <Path
                    key={i}
                    d={PENA}
                    fill={ref('ouro')}
                    stroke="#B26A00"
                    strokeWidth={1.2}
                    transform={`translate(150 90) rotate(${p.ang}) scale(${p.esc})`}
                  />
                ))}
              </G>
            ))}
          </>
        )}

        {/* Pontas da fita (atrás do emblema) */}
        <Path d="M 34 150 L 60 150 L 60 178 L 34 178 L 43 164 Z" fill={escurecer(pal.fita, 0.35)} />
        <Path d="M 166 150 L 140 150 L 140 178 L 166 178 L 157 164 Z" fill={escurecer(pal.fita, 0.35)} />

        {/* Sombra */}
        <Ellipse cx={100} cy={174} rx={52} ry={6} fill="#000000" opacity={0.12} />

        {/* Borda metálica */}
        <Path d={forma} fill={ref('rim')} stroke={pal.rimEscuro} strokeWidth={2} strokeLinejoin="round" />

        {/* Miolo colorido */}
        <Path
          d={forma}
          transform={TRANSFORMA_MIOLO}
          fill={ref('face')}
          stroke={faceBorda}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <Path
          d={forma}
          transform={TRANSFORMA_LINHA}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity={0.4}
          strokeWidth={1.4}
          strokeLinejoin="round"
        />

        {/* Brilho de vidro na parte de cima */}
        <G clipPath={ref('clip')}>
          <Ellipse cx={100} cy={72} rx={48} ry={30} fill={ref('gloss')} opacity={0.55} />
        </G>

        {/* Gemas na borda */}
        {gemas.map((g, i) => (
          <G key={i}>
            <Circle cx={g.x} cy={g.y} r={g.r + 1.4} fill={pal.rimEscuro} />
            <Circle cx={g.x} cy={g.y} r={g.r} fill={pal.gema} />
            <Circle cx={g.x - g.r * 0.3} cy={g.y - g.r * 0.3} r={g.r * 0.32} fill="#FFFFFF" opacity={0.85} />
          </G>
        ))}

        {/* Coroa (lendária) */}
        {raridade === 'lendaria' && !bloqueada && (
          <G transform="translate(0 -4)">
            <Path
              d="M 76 58 L 79 30 L 91 44 L 100 24 L 109 44 L 121 30 L 124 58 Z"
              fill={ref('ouro')}
              stroke="#B26A00"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            <Rect x={76} y={54} width={48} height={8} rx={3} fill={ref('ouro')} stroke="#B26A00" strokeWidth={1.4} />
            <Circle cx={79} cy={29} r={3.4} fill="#FF5C5C" />
            <Circle cx={100} cy={23} r={4} fill="#4DABF7" />
            <Circle cx={121} cy={29} r={3.4} fill="#FF5C5C" />
            <Circle cx={100} cy={58} r={2.8} fill="#FF5C5C" />
          </G>
        )}

        {/* Fita com estrelas */}
        <Path
          d="M 50 146 Q 100 152 150 146 L 150 172 Q 100 178 50 172 Z"
          fill={ref('fita')}
          stroke={escurecer(pal.fita, 0.45)}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        {Array.from({ length: qtdEstrelas }, (_, i) => (
          <Path
            key={i}
            d={estrela(xInicio + i * passoEstrela, 160, 8.4, 3.6)}
            fill={pal.estrela}
            stroke={bloqueada ? '#6C757D' : '#B26A00'}
            strokeWidth={1}
            strokeLinejoin="round"
          />
        ))}
      </Svg>

      {/* Reflexo que passa pelo emblema (épica e lendária) */}
      {animar && (raridade === 'epica' || raridade === 'lendaria') && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: W / 2 - W * 0.2,
            top: CY * px - W * 0.2,
            width: W * 0.4,
            height: W * 0.4,
            borderRadius: W * 0.2,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: W * 0.14,
              top: -W * 0.1,
              width: W * 0.1,
              height: W * 0.6,
              backgroundColor: '#FFFFFF',
              opacity: 0.5,
              transform: [{ translateX: brilhoX }, { rotate: '20deg' }],
            }}
          />
        </View>
      )}

      {/* Ícone no centro */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: W / 2 - tamIcone / 2,
          top: CY * px - tamIcone / 2,
          width: tamIcone,
          height: tamIcone,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {usaTematico ? (
          <MaterialCommunityIcons
            name={nomeTematico as any}
            size={tamIcone}
            color={bloqueada ? 'rgba(255,255,255,0.3)' : '#FFFFFF'}
            style={bloqueada ? undefined : (sombraIcone as any)}
          />
        ) : (
          <Feather
            name={iconName as any}
            size={tamIcone}
            color={bloqueada ? 'rgba(255,255,255,0.3)' : '#FFFFFF'}
            style={bloqueada ? undefined : (sombraIcone as any)}
          />
        )}
      </View>

      {/* Cadeado (bloqueada) */}
      {bloqueada && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: W / 2 - S * 0.2,
            top: CY * px - S * 0.2,
            width: S * 0.4,
            height: S * 0.4,
            borderRadius: S * 0.2,
            backgroundColor: 'rgba(33,37,41,0.75)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Feather name="lock" size={S * 0.24} color="#FFFFFF" />
        </View>
      )}

      {/* Faíscas piscando (épica e lendária) */}
      {animar &&
        FAISCAS.slice(0, QTD_FAISCAS[raridade]).map((f, i) => {
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
                opacity: par ? faiscaA : faiscaB,
                transform: [{ scale: par ? escalaA : escalaB }],
              }}
            >
              <Ionicons name="sparkles" size={tam} color={raridade === 'lendaria' ? '#FFD43B' : pal.aura} />
            </Animated.View>
          );
        })}
    </View>
  );
}

export default InsigniaVisual;