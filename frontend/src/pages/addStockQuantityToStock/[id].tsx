import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AddStockQuantityToStock from '@//modules/addStockQuantityToStock/addStockQuantityToStock';

import { Box, Typography, Button } from '@mui/material';

const ProductStockPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

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
      <AddStockQuantityToStock productId={parseInt(id, 10)} />
    </Box>
  );
};

export default ProductStockPage;
