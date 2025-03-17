import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AllProducts from '@//modules/allProducts/AllProducts';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Index: NextPage = () => {
  const router = useRouter();

  const redirectToAddProduct = () => {
    router.push('/add-product');
  };

  return (
    <Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4CAF50',
          color: 'white',
          marginBottom: 2,
          '&:hover': { backgroundColor: '#388E3C' },
        }}
        startIcon={<AddIcon />}
        onClick={redirectToAddProduct}
      >
        Ajouter un Produit
      </Button>

      <AllProducts />
    </Box>
  );
};

export default Index;
