import { NextPage } from 'next';
import AllShelfProducts from '@//modules/allShelfProducts/AllShelfProducts';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <Box>
      <AllShelfProducts />
    </Box>
  );
};

export default Index;
