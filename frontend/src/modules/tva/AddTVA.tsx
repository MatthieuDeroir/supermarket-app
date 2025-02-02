import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import ApiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';

const CreateTVAPage = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({
    tax_value: '',
    description: '',
  });
  const [tva, setTva] = useState({
    tax_value: '',
    description: '',
  });

  const validateTaxValue = (taxValue: string) => {
    const taxRegex = /^\d+(\.\d{1,2})?$/;
    return taxRegex.test(taxValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const taxValid = validateTaxValue(tva.tax_value);

    if (!taxValid) {
      setErrors({
        tax_value: taxValid ? '' : 'Valeur de la taxe invalide',
        description: '',
      });
      return;
    }

    try {
      await makeApiRequest(ApiRoutes.Categories.Create, 'POST', tva);
      router.push('/tva');
    } catch (error) {
      console.error('Erreur lors de la création de la TVA', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom>
        Créer une TVA
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Valeur de la taxe (%)"
              value={tva.tax_value}
              onChange={(e) => setTva({ ...tva, tax_value: e.target.value })}
              error={!!errors.tax_value}
              helperText={errors.tax_value}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Description"
              value={tva.description}
              onChange={(e) => setTva({ ...tva, description: e.target.value })}
            />
          </Grid>
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

export default CreateTVAPage;
