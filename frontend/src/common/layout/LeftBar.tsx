import React, { useState } from 'react';
import {
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  ListItemButton,
  Box,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useRouter } from 'next/router';
import LockIcon from '@mui/icons-material/Lock';

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

export type LeftBarProps = {
  items: Item[];
};

const LeftBar: React.FC<LeftBarProps> = ({ items }) => {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const handleClick = (item: Item) => {
    if (item.sousItems) {
      setOpen((prevOpen) => ({ ...prevOpen, [item.itemLabel]: !prevOpen[item.itemLabel] }));
    } else {
      router.push(item.itemLink ? item.itemLink : '/');
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        top: 0,
        overflowY: 'auto',
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
        height: 'calc(100vh - 64px)',
      }}
    >
      <List sx={{ flex: 2 }}>
        {items.map((item) => (
          <React.Fragment key={item.itemLabel}>
            <StyledListItem
              onClick={() => handleClick(item)}
              selected={window.location.pathname === item.itemLink}
            >
              <ListItemIcon
                sx={{
                  color:
                    window.location.pathname === item.itemLink ? 'primary.dark' : 'common.black',
                  minWidth: '36px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.itemLabel} />
              {item.sousItems && (open[item.itemLabel] ? <ExpandLess /> : <ExpandMore />)}
            </StyledListItem>
            {item.sousItems && (
              <Collapse in={open[item.itemLabel]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.sousItems.map((sousItem) => (
                    <StyledListItem
                      key={sousItem.itemLabel}
                      onClick={() => router.push(sousItem.itemLink ? sousItem.itemLink : '/')}
                      selected={window.location.pathname === sousItem.itemLink}
                      sx={{ pl: 6 }}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            window.location.pathname === sousItem.itemLink
                              ? 'primary.dark'
                              : 'common.black',
                          minWidth: '36px',
                        }}
                      >
                        {sousItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={sousItem.itemLabel} />
                    </StyledListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ height: '100%', display: 'flex' }}>
        <StyledListItem
          onClick={() => router.push('/')}
          sx={{
            color: 'error.main',
            width: '100%',
            marginTop: 'auto',
            alignSelf: 'flex-end',
          }}
        >
          <ListItemIcon sx={{ color: 'error.main', minWidth: '36px' }}>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Fermer le magasin" />
        </StyledListItem>
      </Box>
    </Box>
  );
};

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  color: theme.palette.grey[700],
  borderRadius: theme.shape.borderRadius + 'px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.dark,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default LeftBar;
