import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useConfirmDialog } from '@common/components/ConfirmDialogProvider';

interface UpdateMinimumStockProps {
  productId: number;
  productName: string;
  currentMinimumStock: number;
}

const MinimumStockButton: React.FC<UpdateMinimumStockProps> = ({
  productId,
  productName,
  currentMinimumStock,
}) => {
  const { showConfirmDialog } = useConfirmDialog();
  const [loading, setLoading] = useState(false);
  const [minimumStock, setMinimumStock] = useState<number | ''>(currentMinimumStock);
  const [currentId, setCurrentId] = useState<number>(0);

  useEffect(() => {
    setCurrentId(productId);
  }, []);

  const handleUpdate = async () => {
    if (!minimumStock || Number(minimumStock) < 0) {
      await showConfirmDialog({
        title: 'Erreur',
        message: 'Veuillez entrer une quantité minimale valide.',
        confirmText: 'OK',
        cancelText: '',
      });
      return;
    }
    const isConfirmed = await showConfirmDialog({
      title: 'Confirmation',
      message: `Voulez-vous définir ${minimumStock} comme minimum pour ${productName} ?`,
      confirmText: 'Oui',
      cancelText: 'Non',
    });

    if (!isConfirmed) {
      return;
    }
    console.log('productId:', productId);
    setLoading(true);

    try {
      console.log(`Making API request to: ${apiRoutes.Products.Update(productId)}`);

      const response = await makeApiRequest(apiRoutes.Products.Update(currentId), 'PUT', {
        minimum_shelf_stock: Number(minimumStock),
      });

      if (response) {
        console.log('Stock updated successfully:', response);
        await showConfirmDialog({
          title: 'Succès',
          message: 'Minimum de stock mis à jour avec succès !',
          confirmText: 'OK',
          cancelText: '',
        });
        setMinimumStock(Number(minimumStock));
      } else {
        throw new Error('Échec de la mise à jour.');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du minimum de stock:', error);
      await showConfirmDialog({
        title: 'Erreur',
        message: 'Erreur lors de la mise à jour du minimum de stock.',
        confirmText: 'OK',
        cancelText: '',
      });
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
          onChange={(e) => setMinimumStock(e.target.value === '' ? '' : Number(e.target.value))}
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

export default MinimumStockButton;
