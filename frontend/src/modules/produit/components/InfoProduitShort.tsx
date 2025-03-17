import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import CodeBarre from './CodeBarre';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';

interface ProductData {
  product_id: number;
  ean: string;
  name: string;
  price: string;
  brand: string;
  picture: string;
  category: number;
  nutritional_information: Record<string, string | number>;
  stock_shelf_bottom: number;
  stock_warehouse: number;
  available_quantity: number;
}

const InfoProduit: React.FC<{ productId: number }> = ({ productId }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProductById = async () => {
      try {
        console.log(`Fetching product data for ID: ${productId}`);
        const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

        if (response) {
          console.log(' API Response:', response);
          setProductData({
            product_id: response.product_id,
            ean: response.ean,
            name: response.name,
            price: response.price,
            brand: response.brand,
            picture: response.picture,
            category: response.category_id,
            nutritional_information: JSON.parse(response.nutritional_information || '{}'),
            stock_shelf_bottom: response.stock_shelf_bottom,
            stock_warehouse: response.stock_warehouse,
            available_quantity: response.stock_warehouse + response.stock_shelf_bottom,
          });
        } else {
          console.error('No product data found for this ID.');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [productId]);

  const RedirectToAddMoreProduct = (id: number) => {
    router.push(`/addStockQuantityToStock/${id}`);
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Chargement des informations du produit...
        </Typography>
      </Box>
    );
  }

  if (!productData) {
    return (
      <Box>
        <Typography variant="h5" color="error">
          Aucun produit trouvé pour cet ID.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', padding: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 2 }}>
          <Typography variant="h2">{productData.name}</Typography>
          <Button
            sx={{
              width: '50px',
              height: '50px',
              minWidth: '50px',
              aspectRatio: '1 / 1',
              backgroundColor: '#4CAF50',
              color: 'white',
              mt: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': { backgroundColor: '#388E3C' },
            }}
            onClick={() => RedirectToAddMoreProduct(productId)}
          >
            <AddIcon />
          </Button>
        </Box>
        <Typography variant="h6">Quantité disponible en en stock :</Typography>
        <Typography>{productData.stock_warehouse} unités</Typography>
        <Typography variant="h6">Quantité disponible en en fond de rayon :</Typography>
        <Typography>{productData.stock_shelf_bottom} unités</Typography>
        <Typography variant="h6">EAN :</Typography>
        <Typography>{productData.ean}</Typography>
        <CodeBarre value={productData.ean} />
      </Box>
    </Box>
  );
};

export default InfoProduit;
