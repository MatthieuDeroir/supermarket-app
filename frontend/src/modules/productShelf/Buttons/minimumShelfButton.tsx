import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface UpdateMinimumStockProps {
  productId: number;
  productName: string;
  currentMinimumStock: number;
}

const minimumStockButton: React.FC<UpdateMinimumStockProps> = ({
  productId,
  productName,
  currentMinimumStock,
}) => {
  const [loading, setLoading] = useState(false);
  const [minimumStock, setMinimumStock] = useState<number | string>(currentMinimumStock);

  const handleUpdate = async () => {
    if (!minimumStock || Number(minimumStock) < 0) {
      alert('Veuillez entrer une quantité minimale valide.');
      return;
    }

    if (
      !window.confirm(`Voulez-vous définir ${minimumStock} comme minimum pour ${productName} ?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      await makeApiRequest(apiRoutes.Products.Update, 'PUT', {
        id: productId,
        minimum_stock: Number(minimumStock),
      });

      alert('Minimum de stock mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du minimum de stock', error);
      alert('Erreur lors de la mise à jour du minimum de stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      border="1px solid #ddd"
      borderRadius={2}
      padding={2}
      width="fit-content"
      boxShadow={1}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={1}
        width="fit-content"
      >
        <Typography fontWeight="bold">Minimum de</Typography>

        <TextField
          type="number"
          variant="standard"
          value={minimumStock}
          onChange={(e) => setMinimumStock(e.target.value)}
          sx={{
            width: 80,
            mx: 2,
            '& .MuiInputBase-root': {
              textAlign: 'center',
            },
            '& .MuiInputBase-input': {
              WebkitTextFillColor: 'black',
              textAlign: 'center',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'black' },
            },
          }}
        />

        <Typography fontWeight="bold">avant alerte</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#4CAF50',
          color: 'white',
          mt: 1,
          '&:hover': { backgroundColor: '#388E3C' },
        }}
        startIcon={<CheckCircleIcon />}
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? 'Enregistrement...' : 'VALIDER'}
      </Button>
    </Box>
  );
};

export default minimumStockButton;
