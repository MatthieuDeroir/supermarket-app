import React, { useEffect, useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ExpandMore';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import CodeBarre from './CodeBarre';

interface ProductData {
  product_id: number;
  ean: string;
  name: string;
  price: string;
  brand: string;
  picture: string;
  category: number;
  nutritional_information: Record<string, string | number>;
  stock_warehouse: number;
  available_quantity: number;
}

const InfoProduit: React.FC<{ productId: number }> = ({ productId }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        <Typography variant="h2">{productData.name}</Typography>
        <Typography variant="h6">Prix :</Typography>
        <Typography>{productData.price}</Typography>
        <Typography variant="h6">Marque :</Typography>
        <Typography variant="body1">{productData.brand}</Typography>
        <Typography variant="h6">Quantité disponible au dépôt :</Typography>
        <Typography>{productData.stock_warehouse} unités</Typography>
        <Typography variant="h6">EAN :</Typography>
        <Typography>{productData.ean}</Typography>
        <CodeBarre value={productData.ean} />

        <Accordion>
          <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
            <Typography component="span" variant="h6">
              Informations nutritionnelles
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ maxWidth: '95%', fontSize: '0.75rem' }}>
              {Object.entries(productData.nutritional_information)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: 2,
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          sx={{ width: '80%', height: 'auto', borderRadius: 1 }}
          alt="product image"
          src={productData.picture}
        />
      </Box>
    </Box>
  );
};

export default InfoProduit;
