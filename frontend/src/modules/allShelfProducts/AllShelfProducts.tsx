import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import apiRoutes from '@common/defs/routes/apiRoutes';
import axios from 'axios';

interface AllStockData {
  product_id: number;
  ean: string;
  name: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
}

interface StockData {
  id: number; // Clé unique requise pour chaque ligne
  name: string;
  ean: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
}

const allShelfProducts: React.FC = () => {
  const [rows, setRows] = useState<StockData[]>([]); // Assurez-vous d'utiliser `StockData[]`
  const router = useRouter();

  const handleViewProduct = (ean: string) => {
    router.push(`/produit/${ean}`);
  };

  const handleDeleteProduct = (ean: string) => {
    alert(`Supprimer le produit avec le code EAN : ${ean}`);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Produit', flex: 2, headerAlign: 'center', align: 'left' },
    { field: 'ean', headerName: 'EAN - 13', flex: 2, headerAlign: 'center', align: 'center' },
    {
      field: 'stock_shelf_bottom',
      headerName: 'Quantité en rayon',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 4,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: '10%',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleViewProduct(params.row.ean)}
          >
            Afficher le produit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeleteProduct(params.row.ean)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get(apiRoutes.Products.GetAll);
      if (response.status === 200) {
        const mappedData = response.data.map((item: AllStockData) => ({
          id: item.product_id,
          name: item.name,
          ean: item.ean,
          stock_warehouse: item.stock_warehouse,
          stock_shelf_bottom: item.stock_shelf_bottom,
        }));
        setRows(mappedData); // Mise à jour des données
      } else {
        throw new Error('API not available');
      }
    } catch (error) {
      console.error('Error fetching data from API', error);
    }

    // Fallback : Chargement des données locales
    try {
      const localData = await import('../allProducts/allProductsMocked/allProductsMockerd.json');
      const mappedData = localData.default.map((item: AllStockData) => ({
        id: item.product_id,
        name: item.name,
        ean: item.ean,
        stock_warehouse: item.stock_warehouse,
        stock_shelf_bottom: item.stock_shelf_bottom,
      }));
      setRows(mappedData); // Mise à jour des données avec un tableau
    } catch (localError) {
      console.error('Erreur lors du chargement des données locales', localError);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h3">Produit en fond de rayon disponible</Typography>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

export default allShelfProducts;
