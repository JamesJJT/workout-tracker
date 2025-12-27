import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Router from './navigation/Router';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SessionDetailScreen from './screens/SessionDetailScreen';

export default function App() {
  const [workoutHistory, setWorkoutHistory] = React.useState([]);
  const [currentSession, setCurrentSession] = React.useState(null);
  const [customWorkouts, setCustomWorkouts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

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
              setCurrentSession={setCurrentSession}
              workoutHistory={workoutHistory}
              setWorkoutHistory={setWorkoutHistory}
              customWorkouts={customWorkouts}
              setCustomWorkouts={setCustomWorkouts}
              onDeleteSession={handleDeleteSession}
            />
          ),
          History: ({ navigation }) => (
            <HistoryScreen
              navigation={navigation}
              workoutHistory={workoutHistory}
              onDeleteSession={handleDeleteSession}
              onClearAllSessions={handleClearAllSessions}
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

      <StatusBar style="light" />
    </>
  );
}
