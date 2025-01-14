import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { ArrowForwardIos } from '@mui/icons-material';

interface TopbarItem {
  label: string;
  link?: string;
  onClick?: () => void;
  dropdown?: Array<{
    label: string;
    link?: string;
    onClick?: () => void;
  }>;
}

const Topbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownWidth = 137;
  const toggleSidebar = () => {
    setShowDrawer((oldValue) => !oldValue);
  };
  const navItems: TopbarItem[] = [
    {
      label: 'Accueil',
      link: '/',
      onClick: () => router.push('/'),
    },
  ];

  const toggleDropdown = () => {
    setShowDropdown((oldValue) => !oldValue);
  };

  const onNavButtonClick = (item: TopbarItem) => {
    if (item.dropdown) {
      return toggleDropdown;
    }
    return () => {
      setShowDrawer(false);
      if (item.onClick) {
        item.onClick();
      }
    };
  };

  const router = useRouter();
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: (theme) => theme.customShadows.z1,
        backgroundColor: 'common.white',
      }}
    >
      <Container>
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <Stack flexDirection="row" alignItems="center" flexGrow={1}>
            <Typography sx={{ color: 'text.secondary' }}>Logo</Typography>
          </Stack>
          <List sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <>
              {navItems.map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    sx={{
                      width: 'fit-content',
                    }}
                  >
                    <StyledListItemButton
                      sx={{
                        ...(router.pathname === item.link && {
                          color: 'primary.main',
                        }),
                        ...(item.dropdown && {
                          borderTopLeftRadius: 24,
                          borderTopRightRadius: 24,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          width: dropdownWidth,
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            boxShadow: (theme) => theme.customShadows.z12,
                            '.MuiTypography-root': {
                              fontWeight: 'bold',
                            },
                            '.dropdown-menu': {
                              visibility: 'visible',
                            },
                            '.MuiTouchRipple-child': {
                              backgroundColor: 'transparent',
                            },
                          },
                        }),
                      }}
                      onClick={onNavButtonClick(item)}
                    >
                      {!item.dropdown ? (
                        <>{item.label}</>
                      ) : (
                        <>
                          <ListItemText>{item.label}</ListItemText>
                          <KeyboardArrowDown />
                          <List
                            className="dropdown-menu"
                            sx={{
                              backgroundColor: 'common.white',
                              boxShadow: (theme) => theme.customShadows.z12,
                              position: 'absolute',
                              top: 48,
                              left: 0,
                              padding: 0,
                              width: dropdownWidth,
                              borderBottomLeftRadius: 24,
                              borderBottomRightRadius: 24,
                              visibility: 'hidden',
                              zIndex: 1000000,
                            }}
                          >
                            {item.dropdown.map((dropdownItem, dropdownItemIndex) => {
                              return (
                                <ListItem
                                  key={dropdownItemIndex}
                                  sx={{
                                    padding: 0,
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      display: 'flex',
                                      gap: 1,
                                      paddingX: 2,
                                      paddingY: 1.5,
                                      borderRadius: 0,
                                      zIndex: 1000000,
                                      '&:hover': {
                                        backgroundColor: 'primary.dark',
                                        color: 'primary.contrastText',
                                      },
                                      ...(item.dropdown?.length === dropdownItemIndex + 1 && {
                                        borderBottomLeftRadius: 24,
                                        borderBottomRightRadius: 24,
                                      }),
                                    }}
                                    onClick={onNavButtonClick(dropdownItem)}
                                  >
                                    {dropdownItem.label}
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </>
                      )}
                    </StyledListItemButton>
                  </ListItem>
                );
              })}
            </>

            <>
              <ListItem
                sx={{
                  width: 'fit-content',
                }}
              >
                <StyledListItemButton
                  onClick={() => router.push('/')}
                  sx={{
                    ...(router.pathname === '/' && {
                      color: 'primary.main',
                    }),
                  }}
                >
                  Connexion
                </StyledListItemButton>
              </ListItem>
              <ListItem
                sx={{
                  width: 'fit-content',
                }}
              >
                <Button
                  variant="contained"
                  endIcon={
                    <ArrowForwardIos
                      fontSize="small"
                      className="arrow-icon"
                      sx={{ fontSize: '12px', transition: 'all, 0.15s' }}
                    />
                  }
                  onClick={() => router.push('/')}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      '.arrow-icon': {
                        transform: 'translateX(0.25rem)',
                      },
                    },
                  }}
                >
                  Inscription
                </Button>
              </ListItem>
            </>
          </List>
          <IconButton
            onClick={() => toggleSidebar()}
            sx={{
              display: { md: 'none', sm: 'flex' },
            }}
          >
            <MenuIcon fontSize="medium" sx={{ color: 'grey.700' }} />
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
              '.topbar-logo': {
                width: '250px',
              },
            }}
          >
            <Typography sx={{ color: 'text.secondary' }}>Logo</Typography>
          </Box>
          {navItems.map((item, index) => {
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  ...(item.dropdown && {
                    display: 'flex',
                    flexDirection: 'column',
                  }),
                }}
              >
                <ListItemButton
                  onClick={!item.dropdown ? onNavButtonClick(item) : toggleDropdown}
                  sx={{
                    width: '100%',
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      ...(router.pathname === item.link && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    {item.label}
                  </ListItemText>
                  {item.dropdown && (
                    <ListItemIcon color="grey.800" sx={{ minWidth: 'unset' }}>
                      <KeyboardArrowDown sx={{ color: 'grey.800' }} />
                    </ListItemIcon>
                  )}
                </ListItemButton>
                {item.dropdown && (
                  <List
                    sx={{
                      width: '100%',
                      transition: 'all, 0.2s',
                      height: 0,
                      paddingY: 0,
                      ...(showDropdown && {
                        height: `calc(${item.dropdown.length} * 48px)`,
                      }),
                    }}
                    className="dropdown-list"
                  >
                    {item.dropdown.map((dropdownItem, dropdownItemIndex) => {
                      return (
                        <ListItem
                          key={dropdownItemIndex}
                          sx={{
                            padding: 0,
                            visibility: 'hidden',
                            ...(showDropdown && {
                              visibility: 'visible',
                            }),
                          }}
                        >
                          <ListItemButton
                            onClick={onNavButtonClick(dropdownItem)}
                            sx={{
                              display: 'flex',
                              gap: 1,
                              paddingLeft: 4,
                            }}
                          >
                            <ListItemText>{dropdownItem.label}</ListItemText>
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </ListItem>
            );
          })}
          <ListItem key="profile" disablePadding>
            <ListItemButton
              onClick={() => router.push('/')}
              sx={{
                width: '100%',
              }}
            >
              <ListItemText
                primaryTypographyProps={{
                  ...(router.pathname === '/' && {
                    color: 'primary.main',
                  }),
                }}
              >
                Mon Profil
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <>
            <ListItem
              disablePadding
              sx={{
                backgroundColor: 'transparent',
                marginBottom: 3,
              }}
            >
              <ListItemButton
                onClick={() => {
                  setShowDrawer(false);
                  router.push('/');
                }}
              >
                <ListItemText
                  primaryTypographyProps={{
                    ...(router.pathname === '/' && {
                      color: 'primary.main',
                    }),
                  }}
                >
                  Connexion
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <Button
              variant="contained"
              endIcon={
                <ArrowForwardIos
                  fontSize="small"
                  className="arrow-icon"
                  sx={{ fontSize: '12px', transition: 'all, 0.15s' }}
                />
              }
              onClick={() => {
                setShowDrawer(false);
                router.push('/');
              }}
              sx={{
                display: 'flex',
                flex: 1,
                width: 150,
                '&:hover': {
                  '.arrow-icon': {
                    transform: 'translateX(0.25rem)',
                  },
                },
              }}
            >
              Inscription
            </Button>
          </>
        </List>
      </Drawer>
    </AppBar>
  );
};
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius + 'px',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  '.MuiTouchRipple-child': {
    backgroundColor: theme.palette.primary.main,
  },
}));
export default Topbar;
