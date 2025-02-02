import { NextPage } from 'next';
import AllPromotions from '@//modules/allPromotions/allPromotions';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <Box>
      <AllPromotions />
    </Box>
  );
};

export default Index;
