import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface UserDropDownProps {
    username: string;
    onLogout: () => void;
}

const UserDropDown: React.FC<UserDropDownProps> = ({ username, onLogout }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>{username}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f00',
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        textAlign: 'center',
    },
});

export default UserDropDown;