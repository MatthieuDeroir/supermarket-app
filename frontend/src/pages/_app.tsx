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

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
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
