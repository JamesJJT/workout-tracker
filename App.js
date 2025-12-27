import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import workoutsData from './workouts-data.json';
import Router from './navigation/Router';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';
import WorkoutModal from './components/WorkoutModal';
import CreateWorkoutModal from './components/CreateWorkoutModal';
import { CATEGORY_LIST, FILTER_OPTIONS } from './constants/categories';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState(FILTER_OPTIONS.ALL);

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
    <>
      <Router
        initialRoute="Home"
        routes={{
          Home: ({ navigation }) => (
            <HomeScreen
              navigation={navigation}
              currentSession={currentSession}
              handleStartSession={handleStartSession}
              handleEndSession={handleEndSession}
              handleCancelSession={handleCancelSession}
              handleSelectWorkout={handleSelectWorkout}
              allWorkouts={filteredWorkouts}
              setCreateWorkoutModalVisible={setCreateWorkoutModalVisible}
              workoutHistory={workoutHistory}
              handleDeleteSession={handleDeleteSession}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              categories={CATEGORY_LIST}
            />
          ),
          History: ({ navigation }) => (
            <HistoryScreen
              navigation={navigation}
              workoutHistory={workoutHistory}
              handleDeleteSession={handleDeleteSession}
              handleClearAllSessions={handleClearAllSessions}
            />
          ),
          SessionDetail: ({ navigation }) => {
            const sessionId = navigation.params?.sessionId;
            const session = workoutHistory.find(s => s.id === sessionId);
            return (
              <SessionDetailScreen
                session={session}
                onBack={() => navigation.navigate('History')}
                onDeleteSession={handleDeleteSession}
              />
            );
          },
        }}
      />

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
        categories={CATEGORY_LIST}
        onClose={() => setCreateWorkoutModalVisible(false)}
        onCreate={handleCreateWorkout}
        onNameChange={setNewWorkoutName}
        onCategoryChange={handleCategorySelect}
        onDescriptionChange={setNewWorkoutDescription}
        onTogglePicker={() => setShowCategoryPicker(!showCategoryPicker)}
      />

      <StatusBar style="light" />
    </>
  );
}
