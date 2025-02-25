import React, { createContext, useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ApiRoutes from '../common/defs/routes/apiRoutes';

// 📌 Définition du type du contexte d'authentification
interface AuthContextType {
  isAuth: boolean;
  login: (email: string, password: string, navigation: any) => Promise<void>;
  logout: (navigation: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook sécurisé pour utiliser l'auth (évite `null`)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 📌 Fonctions de gestion du token
const saveToken = async (token: string) => {
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

// 📌 `AuthProvider` : Gère l'état d'authentification
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
      const response = await axios.post(ApiRoutes.Auth.Login, {
        email,
        password,
      });

      if (response.data.success && response.data.token) {
        await saveToken(response.data.token);
        setIsAuth(true);
        Alert.alert('Connexion réussie', 'Vous êtes connecté(e) avec succès.');
        navigation.replace('Home');
      } else {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
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
