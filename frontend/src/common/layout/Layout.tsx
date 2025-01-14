import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { Container, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Footer from '@common/layout/Footer';
import Topbar from '@common/layout/Topbar';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box
        sx={{
          display: 'flex',
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
                <Box component="main" sx={{}}>
                  {children}
                </Box>
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
