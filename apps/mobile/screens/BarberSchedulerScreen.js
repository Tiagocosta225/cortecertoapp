import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const horarios = [
  { id: '1', hora: '09:00', reservado: false },
  { id: '2', hora: '10:30', reservado: true },
  { id: '3', hora: '12:00', reservado: false },
  { id: '4', hora: '14:00', reservado: true },
  { id: '5', hora: '16:00', reservado: false },
];

export default function BarberSchedulerScreen() {
  const [agenda, setAgenda] = useState(horarios);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo-cortecertoapp.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Agenda do Barbeiro</Text>
      <Text style={styles.subtitle}>Visual moderno, rápido e consistente com o CorteCertoApp.</Text>
      <FlatList
        data={agenda}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.reservado && styles.reservado]}>
            <Text style={styles.hora}>{item.hora}</Text>
            <Text style={{ color: item.reservado ? '#DC2626' : '#0066FF', fontWeight: '600' }}>
              {item.reservado ? 'Reservado' : 'Disponível'}
            </Text>
          </View>
        )}
        style={styles.list}
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Sincronizar Agenda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 90,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    width: '100%',
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reservado: {
    backgroundColor: '#EEF4FF',
    borderColor: '#0066FF',
  },
  hora: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
