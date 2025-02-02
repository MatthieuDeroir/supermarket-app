import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface TransferButtonProps {
  productId: number;
  productName: string;
  stockShelfBottom: number;
  stockWarehouse: number;
}

const transfertToShelfButton: React.FC<TransferButtonProps> = ({
  productId,
  productName,
  stockShelfBottom,
  stockWarehouse,
}) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number | string>('');

  const handleTransfer = async () => {
    const transferQuantity = parseInt(quantity as string, 10);

    if (!transferQuantity || transferQuantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    if (transferQuantity > stockShelfBottom) {
      alert(`La quantité ne peut pas dépasser le stock en rayon (${stockShelfBottom}).`);
      return;
    }

    if (
      !window.confirm(`Voulez-vous transférer ${transferQuantity} ${productName} vers l'entrepôt ?`)
    ) {
      return;
    }

    setLoading(true);
    try {
      await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stock_shelf_bottom: stockShelfBottom - transferQuantity,
          stock_warehouse: stockWarehouse + transferQuantity,
        }),
      });

      alert('Transfert effectué avec succès !');
    } catch (error) {
      console.error('Erreur lors du transfert du stock', error);
      alert('Erreur lors du transfert du stock.');
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
        <Typography fontWeight="bold">Transfert</Typography>

        <TextField
          type="number"
          variant="standard"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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

        <Typography fontWeight="bold">à l’entrepôt</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#64B5F6',
          color: 'white',
          mt: 1,
          '&:hover': { backgroundColor: '#42A5F5' },
        }}
        startIcon={<SwapVertIcon />}
        onClick={handleTransfer}
        disabled={loading}
      >
        {loading ? 'Transfert...' : 'TRANSFERT'}
      </Button>
    </Box>
  );
};

export default transfertToShelfButton;
