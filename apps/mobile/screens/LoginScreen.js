import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Image
          source={require('../assets/images/logo-cortecertoapp.png')}
          style={styles.loginImg}
        />
        <Text style={styles.titulo}>Entrar no CorteCerto</Text>
        <Text style={styles.subtitulo}>Sua barbearia organizada, clientes sempre no horário.</Text>
      </View>
      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#64748B"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#64748B"
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Agendamento')}
        style={styles.btnLogin}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  heroCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  loginImg: { width: 250, height: 160, marginBottom: 18, resizeMode: 'contain' },
  titulo: { fontSize: 28, marginBottom: 10, fontWeight: '800', color: '#1A1A1A' },
  subtitulo: { fontSize: 15, marginBottom: 20, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  btnLogin: { marginTop: 20, backgroundColor: '#0066FF', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
});
