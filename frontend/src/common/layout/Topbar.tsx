import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import Routes from '@common/defs/routes/routes';
import LeftBar, { LeftBarProps } from '@common/layout/LeftBar';
import HomeIcon from '@mui/icons-material/Home';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import LayersIcon from '@mui/icons-material/Layers';
import InboxIcon from '@mui/icons-material/Inbox';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';

const Topbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleSidebar = () => {
    setShowDrawer((oldValue) => !oldValue);
  };

  const LeftBarItems: LeftBarProps = {
    items: [
      {
        icon: <HomeIcon />,
        itemLabel: 'Accueil',
        itemLink: Routes.Common.Home,
      },
      {
        icon: <AccountCircleIcon />,
        itemLabel: 'Mon Compte',
        itemLink: Routes.Common.Account,
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

  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: (theme) => theme.customShadows.z1,
        backgroundColor: 'primary.dark',
      }}
    >
      <Container>
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <Stack flexDirection="row" alignItems="center" flexGrow={1} gap={1}>
            <Image
              onClick={() => router.push(Routes.Common.Home)}
              src="/assets/images/GroceryFlowLOGO.webp"
              alt="GroceryFlow"
              width={500}
              height={480}
              style={{ cursor: 'pointer', width: 50, height: 'auto' }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: 'block',
                color: 'secondary.lighter',
              }}
            >
              GroceryFlow
            </Typography>
          </Stack>
          <List sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <>
              <IconButton
                aria-label="Compte"
                size="small"
                onClick={() => router.push(Routes.Common.Account)}
              >
                <AccountCircleIcon
                  fontSize="inherit"
                  sx={{ color: 'primary.light', fontSize: 35 }}
                />
              </IconButton>
            </>
          </List>
          <IconButton
            onClick={() => toggleSidebar()}
            sx={{
              display: { md: 'none', sm: 'flex' },
            }}
          >
            <MenuIcon fontSize="medium" sx={{ color: 'secondary.lighter' }} />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontWeight: 700,
            width: 250,
          }}
        >
          <Box
            sx={{
              padding: 4,
            }}
            onClick={() => router.push(Routes.Common.Home)}
          >
            <Image
              src="/assets/images/GroceryFlowLOGO.webp"
              alt="GroceryFlow"
              width={500}
              height={480}
              style={{
                cursor: 'pointer',
                width: 45,
                height: 'auto',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: 'block', md: 'none' },
                color: 'common.black',
              }}
            >
              GroceryFlow
            </Typography>
          </Box>
        </List>
        <LeftBar items={LeftBarItems.items} />
      </Drawer>
    </AppBar>
  );
};
export default Topbar;
