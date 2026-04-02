import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const servicos = [
  { id: '1', nome: 'Corte Simples', preco: 'R$ 25,00' },
  { id: '2', nome: 'Corte + Barba', preco: 'R$ 45,00' },
  { id: '3', nome: 'Barba', preco: 'R$ 20,00' },
];

const horarios = [
  { id: '1', hora: '09:00' },
  { id: '2', hora: '10:30' },
  { id: '3', hora: '12:00' },
  { id: '4', hora: '14:00' },
  { id: '5', hora: '16:00' },
];

export default function ClientBookingScreen() {
  const [servicoSelecionado, setServicoSelecionado] = useState('2');
  const [horarioSelecionado, setHorarioSelecionado] = useState('2');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo-cortecertoapp.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Agendamento</Text>
      <Text style={styles.subtitle}>Escolha o serviço e o melhor horário para seu atendimento.</Text>

      <Text style={styles.sectionTitle}>Serviços</Text>
      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, servicoSelecionado === item.id && styles.cardSelected]}
            onPress={() => setServicoSelecionado(item.id)}
          >
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardPrice}>{item.preco}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Horários</Text>
      <FlatList
        data={horarios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.slot, horarioSelecionado === item.id && styles.slotSelected]}
            onPress={() => setHorarioSelecionado(item.id)}
          >
            <Text style={styles.slotText}>{item.hora}</Text>
            <Text style={styles.slotHint}>Disponível</Text>
          </TouchableOpacity>
        )}
        style={styles.slotsList}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
  },
  logo: {
    width: 180,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  horizontalList: {
    gap: 12,
    paddingBottom: 8,
  },
  card: {
    width: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#E8F0FF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardPrice: {
    marginTop: 8,
    fontSize: 15,
    color: '#0066FF',
    fontWeight: '700',
  },
  slotsList: {
    flexGrow: 0,
  },
  slot: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotSelected: {
    borderColor: '#0066FF',
    backgroundColor: '#E8F0FF',
  },
  slotText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  slotHint: {
    fontSize: 14,
    color: '#64748B',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
