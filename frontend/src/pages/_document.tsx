import palette from '@common/theme/palette';
import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />

        <meta name="theme-color" content={palette.primary.main} />

        {/* Meta */}
        <meta name="description" content="" />
        <meta name="author" content="Epitech" />
        <meta name="keywords" content="react,material,next,application,dashboard,admin,template" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="m-0 p-0">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
export default Document;
