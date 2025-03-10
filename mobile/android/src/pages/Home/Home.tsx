import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthProvider';
import Header from '../../common/components/Header/header'
import Footer from '../../common/components/Footer/Footer'
import ProductCarrousel from '../../common/components/ProductCarrousel/ProductCarrousel';



const HomeScreen = () => {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Header />
      <Button title="Se déconnecter" onPress={logout} color="#6B8E7D" />
      <ProductCarrousel />
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
