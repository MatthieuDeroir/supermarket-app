import { NextPage } from 'next';
import AllProducts from '@//modules/allProducts/AllProducts';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <Box>
      <AllProducts />
    </Box>
  );
};

export default Index;
