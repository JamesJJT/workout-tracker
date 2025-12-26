import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function WorkoutCard({ workout, onPress }) {
  if (!workout) return null;
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{workout.name}</Text>
      <Text style={styles.category}>{workout.category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  category: {
    fontSize: 14,
    color: '#0f4c75',
    fontWeight: '600',
  },
});
