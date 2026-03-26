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
        source={require('../assets/images/agenda_barbeiro.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Agenda do Barbeiro</Text>
      <FlatList
        data={agenda}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.reservado && styles.reservado]}>
            <Text style={styles.hora}>{item.hora}</Text>
            <Text style={{ color: item.reservado ? '#F00' : '#090' }}>
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
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    width: '100%',
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EEE',
    padding: 14,
    marginVertical: 4,
    borderRadius: 7,
  },
  reservado: {
    backgroundColor: '#FFD6D6',
  },
  hora: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2A4AA2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
