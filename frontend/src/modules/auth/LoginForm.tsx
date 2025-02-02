import { LockOpen } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import useAuth from '@common/hooks/useAuth';
import Image from 'next/image';
import Routes from '@common/defs/routes/routes';

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const { login } = useAuth();
  const methods = useForm<LoginFormInputs>();
  const {
    handleSubmit,
    formState: { isSubmitting },
    register,
  } = methods;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await login(data);

      if (response.success) {
        const storage = data.rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.token);
        window.location.href = Routes.Common.Home;
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          overflowY: 'auto',
          gap: 1,
        }}
      >
        <Box sx={{ maxWidth: '450px' }}>
          <Image
            src="/assets/images/GroceryFlowLOGO.webp"
            alt="GroceryFlow"
            width={300}
            height={280}
            style={{ margin: 'auto', display: 'block', width: '80%', height: 'auto' }}
          />
          <Typography
            component="h1"
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            GroceryFlow
          </Typography>
        </Box>

        <Card
          sx={{
            maxWidth: '450px',
            backgroundColor: 'transparent',
            boxShadow: 'none',
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    fullWidth
                    {...register('email', { required: 'Email is required' })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    {...register('password', { required: 'Password is required' })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox {...register('rememberMe')} />}
                    label="Se souvenir de moi"
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <LoadingButton
                    size="large"
                    variant="contained"
                    type="submit"
                    startIcon={<LockOpen />}
                    loadingPosition="start"
                    loading={isSubmitting}
                  >
                    SE CONNECTER
                  </LoadingButton>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Vous avez oublié votre mot de passe ?{' '}
                    <Link href="/password-reset">Cliquez ici</Link>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </FormProvider>
        </Card>
      </Box>
    </>
  );
};

export default LoginForm;
