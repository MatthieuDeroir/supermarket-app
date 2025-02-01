import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { data } from '@common/defs/fakes/logs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogDetailsModal from '@modules/stock-logs/components/LogDetailsModal';
import dayjs from 'dayjs';
import { StockLogsType, LogType } from '@common/defs/types/logs';

// exemple of my data
// {
//     id: 1,
//     ean: '1234567890123',
//     type: 'Trans',
//     de: 'FDR',
//     pour: 'Panier',
//     qt: 4,
//     date: '2021-01-01T00:00:00',
//     par: 24,
//   },

export const LogTypeColors: Record<LogType, string> = {
  [LogType.TRANS]: 'orange',
  [LogType.SOLD]: 'blue',
  [LogType.AJOUT]: 'green',
  [LogType.SUPPRIMER]: 'red',
};

const StockLogs: React.FC = () => {
  const [rows, setRows] = useState<StockLogsType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<StockLogsType | null>(null);

  const handleShowLog = (log: StockLogsType) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'ean', headerName: 'EAN', flex: 2, headerAlign: 'center', align: 'center' },
    {
      field: 'type',
      headerName: 'Type',
      flex: 2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const logType = params.value as LogType;
        return (
          <Box
            sx={{
              color: LogTypeColors[logType] || 'black',
              fontWeight: 'bold',
            }}
          >
            {logType}
          </Box>
        );
      },
    },
    { field: 'de', headerName: 'De', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'pour', headerName: 'Pour', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'qt', headerName: 'Quantité', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'par', headerName: 'Par', flex: 2, headerAlign: 'center', align: 'center' },
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
              handleShowLog(params.row);
            }}
            size="small"
          >
            <VisibilityIcon color="inherit" />
          </IconButton>
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
      const mappedData = data.map((item: StockLogsType) => ({
        id: item.id,
        ean: item.ean,
        type: item.type,
        de: item.de,
        pour: item.pour,
        qt: item.qt,
        date: dayjs(item.date).format('DD/MM/YYYY HH[h]mm'),
        par: item.par,
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
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Typography variant="h3">Logs des Stocks</Typography>
        <DataGrid rows={rows} columns={columns} />
      </Box>
      {selectedLog && (
        <LogDetailsModal
          stockLog={selectedLog}
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setSelectedLog(null);
          }}
        />
      )}
    </>
  );
};

export default StockLogs;
