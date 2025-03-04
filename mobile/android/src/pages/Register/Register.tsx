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
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import ApiRoutes from '../../common/defs/routes/apiRoutes';

const Register = ({ navigation }: { navigation: any }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    if (!form.acceptTerms) {
      Alert.alert('Erreur', 'Vous devez accepter les termes et conditions.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const userData = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      phone_number: form.phone_number,
    };

    try {
      const response = await axios.post(ApiRoutes.Users.Create, userData);
      console.log('Inscription réussie:', response.data);
      Alert.alert('Succès', 'Votre compte a été créé avec succès.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      Alert.alert('Erreur', 'Impossible de créer un compte.');
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

        <TextInput
            style={styles.input}
            placeholder="Entrez votre prénom"
            placeholderTextColor="#A9A9A9"
            value={form.first_name}
            onChangeText={(text) => handleChange('first_name', text)}
        />
        <TextInput
            style={styles.input}
            placeholder="Entrez votre nom"
            placeholderTextColor="#A9A9A9"
            value={form.last_name}
            onChangeText={(text) => handleChange('last_name', text)}
        />
        <TextInput
            style={styles.input}
            placeholder="Entrez votre email"
            placeholderTextColor="#A9A9A9"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            placeholder="Entrez votre mot de passe"
            placeholderTextColor="#A9A9A9"
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Confirmez votre mot de passe"
            placeholderTextColor="#A9A9A9"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
        />
        <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            placeholderTextColor="#A9A9A9"
            value={form.phone_number}
            onChangeText={(text) => handleChange('phone_number', text)}
            keyboardType="phone-pad"
        />

        <View style={styles.checkboxContainer}>
            <CheckBox
            value={form.acceptTerms}
            onValueChange={(value) => handleChange('acceptTerms', value)}
            />
            <Text style={styles.checkboxText}>J'accepte les termes et conditions.</Text>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            <Text style={styles.registerButtonText}>
            {loading ? 'Inscription...' : "S'inscrire"}
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
        marginBottom: 30,
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    checkboxText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#4F4F4F',
    },
    registerButton: {
        width: '100%',
        height: 50,
        backgroundColor: '#A55D2B',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    registerButtonText: {
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

export default Register;
