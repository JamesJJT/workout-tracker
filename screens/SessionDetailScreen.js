import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function SessionDetailScreen({ 
  session, 
  onBack, 
  onDeleteSession 
}) {
  const [expandedExercises, setExpandedExercises] = useState({});

  const toggleExercise = (exerciseId) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDuration = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'Duration not recorded';
    const mins = parseInt(minutes);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainder = mins % 60;
    return remainder > 0 ? `${hours}h ${remainder}m` : `${hours}h`;
  };

  const handleDelete = () => {
    onDeleteSession(session.id);
    onBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.sessionInfo}>
          <Text style={styles.title}>Workout Session</Text>
          <Text style={styles.date}>{session.startTime}</Text>
          {session.endTime && (
            <Text style={styles.endTime}>Ended: {session.endTime}</Text>
          )}
          {session.duration !== undefined && session.duration !== null && (
            <Text style={styles.duration}>{formatDuration(session.duration)}</Text>
          )}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Exercises</Text>
            <Text style={styles.summaryValue}>{session.exercises.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Sets</Text>
            <Text style={styles.summaryValue}>
              {session.exercises.reduce((sum, ex) => sum + (parseInt(ex.sets) || 0), 0)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Volume</Text>
            <Text style={styles.summaryValue}>
              {session.exercises.reduce((sum, ex) => {
                const weight = parseFloat(ex.weight) || 0;
                const reps = parseInt(ex.reps) || 0;
                const sets = parseInt(ex.sets) || 0;
                return sum + (weight * reps * sets);
              }, 0).toFixed(0)} kg
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercises</Text>
        {session.exercises.map((exercise, index) => {
          const isExpanded = expandedExercises[exercise.id];
          const sets = parseInt(exercise.sets) || 0;
          const setRows = Array.from({ length: sets }, (_, i) => i + 1);

          return (
            <View key={exercise.id} style={styles.exerciseCard}>
              <TouchableOpacity 
                onPress={() => toggleExercise(exercise.id)}
                activeOpacity={0.7}
              >
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseNumber}>#{index + 1}</Text>
                  <Text style={styles.exerciseName}>{exercise.workout?.name || 'Exercise'}</Text>
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                </View>
                {exercise.workout?.category && (
                  <Text style={styles.exerciseCategory}>{exercise.workout.category}</Text>
                )}
                <View style={styles.exerciseStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Weight</Text>
                    <Text style={styles.statValue}>{exercise.weight} kg</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Reps</Text>
                    <Text style={styles.statValue}>{exercise.reps}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Sets</Text>
                    <Text style={styles.statValue}>{exercise.sets}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Volume</Text>
                    <Text style={styles.statValue}>
                      {(parseFloat(exercise.weight) * parseInt(exercise.reps) * parseInt(exercise.sets)).toFixed(0)} kg
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.setsBreakdown}>
                  <View style={styles.setsHeader}>
                    <Text style={styles.setsHeaderText}>Set Breakdown</Text>
                  </View>
                  {setRows.map((setNum) => (
                    <View key={setNum} style={styles.setRow}>
                      <Text style={styles.setNumber}>Set {setNum}</Text>
                      <Text style={styles.setDetails}>
                        {exercise.reps} reps × {exercise.weight} kg
                      </Text>
                      <Text style={styles.setVolume}>
                        {(parseFloat(exercise.weight) * parseInt(exercise.reps)).toFixed(0)} kg
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f4c75',
  },
  backButton: {
    fontSize: 16,
    color: '#0f4c75',
    fontWeight: '600',
  },
  deleteButton: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sessionInfo: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0f4c75',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  endTime: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#0f4c75',
    fontWeight: '600',
    marginTop: 8,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 20,
    color: '#0f4c75',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 15,
  },
  exerciseCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseNumber: {
    fontSize: 16,
    color: '#0f4c75',
    fontWeight: 'bold',
    marginRight: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eee',
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: '#0f4c75',
    marginLeft: 10,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 15,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#0f2027',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#aaa',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 16,
    color: '#0f4c75',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 100,
  },
  setsBreakdown: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#0f2027',
  },
  setsHeader: {
    marginBottom: 10,
  },
  setsHeaderText: {
    fontSize: 14,
    color: '#0f4c75',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f2027',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 14,
    color: '#eee',
    fontWeight: '600',
    width: 60,
  },
  setDetails: {
    fontSize: 14,
    color: '#aaa',
    flex: 1,
  },
  setVolume: {
    fontSize: 14,
    color: '#0f4c75',
    fontWeight: 'bold',
  },
});
