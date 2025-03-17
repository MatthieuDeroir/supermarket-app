import { Box, Typography, Grid } from '@mui/material';
import React from 'react';
import InfoCard from '@modules/home/components/InfoCard';
import DashboardCard from '@modules/home/components/DashboardCard';
import ApiRoutes, { makeApiRequest } from '@//common/defs/routes/apiRoutes';
import { Product } from '@common/defs/types/produit';
import usePermissions from '@//common/hooks/usePermissions';
import useAuth from '@common/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { isAdmin, isManager, isUser } = usePermissions();
  const { user } = useAuth();

  const [totalUsers, setTotalUsers] = React.useState(0);
  const [totalProductsStock, setTotalProductsStock] = React.useState(0);
  const [totalProductsFDR, setTotalProductsFDR] = React.useState(0);
  const [totalCA, setTotalCA] = React.useState(0);

  const infoCards = [
    { title: 'Users Total', value: totalUsers },
    { title: "Produits dans l'entrepôt", value: totalProductsStock },
    { title: 'Produits dans le FDR', value: totalProductsFDR },
    { title: "Chiffre d'affaire du mois", value: totalCA + ' €' },
  ];

  const dashboardCards = [
    { name: 'Gestion des déchets', url: '#', image: '' },
    { name: 'Surveillance des Plantes', url: '#', image: '' },
    { name: 'Jira', url: '#', image: '' },
    { name: 'TimeManager', url: '#', image: '' },
    { name: 'Gestion des stocks', url: '#', image: '' },
    { name: 'Kinéthie client', url: '#', image: '' },
    { name: 'Logs des payements', url: '#', image: '' },
    { name: 'Défense Anti-Intrusion', url: '#', image: '' },
    { name: 'Gestion des Licornes', url: '#', image: '' },
    { name: 'Gestion de Paye', url: '#', image: '' },
    { name: 'Produits perdus', url: '#', image: '' },
    { name: 'Factures Fantômes', url: '#', image: '' },
    { name: 'Combats de Coqs', url: '#', image: '' },
    { name: 'Produit Aléatoire', url: '#', image: '' },
    { name: 'Planning des Siestes', url: '#', image: '' },
    { name: 'Code Confidentiel', url: '#', image: '' },
  ];

  const fetchTotalUsers = async () => {
    const response = await makeApiRequest(ApiRoutes.Users.GetAll);
    setTotalUsers(response.length);
  };
  const fetchTotalProductsStock = async () => {
    const response = await makeApiRequest(ApiRoutes.Products.GetAll);
    const productsInStock: number = response.filter(
      (product: Product) => product.stock_warehouse > 0,
    ).length;
    setTotalProductsStock(productsInStock);
  };

  const fetchTotalProductsFDR = async () => {
    const response = await makeApiRequest(ApiRoutes.Products.GetAll);
    const productsInFDR: number = response.filter(
      (product: Product) => product.stock_shelf_bottom > 0,
    ).length;
    setTotalProductsFDR(productsInFDR);
  };

  React.useEffect(() => {
    fetchTotalUsers();
    fetchTotalProductsStock();
    fetchTotalProductsFDR();
    setTotalCA(0);
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

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 9, md: 12 }}>
        {dashboardCards.map((card, index) => (
          <Grid item key={index} xs={4} sm={3} md={3} style={{ display: 'flex' }}>
            <DashboardCard name={card.name} url={card.url} image={card.image} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
