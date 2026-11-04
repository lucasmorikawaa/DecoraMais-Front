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
import { CardInsigniaDestaque } from '../../components/CardInsigniaDestaque/CardInsigniaDestaque';
import {
  CompraInsigniaModal,
  InsigniaComprada,
} from '../../components/CompraInsigniaModal';
import { InsigniaItem, LojaInsigniasScreenProps } from './types';

// Define a raridade pelo preço (enquanto a insígnia não tem esse campo)
function raridadePorPreco(preco: number): NonNullable<InsigniaComprada['raridade']> {
  if (preco >= 1000) return 'lendaria';
  if (preco >= 500) return 'epica';
  if (preco >= 100) return 'rara';
  return 'comum';
}

const RARIDADES = {
  comum: { label: 'Comum', cor: '#868E96' },
  rara: { label: 'Rara', cor: '#4C8DF6' },
  epica: { label: 'Épica', cor: '#9C36B5' },
  lendaria: { label: 'Lendária', cor: '#F59F00' },
} as const;

export function LojaInsignias({
  usuarioXp = 850,
  onGoBack,
}: LojaInsigniasScreenProps) {
  // Saldo local: desconta a cada compra
  const [xp, setXp] = useState(usuarioXp);

  // Modal de compra
  const [insigniaNova, setInsigniaNova] = useState<InsigniaComprada | null>(null);
  const [idRecemComprada, setIdRecemComprada] = useState<string | null>(null);

  // Lista de insígnias mockadas
  const [insignias, setInsignias] = useState<InsigniaItem[]>([
    { id: '1', titulo: 'Primeira Vitória', precoXp: 100, status: 'equipar', iconName: 'award', iconBgColor: '#51CF66' },
    { id: '2', titulo: 'Memória Foguete', precoXp: 500, status: 'comprar', iconName: 'zap', iconBgColor: '#FF6B6B' },
    { id: '3', titulo: 'Memória Brilhante', precoXp: 1000, status: 'comprar', iconName: 'star', iconBgColor: '#FCC419' },
    { id: '4', titulo: 'Memória Foguete', precoXp: 500, status: 'comprar', iconName: 'zap', iconBgColor: '#FF6B6B' },
  ]);

  const colecao = insignias.filter((i) => i.status !== 'comprar');
  const loja = insignias.filter((i) => i.status === 'comprar');
  const equipada = insignias.find((i) => i.status === 'equipado');

  const comprar = (item: InsigniaItem) => {
    if (xp < item.precoXp) {
      Alert.alert('XP insuficiente', `Faltam ${item.precoXp - xp} XP para esta insígnia.`);
      return;
    }

    setXp((x) => x - item.precoXp);
    setInsignias((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'equipar' } : i))
    );
    setIdRecemComprada(item.id);
    setInsigniaNova({
      nome: item.titulo,
      descricao: 'Parabéns! Ela já está disponível na sua coleção.',
      icone: item.iconName as string,
      raridade: raridadePorPreco(item.precoXp),
      custo: item.precoXp,
    });
  };

  // Equipa a insígnia escolhida (e desequipa a anterior). Tocar na equipada desequipa.
  const alternarEquipar = (id: string) => {
    setInsignias((prev) =>
      prev.map((i) => {
        if (i.id === id) return { ...i, status: i.status === 'equipado' ? 'equipar' : 'equipado' };
        return i.status === 'equipado' ? { ...i, status: 'equipar' } : i;
      })
    );
  };

  const equiparRecemComprada = () => {
    if (idRecemComprada) {
      setInsignias((prev) =>
        prev.map((i) => {
          if (i.id === idRecemComprada) return { ...i, status: 'equipado' };
          return i.status === 'equipado' ? { ...i, status: 'equipar' } : i;
        })
      );
    }
  };

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
        {/* Resumo: saldo e insígnia equipada */}
        <View style={s.resumo}>
          <View style={s.resumoLado}>
            <Text style={s.resumoRotulo}>Seu saldo</Text>
            <View style={s.xpLinha}>
              <FontAwesome5 name="bolt" size={20} color="#FFD43B" />
              <Text style={s.xpValor}>{xp}</Text>
              <Text style={s.xpUnidade}>XP</Text>
            </View>
          </View>

          <View style={s.resumoDivisor} />

          <View style={[s.resumoLado, { alignItems: 'center' }]}>
            <Text style={s.resumoRotulo}>Equipada</Text>
            {equipada ? (
              <View style={s.equipadaLinha}>
                <View style={[s.miniIcone, { backgroundColor: equipada.iconBgColor }]}>
                  <Feather name={equipada.iconName as any} size={16} color="#FFFFFF" />
                </View>
                <Text style={s.equipadaNome} numberOfLines={1}>
                  {equipada.titulo}
                </Text>
              </View>
            ) : (
              <Text style={s.equipadaVazia}>Nenhuma</Text>
            )}
          </View>
        </View>

        {/* ===== Seção: Minha coleção ===== */}
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
              Estude, ganhe XP e compre sua primeira insígnia na loja abaixo.
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
                  <View style={[s.iconeGrande, { backgroundColor: item.iconBgColor }]}>
                    <Feather name={item.iconName as any} size={30} color="#FFFFFF" />
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

        {/* ===== Seção: Loja ===== */}
        <View style={[s.secaoTitulo, { marginTop: 28 }]}>
          <Text style={s.secaoTexto}>Loja</Text>
          <View style={s.contador}>
            <Text style={s.contadorTexto}>{loja.length} disponíveis</Text>
          </View>
        </View>

        <CardInsigniaDestaque
          titulo="Mestre da memorização"
          descricao="Para os mestres da memorização! Edição limitada."
          precoXp={5000}
          usuarioXp={xp}
          iconName="sun"
          iconBgColor="#FCC419"
        />

        {loja.length === 0 ? (
          <View style={s.vazio}>
            <Feather name="award" size={28} color="#51CF66" />
            <Text style={s.vazioTitulo}>Você comprou tudo!</Text>
            <Text style={s.vazioTexto}>Novas insígnias chegam em breve.</Text>
          </View>
        ) : (
          <View style={s.grade}>
            {loja.map((item) => {
              const raridade = RARIDADES[raridadePorPreco(item.precoXp)];
              const pode = xp >= item.precoXp;
              const progresso = Math.min(xp / item.precoXp, 1) * 100;
              return (
                <View key={item.id} style={s.cardLoja}>
                  <View style={[s.chip, { backgroundColor: raridade.cor }]}>
                    <Text style={s.chipTexto}>{raridade.label}</Text>
                  </View>

                  <View style={[s.iconeGrande, { backgroundColor: item.iconBgColor, opacity: pode ? 1 : 0.55 }]}>
                    <Feather name={item.iconName as any} size={30} color="#FFFFFF" />
                  </View>

                  <Text style={s.cardTitulo} numberOfLines={2}>
                    {item.titulo}
                  </Text>

                  <View style={s.precoLinha}>
                    <FontAwesome5 name="bolt" size={12} color="#F59F00" />
                    <Text style={s.preco}>{item.precoXp} XP</Text>
                  </View>

                  {pode ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[s.botao, s.botaoComprar]}
                      onPress={() => comprar(item)}
                    >
                      <Text style={s.botaoTexto}>Comprar</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ width: '100%' }}>
                      <View style={s.barraFundo}>
                        <View style={[s.barraPreenchida, { width: `${progresso}%` }]} />
                      </View>
                      <Text style={s.faltam}>Faltam {item.precoXp - xp} XP</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Modal gamificado de compra */}
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
    backgroundColor: '#155DFC',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    alignItems: 'center',
  },
  resumoLado: { flex: 1 },
  resumoDivisor: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 14 },
  resumoRotulo: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 6, fontWeight: '600' },
  xpLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  xpValor: { fontSize: 30, fontWeight: 'bold', color: '#FFFFFF' },
  xpUnidade: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8 },
  equipadaLinha: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  miniIcone: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  equipadaNome: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', maxWidth: 110 },
  equipadaVazia: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },

  // Seções
  secaoTitulo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  secaoTexto: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  contador: { backgroundColor: '#E9ECEF', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 3 },
  contadorTexto: { fontSize: 12, fontWeight: '600', color: '#495057' },

  // Estado vazio
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

  // Coleção (horizontal)
  colecaoLista: { gap: 12, paddingVertical: 4, paddingRight: 8 },
  cardColecao: {
    width: 128,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E9ECEF',
    padding: 12,
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

  // Loja (grade)
  grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginTop: 14 },
  cardLoja: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  chip: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, marginBottom: 10 },
  chipTexto: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },

  iconeGrande: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardTitulo: { fontSize: 14, fontWeight: '600', color: '#212529', textAlign: 'center', minHeight: 36 },

  precoLinha: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, marginBottom: 10 },
  preco: { fontSize: 14, fontWeight: 'bold', color: '#E67700' },

  botao: { width: '100%', height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  botaoComprar: { backgroundColor: '#155DFC' },
  botaoTexto: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  botaoPequeno: { width: '100%', height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  botaoOutline: { borderWidth: 1.5, borderColor: '#155DFC' },
  botaoEquipado: { backgroundColor: '#51CF66' },
  botaoPequenoTexto: { fontSize: 13, fontWeight: '600', color: '#155DFC' },

  barraFundo: { height: 6, borderRadius: 3, backgroundColor: '#E9ECEF', overflow: 'hidden' },
  barraPreenchida: { height: 6, borderRadius: 3, backgroundColor: '#ADB5BD' },
  faltam: { fontSize: 12, color: '#868E96', textAlign: 'center', marginTop: 6, fontWeight: '600' },
});