import { NextPage } from 'next';
import { useState } from 'react';
import InfoProduit from '@modules/produit/components/InfoProduit';
import StockKPI from '@modules/kpi/components/StockKPI';
import FondRayonKPI from '@modules/kpi/components/FondRayonKPI';
import EvolutionVentesKPI from '@//modules/kpi/components/EvolutionVentesKPI';

import { Box } from '@mui/material';

const Index: NextPage = () => {
  const [ean, setEan] = useState<string>('');
  const [productId, setProductId] = useState<number>(4);

  return (
    <Box>
      <Box>
        <InfoProduit ean={ean} />
      </Box>

      <Box sx={{ display: 'flex', marginTop: 4, gap: 2 }}>
        <StockKPI ean={ean} />
        <FondRayonKPI ean={ean} />
      </Box>

      <Box marginTop={4}>
        <EvolutionVentesKPI productId={productId} />
      </Box>
    </Box>
  );
};

export default Index;
