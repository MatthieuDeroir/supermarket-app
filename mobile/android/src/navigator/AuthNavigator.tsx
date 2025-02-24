import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/Login/Login';
import HomeScreen from '../pages/Home/Home';
import { useAuth } from '../utils/AuthContext';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const { isAuth } = useAuth();

  if (isAuth === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6B8E7D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
