import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { CompraInsigniaModal, InsigniaComprada } from '../../components/CompraInsigniaModal';
import { InsigniaVisual, RaridadeInsignia } from '../../components/InsigniaVisual';
import { InsigniaItem, LojaInsigniasScreenProps } from './types';

// Cada card estudado rende 10 XP (igual ao back-end)
const XP_POR_CARD = 10;
const ID_DESTAQUE = 'destaque';

type Insignia = InsigniaItem & {
  raridade: RaridadeInsignia;
  frase: string;
};

const RARIDADES = {
  comum: { label: 'COMUM', cor: '#868E96' },
  rara: { label: 'RARA', cor: '#4C8DF6' },
  epica: { label: 'ÉPICA', cor: '#B25AD6' },
  lendaria: { label: 'LENDÁRIA', cor: '#F59F00' },
} as const;

function cardsPara(xpFaltando: number) {
  return Math.ceil(xpFaltando / XP_POR_CARD);
}

function Progresso({ atual, total, cor }: { atual: number; total: number; cor: string }) {
  const pct = Math.min(atual / total, 1) * 100;
  return (
    <View style={s.barraFundo}>
      <View style={[s.barraCheia, { width: `${pct}%`, backgroundColor: cor }]} />
    </View>
  );
}

export function LojaInsignias({
  usuarioXp = 850,
  onGoBack,
}: LojaInsigniasScreenProps) {
  const [xp, setXp] = useState(usuarioXp);
  const [insigniaNova, setInsigniaNova] = useState<InsigniaComprada | null>(null);
  const [idRecemComprada, setIdRecemComprada] = useState<string | null>(null);

  const [insignias, setInsignias] = useState<Insignia[]>([
    {
      id: '1',
      titulo: 'Primeira Vitória',
      precoXp: 100,
      status: 'equipar',
      iconName: 'award',
      iconBgColor: '#51CF66',
      raridade: 'comum',
      frase: 'O primeiro passo de todo mestre.',
    },
    {
      id: '2',
      titulo: 'Escudo do Saber',
      precoXp: 400,
      status: 'comprar',
      iconName: 'shield',
      iconBgColor: '#20C997',
      raridade: 'rara',
      frase: 'Defenda sua memória contra o esquecimento.',
    },
    {
      id: '3',
      titulo: 'Memória Foguete',
      precoXp: 500,
      status: 'comprar',
      iconName: 'zap',
      iconBgColor: '#FF6B6B',
      raridade: 'epica',
      frase: 'Decore na velocidade da luz.',
    },
    {
      id: '4',
      titulo: 'Chama Imparável',
      precoXp: 750,
      status: 'comprar',
      iconName: 'trending-up',
      iconBgColor: '#FD7E14',
      raridade: 'epica',
      frase: 'Quem estuda todo dia, brilha todo dia.',
    },
    {
      id: '5',
      titulo: 'Memória Brilhante',
      precoXp: 1000,
      status: 'comprar',
      iconName: 'star',
      iconBgColor: '#FCC419',
      raridade: 'lendaria',
      frase: 'Só os mais dedicados chegam aqui.',
    },
    {
      id: ID_DESTAQUE,
      titulo: 'Mestre da Memorização',
      precoXp: 5000,
      status: 'comprar',
      iconName: 'sun',
      iconBgColor: '#FCC419',
      raridade: 'lendaria',
      frase: 'Para os mestres da memorização! Edição limitada.',
    },
  ]);

  const destaque = insignias.find((i) => i.id === ID_DESTAQUE)!;
  const equipada = insignias.find((i) => i.status === 'equipado');
  const colecao = insignias.filter((i) => i.status !== 'comprar');
  const loja = insignias
    .filter((i) => i.status === 'comprar' && i.id !== ID_DESTAQUE)
    .sort((a, b) => a.precoXp - b.precoXp);

  const comprar = (item: Insignia) => {
    if (xp < item.precoXp) {
      Alert.alert(
        'Quase lá!',
        `Faltam ${item.precoXp - xp} XP. Estude cerca de ${cardsPara(item.precoXp - xp)} cards para conquistar esta insígnia.`
      );
      return;
    }

    setXp((x) => x - item.precoXp);
    setInsignias((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'equipar' } : i))
    );
    setIdRecemComprada(item.id);
    setInsigniaNova({
      nome: item.titulo,
      descricao: item.frase,
      icone: item.iconName as string,
      raridade: item.raridade,
      custo: item.precoXp,
      cor: item.iconBgColor,
    });
  };

  // Equipa a escolhida (e desequipa a anterior). Tocar na equipada desequipa.
  const alternarEquipar = (id: string) => {
    setInsignias((prev) =>
      prev.map((i) => {
        if (i.id === id) return { ...i, status: i.status === 'equipado' ? 'equipar' : 'equipado' };
        return i.status === 'equipado' ? { ...i, status: 'equipar' } : i;
      })
    );
  };

  const equiparRecemComprada = () => {
    if (!idRecemComprada) return;
    setInsignias((prev) =>
      prev.map((i) => {
        if (i.id === idRecemComprada) return { ...i, status: 'equipado' };
        return i.status === 'equipado' ? { ...i, status: 'equipar' } : i;
      })
    );
  };

  const destaqueDele = destaque.status !== 'comprar';
  const faltaDestaque = destaque.precoXp - xp;

  return (
    <View style={s.container}>
      {/* Topo */}
      <View style={s.header}>
        <TouchableOpacity onPress={onGoBack} hitSlop={10}>
          <Feather name="arrow-left-circle" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={s.headerTitulo}>Loja de Insígnias</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={s.conteudo} showsVerticalScrollIndicator={false}>
        {/* Resumo: saldo + insígnia em destaque */}
        <View style={s.resumo}>
          <View style={{ flex: 1 }}>
            <Text style={s.resumoRotulo}>Seu saldo</Text>
            <View style={s.xpLinha}>
              <FontAwesome5 name="bolt" size={22} color="#FFD43B" />
              <Text style={s.xpValor}>{xp}</Text>
              <Text style={s.xpUnidade}>XP</Text>
            </View>
            <View style={s.dica}>
              <Feather name="zap" size={12} color="#FFD43B" />
              <Text style={s.dicaTexto}>Cada card estudado = +{XP_POR_CARD} XP</Text>
            </View>
          </View>

          <View style={s.resumoDireita}>
            {equipada ? (
              <>
                <View style={{ marginVertical: -14 }}>
                  <InsigniaVisual
                    iconName={equipada.iconName as string}
                    cor={equipada.iconBgColor}
                    raridade={equipada.raridade}
                    tamanho={54}
                  />
                </View>
                <Text style={s.equipadaNome} numberOfLines={1}>
                  {equipada.titulo}
                </Text>
              </>
            ) : (
              <>
                <Feather name="award" size={34} color="rgba(255,255,255,0.5)" />
                <Text style={s.equipadaVazia}>Nenhuma equipada</Text>
              </>
            )}
          </View>
        </View>

        {/* ===== Vitrine lendária ===== */}
        <View style={s.vitrine}>
          <View style={s.vitrineTag}>
            <Feather name="clock" size={12} color="#1B1F3B" />
            <Text style={s.vitrineTagTexto}>EDIÇÃO LIMITADA</Text>
          </View>

          <View style={{ marginVertical: -8 }}>
            <InsigniaVisual
              iconName={destaque.iconName as string}
              cor={destaque.iconBgColor}
              raridade="lendaria"
              tamanho={112}
            />
          </View>

          <Text style={s.vitrineTitulo}>{destaque.titulo}</Text>
          <Text style={s.vitrineFrase}>{destaque.frase}</Text>

          {destaqueDele ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={[s.botaoVitrine, destaque.status === 'equipado' && { backgroundColor: '#51CF66' }]}
              onPress={() => alternarEquipar(destaque.id)}
            >
              <Feather
                name={destaque.status === 'equipado' ? 'check' : 'award'}
                size={18}
                color="#1B1F3B"
              />
              <Text style={s.botaoVitrineTexto}>
                {destaque.status === 'equipado' ? 'Equipada' : 'Conquistada! Equipar'}
              </Text>
            </TouchableOpacity>
          ) : faltaDestaque <= 0 ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={s.botaoVitrine}
              onPress={() => comprar(destaque)}
            >
              <FontAwesome5 name="bolt" size={14} color="#1B1F3B" />
              <Text style={s.botaoVitrineTexto}>Conquistar por {destaque.precoXp} XP</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: '100%', marginTop: 14 }}>
              <Progresso atual={xp} total={destaque.precoXp} cor="#FFD43B" />
              <Text style={s.vitrineFalta}>
                {xp}/{destaque.precoXp} XP · faltam {faltaDestaque} XP (~{cardsPara(faltaDestaque)} cards)
              </Text>
            </View>
          )}
        </View>

        {/* ===== Minha coleção ===== */}
        <View style={s.secaoTitulo}>
          <Text style={s.secaoTexto}>Minha coleção</Text>
          <View style={s.contador}>
            <Text style={s.contadorTexto}>
              {colecao.length}/{insignias.length}
            </Text>
          </View>
        </View>

        {colecao.length === 0 ? (
          <View style={s.vazio}>
            <Feather name="lock" size={28} color="#ADB5BD" />
            <Text style={s.vazioTitulo}>Sua coleção está vazia</Text>
            <Text style={s.vazioTexto}>
              Estude flashcards, junte XP e conquiste sua primeira insígnia!
            </Text>
          </View>
        ) : (
          <FlatList
            data={colecao}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.colecaoLista}
            renderItem={({ item }) => {
              const equipado = item.status === 'equipado';
              return (
                <View style={[s.cardColecao, equipado && s.cardColecaoEquipado]}>
                  {equipado && (
                    <View style={s.selo}>
                      <Feather name="check" size={12} color="#FFFFFF" />
                    </View>
                  )}
                  <View style={{ marginVertical: -12 }}>
                    <InsigniaVisual
                      iconName={item.iconName as string}
                      cor={item.iconBgColor}
                      raridade={item.raridade}
                      tamanho={64}
                    />
                  </View>
                  <Text style={s.cardTitulo} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[s.botaoPequeno, equipado ? s.botaoEquipado : s.botaoOutline]}
                    onPress={() => alternarEquipar(item.id)}
                  >
                    <Text style={[s.botaoPequenoTexto, equipado && { color: '#FFFFFF' }]}>
                      {equipado ? 'Equipada' : 'Equipar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        )}

        {/* ===== Loja ===== */}
        <View style={[s.secaoTitulo, { marginTop: 28 }]}>
          <Text style={s.secaoTexto}>Conquiste estudando</Text>
          <View style={s.contador}>
            <Text style={s.contadorTexto}>{loja.length} disponíveis</Text>
          </View>
        </View>

        {loja.length === 0 ? (
          <View style={s.vazio}>
            <Feather name="award" size={28} color="#51CF66" />
            <Text style={s.vazioTitulo}>Você conquistou tudo!</Text>
            <Text style={s.vazioTexto}>Novas insígnias chegam em breve.</Text>
          </View>
        ) : (
          <View style={s.grade}>
            {loja.map((item) => {
              const raridade = RARIDADES[item.raridade];
              const pode = xp >= item.precoXp;
              const falta = item.precoXp - xp;
              return (
                <View key={item.id} style={[s.cardLoja, { borderColor: raridade.cor }]}>
                  <View style={[s.chip, { backgroundColor: raridade.cor }]}>
                    <Text style={s.chipTexto}>{raridade.label}</Text>
                  </View>

                  <View style={{ marginVertical: -10 }}>
                    <InsigniaVisual
                      iconName={item.iconName as string}
                      cor={item.iconBgColor}
                      raridade={item.raridade}
                      tamanho={76}
                    />
                  </View>

                  <Text style={s.cardTitulo} numberOfLines={2}>
                    {item.titulo}
                  </Text>
                  <Text style={s.cardFrase} numberOfLines={2}>
                    {item.frase}
                  </Text>

                  <View style={s.precoLinha}>
                    <FontAwesome5 name="bolt" size={12} color="#F59F00" />
                    <Text style={s.preco}>{item.precoXp} XP</Text>
                  </View>

                  {pode ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[s.botao, { backgroundColor: raridade.cor }]}
                      onPress={() => comprar(item)}
                    >
                      <Text style={s.botaoTexto}>Conquistar!</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Progresso atual={xp} total={item.precoXp} cor={raridade.cor} />
                      <Text style={s.faltam}>
                        Faltam {falta} XP · ~{cardsPara(falta)} cards
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <CompraInsigniaModal
        visible={!!insigniaNova}
        insignia={insigniaNova}
        onEquipar={equiparRecemComprada}
        onFechar={() => setInsigniaNova(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitulo: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  conteudo: { padding: 16, paddingBottom: 40 },

  // Resumo
  resumo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#155DFC',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  resumoRotulo: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 4 },
  xpLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpValor: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  xpUnidade: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 10 },
  dica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dicaTexto: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  resumoDireita: { width: 100, alignItems: 'center' },
  equipadaNome: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', marginTop: 2, maxWidth: 100 },
  equipadaVazia: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },

  // Vitrine
  vitrine: {
    backgroundColor: '#1B1F3B',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,212,59,0.5)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
  },
  vitrineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFD43B',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  vitrineTagTexto: { fontSize: 11, fontWeight: '800', color: '#1B1F3B', letterSpacing: 0.5 },
  vitrineTitulo: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4, textAlign: 'center' },
  vitrineFrase: { fontSize: 13, color: '#ADB5BD', textAlign: 'center', marginTop: 4 },
  vitrineFalta: { fontSize: 12, color: '#FFE066', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  botaoVitrine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFD43B',
    marginTop: 14,
  },
  botaoVitrineTexto: { color: '#1B1F3B', fontSize: 15, fontWeight: '800' },

  // Seções
  secaoTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  secaoTexto: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  contador: { backgroundColor: '#E9ECEF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  contadorTexto: { fontSize: 12, fontWeight: '600', color: '#495057' },

  vazio: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
    padding: 24,
    gap: 6,
  },
  vazioTitulo: { fontSize: 15, fontWeight: '700', color: '#343A40', marginTop: 4 },
  vazioTexto: { fontSize: 13, color: '#868E96', textAlign: 'center' },

  // Coleção
  colecaoLista: { gap: 12, paddingVertical: 8, paddingRight: 8 },
  cardColecao: {
    width: 132,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    padding: 10,
    alignItems: 'center',
  },
  cardColecaoEquipado: { borderColor: '#51CF66', backgroundColor: '#F4FCF5' },
  selo: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#51CF66',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  // Loja
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 14 },
  cardLoja: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  chip: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  chipTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  cardTitulo: { fontSize: 14, fontWeight: '700', color: '#212529', textAlign: 'center', minHeight: 36 },
  cardFrase: { fontSize: 11, color: '#868E96', textAlign: 'center', minHeight: 28, marginTop: 2 },

  precoLinha: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, marginBottom: 10 },
  preco: { fontSize: 15, fontWeight: 'bold', color: '#E67700' },

  botao: { width: '100%', height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  botaoTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },

  botaoPequeno: { width: '100%', height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  botaoOutline: { borderWidth: 1.5, borderColor: '#155DFC' },
  botaoEquipado: { backgroundColor: '#51CF66' },
  botaoPequenoTexto: { fontSize: 13, fontWeight: '600', color: '#155DFC' },

  barraFundo: { height: 7, borderRadius: 4, backgroundColor: 'rgba(173,181,189,0.35)', overflow: 'hidden' },
  barraCheia: { height: 7, borderRadius: 4 },
  faltam: { fontSize: 11, color: '#495057', textAlign: 'center', marginTop: 6, fontWeight: '700' },
});