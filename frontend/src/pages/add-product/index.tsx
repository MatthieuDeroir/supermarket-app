import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AddNewProductToStock from '@//modules/addNewProductToStock/addNewProductToStock';
import { Box, Button } from '@mui/material';

const ProductStockPage: NextPage = () => {
  const router = useRouter();

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
      <AddNewProductToStock />
    </Box>
  );
};

export default ProductStockPage;
