import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { apiFetch } from '@/lib/api';

type Barbearia = {
  id: number;
  nome: string;
  cidade?: string | null;
  slug?: string;
  telefone?: string | null;
  endereco?: string | null;
  ativa: boolean;
};

export default function ProfileMobile() {
  const { user, signOut } = useAuth();
  const [shop, setShop] = useState<Barbearia | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setError('');
    const shops = await apiFetch<Barbearia[]>('/barbearias');
    setShop(shops[0] || null);
  }, []);

  useEffect(() => {
    setLoading(true);
    loadData()
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Falha ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, [loadData]);

  async function refresh() {
    setRefreshing(true);
    try {
      await loadData();
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar perfil.');
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
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Sessão autenticada com dados reais do CorteCertoApp.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Usuário logado</Text>
        <Info label="Nome" value={user?.nome || '-'} />
        <Info label="E-mail" value={user?.email || '-'} />
        <Info label="Papel" value={user?.papel || '-'} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Barbearia do perfil</Text>
        {shop ? (
          <>
            <Info label="Nome" value={shop.nome} />
            <Info label="Cidade" value={shop.cidade || '-'} />
            <Info label="Telefone" value={shop.telefone || '-'} />
            <Info label="Endereço" value={shop.endereco || '-'} />
            <Info label="Status" value={shop.ativa ? 'Ativa' : 'Inativa'} />
            <Info label="Link público" value={shop.slug ? `/${shop.slug}` : 'Sem slug'} />
          </>
        ) : (
          <Text style={styles.muted}>Nenhuma barbearia vinculada a este usuário. Cadastre uma no painel admin.</Text>
        )}
      </View>

      <Pressable style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, paddingBottom: 36 },
  title: { color: '#0F172A', fontSize: 30, fontWeight: '800' },
  subtitle: { marginTop: 4, marginBottom: 18, color: '#64748B', lineHeight: 22 },
  error: { marginBottom: 12, borderRadius: 8, backgroundColor: '#FEF2F2', color: '#DC2626', padding: 12, fontWeight: '700' },
  card: { borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', padding: 16, marginBottom: 14 },
  cardTitle: { color: '#0F172A', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  infoRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingVertical: 10 },
  infoLabel: { color: '#64748B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  infoValue: { marginTop: 4, color: '#0F172A', fontWeight: '700' },
  muted: { color: '#64748B', lineHeight: 22 },
  logoutButton: { alignItems: 'center', borderRadius: 8, backgroundColor: '#0F172A', paddingVertical: 15 },
  logoutText: { color: '#FFFFFF', fontWeight: '900' },
});
