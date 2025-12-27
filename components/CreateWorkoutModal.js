import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function CreateWorkoutModal({
  visible,
  name,
  category,
  description,
  showPicker,
  categories,
  onClose,
  onCreate,
  onNameChange,
  onCategoryChange,
  onDescriptionChange,
  onTogglePicker,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.content}>
          <Text style={styles.title}>Create New Workout</Text>
          <Text style={styles.subtitle}>Add a custom exercise</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Exercise Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={onNameChange}
              placeholder="e.g., Bulgarian Split Squat"
              placeholderTextColor="#666"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={onTogglePicker}
            >
              <Text style={[styles.dropdownButtonText, !category && styles.placeholderText]}>
                {category || 'Select a category'}
              </Text>
              <Text style={styles.dropdownArrow}>{showPicker ? '\u25b2' : '\u25bc'}</Text>
            </TouchableOpacity>
            
            {showPicker && (
              <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.dropdownItem}
                    onPress={() => onCategoryChange(cat)}
                  >
                    <Text style={styles.dropdownItemText}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description (optional)</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={onDescriptionChange}
              placeholder="Notes about this exercise"
              placeholderTextColor="#666"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={onCreate}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
          </TouchableWithoutFeedback>
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
