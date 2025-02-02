import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

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
  stock_shelf_bottom: number;
}

const AllShelfProducts: React.FC = () => {
  const [rows, setRows] = useState<StockData[]>([]);
  const router = useRouter();

  const handleViewProduct = (id: string) => {
    router.push(`/produit/${id}`);
  };

  const handleDeleteProduct = (id: string) => {
    alert(`Supprimer le produit avec le code EAN : ${id}`);
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
            onClick={() => handleViewProduct(params.row.id)}
          >
            Afficher le produit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDeleteProduct(params.row.id)}
          >
            Supprimer
          </Button>
        </Box>
      ),
    },
  ];

  const fetchAllShelfProducts = async () => {
    try {
      const response = await makeApiRequest(apiRoutes.Products.GetAll);

      if (Array.isArray(response)) {
        console.log('API Response:', response);
        const mappedData = response
          .filter((item: AllStockData) => item.stock_shelf_bottom > 0)
          .map((item: AllStockData) => ({
            id: item.product_id,
            name: item.name,
            ean: item.ean,
            stock_shelf_bottom: item.stock_shelf_bottom,
          }));
        setRows(mappedData);
      }
    } catch (error) {
      console.error('Error fetching shelf products from API:', error);
    }
  };

  useEffect(() => {
    fetchAllShelfProducts();
  }, []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h3">Produits en fond de rayon disponibles</Typography>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

export default AllShelfProducts;
