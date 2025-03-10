import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/Login/Login';
import HomeScreen from '../pages/Home/Home';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ProductSpecific from '../common/components/ProductSpecific/ProductSpecific';
import Register from '../pages/Register/Register';
import { useAuth } from '../context/AuthProvider';

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
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProductSpecific" component={ProductSpecific} /> 
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
