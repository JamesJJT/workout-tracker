import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import SessionCard from '../components/SessionCard';
import WorkoutCard from '../components/WorkoutCard';
import SessionHistory from '../components/SessionHistory';
import { styles } from '../styles/appStyles';
import { FILTER_OPTIONS } from '../constants/categories';

export default function HomeScreen({
  navigation,
  currentSession,
  handleStartSession,
  handleEndSession,
  handleCancelSession,
  handleSelectWorkout,
  allWorkouts,
  setCreateWorkoutModalVisible,
  workoutHistory,
  handleDeleteSession,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  categories,
}) {
  return (
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
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={{ backgroundColor: selectedFilter === cat ? '#0f4c75' : '#16213e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 8 }}
                  onPress={() => setSelectedFilter(cat)}
                >
                  <Text style={{ color: '#eee', fontWeight: selectedFilter === cat ? 'bold' : 'normal' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {allWorkouts.map((workout) => (
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
                onDeleteSession={handleDeleteSession}
                onClearAll={null}
                onSessionPress={(sessionId) => navigation.navigate('SessionDetail', { sessionId })}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
