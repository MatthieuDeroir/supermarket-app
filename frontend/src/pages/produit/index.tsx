import { NextPage } from 'next';
import InfoProduit from '@modules/produit/components/InfoProduit';
import StockKPI from '@modules/kpi/components/StockKPI';
import FondRayonKPI from '@modules/kpi/components/FondRayonKPI';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <Box>
      <InfoProduit ean="" />
      <Box>
        <StockKPI />
        <FondRayonKPI />
      </Box>
    </Box>
  );
};

export default Index;
