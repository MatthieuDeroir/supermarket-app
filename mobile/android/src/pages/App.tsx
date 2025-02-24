import React from 'react';
import { SafeAreaView } from 'react-native';
import AuthNavigator from '../navigator/AuthNavigator';
import { AuthProvider } from '../utils/AuthContext';

const App = () => {
  return (
    <AuthProvider children={undefined}>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
};

export default App;
