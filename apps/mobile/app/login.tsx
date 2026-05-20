import { Image } from 'expo-image';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/contexts/auth-context';

export default function LoginRoute() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) {
    return <Redirect href="/(tabs)" />;
  }

  async function handleSubmit() {
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await signUp({ nome, email, telefone, senha });
      } else {
        await signIn(email, senha);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível autenticar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo-cortecertoapp.png')} style={styles.logo} contentFit="contain" />
      <Text style={styles.title}>CorteCertoApp</Text>
      <Text style={styles.subtitle}>Acesse sua barbearia com os mesmos dados reais do painel admin.</Text>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}>
          <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Entrar</Text>
        </Pressable>
        <Pressable style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => setMode('register')}>
          <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Cadastrar</Text>
        </Pressable>
      </View>

      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor="#64748B" />
      )}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#64748B"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {mode === 'register' && (
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholderTextColor="#64748B"
          keyboardType="phone-pad"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#64748B"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#F8FAFC', padding: 24 },
  logo: { alignSelf: 'center', width: '100%', maxWidth: 320, height: 150, marginBottom: 10 },
  title: { textAlign: 'center', fontSize: 30, fontWeight: '800', color: '#0F172A' },
  subtitle: { marginTop: 8, marginBottom: 24, textAlign: 'center', color: '#64748B', lineHeight: 22 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 14, borderRadius: 8, backgroundColor: '#E2E8F0', padding: 4 },
  tab: { flex: 1, borderRadius: 6, paddingVertical: 10, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { color: '#64748B', fontWeight: '700' },
  tabTextActive: { color: '#0066FF' },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
    color: '#0F172A',
  },
  error: { marginBottom: 10, color: '#DC2626', fontWeight: '600' },
  button: { alignItems: 'center', borderRadius: 8, backgroundColor: '#0066FF', paddingVertical: 15 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
});
