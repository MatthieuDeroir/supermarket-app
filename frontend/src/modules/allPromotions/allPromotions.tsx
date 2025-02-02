import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface PromotionData {
  promotion_id: number;
  product_id: number;
  product_name?: string;
  ean?: string;
  pourcentage: number;
  beging_date: string;
  end_date: string;
  active: boolean;
}

const AllPromotions: React.FC = () => {
  const [rows, setRows] = useState<PromotionData[]>([]);
  const router = useRouter();

  const handleEditPromotion = (id: number) => {
    router.push(`/promotion/edit/${id}`);
  };

  const columns: GridColDef[] = [
    { field: 'product_name', headerName: 'Produit', flex: 2, headerAlign: 'center', align: 'left' },
    { field: 'ean', headerName: 'EAN - 13', flex: 2, headerAlign: 'center', align: 'center' },

    {
      field: 'pourcentage',
      headerName: 'Réduction (%)',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params: { value: number }) => {
        return params.value !== undefined ? `${params.value} %` : 'N/A';
      },
    },

    {
      field: 'beging_date',
      headerName: 'Début',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params: { value: string }) => {
        return params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'Non spécifié';
      },
    },

    {
      field: 'end_date',
      headerName: 'Fin',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueFormatter: (params: { value: string }) => {
        return params.value ? new Date(params.value).toLocaleDateString('fr-FR') : 'Non spécifié';
      },
    },

    {
      field: 'active',
      headerName: 'Statut',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        console.log('Active Status Data in Row:', params.value);
        return params.value ? (
          <Typography color="green">Active</Typography>
        ) : (
          <Typography color="gray">Inactive</Typography>
        );
      },
    },
  ];

  const fetchAllPromotions = async () => {
    try {
      console.log('Fetching promotions from API...');
      const response = await makeApiRequest(apiRoutes.Promotions.GetAll);

      if (Array.isArray(response)) {
        console.log('API Response:', response);

        const promotionsWithProducts = await Promise.all(
          response.map(async (promo) => {
            try {
              const productResponse = await makeApiRequest(
                apiRoutes.Products.GetById(promo.product_id),
              );
              return {
                ...promo,
                id: promo.promotion_id,
                product_name: productResponse?.name || 'Nom inconnu',
                ean: productResponse?.ean || 'Non spécifié',
                pourcentage: promo.pourcentage,
                beging_date: promo.beging_date,
                end_date: promo.end_date,
              };
            } catch (error) {
              console.error(`Error fetching product for ID ${promo.product_id}:`, error);
              return {
                ...promo,
                id: promo.promotion_id,
                product_name: 'Nom inconnu',
                ean: 'Non spécifié',
                pourcentage: promo.pourcentage,
                beging_date: promo.beging_date,
                end_date: promo.end_date,
              };
            }
          }),
        );

        console.log('Processed Promotions Before Setting State:', promotionsWithProducts);
        setRows(promotionsWithProducts);
      }
    } catch (error) {
      console.error('Error fetching promotions from API:', error);
    }
  };

  useEffect(() => {
    fetchAllPromotions();
  }, []);

  return (
    <Box sx={{ height: 600, width: '100%', padding: 3 }}>
      <Typography variant="h3" marginBottom={2}>
        Liste des Promotions
      </Typography>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

export default AllPromotions;
