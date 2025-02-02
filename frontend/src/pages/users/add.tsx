import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ApiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';

const CreateUserPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<{ role_id: number; name: string }[]>([]);
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    role_id: 0,
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    phone_number: '',
  });

  const fetchRoles = async () => {
    try {
      const rolesResponse = await makeApiRequest(ApiRoutes.Roles.GetAll);
      setRoles(Array.isArray(rolesResponse) ? rolesResponse : []);
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const emailValid = validateEmail(user.email);
    const phoneValid = validatePhoneNumber(user.phone_number);

    if (!emailValid || !phoneValid) {
      setErrors({
        email: emailValid ? '' : 'Email invalide',
        phone_number: phoneValid ? '' : 'Numéro de téléphone invalide',
      });
      return;
    }

    try {
      await makeApiRequest(ApiRoutes.Users.Create, 'POST', user);
      router.push('/users');
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom>
        Créer un utilisateur
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              label="Prénom"
              value={user.first_name}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              required
              label="Nom"
              value={user.last_name}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Téléphone"
              value={user.phone_number}
              onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
              error={!!errors.phone_number}
              helperText={errors.phone_number}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Rôle"
              value={user.role_id}
              onChange={(e) => setUser({ ...user, role_id: Number(e.target.value) })}
              SelectProps={{ native: true }}
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.name}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="E-Mail"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid> */}
        </Grid>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" color="primary">
            Créer
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateUserPage;
