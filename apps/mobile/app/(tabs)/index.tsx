import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { apiFetch } from '@/lib/api';

type Barbearia = {
  id: number;
  nome: string;
  cidade?: string | null;
  slug?: string;
};

type Overview = {
  hoje: {
    agendamentos: number;
    faturamentoPrevisto: number;
    capacidadeSlots: number;
    ocupacaoPercentual: number;
  };
  semana: {
    faturamento: number;
    meta: number;
  };
  crm: {
    totalClientes: number;
    clientesEmRisco: number;
  };
  antiFuro: {
    protegidos: number;
    pagamentosPendentes: number;
  };
};

type Agenda = {
  dias: Array<{
    slotsLivres: number;
    agendamentos: Array<{
      id: number;
      horario: string;
      cliente: string;
      servico: string;
      status: string;
      valorTotal: number;
    }>;
  }>;
};

function toDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function MobileDashboard() {
  const { user, signOut } = useAuth();
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [shops, setShops] = useState<Barbearia[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const shop = shops[0] || null;
  const appointments = agenda?.dias?.[0]?.agendamentos || [];

  const loadData = useCallback(async () => {
    setError('');
    const barbearias = await apiFetch<Barbearia[]>('/barbearias');
    setShops(barbearias);

    const currentShop = barbearias[0];
    if (!currentShop) {
      setOverview(null);
      setAgenda(null);
      return;
    }

    const [overviewPayload, agendaPayload] = await Promise.all([
      apiFetch<Overview>(`/dashboard/barbearias/${currentShop.id}/overview?date=${selectedDate}`),
      apiFetch<Agenda>(`/dashboard/barbearias/${currentShop.id}/agenda-inteligente?date=${selectedDate}&days=1`),
    ]);

    setOverview(overviewPayload);
    setAgenda(agendaPayload);
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    loadData()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar dashboard.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar dashboard.');
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0066FF" />
        <Text style={styles.loadingText}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Olá, {user?.nome?.split(' ')[0] || 'barbeiro'}</Text>
          <Text style={styles.subtitle}>{shop ? shop.nome : 'Nenhuma barbearia cadastrada'}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.dateCard}>
        <Text style={styles.label}>Data do dashboard</Text>
        <TextInput value={selectedDate} onChangeText={setSelectedDate} style={styles.dateInput} placeholder="YYYY-MM-DD" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!shop ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Cadastre sua barbearia</Text>
          <Text style={styles.emptyText}>Crie a barbearia pelo painel admin para liberar dashboard, agenda, serviços e clientes no mobile.</Text>
        </View>
      ) : (
        <>
          <View style={styles.grid}>
            <Stat title="Agendamentos" value={String(overview?.hoje.agendamentos ?? 0)} hint="no dia selecionado" />
            <Stat title="Faturamento" value={formatCurrency(overview?.hoje.faturamentoPrevisto ?? 0)} hint="previsto no dia" />
            <Stat title="Ocupação" value={`${overview?.hoje.ocupacaoPercentual ?? 0}%`} hint={`${agenda?.dias?.[0]?.slotsLivres ?? 0} horários livres`} />
            <Stat title="Clientes" value={String(overview?.crm.totalClientes ?? 0)} hint={`${overview?.crm.clientesEmRisco ?? 0} em risco`} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Agendamentos do dia</Text>
            {!appointments.length ? (
              <Text style={styles.muted}>Nenhum agendamento para essa data.</Text>
            ) : (
              appointments.map((appointment) => (
                <View key={appointment.id} style={styles.appointment}>
                  <View>
                    <Text style={styles.appointmentTitle}>{appointment.cliente}</Text>
                    <Text style={styles.muted}>{appointment.servico}</Text>
                  </View>
                  <View style={styles.appointmentRight}>
                    <Text style={styles.time}>{formatTime(appointment.horario)}</Text>
                    <Text style={styles.price}>{formatCurrency(appointment.valorTotal)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Anti-furo</Text>
            <View style={styles.row}>
              <Text style={styles.muted}>Reservas protegidas</Text>
              <Text style={styles.bold}>{overview?.antiFuro.protegidos ?? 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.muted}>Pagamentos pendentes</Text>
              <Text style={styles.bold}>{overview?.antiFuro.pagamentosPendentes ?? 0}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.muted}>Meta semanal</Text>
              <Text style={styles.bold}>{formatCurrency(overview?.semana.faturamento ?? 0)} / {formatCurrency(overview?.semana.meta ?? 0)}</Text>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { marginTop: 10, color: '#64748B' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 36 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  hello: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 4, color: '#64748B' },
  logoutButton: { borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE', paddingHorizontal: 14, paddingVertical: 9 },
  logoutText: { color: '#0066FF', fontWeight: '700' },
  dateCard: { borderRadius: 8, borderWidth: 1, borderColor: '#DBEAFE', backgroundColor: '#EFF6FF', padding: 14, marginBottom: 14 },
  label: { color: '#1D4ED8', fontWeight: '700', marginBottom: 8 },
  dateInput: { borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#FFFFFF', padding: 12, color: '#0F172A' },
  error: { marginBottom: 12, borderRadius: 8, backgroundColor: '#FEF2F2', color: '#DC2626', padding: 12, fontWeight: '700' },
  emptyCard: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 18 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  emptyText: { marginTop: 8, color: '#64748B', lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 14 },
  statTitle: { color: '#64748B', fontWeight: '700' },
  statValue: { marginTop: 8, color: '#0F172A', fontSize: 22, fontWeight: '800' },
  statHint: { marginTop: 6, color: '#64748B', fontSize: 12 },
  card: { marginTop: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 16 },
  cardTitle: { marginBottom: 12, color: '#0F172A', fontSize: 18, fontWeight: '800' },
  appointment: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingVertical: 12 },
  appointmentTitle: { color: '#0F172A', fontWeight: '800' },
  appointmentRight: { alignItems: 'flex-end' },
  muted: { color: '#64748B' },
  time: { color: '#0066FF', fontWeight: '800' },
  price: { marginTop: 4, color: '#0F172A', fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 8 },
  bold: { color: '#0F172A', fontWeight: '800' },
});
