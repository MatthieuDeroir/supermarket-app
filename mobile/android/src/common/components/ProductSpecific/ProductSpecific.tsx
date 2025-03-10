import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { makeApiRequest } from '../../defs/routes/apiRoutes';
import apiRoutes from '../../defs/routes/apiRoutes';
import Accordion from '../Accordion/Accordion';

interface Product {
    product_id: string;
    ean: string;
    name: string;
    brand: string;
    description: string;
    picture: string;
    categories: string[];
    nutritional_information: Record<string, string | number>;
    price: number;
}

const ProductSpecific = ({ route }: { route: any }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    
    const { productId } = route.params as { productId: string };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await makeApiRequest(apiRoutes.Products.GetById(Number(productId)));

                if (response) {
                setProduct({
                    product_id: response.product_id,
                    ean: response.ean,
                    name: response.name,
                    price: response.price,
                    brand: response.brand,
                    description: response.description,
                    picture: response.picture,
                    categories: response.category_id,
                    nutritional_information: JSON.parse(response.nutritional_information || '{}'),
                })
                } else {
                    console.error('Unexpected API response:', response);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du produit:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#6B8E7D" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Produit non trouvé.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <Image source={{ uri: product.picture }} style={styles.productImage} />
                <View style={styles.headerText}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.brand}>{product.brand}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Dénomination générique :</Text>
            <Text style={styles.text}>{product.description}</Text>

            <Text style={styles.sectionTitle}>Quantité :</Text>
            <Text style={styles.text}>{product.nutritional_information["quantity"]} g</Text>

            <Text style={styles.sectionTitle}>Marques :</Text>
            <Text style={styles.link}>{product.brand}</Text>

            <Accordion
                title="Informations nutritionnelles"
                content={product.categories.join('\n')}
            />


            <Text style={styles.sectionTitle}>Origine des ingrédients :</Text>
            <Text style={styles.text}>Non indiqué</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        padding: 15,
        backgroundColor: '#FFFFFF',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    productImage: {
        width: 120,
        height: 120,
        marginRight: 15,
        borderRadius: 10,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    brand: {
        fontSize: 16,
        color: '#6B8E7D',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
    },
    text: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    link: {
        fontSize: 14,
        color: '#4F8EF7',
        textDecorationLine: 'underline',
        marginBottom: 5,
    },
    scoresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    scoreImage: {
        width: 100,
        height: 50,
    },
});

export default ProductSpecific;
