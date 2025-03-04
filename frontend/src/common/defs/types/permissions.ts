
const permissions = {
  user: [
    { label: 'Accueil', link: '/accueil', icon: 'HomeIcon' },
    { label: 'Paniers', link: '/paniers', icon: 'ShoppingCartIcon' },
    { label: 'Facture', link: '/facture', icon: 'ArticleIcon' },
    { label: 'Déconnexion', link: '/logout', icon: 'PersonIcon' },
  ],
  manager: [
    { label: 'Accueil', link: '/accueil', icon: 'HomeIcon' },
    { label: 'Stocks', link: '/stocks', icon: 'LayersIcon' },
    { label: 'Ventes', link: '/ventes', icon: 'CreditCardIcon' },
    { label: 'Promotions', link: '/promotions', icon: 'ShoppingCartIcon' },
    { label: 'Paramètres', link: '/parametres', icon: 'SettingsIcon' },
  ],
  admin: [
    { label: 'Accueil', link: '/accueil', icon: 'HomeIcon' },
    { label: 'Stocks', link: '/stocks', icon: 'LayersIcon' },
    { label: 'Ventes', link: '/ventes', icon: 'CreditCardIcon' },
    { label: 'Promotions', link: '/promotions', icon: 'ShoppingCartIcon' },
    { label: 'Paramètres', link: '/parametres', icon: 'SettingsIcon' },
    { label: 'Utilisateurs', link: '/users', icon: 'PersonIcon' },
    { label: 'TVA', link: '/tva', icon: 'ArticleIcon' },
  ],
  guest: ['/', '/login', '/register'],
};

export default permissions;
