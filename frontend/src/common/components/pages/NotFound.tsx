import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Routes from '@common/defs/routes/routes';
import { Box } from '@mui/material';
import Image from 'next/image';

const NotFound = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        overflowY: 'auto',
        padding: 2,
      }}
    >
      <Box>
        <Typography variant="h3" textAlign="center">
          Oups, la page est introuvable !
        </Typography>
        <Typography
          variant="body1"
          className="mb-6 text-center"
          textAlign="center"
          sx={{ color: 'text.secondary' }}
        >
          Désolé, nous ne trouvons pas cette page.
          <br />
          Peut-être avez-vous mal saisi l'URL ?
        </Typography>
      </Box>
      <Image
        src="/assets/svgs/404PageNotFound.svg"
        alt="404 Page Not Found"
        width={450}
        height={450}
        style={{
          width: '100%',
          maxWidth: '650px',
          height: 'auto',
          marginTop: '2rem',
          marginBottom: '4rem',
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Button component={NextLink} href={Routes.Common.Home} size="large" variant="contained">
          RETOURNER À L'ACCUEIL
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
