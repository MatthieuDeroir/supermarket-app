import { Box, Typography, Grid } from '@mui/material';
import React from 'react';
import InfoCard from '@modules/home/components/InfoCard';
import DashboardCard from '@modules/home/components/DashboardCard';

const Dashboard: React.FC = () => {
  const infoCards = [
    { title: 'Users Total', value: 114 },
    { title: "Produits dans l'entrepôt", value: '8.236' },
    { title: 'Produits dans le FDR', value: '2.352' },
    { title: "Chiffre d'affaire du mois", value: '8K' },
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome DP
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
