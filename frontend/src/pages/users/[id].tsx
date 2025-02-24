import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import ApiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { User } from '@common/defs/types/user';
import StockLogs from '@//modules/stock-logs/StockLogs';

const UserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [updateTexts, setUpdateTexts] = useState(true);
  type Role = {
    role_id: number;
    name: string;
  };
  const [roles, setRoles] = useState<Role[]>([]);

  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteUser();
    handleClose();
    router.push('/users');
  };

  const deleteUser = async () => {
    try {
      if (user) {
        await makeApiRequest(ApiRoutes.Users.Delete(Number(id)), 'DELETE');
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  const updateUser = async () => {
    try {
      if (user) {
        await makeApiRequest(ApiRoutes.Users.Update(Number(id)), 'PUT', user);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    }
  };

  const fetchUser = async () => {
    try {
      const rolesResponse = await makeApiRequest(ApiRoutes.Roles.GetAll);
      const rolesData = Array.isArray(rolesResponse) ? rolesResponse : [];
      setRoles(rolesData);
      const response = await makeApiRequest(ApiRoutes.Users.GetById(Number(id)));
      const userData = response as User;
      setUser(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'API", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  if (!user) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <>
      <Container
        sx={{ display: 'flex', flexDirection: 'row', gap: 4, width: '100%', maxWidth: '100%' }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h3" gutterBottom>
            Bienvenue {user.first_name} {user.last_name}
          </Typography>

          <Grid container maxWidth="sm" spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={user.first_name}
                disabled={updateTexts}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom"
                value={user.last_name}
                disabled={updateTexts}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Téléphone"
                value={user.phone_number}
                disabled={updateTexts}
                onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Rôle"
                value={user.role_id}
                onChange={(e) => setUser({ ...user, role_id: Number(e.target.value) })}
                SelectProps={{
                  native: true,
                }}
                disabled={updateTexts}
              >
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
                label="E-Mail"
                value={user.email}
                disabled={updateTexts}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                disabled={updateTexts}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="contained" color="error" onClick={handleClickOpen}>
              Supprimer
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ display: updateTexts ? 'block' : 'none' }}
              onClick={() => setUpdateTexts(!updateTexts)}
            >
              Modifier
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ display: updateTexts ? 'none' : 'block' }}
              onClick={updateUser}
            >
              Sauvegarder
            </Button>
          </Box>
        </Box>
        <Box sx={{ flex: 2 }}>
          <StockLogs />
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet utilisateur ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserPage;
