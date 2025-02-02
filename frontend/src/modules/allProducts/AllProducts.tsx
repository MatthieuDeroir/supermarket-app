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
  id: number;
  name: string;
  ean: string;
  stock_warehouse: number;
  stock_shelf_bottom: number;
}

const AllProducts: React.FC = () => {
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
      field: 'stock_warehouse',
      headerName: 'Quantité en entrepôt',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
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
      flex: 2,
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

  const fetchAllProducts = async () => {
    try {
      console.log('Fetching product data from API...');
      const response = await makeApiRequest(apiRoutes.Products.GetAll);

      if (Array.isArray(response)) {
        console.log('API Response:', response);
        const mappedData = response.map((item: AllStockData) => ({
          id: item.product_id,
          name: item.name,
          ean: item.ean,
          stock_warehouse: item.stock_warehouse,
          stock_shelf_bottom: item.stock_shelf_bottom,
        }));
        setRows(mappedData);
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h3">Produit total stock</Typography>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

export default AllProducts;
