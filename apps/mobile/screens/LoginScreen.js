import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/login_screen_pt.png')}
        style={styles.loginImg}
      />
      <Text style={styles.titulo}>Entrar no CorteCerto</Text>
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loginImg: { width: 250, height: 180, marginBottom: 24, resizeMode: 'contain' },
  titulo: { fontSize: 24, marginBottom: 24, fontWeight: 'bold' },
  input: { width: '80%', borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 12, marginVertical: 8 },
  btnLogin: { marginTop: 20, backgroundColor: '#2263de', padding: 14, borderRadius: 8, width: '80%', alignItems: 'center' },
});
