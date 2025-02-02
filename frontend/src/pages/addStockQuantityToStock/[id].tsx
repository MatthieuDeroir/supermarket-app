import { NextPage } from 'next';
import { useRouter } from 'next/router';
import AddStockQuantityToStock from '@//modules/addStockQuantityToStock/addStockQuantityToStock';

import { Box, Typography } from '@mui/material';

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
      <AddStockQuantityToStock productId={parseInt(id, 10)} />
    </Box>
  );
};

export default ProductStockPage;
