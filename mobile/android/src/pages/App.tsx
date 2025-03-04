import React from 'react';
import { SafeAreaView } from 'react-native';
import AuthNavigator from '../navigator/AuthNavigator';
import { AuthProvider } from '../context/AuthProvider';


const App = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
};

export default App;
