import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { data } from '@common/defs/fakes/addProduct';

// exemple of my data
// {"id": 1,
//     "name": "fishy Box",
//     "ean": "1234567890123",
//     "description": "fish",
//     "brand": "sea",
//     "conditioning": "box",
//     "weight": "100 grams",
//     "categories": ["food", "fish"]
//   },
interface OFFProduct {
  id: number;
  name: string;
  ean: string;
  description: string;
  brand: string;
  conditioning: string;
  weight: string;
  categories: string[];
}

const AddProducts: React.FC = () => {
  const [rows, setRows] = useState<OFFProduct[]>([]);
  const router = useRouter();

  const handleAddProduct = async (ean: string) => {
    const response = await makeApiRequest(apiRoutes.OpenFoodFact.GetProductByEan, 'POST', { ean });
    if (response.status === 200) {
      router.push(`/add-product/${ean}`);
    } else {
      console.error('Error fetching product from API');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 2, headerAlign: 'left', align: 'left' },
    { field: 'name', headerName: 'Produit', flex: 2, headerAlign: 'left', align: 'left' },
    { field: 'ean', headerName: 'EAN', flex: 2, headerAlign: 'left', align: 'left' },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
    },
    { field: 'brand', headerName: 'Marque', flex: 2, headerAlign: 'left', align: 'left' },
    {
      field: 'conditioning',
      headerName: 'Conditionnement',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
    },
    { field: 'weight', headerName: 'Poids', flex: 2, headerAlign: 'left', align: 'left' },
    {
      field: 'categories',
      headerName: 'Catégories',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'action',
      headerName: 'Actions',
      flex: 2,
      headerAlign: 'left',
      align: 'left',
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
            onClick={() => handleAddProduct(params.row.ean)}
          >
            Ajouter au stock
          </Button>
        </Box>
      ),
    },
  ];

  const fetchAllProducts = async () => {
    // try {
    //   const response = await makeApiRequest(apiRoutes.Products.GetAll);
    //   if (response.status === 200) {
    //     const mappedData = response.data.map((item: OFFProduct) => ({
    //       id: item.id,
    //       name: item.name,
    //       ean: item.ean,
    //       description: item.description,
    //       brand: item.brand,
    //       conditioning: item.conditioning,
    //       weight: item.weight,
    //       categories: item.categories,
    //     }));
    //     setRows(response.data);
    //   } else {
    //     throw new Error('API not available');
    //   }
    // } catch (error) {
    //   console.error('Error fetching data from API', error);
    // }

    // Fallback : Chargement des données locales
    try {
      const mappedData = data.map((item: OFFProduct) => ({
        id: item.id,
        name: item.name,
        ean: item.ean,
        description: item.description,
        brand: item.brand,
        conditioning: item.conditioning,
        weight: item.weight,
        categories: item.categories,
      }));
      setRows(mappedData);
    } catch (localError) {
      console.error('Erreur lors du chargement des données locales', localError);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h3">Ajouter un Produit</Typography>
      <DataGrid rows={rows} columns={columns} />
    </Box>
  );
};

export default AddProducts;
