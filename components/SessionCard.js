import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SessionCard({ session, onEndSession, onCancelSession }) {
  if (!session) return null;
  
  const hasExercises = session.exercises.length > 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Current Session</Text>
          <Text style={styles.time}>{session.startTime}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.endButton, !hasExercises && styles.endButtonDisabled]} 
          onPress={hasExercises ? onEndSession : null}
          disabled={!hasExercises}
        >
          <Text style={[styles.endButtonText, !hasExercises && styles.endButtonTextDisabled]}>End Session</Text>
        </TouchableOpacity>
      </View>
      
      {session.exercises.length > 0 && (
        <View style={styles.exercises}>
          {session.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.workout.name}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.sets} × {exercise.reps} @ {exercise.weight} kg
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f4c75',
  },
  time: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  endButton: {
    backgroundColor: '#533483',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  endButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  endButtonTextDisabled: {
    color: '#888',
  },
  exercises: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#0f2027',
  },
  exerciseItem: {
    paddingVertical: 8,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#eee',
  },
  exerciseDetails: {
    fontSize: 13,
    color: '#0f4c75',
    marginTop: 2,
  },
});
