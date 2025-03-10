import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { makeApiRequest } from '../../defs/routes/apiRoutes';
import ProductCard from '../ProductCard/ProductCard';
import apiRoutes from '../../defs/routes/apiRoutes';

interface Product {
    product_id: string;
    ean: string;
    name: string;
    price: number;
    image: string;
}

const ProductCarrousel: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from:', apiRoutes.Products.GetAll);
                const response = await makeApiRequest(apiRoutes.Products.GetAll);
                
                if (response && Array.isArray(response)) {
                    setProducts(response);
                    console.log('Products fetched successfully:', response);
                } else {
                    console.error('Unexpected API response:', response);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#6B8E7D" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.product_id}
                renderItem={({ item }) => <ProductCard product={item} />}
                numColumns={2} 
                columnWrapperStyle={styles.row}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,
        
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        justifyContent: 'space-around',  
        // marginBottom: 10, 
        // marginLeft: 10,
        // marginRight: 10,

    },
});

export default ProductCarrousel;
