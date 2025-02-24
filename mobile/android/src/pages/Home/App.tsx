import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const handleLogout = async () => {
    try {
      await Keychain.resetGenericPassword(); // Suppression sécurisée du token
      navigation.replace('Login');
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Basilik 🥬</Text>
      <Button title="Se déconnecter" onPress={handleLogout} color="#6B8E7D" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E2E2E',
    marginBottom: 20,
  },
});

export default HomeScreen;
