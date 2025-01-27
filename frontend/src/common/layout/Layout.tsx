import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { Container, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Footer from '@common/layout/Footer';
import Topbar from '@common/layout/Topbar';
import LeftBar, { LeftBarProps } from '@common/layout/LeftBar';
import HomeIcon from '@mui/icons-material/Home';
import Routes from '@common/defs/routes/routes';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LayersIcon from '@mui/icons-material/Layers';
import InboxIcon from '@mui/icons-material/Inbox';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const LeftBarItems: LeftBarProps = {
    items: [
      {
        icon: <HomeIcon />,
        itemLabel: 'Accueil',
        itemLink: Routes.Common.Home,
      },
      {
        icon: <DragIndicatorIcon />,
        itemLabel: 'Stocks',
        sousItems: [
          {
            icon: <LayersIcon />,
            itemLabel: 'Entrepôt',
            itemLink: Routes.Stocks.Entrepot,
          },
          {
            icon: <LayersIcon />,
            itemLabel: 'FDR',
            itemLink: Routes.Stocks.FDR,
          },
          {
            icon: <InboxIcon />,
            itemLabel: 'Gestion des Stocks',
            itemLink: Routes.Stocks.StocksManagment,
          },
          {
            icon: <FilterAltIcon />,
            itemLabel: 'Logs Stocks',
            itemLink: Routes.Stocks.StocksLogs,
          },
          {
            icon: <AddIcon />,
            itemLabel: 'Ajouter Produit',
            itemLink: Routes.Stocks.AddProduct,
          },
        ],
      },
      {
        icon: <CreditCardIcon />,
        itemLabel: 'Ventes',
        itemLink: Routes.Common.Selles,
      },
      {
        icon: <ShoppingCartIcon />,
        itemLabel: 'Promotions',
        itemLink: Routes.Common.Promotions,
      },
      {
        icon: <SettingsIcon />,
        itemLabel: 'Paramètres',
        itemLink: Routes.Common.Settings,
      },
    ],
  };
  const { children } = props;
  const theme = useTheme();
  return (
    <div>
      <Head>
        <title>GroceryFlow</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.primary.light}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'primary.light',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: '4px',
          },
        }}
      >
        <Box sx={{ minHeight: '100vh', width: '100vw' }}>
          <Stack direction="column" sx={{ height: '100%' }}>
            <Topbar />
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                marginLeft: 0,
                width: '100%',
              }}
            >
              <Box
                sx={{ minWidth: '250px', maxWidth: '300px', display: { xs: 'none', md: 'block' } }}
              >
                <LeftBar items={LeftBarItems.items} />
              </Box>
              <Container
                sx={{
                  flex: 1,
                  paddingY: 6,
                  transition: theme.transitions.create(['all'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }}
              >
                <Box component="main">{children}</Box>
              </Container>
            </Box>
            <Box
              sx={{
                marginLeft: 0,
                maxWidth: '100%',
                transition: theme.transitions.create(['all'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
              }}
            >
              <Footer />
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
