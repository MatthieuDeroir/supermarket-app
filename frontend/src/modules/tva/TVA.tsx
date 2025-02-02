import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';

const TVA: React.FC = () => {
  const router = useRouter();

  type TVARow = {
    id: number;
    category_id: string;
    tax_value: number;
    description: string;
  };

  const [rows, setRows] = useState<TVARow[]>([]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'category_id',
      headerName: 'Catégorie ID',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'tax_value',
      headerName: 'Valeur TVA',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 3,
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
          <IconButton
            onClick={() => {
              router.push(`/tva/${params.row.id}`);
            }}
            size="small"
          >
            <VisibilityIcon color="inherit" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const fetchTVA = async () => {
    try {
      const response = await makeApiRequest(apiRoutes.Categories.GetAll);
      if (Array.isArray(response)) {
        const mappedData = response.map((item, index) => ({
          id: item.category_id ?? `temp-${index}`,
          category_id: item.category_id ?? 'N/A',
          tax_value: item.tax_value ?? 0,
          description: item.description ?? 'Aucune description',
        }));
        setRows(mappedData);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des TVA', error);
    }
  };

  useEffect(() => {
    fetchTVA();
  }, []);

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3">TVA</Typography>
          <IconButton
            onClick={() => router.push('/tva/add')}
            size="small"
            sx={{ backgroundColor: 'primary.light', borderRadius: 1 }}
          >
            <AddIcon sx={{ color: 'primary.dark' }} />
          </IconButton>
        </Box>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </>
  );
};

export default TVA;
