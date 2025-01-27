import { NextPage } from 'next';
import AllStockProducts from '@//modules/allStockProducts/AllStockProducts';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <Box>
      <AllStockProducts />
    </Box>
  );
};

export default Index;
