import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, TextField, Button } from '@mui/material';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface ProductInfo {
  productId: number;
  price: string;
}

const PromotionArticle: React.FC<ProductInfo> = ({ productId, price }) => {
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const router = useRouter();

  const fetchPromotion = async () => {
    if (!productId) {
      return;
    }
    setIsFetching(true);
    try {
      const response = await makeApiRequest(apiRoutes.Promotions.GetByProductId(productId));
      if (response.status === 200) {
        const promoData = await response.json();
        setIsApplied(promoData.active);
        setDiscount(promoData.pourcentage);
        setPromoId(promoData.id);
      } else {
        setIsApplied(false);
        setDiscount(0);
        setPromoId(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la promotion', error);
      setIsApplied(false);
      setDiscount(0);
      setPromoId(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, [productId]);

  const calculatedTTC = (parseFloat(price) * (1 - discount / 100)).toFixed(2);

  const handleModifyPromo = () => {
    router.push(`/promotion/edit/${promoId}`);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#F2A900',
        padding: 3,
        borderRadius: 3,
        width: 'fit-content',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        Promotion on the product
      </Typography>

      {isFetching ? (
        <Typography>Chargement des données...</Typography>
      ) : (
        <>
          <Box display="flex" alignItems="center" justifyContent="start" my={1}>
            <Checkbox checked={isApplied} sx={{ color: 'black' }} disabled />
            <Typography fontWeight="bold">Is currently applied</Typography>
          </Box>

          <Box display="flex" gap={2} justifyContent="center">
            <TextField
              label="Reduction Applicable (%)"
              variant="outlined"
              type="number"
              value={discount}
              sx={{
                width: 90,
                borderRadius: 1,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: 'black',
                },
              }}
              disabled
            />

            <TextField
              label="Prix initial (HT)"
              variant="outlined"
              value={price}
              sx={{
                width: 90,
                borderRadius: 1,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: 'black',
                },
              }}
              disabled
            />
            <TextField
              label="Prix réduit (TTC)"
              variant="outlined"
              value={calculatedTTC}
              sx={{
                width: 90,
                borderRadius: 1,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  '& fieldset': {
                    borderColor: 'black',
                  },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: 'black',
                },
              }}
              disabled
            />
          </Box>

          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#F4A261', color: 'white', flex: 10 }}
              onClick={handleModifyPromo}
            >
              MODIFIER
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PromotionArticle;
