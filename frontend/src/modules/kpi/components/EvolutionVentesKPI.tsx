import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import apiRoutes from '@common/defs/routes/apiRoutes';
import axios from 'axios';

interface DailyStockData {
  date: string;
  quantity: number;
}

// ✅ Interface pour définir le format des données API et locales
interface ApiResponseEntry {
  date: string;
  quantity: number;
}

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const generateDateRange = (start: string, end: string): string[] => {
  const dates: string[] = [];
  const currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const EvolutionVentesKPI: React.FC<{ productId: number }> = ({ productId }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(formatDate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));
  const [salesData, setSalesData] = useState<DailyStockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        apiRoutes.Logs.GetDailyStocks(productId, startDate, endDate),
      );

      if (response.status === 200) {
        const apiData: ApiResponseEntry[] = response.data.map((entry: ApiResponseEntry) => ({
          date: formatDate(new Date(entry.date)),
          quantity: Number(entry.quantity) || 0,
        }));

        const allDates = generateDateRange(startDate, endDate);
        const completedData = allDates.map((date) => ({
          date,
          quantity: apiData.find((entry) => entry.date === date)?.quantity ?? 0,
        }));

        setSalesData(completedData);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur API, utilisation des données locales', error);
      try {
        const localData = await import('./exempleData/exempleLogs.json');

        const localStockData: ApiResponseEntry[] = localData.default.map(
          (entry: ApiResponseEntry) => ({
            date: formatDate(new Date(entry.date)),
            quantity: Number(entry.quantity) || 0,
          }),
        );

        const allDates = generateDateRange(startDate, endDate);
        const completedLocalData = allDates.map((date) => ({
          date,
          quantity: localStockData.find((entry) => entry.date === date)?.quantity ?? 0,
        }));

        setSalesData(completedLocalData);
      } catch (localError) {
        console.error('Erreur lors du chargement des données locales', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (startDate && endDate) {
      fetchSalesData();
    } else {
      alert('Veuillez sélectionner une plage de dates.');
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [productId, startDate, endDate]);

  const dataset = salesData.map((item) => ({
    x: item.date,
    y: item.quantity,
  }));

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Evolution des Ventes KPI
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Date de début"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Date de fin"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFetch} disabled={loading}>
          {loading ? 'Chargement...' : 'Rechercher'}
        </Button>
      </Box>

      <BarChart
        dataset={dataset}
        xAxis={[{ dataKey: 'x', label: 'Dates', scaleType: 'band' }]}
        series={[{ dataKey: 'y', label: 'Produits vendus', color: '#3b82f6' }]}
        height={300}
        margin={{ left: 50, right: 30, top: 30, bottom: 50 }}
        grid={{ vertical: true, horizontal: true }}
      />
    </Box>
  );
};

export default EvolutionVentesKPI;
