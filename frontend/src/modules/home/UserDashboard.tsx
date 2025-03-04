import { Box, Typography, Grid } from '@mui/material';
import React from 'react';
import InfoCard from '@modules/home/components/InfoCard';
import DashboardChart from '@modules/home/components/DashboardChart';
import StockLogs from '@modules/stock-logs/StockLogs';
import ApiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import useAuth from '@common/hooks/useAuth';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  const [totalCart, setTotalCart] = React.useState(0);
  const [totalInvoices, setTotalInvoices] = React.useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = React.useState(0);
  const [favoriteProducts, setFavoriteProducts] = React.useState(0);
  const [recentTransactions, setRecentTransactions] = React.useState([]);
  const [chartData, setChartData] = React.useState([]);

  const infoCards = [
    { title: 'Total du panier en cours en €', value: `${totalCart}€` },
    { title: 'Nombre de Factures', value: totalInvoices },
    { title: 'Nombre de points de fidélité', value: loyaltyPoints },
    { title: 'Produits en Favoris', value: favoriteProducts },
  ];

  const fetchData = async () => {
    // const cartResponse = await makeApiRequest(ApiRoutes.Cart.GetTotal);
    // setTotalCart(cartResponse.total);

    // const invoicesResponse = await makeApiRequest(ApiRoutes.Invoices.GetTotal);
    // setTotalInvoices(invoicesResponse.count);

    // const pointsResponse = await makeApiRequest(ApiRoutes.User.GetLoyaltyPoints);
    // setLoyaltyPoints(pointsResponse.points);

    // const favoritesResponse = await makeApiRequest(ApiRoutes.User.GetFavorites);
    // setFavoriteProducts(favoritesResponse.count);

    // const transactionsResponse = await makeApiRequest(ApiRoutes.Transactions.GetRecent);
    // setRecentTransactions(transactionsResponse);

    // const chartResponse = await makeApiRequest(ApiRoutes.Stats.GetRecentCarts);
    // setChartData(chartResponse);
    setTotalCart(100);
    setTotalInvoices(10);
    setLoyaltyPoints(100);
    setFavoriteProducts(10);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome {user?.first_name} {user?.last_name}
      </Typography>

      <Grid container mb={4} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {infoCards.map((card, index) => (
          <Grid item key={index} xs={4} sm={4} md={3} style={{ display: 'flex' }}>
            <InfoCard title={card.title} value={card.value} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardChart userId={user?.user_id ?? 0} />
        </Grid>
        <Grid item xs={12} md={6}>
          <StockLogs />
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
