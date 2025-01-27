import { NextPage } from 'next';
import InfoProduit from '@modules/produit/components/InfoProduit';
import StockKPI from '@modules/kpi/components/StockKPI';
import FondRayonKPI from '@modules/kpi/components/FondRayonKPI';

import { Box } from '@mui/material';
import { Margin } from '@mui/icons-material';

const Index: NextPage = () => {
  return (
    <Box>
      <Box>
        <InfoProduit ean="" />
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <StockKPI ean="" />
        <FondRayonKPI ean="" />
      </Box>
    </Box>
  );
};

export default Index;
