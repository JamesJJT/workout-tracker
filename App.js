import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import workoutsData from './workouts-data.json';
import SessionCard from './components/SessionCard';
import WorkoutCard from './components/WorkoutCard';
import WorkoutModal from './components/WorkoutModal';
import CreateWorkoutModal from './components/CreateWorkoutModal';
import SessionHistory from './components/SessionHistory';

export default function App() {
  const [workoutHistory, setWorkoutHistory] = React.useState([]);
  const [currentSession, setCurrentSession] = React.useState(null);
  const [customWorkouts, setCustomWorkouts] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [createWorkoutModalVisible, setCreateWorkoutModalVisible] = React.useState(false);
  const [selectedWorkout, setSelectedWorkout] = React.useState(null);
  const [weight, setWeight] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [sets, setSets] = React.useState('');
  const [newWorkoutName, setNewWorkoutName] = React.useState('');
  const [newWorkoutCategory, setNewWorkoutCategory] = React.useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = React.useState('');
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const categories = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

  // Load data on mount
  React.useEffect(() => {
    loadData();
  }, []);

  // Save data whenever workoutHistory, currentSession, or customWorkouts changes
  React.useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [workoutHistory, currentSession, customWorkouts]);

  const loadData = async () => {
    try {
      const [historyJson, customWorkoutsJson] = await Promise.all([
        AsyncStorage.getItem('workoutHistory'),
        AsyncStorage.getItem('customWorkouts')
      ]);
      
      if (historyJson) {
        setWorkoutHistory(JSON.parse(historyJson));
      }
      if (customWorkoutsJson) {
        setCustomWorkouts(JSON.parse(customWorkoutsJson));
      }
      // Don't restore currentSession - always start fresh
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('workoutHistory', JSON.stringify(workoutHistory)),
        AsyncStorage.setItem('customWorkouts', JSON.stringify(customWorkouts))
      ]);
      // Don't save currentSession
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleStartSession = () => {
    const now = new Date();
    const newSession = {
      id: Date.now().toString(),
      startTime: now.toLocaleString(),
      startTimestamp: now.getTime(),
      exercises: []
    };
    setCurrentSession(newSession);
  };

  const handleEndSession = () => {
    if (currentSession && currentSession.exercises.length > 0) {
      const endTime = new Date();
      const endTimestamp = endTime.getTime();
      const startTimestamp = currentSession.startTimestamp || Date.now();
      const durationMinutes = Math.round((endTimestamp - startTimestamp) / 1000 / 60);
      
      const completedSession = {
        ...currentSession,
        endTime: endTime.toLocaleString(),
        duration: durationMinutes
      };
      
      setWorkoutHistory([completedSession, ...workoutHistory]);
      setCurrentSession(null);
    }
  };

  const handleCreateWorkout = () => {
    if (newWorkoutName.trim() && newWorkoutCategory.trim()) {
      const newWorkout = {
        id: `custom-${Date.now()}`,
        name: newWorkoutName.trim(),
        category: newWorkoutCategory.trim(),
        description: newWorkoutDescription.trim() || 'Custom workout'
      };
      setCustomWorkouts([...customWorkouts, newWorkout]);
      setCreateWorkoutModalVisible(false);
      setNewWorkoutName('');
      setNewWorkoutCategory('');
      setNewWorkoutDescription('');
      setShowCategoryPicker(false);
    }
  };

  const handleCategorySelect = (category) => {
    setNewWorkoutCategory(category);
    setShowCategoryPicker(false);
  };

  const allWorkouts = [...workoutsData.workouts, ...customWorkouts];

  const handleSelectWorkout = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
    setWeight('');
    setReps('');
    setSets('');
  };

  const getLastWorkoutEntry = () => {
    if (!selectedWorkout) return null;
    
    for (const session of workoutHistory) {
      const exercise = session.exercises.find(ex => ex.workout.id === selectedWorkout.id);
      if (exercise) return exercise;
    }
    
    return null;
  };

  const handleSaveWorkout = () => {
    if (selectedWorkout && weight && reps && sets && currentSession) {
      const newExercise = {
        id: Date.now().toString(),
        workout: selectedWorkout,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        sets: parseInt(sets),
        time: new Date().toLocaleTimeString()
      };
      
      setCurrentSession({
        ...currentSession,
        exercises: [...currentSession.exercises, newExercise]
      });
      
      setModalVisible(false);
      setSelectedWorkout(null);
    }
  };

  const handleDeleteSession = (sessionId) => {
    setWorkoutHistory(workoutHistory.filter(session => session.id !== sessionId));
  };

  const handleClearAllSessions = () => {
    setWorkoutHistory([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym App</Text>
      <Text style={styles.subtitle}>Track your workouts</Text>
      
      {!currentSession ? (
        <TouchableOpacity style={styles.startSessionButton} onPress={handleStartSession}>
          <Text style={styles.startSessionButtonText}>Start New Session</Text>
        </TouchableOpacity>
      ) : (
        <SessionCard session={currentSession} onEndSession={handleEndSession} />
      )}
      
      <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
        {currentSession && (
          <>
            <View style={styles.addWorkoutHeader}>
              <Text style={styles.sectionTitle}>Select a Workout:</Text>
              <TouchableOpacity 
                style={styles.addWorkoutButton}
                onPress={() => setCreateWorkoutModalVisible(true)}
              >
                <Text style={styles.addWorkoutButtonText}>+ New</Text>
              </TouchableOpacity>
            </View>
            {allWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleSelectWorkout(workout)}
              />
            ))}
          </>
        )}

        <SessionHistory
          sessions={workoutHistory}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAllSessions}
        />
      </ScrollView>

      <WorkoutModal
        visible={modalVisible}
        workout={selectedWorkout}
        weight={weight}
        reps={reps}
        sets={sets}
        lastEntry={getLastWorkoutEntry()}
        hasSession={!!currentSession}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveWorkout}
        onWeightChange={setWeight}
        onRepsChange={setReps}
        onSetsChange={setSets}
      />

      <CreateWorkoutModal
        visible={createWorkoutModalVisible}
        name={newWorkoutName}
        category={newWorkoutCategory}
        description={newWorkoutDescription}
        showPicker={showCategoryPicker}
        categories={categories}
        onClose={() => setCreateWorkoutModalVisible(false)}
        onCreate={handleCreateWorkout}
        onNameChange={setNewWorkoutName}
        onCategoryChange={handleCategorySelect}
        onDescriptionChange={setNewWorkoutDescription}
        onTogglePicker={() => setShowCategoryPicker(!showCategoryPicker)}
      />
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: 'center',
  },
  startSessionButton: {
    backgroundColor: '#0f4c75',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  startSessionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentSessionContainer: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f4c75',
  },
  sessionTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  endSessionButton: {
    backgroundColor: '#533483',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endSessionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionExercises: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#0f2027',
  },
  sessionExerciseItem: {
    paddingVertical: 8,
  },
  sessionExerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#eee',
  },
  sessionExerciseDetails: {
    fontSize: 13,
    color: '#0f4c75',
    marginTop: 2,
  },
  workoutList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eee',
    marginTop: 10,
    marginBottom: 15,
  },
  addWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addWorkoutButton: {
    backgroundColor: '#0f4c75',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addWorkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyTitle: {
    marginTop: 30,
  },
  workoutCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  workoutCategory: {
    fontSize: 14,
    color: '#0f4c75',
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: '#0f2027',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#0f4c75',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  historySessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  historyWorkoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#eee',
  },
  deleteButton: {
    fontSize: 20,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  sessionExercisesList: {
    marginTop: 10,
    marginBottom: 5,
  },
  historyExercise: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  historyExerciseCount: {
    fontSize: 12,
    color: '#0f4c75',
    fontWeight: '600',
    marginTop: 5,
  },
  historyDetails: {
    fontSize: 15,
    color: '#0f4c75',
    fontWeight: '600',
    marginBottom: 5,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 5,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 25,
    textAlign: 'center',
  },
  lastWorkoutContainer: {
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
  lastWorkoutDate: {
    fontSize: 11,
    color: '#666',
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
  dropdownButton: {
    backgroundColor: '#0f2027',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#0f4c75',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#eee',
  },
  placeholderText: {
    color: '#666',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#0f4c75',
  },
  dropdownList: {
    backgroundColor: '#0f2027',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#0f4c75',
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#eee',
  },
  modalButtons: {
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
