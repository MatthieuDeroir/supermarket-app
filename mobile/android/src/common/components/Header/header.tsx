import React from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import {getUserInfo} from '../../../modules/UserInfo';

interface UserInfo {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const Header: React.FC = () => {
    let user: UserInfo | null = getUserInfo();

    const defaultUser: UserInfo = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123456'
    };

    if (!user) {
        user = defaultUser;
    } else {
        user.firstName = user.firstName || defaultUser.firstName;
        user.lastName = user.lastName || defaultUser.lastName;
        user.phoneNumber = user.phoneNumber || defaultUser.phoneNumber;
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{(user?.lastName).trim().charAt(0)}.{user?.firstName}</Text>
            <Image
            style={styles.logoApp}
            source={require('../../../../public/assets/images/GroceryFlowLOGO.png')}
            />
            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={() => Alert.alert('coucou')} style={styles.logoBtn}>
                    <Image
                        source={require('../../../../public/assets/images/shopping_cart.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert('coucou 2')} style={styles.logoBtn}>
                    <Image
                        source={require('../../../../public/assets/images/menu.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '10%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'darkblue',
    },
    logoApp: {
        height: 50,
        width: 50,
        position: 'absolute', 
        left: '52.5%',
        transform: [{ translateX: -25 }],
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logoBtn: {
        padding: 10,
    }
});


export default Header;