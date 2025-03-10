import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { getUserInfo } from '../../../modules/UserInfo';
import { useAuth } from '../../../context/AuthProvider';


interface UserInfo {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

const Header: React.FC = () => {
    let user: UserInfo | null = getUserInfo();
    const { logout } = useAuth();

    const defaultUser: UserInfo = {
        userId: 0,
        email: 'John.Doe@test.com',
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

    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{(user?.lastName).trim().charAt(0)}.{user?.firstName}</Text>

            <Image
                style={styles.logoApp}
                source={require('../../../../public/assets/images/GroceryFlowLOGO.png')}
            />

            <View style={styles.logoContainer}>
                <TouchableOpacity onPress={() => Alert.alert('Panier ouvert')} style={styles.logoBtn}>
                    <Image source={require('../../../../public/assets/images/shopping_cart.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleMenu} style={styles.logoBtn}>
                    <Image source={require('../../../../public/assets/images/menu.png')} />
                </TouchableOpacity>
            </View>

            <Modal transparent visible={menuVisible} animationType="fade">
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Paramètres')}>
                        <Text style={styles.menuText}>Paramètres</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Profil')}>
                        <Text style={styles.menuText}>Mon profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('factures')}>
                        <Text style={styles.menuText}>Mes factures</Text>
                    </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('adresses')}>
                        <Text style={styles.menuText}>Mes adresses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('favories')}>
                        <Text style={styles.menuText}>Mes favories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={logout}>
                        <Text style={styles.menuText}>Déconnexion</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
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
        alignItems: 'center',
    },
    logoBtn: {
        padding: 10,
    },
    
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 60,
        right: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default Header;
