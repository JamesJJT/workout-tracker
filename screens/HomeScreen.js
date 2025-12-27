import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import SessionCard from '../components/SessionCard';
import WorkoutCard from '../components/WorkoutCard';
import SessionHistory from '../components/SessionHistory';
import WorkoutModal from '../components/WorkoutModal';
import CreateWorkoutModal from '../components/CreateWorkoutModal';
import { styles } from '../styles/appStyles';
import { FILTER_OPTIONS, CATEGORY_LIST } from '../constants/categories';
import workoutsData from '../workouts-data.json';

export default function HomeScreen({
  navigation,
  currentSession,
  setCurrentSession,
  workoutHistory,
  setWorkoutHistory,
  customWorkouts,
  setCustomWorkouts,
  onDeleteSession,
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState(FILTER_OPTIONS.ALL);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [createWorkoutModalVisible, setCreateWorkoutModalVisible] = React.useState(false);
  const [selectedWorkout, setSelectedWorkout] = React.useState(null);
  const [weight, setWeight] = React.useState('');
  const [reps, setReps] = React.useState('');
  const [sets, setSets] = React.useState('');
  const [minutes, setMinutes] = React.useState('');
  const [newWorkoutName, setNewWorkoutName] = React.useState('');
  const [newWorkoutCategory, setNewWorkoutCategory] = React.useState('');
  const [newWorkoutDescription, setNewWorkoutDescription] = React.useState('');
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);

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

  const handleCancelSession = () => {
    setCurrentSession(null);
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

  const filteredWorkouts = allWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedFilter === FILTER_OPTIONS.ALL || workout.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSelectWorkout = (workout) => {
    setSelectedWorkout(workout);
    setModalVisible(true);
    setWeight('');
    setReps('');
    setSets('');
    setMinutes('');
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
    const isCardio = selectedWorkout?.category === 'Cardio';
    const isValid = isCardio ? (selectedWorkout && minutes && currentSession) : (selectedWorkout && weight && reps && sets && currentSession);
    
    if (isValid) {
      const newExercise = {
        id: Date.now().toString(),
        workout: selectedWorkout,
        ...(isCardio 
          ? { minutes: parseInt(minutes) }
          : { 
              weight: parseFloat(weight),
              reps: parseInt(reps),
              sets: parseInt(sets)
            }
        ),
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

  return (
    <>
      <View style={styles.container}>
      {currentSession && currentSession.exercises.length === 0 && (
        <TouchableOpacity 
          style={{ position: 'absolute', top: 60, right: 20, backgroundColor: '#ff4444', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
          onPress={handleCancelSession}
        >
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>✕</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Gym App</Text>
      <Text style={styles.subtitle}>Track your workouts</Text>
      
      {!currentSession ? (
        <TouchableOpacity style={styles.startSessionButton} onPress={handleStartSession}>
          <Text style={styles.startSessionButtonText}>Start New Session</Text>
        </TouchableOpacity>
      ) : (
        <SessionCard session={currentSession} onEndSession={handleEndSession} onCancelSession={handleCancelSession} />
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
            
            <TextInput
              style={{ backgroundColor: '#16213e', borderRadius: 10, padding: 12, color: '#eee', marginBottom: 15, borderWidth: 1, borderColor: '#0f4c75' }}
              placeholder="Search workouts..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              <TouchableOpacity
                style={{ backgroundColor: selectedFilter === FILTER_OPTIONS.ALL ? '#0f4c75' : '#16213e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}
                onPress={() => setSelectedFilter(FILTER_OPTIONS.ALL)}
              >
                <Text style={{ color: '#eee', fontWeight: selectedFilter === FILTER_OPTIONS.ALL ? 'bold' : 'normal' }}>All</Text>
              </TouchableOpacity>
              {CATEGORY_LIST.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={{ backgroundColor: selectedFilter === cat ? '#0f4c75' : '#16213e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}
                  onPress={() => setSelectedFilter(cat)}
                >
                  <Text style={{ color: '#eee', fontWeight: selectedFilter === cat ? 'bold' : 'normal' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleSelectWorkout(workout)}
              />
            ))}
          </>
        )}

        {!currentSession && (
          <>
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={() => navigation.navigate('History')}
            >
              <Text style={styles.navButtonText}>→ View Session History</Text>
            </TouchableOpacity>

            {workoutHistory.length > 0 && (
              <SessionHistory
                sessions={workoutHistory.slice(0, 3)}
                onDeleteSession={onDeleteSession}
                onClearAll={null}
                onSessionPress={(sessionId) => navigation.navigate('SessionDetail', { sessionId })}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>

    <WorkoutModal
      visible={modalVisible}
      workout={selectedWorkout}
      weight={weight}
      reps={reps}
      sets={sets}
      minutes={minutes}
      lastEntry={getLastWorkoutEntry()}
      hasSession={!!currentSession}
      onClose={() => setModalVisible(false)}
      onSave={handleSaveWorkout}
      onWeightChange={setWeight}
      onRepsChange={setReps}
      onSetsChange={setSets}
      onMinutesChange={setMinutes}
    />

    <CreateWorkoutModal
      visible={createWorkoutModalVisible}
      name={newWorkoutName}
      category={newWorkoutCategory}
      description={newWorkoutDescription}
      showPicker={showCategoryPicker}
      categories={CATEGORY_LIST}
      onClose={() => setCreateWorkoutModalVisible(false)}
      onCreate={handleCreateWorkout}
      onNameChange={setNewWorkoutName}
      onCategoryChange={handleCategorySelect}
      onDescriptionChange={setNewWorkoutDescription}
      onTogglePicker={() => setShowCategoryPicker(!showCategoryPicker)}
    />
  </>
  );
}
