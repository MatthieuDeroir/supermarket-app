import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>BasilikCorp @ 2025. All rights reserved.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#697077',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '5%',
    },
    text: {
        color: '#ffffff',
        fontSize: 10,
    },
});

export default Footer;