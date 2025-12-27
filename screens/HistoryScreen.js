import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import SessionHistory from '../components/SessionHistory';
import { styles } from '../styles/appStyles';

export default function HistoryScreen({
  navigation,
  workoutHistory,
  handleDeleteSession,
  handleClearAllSessions,
}) {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>← Back to Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
        <SessionHistory
          sessions={workoutHistory}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAllSessions}
          onSessionPress={(sessionId) => navigation.navigate('SessionDetail', { sessionId })}
        />
      </ScrollView>
    </View>
  );
}
