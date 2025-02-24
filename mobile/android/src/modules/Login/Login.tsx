import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import * as Keychain from 'react-native-keychain';

const Login = ({ navigation }: { navigation?: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    // Simulation d'une authentification
    if (email === 'user@basilik.com' && password === '1234') {
      try {
        // Stockage sécurisé du token
        await Keychain.setGenericPassword('user', 'mocked_token');
        Alert.alert('Connexion réussie', 'Vous êtes connecté(e) avec succès.');
        navigation?.replace('Home');
      } catch (error) {
        console.error('Erreur lors du stockage du token:', error);
      }
    } else {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../../public/assets/images/GroceryFlowLOGO.png')}
      />

      <Text style={styles.title}>Basilik</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre mot de passe"
        placeholderTextColor="#A9A9A9"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.rememberContainer}>
        <CheckBox
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.rememberText}>Se souvenir de moi</Text>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation?.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>
        Vous n'avez pas de compte ?{' '}
        <TouchableOpacity onPress={() => navigation?.navigate('Register')}>
          <Text style={styles.registerLink}>S'inscrire</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E2E2E',
    marginBottom: 30,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: '600',
    color: '#4F4F4F',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#F7F7F7',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4F4F4F',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6B8E7D',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#4F8EF7',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: '#4F4F4F',
  },
  registerLink: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
});

export default Login;
