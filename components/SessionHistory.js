import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SessionHistory({ sessions, onDeleteSession, onClearAll }) {
  if (sessions.length === 0) return null;

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'Duration not recorded';
    const mins = parseInt(minutes);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  };

  return (
    <>
      <View style={styles.headerRow}>
        <Text style={styles.title}>
          Previous Sessions ({sessions.length})
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      {sessions.map((session) => {
        if (!session || !session.exercises || !Array.isArray(session.exercises)) return null;
        
        return (
        <View key={session.id} style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.sessionTitle}>Workout Session</Text>
              <Text style={styles.date}>{String(session.startTime || 'N/A')}</Text>
              {session.duration !== undefined && session.duration !== null && (
                <Text style={styles.duration}>{formatDuration(session.duration)}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => onDeleteSession(session.id)}>
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.exercisesList}>
            {session.exercises.map((exercise) => {
              if (!exercise) return null;
              return (
              <Text key={exercise.id} style={styles.exercise}>
                • {String(exercise.workout?.name || 'Exercise')}: {String(exercise.sets || 0)} × {String(exercise.reps || 0)} @ {String(exercise.weight || 0)} kg
              </Text>
              );
            })}
          </View>
          <Text style={styles.count}>
            {String(session.exercises.length)} exercise{session.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eee',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#0f2027',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0f4c75',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  duration: {
    fontSize: 12,
    color: '#0f4c75',
    fontWeight: '600',
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  exercisesList: {
    marginTop: 10,
    marginBottom: 5,
  },
  exercise: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  count: {
    fontSize: 12,
    color: '#0f4c75',
    fontWeight: '600',
    marginTop: 5,
  },
});
