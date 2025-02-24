import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoginDisplay from '../../modules/Login/Login';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <LoginDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
