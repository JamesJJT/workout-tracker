import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

export default function WorkoutModal({
  visible,
  workout,
  weight,
  reps,
  sets,
  minutes,
  lastEntry,
  hasSession,
  onClose,
  onSave,
  onWeightChange,
  onRepsChange,
  onSetsChange,
  onMinutesChange,
}) {
  const isCardio = workout?.category === 'Cardio';
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <ScrollView
              contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.content}>
          <Text style={styles.title}>{workout?.name || 'Workout'}</Text>
          <Text style={styles.subtitle}>{workout?.description || ''}</Text>

          {lastEntry && (
            <View style={styles.lastWorkout}>
              <Text style={styles.lastWorkoutTitle}>Last Recorded:</Text>
              <Text style={styles.lastWorkoutText}>
                {isCardio ? `${lastEntry.minutes} minutes` : `${lastEntry.sets} sets × ${lastEntry.reps} reps @ ${lastEntry.weight} kg`}
              </Text>
            </View>
          )}

          {isCardio ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Minutes</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={minutes}
                onChangeText={onMinutesChange}
                placeholder="0"
                placeholderTextColor="#666"
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </View>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={onWeightChange}
                  placeholder="0"
                  placeholderTextColor="#666"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={reps}
                  onChangeText={onRepsChange}
                  placeholder="0"
                  placeholderTextColor="#666"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Sets</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={sets}
                  onChangeText={onSetsChange}
                  placeholder="0"
                  placeholderTextColor="#666"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
              </View>
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onSave}
              disabled={!hasSession}
            >
              <Text style={styles.buttonText}>
                {hasSession ? 'Save' : 'Start Session First'}
              </Text>
            </TouchableOpacity>
          </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 25,
    textAlign: 'center',
  },
  lastWorkout: {
    backgroundColor: '#0f2027',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#0f4c75',
  },
  lastWorkoutTitle: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  lastWorkoutText: {
    fontSize: 16,
    color: '#0f4c75',
    fontWeight: '600',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#0f2027',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#eee',
    borderWidth: 1,
    borderColor: '#0f4c75',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#0f4c75',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
