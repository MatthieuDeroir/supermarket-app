import * as Keychain from 'react-native-keychain';

// Sauvegarde du token sécurisé
export const saveToken = async (token: string) => {
  try {
    await Keychain.setGenericPassword('authToken', token);
    console.log('Token stocké avec succès');
  } catch (error) {
    console.error('Erreur lors du stockage du token:', error);
  }
};

// Récupération du token
export const getToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

// Suppression du token (déconnexion)
export const deleteToken = async () => {
  try {
    await Keychain.resetGenericPassword();
    console.log('Token supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
  }
};
