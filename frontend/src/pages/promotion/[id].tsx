import React from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import Promotion from '@modules/promotion/promotion';

const PromotionPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const promotionId = id ? Number(id) : null;

  if (!promotionId) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <Promotion />
    </Box>
  );
};

export default PromotionPage;
