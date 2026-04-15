import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { apiFetch } from '@/lib/api';

type Barbearia = {
  id: number;
  nome: string;
  slug?: string;
};

type Servico = {
  id: number;
  nome: string;
  descricao?: string | null;
  preco: number;
  duracaoMin: number;
  depositoAntecipado: number;
  ativo: boolean;
  destaqueLink: boolean;
  barbeariaId: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

export default function ServicesMobile() {
  const [shop, setShop] = useState<Barbearia | null>(null);
  const [services, setServices] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    const [shops, servicos] = await Promise.all([
      apiFetch<Barbearia[]>('/barbearias'),
      apiFetch<Servico[]>('/servicos'),
    ]);

    const currentShop = shops[0] || null;
    setShop(currentShop);
    setServices(currentShop ? servicos.filter((service) => Number(service.barbeariaId) === Number(currentShop.id)) : []);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar serviços.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar serviços.');
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0066FF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <Text style={styles.title}>Serviços</Text>
      <Text style={styles.subtitle}>{shop?.nome || 'Nenhuma barbearia cadastrada'}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!shop ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Cadastre sua barbearia</Text>
          <Text style={styles.muted}>Crie a barbearia no painel admin para gerenciar os serviços reais no mobile.</Text>
        </View>
      ) : services.length ? (
        services.map((service) => (
          <View key={service.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{service.nome}</Text>
                <Text style={styles.muted}>{service.descricao || `${service.duracaoMin} min de atendimento`}</Text>
              </View>
              <Text style={styles.price}>{formatCurrency(service.preco)}</Text>
            </View>
            <View style={styles.details}>
              <Badge label={service.ativo ? 'Ativo' : 'Inativo'} muted={!service.ativo} />
              {service.destaqueLink ? <Badge label="Destaque no link" /> : null}
              <Text style={styles.deposit}>Sinal {formatCurrency(service.depositoAntecipado)}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum serviço cadastrado</Text>
          <Text style={styles.muted}>Cadastre serviços no painel admin para aparecerem no link público e no mobile.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Badge({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <View style={[styles.badge, muted && styles.badgeMuted]}>
      <Text style={[styles.badgeText, muted && styles.badgeMutedText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 36 },
  title: { color: '#0F172A', fontSize: 30, fontWeight: '800' },
  subtitle: { marginTop: 4, marginBottom: 18, color: '#64748B' },
  error: { marginBottom: 12, borderRadius: 8, backgroundColor: '#FEF2F2', color: '#DC2626', padding: 12, fontWeight: '700' },
  card: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  serviceName: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  muted: { color: '#64748B', lineHeight: 22 },
  price: { color: '#0066FF', fontSize: 18, fontWeight: '900' },
  details: { marginTop: 14, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  badge: { borderRadius: 999, backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 5 },
  badgeMuted: { backgroundColor: '#F1F5F9' },
  badgeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '800' },
  badgeMutedText: { color: '#64748B' },
  deposit: { marginLeft: 'auto', color: '#0F172A', fontWeight: '800' },
  emptyCard: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 18 },
  emptyTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginBottom: 6 },
});
