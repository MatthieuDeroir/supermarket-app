import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CodeBarre from './CodeBarre';

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
}

const InfoProduit: React.FC<{ ean: string }> = ({ ean }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    // Tentative de récupération des données depuis l'API
    fetch(`/API/Produit/${ean}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }
        return response.json();
      })
      .then((data: ProductData) => {
        setProductData(data);
      })
      .catch((error) => {
        console.error('Erreur API, utilisation des données locales :', error);
        // Fallback vers le fichier JSON local
        import('../exempleProduit/exempleJSONProduit.json')
          .then((localData) => {
            // Transformation des données locales
            const transformedData: ProductData = {
              ean: localData.ean,
              name: localData.name,
              price: localData.price,
              brand: localData.brand,
              picture: localData.picture,
              category: `Catégorie ID: ${localData.category_id}`,
              nutritional_information: JSON.parse(localData.nutritional_information),
              available_quantity: localData.stock_warehouse + localData.stock_shelf_bottom,
            };
            setProductData(transformedData);
          })
          .catch((localError) =>
            console.error('Erreur lors du chargement du fichier JSON local :', localError),
          );
      });
  }, [ean]);

  if (!productData) {
    return <Typography>Chargement des informations du produit...</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100vh',
        padding: 2,
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '50%' }}
      >
        <Typography variant="h2">{productData.name}</Typography>

        <Typography variant="h6">Prix :</Typography>
        <Typography>{productData.price}</Typography>

        <Typography variant="h6">Marque :</Typography>
        <Typography>{productData.brand}</Typography>

        <Typography variant="h6">Catégorie :</Typography>
        <Typography>{productData.category}</Typography>

        <Typography variant="h6">Quantité disponible en stock :</Typography>
        <Typography>{productData.available_quantity} unités</Typography>

        <Typography variant="h6">EAN :</Typography>
        <Typography>{productData.ean}</Typography>
        <CodeBarre value={productData.ean} />

        <Typography variant="h6">Informations nutritionnelles :</Typography>
        <Typography
          variant="subtitle2"
          sx={{ maxWidth: '95%', wordWrap: 'break-word', fontSize: '0.75rem' }}
        >
          {Object.entries(productData.nutritional_information)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
        </Typography>
      </Box>
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
  );
};

export default InfoProduit;
