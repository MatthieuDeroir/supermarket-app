import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import ApiRoutes from '../../common/defs/routes/apiRoutes';

const ForgotPassword = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Veuillez entrer votre adresse email.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(ApiRoutes.Auth.RequestPasswordReset, {
        email,
      });
      console.log('Réinitialisation demandée:', response.data);
      Alert.alert(
        'Succès',
        'Un lien de réinitialisation vous a été envoyé par email.'
      );
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      Alert.alert(
        'Erreur',
        'Impossible de réinitialiser le mot de passe. Vérifiez votre email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../../public/assets/images/GroceryFlowLOGO.png')}
      />
      <Text style={styles.title}>Basilik</Text>
      <Text style={styles.subtitle}>Mot de passe perdu ?</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre email"
        placeholderTextColor="#A9A9A9"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={styles.resetButton}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.resetButtonText}>
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
            Déjà un compte ?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E2E2E',
    marginBottom: 20,
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
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#A55D2B',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    fontSize: 14,
    color: '#4F4F4F',
  },
  loginLink: {
    color: '#4F8EF7',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;
