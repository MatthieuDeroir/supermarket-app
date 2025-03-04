import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { Container, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Footer from '@common/layout/Footer';
import Topbar from '@common/layout/Topbar';
import LeftBar, { LeftBarProps } from '@common/layout/LeftBar';
import Routes from '@common/defs/routes/routes';
import permissions from '@common/defs/types/permissions';

// Import des icônes dynamiquement
import HomeIcon from '@mui/icons-material/Home';
import LayersIcon from '@mui/icons-material/Layers';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';

interface ILayoutProps {
  children: React.ReactNode;
}

const iconMap = {
  HomeIcon: <HomeIcon />,
  LayersIcon: <LayersIcon />,
  CreditCardIcon: <CreditCardIcon />,
  ShoppingCartIcon: <ShoppingCartIcon />,
  SettingsIcon: <SettingsIcon />,
  PersonIcon: <PersonIcon />,
  ArticleIcon: <ArticleIcon />,
};

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Simulation de récupération du rôle utilisateur
  useEffect(() => {
    const roleFromStorage = localStorage.getItem('userRole') || 'user';
    setUserRole(roleFromStorage);
  }, []);

  if (!userRole) {
    return null; // En attendant le chargement du rôle
  }

  // Filtrer les éléments du menu en fonction du rôle
  const LeftBarItems: LeftBarProps = {
    items: permissions[userRole].map((item) => ({
      icon: iconMap[item.icon] || <HomeIcon />, 
      itemLabel: item.label,
      itemLink: item.link,
    })),
  };

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
