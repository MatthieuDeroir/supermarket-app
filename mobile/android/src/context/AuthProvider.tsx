import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ApiRoutes from '../common/defs/routes/apiRoutes';
import { makeApiRequest } from '../common/defs/routes/apiRoutes';
import { setUserInfo } from '../modules/UserInfo';



interface AuthContextType {
  isAuth: boolean;
  login: (email: string, password: string, navigation: any) => Promise<void>;
  logout: (navigation: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const saveToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword('authToken', token);
  } catch (error) {
    console.error('Erreur lors du stockage du token:', error);
  }
};

const getToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword();
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      setIsAuth(!!token);
    };
    checkAuth();
  }, []);

const login = async (email: string, password: string, navigation: any) => {
  try {
    console.log('Tentative de connexion...');
    console.log(`Envoi des données: ${JSON.stringify({ email, password })}`);

    const response = await makeApiRequest(ApiRoutes.Auth.Login, 'POST', { email, password });
    console.log();
    console.log('Réponse API:', response.data);

    if (response.token) {
      await saveToken(response.token);
      setIsAuth(true);
      setUserInfo(response.user.firstName, response.user.lastName, response.user.phoneNumber);
      navigation.replace('Home');
    } else {
      Alert.alert('Erreur', 'Identifiants incorrects.');
    }
  } catch (error) {
      console.error('Erreur lors de la connexion:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log('Erreur de l\'API:', error.response.data);
        } else if (error.request) {
          console.log('Aucune réponse reçue de l\'API.');
        } else {
          console.log('Erreur inconnue:', error.message);
        }
      } else {
        console.log('Erreur inconnue:', error);
      }

      Alert.alert('Erreur', 'Impossible de se connecter.');
    }
    };


  const logout = async (navigation: any) => {
    await deleteToken();
    setIsAuth(false);
    navigation.replace('Login');
  };

  if (isAuth === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6B8E7D" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 📌 Navigation : Home et Login
import LoginScreen from '../pages/Login/Login';
import HomeScreen from '../pages/Home/Home';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {useAuth().isAuth ? (
            <Stack.Screen name="Home" component={HomeScreen} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AuthNavigator;
