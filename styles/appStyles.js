import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  navButton: {
    padding: 10,
    marginVertical: 10,
  },
  navButtonText: {
    color: '#0f4c75',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;
