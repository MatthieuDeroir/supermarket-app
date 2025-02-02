import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface ProductData {
  product_id: number;
  ean: string;
  name: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
}

const CircularChartProgress: React.FC<{ productId: number }> = ({ productId }) => {
  const [stockStock, setStockStock] = useState<number>(0);
  const [stockTotal, setStockTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      console.log(`Fetching product stock data for ID: ${productId}`);
      const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

      if (response) {
        console.log(' API Response:', response);
        setStockStock(response.stock_warehouse);
        setStockTotal(response.stock_shelf_bottom + response.stock_warehouse);
      } else {
        throw new Error('API non disponible');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const stockPercentage = Math.round((stockStock / stockTotal) * 100);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '300px',
        aspectRatio: '1 / 1',
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ marginBottom: '8px', color: '#333', textAlign: 'center' }}
      >
        État du Stock en entrepot
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box position="relative" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={6}
            sx={{ color: '#E0E0E0', position: 'absolute' }}
          />

          <CircularProgress
            variant="determinate"
            value={stockPercentage}
            size={120}
            thickness={6}
            sx={{ color: '#c46a23' }}
          />

          <Box position="absolute" display="flex" alignItems="center" justifyContent="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#555' }}>
              {stockPercentage}%
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CircularChartProgress;
