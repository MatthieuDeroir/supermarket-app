import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PromotionArticle from '../promotionArticle/promotionArticle';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import React, { useEffect, useState } from 'react';
import CodeBarre from './CodeBarre';
import axios from 'axios';

// Définition du type pour les données du produit
interface ProductData {
  ean: string;
  name: string;
  price: string;
  brand: string;
  picture: string;
  category: string;
  nutritional_information: Record<string, string | number>;
  available_quantity: number;
  product_id: number;
}

const InfoProduit: React.FC<{ ean: string }> = ({ ean }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    const fetchProductByEan = async (ean: string) => {
      try {
        // Tentative de récupération des données via l'API
        const response = await makeApiRequest(apiRoutes.Products.GetByEan(ean));
        if (response.status === 200) {
          setProductData(response.data);
        } else {
          throw new Error('API non disponible');
        }
      } catch (error) {
        console.error(
          'Erreur lors de la récupération depuis l’API, utilisation des données locales',
          error,
        );

        // Fallback : Chargement des données locales
        try {
          const localData = await import('../exempleProduit/exempleJSONProduit.json');
          const transformedData: ProductData = {
            ean: localData.ean,
            name: localData.name,
            price: localData.price,
            brand: localData.brand,
            picture: localData.picture,
            category: `Catégorie ID: ${localData.category_id}`,
            nutritional_information: JSON.parse(localData.nutritional_information),
            available_quantity: localData.stock_warehouse + localData.stock_shelf_bottom,
            product_id: localData.product_id,
          };
          setProductData(transformedData);
        } catch (localError) {
          console.error('Erreur lors du chargement des données locales', localError);
        }
      }
    };

    fetchProductByEan(ean);
  }, [ean]);

  if (!productData) {
    return <Typography>Chargement des informations du produit...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100vh',
          width: '50%',
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '50%',
          }}
        >
          <Typography variant="h2">{productData.name}</Typography>

          <Typography variant="h6">Prix :</Typography>
          <Typography>{productData.price}</Typography>

          <Typography variant="h6">Marque :</Typography>
          <Typography variant="body1">{productData.brand}</Typography>

          <Typography variant="h6">Catégorie :</Typography>
          <Typography>{productData.category}</Typography>

          <Typography variant="h6">Quantité disponible en stock :</Typography>
          <Typography>{productData.available_quantity} unités</Typography>

          <Typography variant="h6">EAN :</Typography>
          <Typography>{productData.ean}</Typography>
          <CodeBarre value={productData.ean} />

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span" variant="h6">
                Informations nutritionnelles
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="subtitle2"
                sx={{ maxWidth: '95%', wordWrap: 'break-word', fontSize: '0.75rem' }}
              >
                {Object.entries(productData.nutritional_information)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <Box>
        <PromotionArticle productId={productData.product_id} price={productData.price} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
          }}
        >
          <Box
            component="img"
            src={productData.picture}
            alt={productData.name}
            sx={{
              maxHeight: '80vh',
              maxWidth: '40%',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoProduit;
