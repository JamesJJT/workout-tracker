import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { formatDuration } from '../utils/formatDuration';

export default function StatsScreen({ navigation, workoutHistory = [] }) {
  const totalSessions = workoutHistory.length;
  const totalExercises = workoutHistory.reduce((acc, s) => acc + (s.exercises?.length || 0), 0);

  // total sets and volume
  let totalSets = 0;
  let totalVolume = 0; // kg
  const exerciseCounts = {}; // name -> count
  let totalDuration = 0;
  let sessionsWithDuration = 0;

  workoutHistory.forEach(session => {
    if (session.duration !== undefined && session.duration !== null) {
      totalDuration += Number(session.duration) || 0;
      sessionsWithDuration += 1;
    }
    (session.exercises || []).forEach(ex => {
      if (ex.workout?.category !== 'Cardio') {
        const sets = parseInt(ex.sets, 10) || 0;
        const reps = parseInt(ex.reps, 10) || 0;
        const weight = parseFloat(ex.weight) || 0;
        totalSets += sets;
        totalVolume += weight * reps * sets;
      }
      const name = ex.workout?.name || 'Unknown';
      exerciseCounts[name] = (exerciseCounts[name] || 0) + 1;
    });
  });

  // cardio stats
  let totalCardioMinutes = 0;
  const cardioPerSession = workoutHistory.map(session => {
    const mins = (session.exercises || []).reduce((acc, ex) => {
      if (ex.workout?.category === 'Cardio') return acc + (parseInt(ex.minutes, 10) || 0);
      return acc;
    }, 0);
    totalCardioMinutes += mins;
    return mins;
  });

  const avgDuration = sessionsWithDuration > 0 ? Math.round(totalDuration / sessionsWithDuration) : 0;

  // most performed exercise
  let topExercise = null;
  let topCount = 0;
  Object.keys(exerciseCounts).forEach(name => {
    if (exerciseCounts[name] > topCount) {
      topCount = exerciseCounts[name];
      topExercise = name;
    }
  });

  const chartConfig = {
    backgroundGradientFrom: '#0a0e27',
    backgroundGradientTo: '#16213e',
    color: (opacity = 1) => `rgba(15,76,117, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(170,170,170, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
  };

  const [activeTab, setActiveTab] = useState('summary');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.back}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'summary' && styles.tabActive]} onPress={() => setActiveTab('summary')}>
          <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>Summary</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'charts' && styles.tabActive]} onPress={() => setActiveTab('charts')}>
          <Text style={[styles.tabText, activeTab === 'charts' && styles.tabTextActive]}>Charts</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'charts' ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.chartCard}>
            <Text style={styles.cardLabel}>Volume — Last {Math.min(7, workoutHistory.length)} Sessions</Text>
            {workoutHistory.length === 0 ? (
              <Text style={{ color: '#aaa', marginTop: 8 }}>No data</Text>
            ) : (
              <LineChart
                data={{
                  labels: workoutHistory.slice(0,7).map((_,i) => `S${i+1}`),
                  datasets: [{
                    data: workoutHistory.slice(0,7).map(session => {
                      return (session.exercises || []).reduce((acc, ex) => {
                        const sets = parseInt(ex.sets,10) || 0;
                        const reps = parseInt(ex.reps,10) || 0;
                        const weight = parseFloat(ex.weight) || 0;
                        return acc + weight * reps * sets;
                      }, 0);
                    })
                  }]
                }}
                width={Dimensions.get('window').width - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={{ marginVertical: 8, borderRadius: 8 }}
              />
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.cardLabel}>Cardio Minutes — Last {Math.min(7, workoutHistory.length)} Sessions</Text>
            {workoutHistory.length === 0 ? (
              <Text style={{ color: '#aaa', marginTop: 8 }}>No data</Text>
            ) : (
              <LineChart
                data={{
                  labels: cardioPerSession.slice(0,7).map((_,i) => `S${i+1}`),
                  datasets: [{ data: cardioPerSession.slice(0,7) }]
                }}
                width={Dimensions.get('window').width - 48}
                height={180}
                chartConfig={chartConfig}
                bezier
                style={{ marginVertical: 8, borderRadius: 8 }}
              />
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Sessions</Text>
            <Text style={styles.cardValue}>{totalSessions}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Exercises</Text>
            <Text style={styles.cardValue}>{totalExercises}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Sets</Text>
            <Text style={styles.cardValue}>{totalSets}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Volume</Text>
            <Text style={styles.cardValue}>{Math.round(totalVolume)} kg</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Avg Session Duration</Text>
            <Text style={styles.cardValue}>{avgDuration} min</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Most Frequent Exercise</Text>
            <Text style={styles.cardValue}>{topExercise || '—'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Total Cardio Minutes</Text>
            <Text style={styles.cardValue}>{totalCardioMinutes} min</Text>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  header: { paddingTop: 60, padding: 20, backgroundColor: '#16213e', borderBottomWidth: 1, borderBottomColor: '#0f4c75' },
  back: { color: '#0f4c75', fontWeight: '700', marginBottom: 8 },
  title: { color: '#eee', fontSize: 20, fontWeight: '700' },
  content: { padding: 20 },
  card: { backgroundColor: '#16213e', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#0f4c75' },
  cardLabel: { color: '#aaa', marginBottom: 6, textTransform: 'uppercase', fontSize: 12 },
  cardValue: { color: '#eee', fontSize: 18, fontWeight: '700' },
  tabBar: { flexDirection: 'row', backgroundColor: '#0f1626', paddingHorizontal: 10 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#0f4c75' },
  tabText: { color: '#aaa', fontWeight: '700' },
  tabTextActive: { color: '#eee' },
  chartCard: { backgroundColor: '#16213e', padding: 12, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#0f4c75' },
});
