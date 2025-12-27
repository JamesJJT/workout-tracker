import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SessionHistory from '../components/SessionHistory';
import { styles } from '../styles/appStyles';

export default function HistoryScreen({
  navigation,
  workoutHistory,
  onDeleteSession,
  onClearAllSessions,
}) {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(new Date());

  const formatDisplayDate = (date) => {
    if (!date) return 'Select a date';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredSessions = workoutHistory.filter(session => {
    if (!selectedDate) return true;
    
    // Parse session timestamp instead of locale string
    const sessionTimestamp = session.startTimestamp;
    if (!sessionTimestamp) return false;
    
    const sessionDate = new Date(sessionTimestamp);
    const filterDate = new Date(selectedDate);
    
    // Compare dates without time
    const sessionDay = sessionDate.getDate();
    const sessionMonth = sessionDate.getMonth();
    const sessionYear = sessionDate.getFullYear();
    
    const filterDay = filterDate.getDate();
    const filterMonth = filterDate.getMonth();
    const filterYear = filterDate.getFullYear();
    
    return sessionDay === filterDay && 
           sessionMonth === filterMonth && 
           sessionYear === filterYear;
  });

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setTempDate(date);
      if (Platform.OS === 'android') {
        setSelectedDate(date);
      }
    }
  };

  const confirmDate = () => {
    setSelectedDate(tempDate);
    setShowDatePicker(false);
  };

  const clearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navButtonText}>← Back to Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ color: '#eee', fontSize: 14, marginBottom: 8, fontWeight: '600' }}>Filter by Date:</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#16213e', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#0f4c75', marginRight: 10 }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: selectedDate ? '#eee' : '#666', fontSize: 16 }}>
              {formatDisplayDate(selectedDate)}
            </Text>
          </TouchableOpacity>
          {selectedDate && (
            <TouchableOpacity
              style={{ backgroundColor: '#ff4444', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10 }}
              onPress={clearDate}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showDatePicker && (
        <>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            themeVariant="dark"
          />
          {Platform.OS === 'ios' && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#16213e', padding: 15, borderRadius: 10, marginBottom: 15 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#666', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#0f4c75', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
                onPress={confirmDate}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
        <SessionHistory
          sessions={filteredSessions}
          onDeleteSession={onDeleteSession}
          onClearAll={onClearAllSessions}
          onSessionPress={(sessionId) => navigation.navigate('SessionDetail', { sessionId })}
        />
      </ScrollView>
    </View>
  );
}
