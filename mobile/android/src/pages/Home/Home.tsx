import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../../common/components/Header/header'
import Footer from '../../common/components/Footer/Footer'
import ProductCarrousel from '../../common/components/ProductCarrousel/ProductCarrousel';



const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
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
