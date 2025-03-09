import Routes from '@common/defs/routes/routes';
import { iconMap } from '@common/defs/types/IconMap';

export type PermissionItem = {
  icon: keyof typeof iconMap;
  itemLabel: string;
  itemLink?: string;
  sousItems?: {
    icon: keyof typeof iconMap;
    itemLabel: string;
    itemLink?: string;
  }[];
};

export type PermissionsData = {
  items: PermissionItem[];
};

const permissions: Record<string, PermissionsData> = {
  user: {
    items: [
      {
        icon: 'HomeIcon' as keyof typeof iconMap,
        itemLabel: 'Accueil',
        itemLink: Routes.Common.Home,
      },
      {
        icon: 'ShoppingCartIcon' as keyof typeof iconMap,
        itemLabel: 'Paniers',
        itemLink: Routes.Common.Promotions,
      },
      {
        icon: 'ReceiptIcon' as keyof typeof iconMap,
        itemLabel: 'Factures',
        itemLink: Routes.Common.Settings,
      },
    ],
  },
  manager: {
    items: [
      {
        icon: 'HomeIcon' as keyof typeof iconMap,
        itemLabel: 'Accueil',
        itemLink: Routes.Common.Home,
      },
      {
        icon: 'DragIndicatorIcon' as keyof typeof iconMap,
        itemLabel: 'Stocks',
        sousItems: [
          {
            icon: 'LayersIcon' as keyof typeof iconMap,
            itemLabel: 'Entrepôt',
            itemLink: Routes.Stocks.Entrepot,
          },
          {
            icon: 'LayersIcon' as keyof typeof iconMap,
            itemLabel: 'FDR',
            itemLink: Routes.Stocks.FDR,
          },
          {
            icon: 'InboxIcon' as keyof typeof iconMap,
            itemLabel: 'Gestion des Stocks',
            itemLink: Routes.Stocks.StocksManagment,
          },
          {
            icon: 'FilterAltIcon' as keyof typeof iconMap,
            itemLabel: 'Logs Stocks',
            itemLink: Routes.Stocks.StocksLogs,
          },
        ],
      },
      {
        icon: 'CreditCardIcon' as keyof typeof iconMap,
        itemLabel: 'Ventes',
        itemLink: Routes.Common.Sales,
      },
      {
        icon: 'ShoppingCartIcon' as keyof typeof iconMap,
        itemLabel: 'Promotions',
        itemLink: Routes.Common.Promotions,
      },
      {
        icon: 'ReceiptIcon' as keyof typeof iconMap,
        itemLabel: 'Factures',
        itemLink: Routes.Common.TVA,
      },
    ],
  },
  admin: {
    items: [
      {
        icon: 'HomeIcon' as keyof typeof iconMap,
        itemLabel: 'Accueil',
        itemLink: Routes.Common.Home,
      },
      {
        icon: 'DragIndicatorIcon' as keyof typeof iconMap,
        itemLabel: 'Stocks',
        sousItems: [
          {
            icon: 'LayersIcon' as keyof typeof iconMap,
            itemLabel: 'Entrepôt',
            itemLink: Routes.Stocks.Entrepot,
          },
          {
            icon: 'LayersIcon' as keyof typeof iconMap,
            itemLabel: 'FDR',
            itemLink: Routes.Stocks.FDR,
          },
          {
            icon: 'InboxIcon' as keyof typeof iconMap,
            itemLabel: 'Gestion des Stocks',
            itemLink: Routes.Stocks.StocksManagment,
          },
          {
            icon: 'FilterAltIcon' as keyof typeof iconMap,
            itemLabel: 'Logs Stocks',
            itemLink: Routes.Stocks.StocksLogs,
          },
        ],
      },
      {
        icon: 'CreditCardIcon' as keyof typeof iconMap,
        itemLabel: 'Ventes',
        itemLink: Routes.Common.Sales,
      },
      {
        icon: 'ShoppingCartIcon' as keyof typeof iconMap,
        itemLabel: 'Promotions',
        itemLink: Routes.Common.Promotions,
      },
      {
        icon: 'SettingsIcon' as keyof typeof iconMap,
        itemLabel: 'Paramètres',
        itemLink: Routes.Common.Settings,
      },
      {
        icon: 'PersonIcon' as keyof typeof iconMap,
        itemLabel: 'Utilisateurs',
        itemLink: Routes.Common.Users,
      },
      {
        icon: 'ReceiptIcon' as keyof typeof iconMap,
        itemLabel: 'TVA',
        itemLink: Routes.Common.TVA,
      },
    ],
  },
};

export default permissions;
