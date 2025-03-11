import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { Container, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Footer from '@common/layout/Footer';
import Topbar from '@common/layout/Topbar';
import LeftBar, { LeftBarProps } from '@common/layout/LeftBar';
import permissions, { PermissionsData } from '@common/defs/types/permissions';
import LockIcon from '@mui/icons-material/Lock';
import usePermissions from '@//common/hooks/usePermissions';
import { iconMap } from '@common/defs/types/IconMap';

type SousItem = {
  icon: React.ReactElement;
  itemLabel: string;
  itemLink?: string;
};

type Item = {
  icon: React.ReactElement;
  itemLabel: string;
  itemLink?: string;
  sousItems?: SousItem[];
};

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  const { isAdmin, isManager, isUser } = usePermissions();

  // Filtrer les éléments du menu en fonction du rôle
  const mapPermissionsToItems = (permissionsData: PermissionsData): Item[] => {
    return permissionsData.items.map((permission) => ({
      itemLabel: permission.itemLabel,
      itemLink: permission.itemLink,
      sousItems: permission.sousItems
        ? permission.sousItems.map((sousItem) => ({
            itemLabel: sousItem.itemLabel,
            itemLink: sousItem.itemLink,
            icon: iconMap[sousItem.icon] ?? <LockIcon />, // Default icon
          }))
        : undefined,
      icon: iconMap[permission.icon] ?? <LockIcon />, // Default icon
    }));
  };

  const getUserPermissions = (): Item[] => {
    switch (true) {
      case isAdmin:
        return mapPermissionsToItems(permissions.admin);
      case isManager:
        return mapPermissionsToItems(permissions.manager);
      default:
        return mapPermissionsToItems(permissions.user);
    }
  };

  const LeftBarItems: LeftBarProps = {
    items: getUserPermissions(),
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
