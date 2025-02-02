import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import type {} from '@mui/lab/themeAugmentation';
import typography from '@common/theme/typography';
import shadows from '@common/theme/shadows';
import { Theme, createTheme } from '@mui/material';
import { AppProps } from 'next/app';
import palette from '@common/theme/palette';
import Layout from '@common/layout/Layout';
import customShadows from '@common/theme/customShadows';
import GlobalStyles from '@common/theme/GlobalStyles';
import { frFR } from '@mui/material/locale';
import ProtectedRoute from '@common/components/ProtectedRoute';

const App = ({ Component, pageProps, router }: AppProps) => {
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED;
  const publicPages = ['/login', '/signup '];
  const isPublicPage = publicPages.includes(router.pathname);
  const is404 = router.pathname === '/404';

  if (is404) {
    return <Component {...pageProps} />;
  }

  if (isPublicPage) {
    return <Component {...pageProps} />;
  }

  if (authEnabled === 'false') {
    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ProtectedRoute>
  );
};

const Wrapper = (props: AppProps) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setRootElement(() => document.querySelector('#__next'));
  }, []);
  useEffect(() => {
    if (rootElement) {
      setTheme(() =>
        createTheme(
          {
            palette,
            typography,
            shape: { borderRadius: 12 },
            shadows,
            customShadows,
            breakpoints: {
              values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
              },
            },
          },
          frFR,
        ),
      );
    }
  }, [rootElement]);
  if (!theme) {
    return <></>;
  }
  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <App {...props} />
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default Wrapper;
