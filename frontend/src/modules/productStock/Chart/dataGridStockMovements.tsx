import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface LogData {
  log_id: number;
  date: string;
  user_id: number;
  product_id: number;
  quantity: number;
  stock_warehouse_after: number;
  stock_shelf_bottom_after: number;
  reason: string;
  action: string;
  stocktype: string;
}

//  `productId` must be passed as a prop
const DataGridStockMovements: React.FC<{ productId: number }> = ({ productId }) => {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStockMovements = async () => {
      if (!productId) {
        return;
      }

      try {
        console.log(`Fetching logs for productId: ${productId}`);

        const response = await makeApiRequest(apiRoutes.Logs.GetByProductId(productId));

        if (Array.isArray(response)) {
          console.log('API Response:', response);
          setLogs(response);
        } else {
          throw new Error('API response is not an array');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStockMovements();
  }, [productId]);

  console.log('Logs state:', logs);

  const columns: GridColDef[] = [
    { field: 'action', headerName: 'Type', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'reason', headerName: 'Raison', flex: 2, headerAlign: 'center', align: 'left' },
    { field: 'quantity', headerName: 'Qt', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params: { value: string }) => new Date(params.value).toLocaleString(),
    },
  ];

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Stock Movements
      </Typography>
      <DataGrid
        rows={logs.map((log) => ({ ...log, id: log.log_id }))}
        columns={columns}
        loading={loading}
      />
    </Box>
  );
};

export default DataGridStockMovements;
