import { NextPage } from 'next';
import { useRouter } from 'next/router';
import ProductShelf from '@//modules/productShelf/productShelf';

import { Box, Typography } from '@mui/material';

const ProductShelfPage: NextPage = () => {
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
      <ProductShelf productId={parseInt(id, 10)} />
    </Box>
  );
};

export default ProductShelfPage;
