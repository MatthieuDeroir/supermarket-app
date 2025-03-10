import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface Product {
    product_id: string;
    ean: string;
    name: string;
    price: number;
    image: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price} €</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 10,
        width: 175,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    name: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#6B8E7D',
        fontWeight: 'bold',
    },
});

export default ProductCard;
