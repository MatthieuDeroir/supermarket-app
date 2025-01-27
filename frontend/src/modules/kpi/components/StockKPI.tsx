import React, { useEffect, useState } from 'react';
import apiRoutes from '@common/defs/routes/apiRoutes';
import { Box, Typography, TextField, Button } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import axios from 'axios';

interface ApiStockData {
  date: string;
  stockWarehouse: number;
  stockShelfBottom: number;
}

const StockKPI: React.FC<{ ean: string }> = ({ ean }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]); // Début : 30 jours avant aujourd'hui
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]); // Fin : aujourd'hui
  const [tableData, setTableData] = useState<ApiStockData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      // Récupération des données via l'API
      const response = await axios.get(apiRoutes.KpiLogs.GetByProductEan(ean, startDate, endDate));
      if (response.status === 200) {
        const transformedData = response.data.map((item: ApiStockData) => ({
          date: item.date,
          stockWarehouse: item.stockWarehouse,
          stockShelfBottom: item.stockShelfBottom,
        }));
        setTableData(transformedData);
      } else {
        throw new Error('API non disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération depuis l’API', error);

      // Fallback : Chargement des données locales
      try {
        const localData = await import('./exempleData/exempleDataKpi.json');
        const transformedData = localData.default.map((item: ApiStockData) => ({
          date: item.date,
          stockWarehouse: item.stockWarehouse,
          stockShelfBottom: item.stockShelfBottom,
        }));
        setTableData(transformedData);
      } catch (localError) {
        console.error('Erreur lors du chargement des données locales', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (startDate && endDate) {
      fetchStockData();
    } else {
      alert('Veuillez sélectionner une plage de dates.');
    }
  };

  useEffect(() => {
    fetchStockData();
  }, [ean]);

  // Préparation des données pour le graphique
  const dataset = tableData.map((item) => ({
    x: new Date(item.date).getTime(), // Convertir la date en timestamp
    y: item.stockShelfBottom, // Stock Shelf Bottom
  }));

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Stock KPI
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
      <LineChart
        dataset={dataset} // Données pour le graphique
        xAxis={[{ dataKey: 'x', label: 'Dates', scaleType: 'time' }]} // Utilisation d'une échelle temporelle
        series={[
          {
            dataKey: 'y', // Axe Y : Stock Shelf Bottom
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
