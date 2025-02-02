import { NextPage } from 'next';
import { useRouter } from 'next/router';
import InfoProduitVatPromo from '@//modules/produit/components/InfoProduitVatPromo';
import StockKPI from '@modules/kpi/components/StockKPI';
import FondRayonKPI from '@modules/kpi/components/FondRayonKPI';
import EvolutionVentesKPI from '@modules/kpi/components/EvolutionVentesKPI';

import { Box, Button, Typography } from '@mui/material';

const ProduitPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const redirectToShelf = (id: number) => {
    router.push(`/productShelf/${id}`);
  };

  const redirectToStock = (id: number) => {
    router.push(`/productStock/${id}`);
  };

  if (!id || typeof id !== 'string') {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Invalid Product ID
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#D32F2F', // Red color
          color: 'white',
          fontSize: '16px',
          fontWeight: 'bold',
          '&:hover': { backgroundColor: '#B71C1C' }, // Darker red on hover
          marginTop: '20px',
          marginBottom: '20px',
        }}
        onClick={() => router.push(`/allProduct`)}
      >
        Retourner aux produits
      </Button>
      <Box>
        <InfoProduitVatPromo productId={parseInt(id, 10)} />
      </Box>

      <Box sx={{ display: 'flex', marginTop: 4, gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <StockKPI productId={parseInt(id, 10)} />
          <Button
            sx={{ backgroundColor: '#679b6a', color: 'white', flex: 10 }}
            onClick={() => redirectToStock(parseInt(id, 10))}
          >
            Accéder aux stocks
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FondRayonKPI productId={parseInt(id, 10)} />
          <Button
            sx={{ backgroundColor: '#679b6a', color: 'white', flex: 10 }}
            onClick={() => redirectToShelf(parseInt(id, 10))}
          >
            Accéder au fond de rayon
          </Button>
        </Box>
      </Box>

      <Box marginTop={4}>
        <EvolutionVentesKPI productId={parseInt(id, 10)} />
      </Box>
    </Box>
  );
};

export default ProduitPage;
