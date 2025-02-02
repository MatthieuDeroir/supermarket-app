import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ExpandMore';
import CodeBarre from '../produit/components/CodeBarre';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface ProductData {
  ean: string;
  name: string;
  brand: string;
  description: string;
  picture: string;
  nutritional_information: Record<string, string | number>;
  price: string;
  stock_warehouse: number;
}

const AddNewProductToStock: React.FC = () => {
  const [ean, setEan] = useState<string>('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number | ''>('');
  const router = useRouter();

  // Fetch product from Open Food Facts API
  const fetchProductByEan = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching product from Open Food Facts with EAN: ${ean}`);
      const response = await makeApiRequest(apiRoutes.OpenFoodFact.GetProductByEan(ean));

      if (response) {
        console.log('Product data fetched:', response);
        setProductData(response);
      } else {
        throw new Error('No product found.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('No product found. Try another EAN.');
    } finally {
      setLoading(false);
    }
  };

  // Add product to internal database
  const addProductToDatabase = async () => {
    if (!productData || quantity === '' || quantity <= 0) {
      return;
    }
    setLoading(true);

    try {
      console.log(`Adding product to database: ${productData.ean}`);
      const response = await makeApiRequest(apiRoutes.Products.Create, 'POST', {
        ean: productData.ean,
        name: productData.name,
        brand: productData.brand,
        description: productData.description,
        picture: productData.picture,
        nutritional_information: JSON.stringify(productData.nutritional_information),
        price: productData.price,
        stock_warehouse: quantity,
        category_id: 1,
      });

      if (response) {
        console.log('Product added successfully:', response);
        router.push(`/produit/${response.product_id}`);
      } else {
        throw new Error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error adding product to database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
        <TextField
          label="Enter EAN"
          variant="outlined"
          value={ean}
          onChange={(e) => setEan(e.target.value)}
          sx={{ width: '40%' }}
        />
        <Button
          variant="contained"
          sx={{ marginLeft: 2 }}
          onClick={fetchProductByEan}
          disabled={loading || !ean}
        >
          {loading ? <CircularProgress size={24} /> : 'Fetch Product'}
        </Button>
      </Box>

      {error && (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {productData && (
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', padding: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2, gap: 2 }}>
            <Typography variant="h2">{productData.name}</Typography>
            <Typography variant="h6">Prix :</Typography>
            <Typography>{productData.price} €</Typography>
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
                {productData.nutritional_information ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {typeof productData.nutritional_information === 'string'
                      ? Object.entries(JSON.parse(productData.nutritional_information)).map(
                          ([key, value]) => (
                            <Typography key={key} variant="body2" sx={{ fontSize: '0.875rem' }}>
                              <strong>{key.replace(/_/g, ' ')}</strong>: {String(value)}
                            </Typography>
                          ),
                        )
                      : Object.entries(productData.nutritional_information).map(([key, value]) => (
                          <Typography key={key} variant="body2" sx={{ fontSize: '0.875rem' }}>
                            <strong>{key.replace(/_/g, ' ')}</strong>: {value}
                          </Typography>
                        ))}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray' }}>
                    No nutritional information available.
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Right Section: Order Form & Image */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              sx={{ width: '300px', height: 'auto', borderRadius: 1 }}
              alt="product image"
              src={productData.picture}
            />

            <Box
              sx={{
                border: '1px solid #E0E0A0',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '400px',
                padding: '20px',
                backgroundColor: '#FCF8E3',
                textAlign: 'center',
                boxShadow: '4px 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: '#333', marginBottom: '15px' }}
              >
                Order this product
              </Typography>

              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                <TextField
                  label="Value"
                  variant="outlined"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value) || '')}
                  sx={{ width: '100px' }}
                  inputProps={{ min: 1 }}
                />
                <Typography fontWeight="bold">Pcs.</Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  width: '100%',
                  height: '40px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#388E3C' },
                }}
                onClick={addProductToDatabase}
                disabled={loading || quantity === '' || quantity <= 0}
              >
                {loading ? <CircularProgress size={20} /> : 'ORDER NOW'}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AddNewProductToStock;
