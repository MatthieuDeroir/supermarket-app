import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import InfoProduit from '@modules/produit/components/InfoProduit';
import { useConfirmDialog } from '@common/components/ConfirmDialogProvider';

const PromotionPage = () => {
  const { showConfirmDialog } = useConfirmDialog();
  const router = useRouter();
  const { id } = router.query;
  const [promotionId, setPromotionId] = useState<number | null>(null);

  const [promotion, setPromotion] = useState<{
    pourcentage: number;
    beging_date: string;
    end_date: string;
    product_id: number;
  } | null>(null);

  const [discount, setDiscount] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('0.00');
  const [vat, setVat] = useState<string>('5.5'); // Default VAT
  const [taxFreePrice, setTaxFreePrice] = useState<string>('0.00');
  const [finalPrice, setFinalPrice] = useState<string>('0.00');
  const [productId, setProductId] = useState<number | null>(null);
  const [ean, setEan] = useState<string>(''); // ✅ Store EAN

  useEffect(() => {
    if (id) {
      const parsedId = Number(id);
      if (!Number.isNaN(parsedId)) {
        setPromotionId(parsedId);
        fetchPromotion(parsedId);
      }
    }
  }, [id]);

  const fetchPromotion = async (promotionId: number) => {
    try {
      const response = await makeApiRequest(apiRoutes.Promotions.GetById(promotionId));
      if (response.success) {
        setPromotion(response);
        setDiscount(response.pourcentage);
        setStartDate(response.beging_date.split('T')[0]);
        setEndDate(response.end_date.split('T')[0]);
        setProductId(response.product_id);

        const productResponse = await makeApiRequest(
          apiRoutes.Products.GetById(response.product_id),
        );
        if (productResponse) {
          setCurrentPrice(productResponse.price);
          setVat(productResponse.vat);

          const price = parseFloat(productResponse.price);
          const vatRate = parseFloat(productResponse.vat);

          const taxFree =
            !Number.isNaN(price) && !Number.isNaN(vatRate)
              ? (price / (1 + vatRate / 100)).toFixed(2)
              : '0.00';

          setTaxFreePrice(taxFree);
          setFinalPrice((price * (1 - response.pourcentage / 100)).toFixed(2));
          setEan(productResponse.ean || '');
        }
      }
    } catch (error) {
      console.error('Error fetching promotion:', error);
    }
  };

  const updatePromotion = async (status: boolean) => {
    if (!promotionId) {
      return;
    }
    try {
      await makeApiRequest(apiRoutes.Promotions.Update(promotionId), 'PUT', {
        pourcentage: discount,
        beging_date: startDate,
        end_date: endDate,
        active: status,
      });

      await showConfirmDialog({
        title: 'Succès',
        message: `Promotion ${status ? 'applied' : 'disabled'} successfully!`,
        confirmText: 'OK',
        cancelText: '',
      });
      router.push('/promotions');
    } catch (error) {
      console.error('Error updating promotion:', error);
      await showConfirmDialog({
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour de la promotion.',
        confirmText: 'OK',
        cancelText: '',
      });
    }
  };

  if (!promotion) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, padding: 4 }}>
      {/* Left Side */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4">Ajouter/Modifier une promotion</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">N° produit</Typography>
            <TextField
              label="EAN"
              value={ean}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">% de réduction</Typography>
            <TextField
              type="number"
              value={discount}
              onChange={(e) => {
                const newDiscount = Number(e.target.value);
                setDiscount(newDiscount);
                setFinalPrice((parseFloat(currentPrice) * (1 - newDiscount / 100)).toFixed(2));
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Price Details */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6">Prix actuel</Typography>
            <TextField
              value={`$ ${currentPrice}`}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />

            <Typography variant="h6">Current VAT</Typography>
            <TextField
              value={`${vat}%`}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />

            <Typography variant="h6">HT (Tax-Free Price)</Typography>
            <TextField
              value={`$ ${taxFreePrice}`}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="h6">Prix apres réduction</Typography>
            <TextField
              value={`$ ${finalPrice}`}
              disabled
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />

            <Typography variant="h6">Date d'activation</Typography>
            <TextField
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />

            <Typography variant="h6">Date de desactivation </Typography>
            <TextField
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black !important',
                  },
                  '&:hover fieldset': {
                    borderColor: 'black !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black !important',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'black !important',
                },
                '& .MuiInputLabel-root': {
                  color: 'black !important',
                },
                '& .Mui-disabled': {
                  WebkitTextFillColor: 'black !important',
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'green', color: 'white', width: '200px' }}
            onClick={() => updatePromotion(true)}
          >
            ACTIVER LA PROMOTION
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'red', color: 'white', width: '200px' }}
            onClick={() => updatePromotion(false)}
          >
            DESACTIVER LA PROMOTION
          </Button>
        </Box>
      </Box>

      {/* Right Side (Product Info) */}
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        {productId && <InfoProduit productId={productId} />}
      </Box>
    </Box>
  );
};

export default PromotionPage;
