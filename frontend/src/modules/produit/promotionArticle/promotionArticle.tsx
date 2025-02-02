import React, { useEffect, useState } from 'react';
import { Box, Typography, Checkbox, TextField, Button, InputAdornment } from '@mui/material';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface ProductInfo {
  productId: number;
}

const PromotionArticle: React.FC<ProductInfo> = ({ productId }) => {
  const [isApplied, setIsApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [promoId, setPromoId] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [productPrice, setProductPrice] = useState<string>('0.00'); // Store product price
  const router = useRouter();

  // Fetch Promotion Details
  const fetchPromotion = async () => {
    if (!productId) {
      return;
    }

    setIsFetching(true);

    try {
      console.log(`Fetching promotion for product ID: ${productId}`);
      const response = await makeApiRequest(apiRoutes.Promotions.GetByProductId(productId));

      if (response) {
        setIsApplied(response.active ?? false);
        setDiscount(response.pourcentage ?? 0);
        setPromoId(response.id ?? null);
      } else {
        console.log('No promotion found, setting default values.');
        setIsApplied(false);
        setDiscount(0);
        setPromoId(null);
      }
    } catch (error) {
      console.error('❌ Error fetching promotion:', error);
      setIsApplied(false);
      setDiscount(0);
      setPromoId(null);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch Product Price
  const fetchProductPrice = async () => {
    if (!productId) {
      return;
    }

    try {
      console.log(`Fetching product price for ID: ${productId}`);
      const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

      if (response) {
        setProductPrice(response.price || '0.00');
      } else {
        throw new Error('No product data available.');
      }
    } catch (error) {
      console.error('❌ Error fetching product price:', error);
    }
  };

  useEffect(() => {
    fetchPromotion();
    fetchProductPrice();
  }, [productId]);

  // Calculate discounted price dynamically
  const calculatedTTC = (parseFloat(productPrice) * (1 - discount / 100)).toFixed(2);

  // Redirect user to edit or create a promotion
  const handleModifyPromo = () => {
    if (promoId) {
      router.push(`/promotion/edit/${promoId}`); // Redirect to edit promotion page
    } else {
      router.push(`/promotion/create?productId=${productId}`); // Redirect to create promotion page
    }
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
                  '& fieldset': { borderColor: 'black' },
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
              value={productPrice}
              sx={{
                width: 90,
                borderRadius: 1,
                '& .MuiOutlinedInput-root.Mui-disabled': {
                  '& fieldset': { borderColor: 'black' },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: 'black',
                },
              }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
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
                  '& fieldset': { borderColor: 'black' },
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: 'black',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: 'black',
                },
              }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
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
              {promoId ? 'MODIFIER' : 'CRÉER UNE PROMO'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default PromotionArticle;
