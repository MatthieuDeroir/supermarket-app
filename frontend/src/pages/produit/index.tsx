import { NextPage } from 'next';
import InfoProduit from '@modules/produit/components/InfoProduit';
import { Box } from '@mui/material';

const Index: NextPage = () => {
  return (
    <>
      <Box>
        <InfoProduit />
      </Box>
    </>
  );
};

export default Index;
