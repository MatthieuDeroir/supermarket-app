import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ShortProduit from '../produit/components/InfoProduitShort';
import Chart from './Chart/circularChartProgress';
import TransfertToStockButton from './Buttons/transfertToStockButton';
import DeleteButton from './Buttons/deleteButton';
import MinimumShelfButton from './Buttons/minimumShelfButton';
import DataGridStockMovements from './Chart/dataGridStockMovements';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface ProductData {
  product_id: number;
  ean: string;
  name: string;
  price: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
  minimum_stock: number;
}

const ProductShelf: React.FC<{ productId: number }> = ({ productId }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`Fetching product data for ID: ${productId}`);
        const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

        if (response) {
          console.log(' Product API Response:', response);
          setProductData(response);
        } else {
          console.error(' No product data found.');
        }
      } catch (error) {
        console.error(' API error:', error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (!productData) {
    return <Typography color="error">Chargement du produit...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h3">Gestion du Fond de rayon</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 8 }}>
          <ShortProduit productId={productData.product_id} />
        </Box>
        <Box sx={{ flex: 3 }}>
          <Chart productId={productData.product_id} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <DeleteButton
          productId={productData.product_id}
          productName={productData.name}
          currentStock={productData.stock_shelf_bottom}
        />
        <TransfertToStockButton
          productId={productData.product_id}
          productName={productData.name}
          stockShelfBottom={productData.stock_shelf_bottom}
          stockWarehouse={productData.stock_warehouse}
        />
        <MinimumShelfButton
          productId={productData.product_id}
          productName={productData.name}
          currentMinimumStock={productData.minimum_stock}
        />
      </Box>

      <DataGridStockMovements productId={productData.product_id} />
    </Box>
  );
};

export default ProductShelf;
