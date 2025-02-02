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
import { TVA } from '@common/defs/types/tva'; // Assuming the TVA type exists

const TvaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [updateTexts, setUpdateTexts] = useState(true);
  const [tva, setTva] = useState<TVA | null>(null);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteTva();
    handleClose();
    router.push('/tva');
  };

  const deleteTva = async () => {
    try {
      if (tva) {
        await makeApiRequest(ApiRoutes.Categories.Delete(Number(id)), 'DELETE');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la TVA', error);
    }
  };

  const updateTva = async () => {
    try {
      if (tva) {
        await makeApiRequest(ApiRoutes.Categories.Update(Number(id)), 'PUT', tva);
        router.push('/tva');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la TVA', error);
    }
  };

  const fetchTva = async () => {
    try {
      const response = await makeApiRequest(ApiRoutes.Categories.GetById(Number(id)));
      const tvaData = response as TVA;
      setTva(tvaData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de la TVA', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTva();
    }
  }, [id]);

  if (!tva) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <>
      <Container maxWidth="sm">
        <Box>
          <Typography variant="h3" gutterBottom>
            Détails TVA : {tva.description}
          </Typography>

          <Grid container maxWidth="sm" spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de la TVA"
                value={tva.description}
                disabled={updateTexts}
                onChange={(e) => setTva({ ...tva, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Taux de TVA (%)"
                value={tva.tax_value}
                disabled={updateTexts}
                onChange={(e) => setTva({ ...tva, tax_value: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={tva.description}
                disabled={updateTexts}
                onChange={(e) => setTva({ ...tva, description: e.target.value })}
              />
            </Grid>
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
              onClick={updateTva}
            >
              Sauvegarder
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>Êtes-vous sûr de vouloir supprimer cette TVA ?</DialogContentText>
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

export default TvaPage;
