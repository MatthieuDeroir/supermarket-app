// import Routes from '@common/defs/routes';
import { useTheme } from '@mui/material/styles';
import { Divider, List, ListItem, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { alpha, Box } from '@mui/system';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface FooterItemProps {
  label: string;
  link: string;
}

const Footer = () => {
  const footerItems: FooterItemProps[] = [
    {
      label: 'Vie privée & Cookies',
      link: '/',
    },
    {
      label: 'Mentions légales',
      link: '/',
    },
  ];
  const isFooterItemsEven = footerItems.length % 2 === 0;
  const router = useRouter();
  const currenttheme = useTheme();
  const mdScreen = useMediaQuery(currenttheme.breakpoints.down('md'));
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        zIndex: 100,
        backgroundColor: 'primary.dark',
        width: '100%',
        paddingY: { xs: 1, md: 2 },
        marginTop: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '15px',
        color: 'secondary.lighter',
      }}
    >
      {(!isFooterItemsEven || mdScreen) && (
        <Box sx={{ marginBottom: 2 }}>
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
              color: 'secondary.lighter',
            }}
          >
            GroceryFlow
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', marginBottom: { xs: 0, md: 1.7 } }}>
        {!isFooterItemsEven || mdScreen ? (
          <List
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 0 },
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {footerItems.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  onClick={() => router.push(item.link)}
                  sx={{
                    cursor: 'pointer',
                    width: 'fit-content',
                    borderLeft: { xs: 0, md: 1 },
                    paddingY: 0,
                    borderLeftColor: 'primary.lighter',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                    ...(footerItems.length === index + 1 && {
                      borderRight: { xs: 0, md: 1 },
                      borderRightColor: 'primary.lighter',
                    }),
                  }}
                >
                  <ListItemText sx={{ marginY: 0 }}>{item.label}</ListItemText>
                </ListItem>
              );
            })}
            <Divider
              sx={{
                marginY: { xs: 2, md: 0 },
                display: { xs: 'block', md: 'none' },
                borderColor: (theme) => alpha(theme.palette.primary.lighter, 0.4),
                borderWidth: 0.5,
                width: '100%',
              }}
            />
          </List>
        ) : (
          <>
            <List
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {footerItems.slice(0, Math.ceil(footerItems.length / 2)).map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    onClick={() => router.push(item.link)}
                    sx={{
                      cursor: 'pointer',
                      width: 'fit-content',
                      borderLeft: 1,
                      paddingY: 0,
                      borderLeftColor: 'primary.lighter',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      ...(footerItems.length / 2 === index + 1 && {
                        borderRight: 1,
                        borderRightColor: 'primary.lighter',
                      }),
                    }}
                  >
                    <ListItemText sx={{ marginY: 0 }}>{item.label}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
            <Box
              sx={{
                paddingX: 4,
              }}
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
                  display: 'block',
                  color: 'secondary.lighter',
                }}
              >
                GroceryFlow
              </Typography>
            </Box>
            <List
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {footerItems.slice(Math.ceil(footerItems.length / 2)).map((item, index) => {
                return (
                  <ListItem
                    key={index}
                    onClick={() => router.push(item.link)}
                    sx={{
                      cursor: 'pointer',
                      width: 'fit-content',
                      borderLeft: 1,
                      paddingY: 0,
                      borderLeftColor: 'primary.lighter',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                      ...(footerItems.length / 2 === index + 1 && {
                        borderRight: 1,
                        borderRightColor: 'primary.lighter',
                      }),
                    }}
                  >
                    <ListItemText sx={{ marginY: 0 }}>{item.label}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Box>

      <Box
        sx={{
          fontSize: '13px',
        }}
      >
        © Copyright
      </Box>
    </Box>
  );
};

export default Footer;
