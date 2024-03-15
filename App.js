import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Form from './components/Form';
import { Provider } from 'react-redux';
import { store } from './Redux/store';

export default function App() {
  return (
    <ScrollView style={styles.container}>
    <Provider store={store}>
    <Form/>
    </Provider>
  </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal:10,
    marginTop:80
  },
});
