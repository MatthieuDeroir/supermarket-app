import React, { useEffect, useState } from 'react';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { Box, Typography, TextField, Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts';

interface PurchaseData {
  date: string;
  amount: number;
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

const DashboardChart: React.FC<{ userId: number }> = ({ userId }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(formatDate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState<string>(formatDate(today));
  const [purchaseData, setPurchaseData] = useState<PurchaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //   const fetchPurchaseData = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await makeApiRequest(
  //         apiRoutes.Purchases.GetByUserId(userId, startDate, endDate),
  //       );

  //       if (response && Array.isArray(response)) {
  //         const apiData = response.map((entry: PurchaseData) => ({
  //           date: formatDate(new Date(entry.date)),
  //           amount: Number(entry.amount) || 0,
  //         }));

  //         const allDates = generateDateRange(startDate, endDate);
  //         const completedData = allDates.map((date) => ({
  //           date,
  //           amount: apiData.find((entry) => entry.date === date)?.amount ?? 0,
  //         }));

  //         setPurchaseData(completedData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching purchase data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  const fetchPurchaseData = async () => {
    setLoading(true);
    try {
      // Simulate an API call with fake data
      const fakeData: PurchaseData[] = [
        { date: formatDate(new Date(today.setDate(today.getDate() - 1))), amount: 50 },
        { date: formatDate(new Date(today.setDate(today.getDate() - 2))), amount: 75 },
        { date: formatDate(new Date(today.setDate(today.getDate() - 3))), amount: 20 },
        { date: formatDate(new Date(today.setDate(today.getDate() - 4))), amount: 100 },
        { date: formatDate(new Date(today.setDate(today.getDate() - 5))), amount: 30 },
      ];

      const allDates = generateDateRange(startDate, endDate);
      const completedData = allDates.map((date) => ({
        date,
        amount: fakeData.find((entry) => entry.date === date)?.amount ?? 0,
      }));

      setPurchaseData(completedData);
    } catch (error) {
      console.error('Error fetching purchase data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseData();
  }, [userId, startDate, endDate]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Paniers récents
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
      </Box>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={300} />
      ) : (
        <BarChart
          dataset={purchaseData.map((item) => ({ x: item.date, y: item.amount }))}
          xAxis={[{ dataKey: 'x', label: 'Date', scaleType: 'band' }]}
          series={[{ dataKey: 'y', label: 'Montant Dépensé (€)', color: '#3b82f6' }]}
          height={300}
        />
      )}
    </Box>
  );
};

export default DashboardChart;
