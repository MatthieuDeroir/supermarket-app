import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import Header from '../../common/components/Header/header'
import Footer from '../../common/components/Footer/Footer'



const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Bienvenue sur Basilik 🥬</Text>
      <Button title="Se déconnecter" onPress={logout} color="#6B8E7D" />
      <Footer />
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
