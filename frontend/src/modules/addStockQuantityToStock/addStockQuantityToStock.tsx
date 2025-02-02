import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import InfoProduit from '../produit/components/InfoProduit';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';

const AddStockQuantityToStock: React.FC<{ productId: number }> = ({ productId }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState<number | ''>('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  //  Function to fetch the latest product stock
  const fetchProductData = async () => {
    try {
      console.log(`Fetching product data for ID: ${productId}`);
      const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

      if (response) {
        console.log(' Product data fetched:', response);
        setCurrentStock(response.stock_warehouse);
      } else {
        throw new Error('No product data available.');
      }
    } catch (error) {
      console.error(' Error fetching product data:', error);
      setError('Error fetching product data.');
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleOrder = async () => {
    if (quantity === '' || quantity <= 0) {
      setError('Veuillez entrer une quantité valide.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const newStock = currentStock + Number(quantity);

    try {
      console.log(`Updating stock for product ID: ${productId} with new stock: ${newStock}`);
      const response = await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        stock_warehouse: newStock,
      });

      if (response) {
        console.log(' Stock updated successfully:', response);
        setSuccess('Stock mis à jour avec succès !');
        setQuantity('');

        setTimeout(() => {
          router.push(`/produit/${productId}`);
        }, 1000);
      } else {
        throw new Error('Échec de la mise à jour du stock.');
      }
    } catch (error) {
      console.error(' Error updating stock:', error);
      setError('Erreur dans le traitement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', mt: 4 }}
    >
      <InfoProduit productId={productId} />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          width: '60%',
          maxWidth: '500px',
          border: '2px solid #e0e0a0',
          borderRadius: '12px',
          padding: '30px',
          backgroundColor: '#FCF8E3',
          textAlign: 'center',
          boxShadow: '4px 4px 10px rgba(0,0,0,0.1)',
          mt: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#333', marginBottom: '20px' }}>
          Commander des produits
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={3}>
          <TextField
            label="Quantité"
            variant="outlined"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || '')}
            sx={{ width: '120px', fontSize: '18px' }}
            inputProps={{ min: 1, style: { textAlign: 'center' } }}
          />
          <Typography fontWeight="bold" sx={{ fontSize: '18px' }}>
            Qté.
          </Typography>
        </Box>

        {error && (
          <Typography color="error" fontSize="16px">
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="green" fontSize="16px">
            {success}
          </Typography>
        )}

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            width: '85%',
            height: '50px',
            fontSize: '18px',
            fontWeight: 'bold',
            marginTop: '15px',
            '&:hover': { backgroundColor: '#388E3C' },
          }}
          onClick={handleOrder} //  Calls `handleOrder` only
          disabled={loading}
        >
          {loading ? 'Traitement en cours...' : 'COMMANDER'}
        </Button>
      </Box>
    </Box>
  );
};

export default AddStockQuantityToStock;
