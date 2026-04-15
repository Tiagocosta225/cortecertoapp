import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { apiFetch } from '@/lib/api';

type Barbearia = {
  id: number;
  nome: string;
};

type Appointment = {
  id: number;
  cliente: string;
  servico: string;
  horario: string;
  status: string;
  statusPagamento: string;
  valorTotal: number;
};

type Agenda = {
  dias: Array<{
    slotsLivres: number;
    recomendacao: string;
    agendamentos: Appointment[];
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

export default function AgendaMobile() {
  const [selectedDate, setSelectedDate] = useState(toDateInput(new Date()));
  const [shop, setShop] = useState<Barbearia | null>(null);
  const [agenda, setAgenda] = useState<Agenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const day = agenda?.dias?.[0];
  const appointments = day?.agendamentos || [];

  const loadData = useCallback(async () => {
    setError('');
    const shops = await apiFetch<Barbearia[]>('/barbearias');
    const currentShop = shops[0] || null;
    setShop(currentShop);

    if (!currentShop) {
      setAgenda(null);
      return;
    }

    const payload = await apiFetch<Agenda>(`/dashboard/barbearias/${currentShop.id}/agenda-inteligente?date=${selectedDate}&days=1`);
    setAgenda(payload);
  }, [selectedDate]);

  useEffect(() => {
    setLoading(true);
    loadData()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar agenda.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar agenda.');
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
      <Text style={styles.title}>Agenda</Text>
      <Text style={styles.subtitle}>{shop?.nome || 'Cadastre uma barbearia pelo painel admin'}</Text>

      <View style={styles.dateCard}>
        <Text style={styles.label}>Data</Text>
        <TextInput value={selectedDate} onChangeText={setSelectedDate} style={styles.dateInput} placeholder="YYYY-MM-DD" />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {shop ? (
        <>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{appointments.length}</Text>
            <Text style={styles.summaryLabel}>agendamentos no dia</Text>
            <Text style={styles.summaryHint}>{day?.slotsLivres ?? 0} horários livres</Text>
          </View>

          {appointments.length ? (
            appointments.map((appointment) => (
              <View key={appointment.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.client}>{appointment.cliente}</Text>
                    <Text style={styles.muted}>{appointment.servico}</Text>
                  </View>
                  <Text style={styles.time}>{formatTime(appointment.horario)}</Text>
                </View>
                <View style={styles.details}>
                  <Badge label={appointment.status} />
                  <Badge label={appointment.statusPagamento} muted />
                  <Text style={styles.price}>{formatCurrency(appointment.valorTotal)}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Sem agendamentos</Text>
              <Text style={styles.muted}>Nenhum atendimento marcado para a data selecionada.</Text>
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhuma barbearia encontrada</Text>
          <Text style={styles.muted}>Crie sua barbearia no painel admin para acompanhar a agenda no mobile.</Text>
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
  dateCard: { borderRadius: 8, borderWidth: 1, borderColor: '#DBEAFE', backgroundColor: '#EFF6FF', padding: 14, marginBottom: 14 },
  label: { color: '#1D4ED8', fontWeight: '700', marginBottom: 8 },
  dateInput: { borderRadius: 8, borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#FFFFFF', padding: 12, color: '#0F172A' },
  error: { marginBottom: 12, borderRadius: 8, backgroundColor: '#FEF2F2', color: '#DC2626', padding: 12, fontWeight: '700' },
  summaryCard: { borderRadius: 8, backgroundColor: '#0066FF', padding: 18, marginBottom: 14 },
  summaryValue: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },
  summaryLabel: { color: '#DBEAFE', fontWeight: '700' },
  summaryHint: { marginTop: 8, color: '#FFFFFF' },
  card: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  client: { color: '#0F172A', fontSize: 17, fontWeight: '800' },
  muted: { color: '#64748B', lineHeight: 22 },
  time: { color: '#0066FF', fontSize: 17, fontWeight: '900' },
  details: { marginTop: 12, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  badge: { borderRadius: 999, backgroundColor: '#DBEAFE', paddingHorizontal: 10, paddingVertical: 5 },
  badgeMuted: { backgroundColor: '#F1F5F9' },
  badgeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '800' },
  badgeMutedText: { color: '#64748B' },
  price: { marginLeft: 'auto', color: '#0F172A', fontWeight: '900' },
  emptyCard: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 18 },
  emptyTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginBottom: 6 },
});
