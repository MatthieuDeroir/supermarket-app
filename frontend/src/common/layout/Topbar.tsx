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
import LockIcon from '@mui/icons-material/Lock';
import usePermissions from '@common/hooks/usePermisions';
import permissions, { PermissionsData } from '@common/defs/types/permissions';
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

const Topbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

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

  const toggleSidebar = () => {
    setShowDrawer((oldValue) => !oldValue);
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
