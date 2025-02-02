import React, { useEffect, useState } from 'react';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { Box, Typography, TextField, Button } from '@mui/material';
import { LineChart } from '@mui/x-charts';

interface ApiStockData {
  date: string;
  stockWarehouse: number;
  stockShelfBottom: number;
}

const StockKPI: React.FC<{ productId: number }> = ({ productId }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  const [tableData, setTableData] = useState<ApiStockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      console.log(
        `Fetching stock data for product ID: ${productId}, from ${startDate} to ${endDate}`,
      );
      const response = await makeApiRequest(
        apiRoutes.KpiLogs.GetByLogsProductId(productId, startDate, endDate),
      );

      if (response && Array.isArray(response)) {
        console.log(' API Response:', response);
        const transformedData = response.map((item: ApiStockData) => ({
          date: item.date,
          stockWarehouse: item.stockWarehouse,
          stockShelfBottom: item.stockShelfBottom,
        }));
        setTableData(transformedData);
      } else {
        console.error('No stock data found for this product.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);

      try {
        const localData = await import('./exempleData/exempleDataKpi.json');
        console.log(' Using local data fallback:', localData.default);
        const transformedData = localData.default.map((item: ApiStockData) => ({
          date: item.date,
          stockWarehouse: item.stockWarehouse,
          stockShelfBottom: item.stockShelfBottom,
        }));
        setTableData(transformedData);
      } catch (localError) {
        console.error('Error loading local stock data:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchStockData();
    }
  }, [productId, startDate, endDate]);

  const dataset = tableData.map((item) => ({
    x: new Date(item.date).getTime(),
    y: item.stockShelfBottom,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h3" gutterBottom>
        Stock KPI
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Date de début"
          defaultValue={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Date de fin"
          defaultValue={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>
      <LineChart
        dataset={dataset}
        xAxis={[{ dataKey: 'x', scaleType: 'time' }]}
        series={[
          {
            dataKey: 'y',
            label: 'Stock en Rayon',
          },
        ]}
        height={300}
        margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
        grid={{ vertical: true, horizontal: true }}
      />
    </Box>
  );
};

export default StockKPI;
