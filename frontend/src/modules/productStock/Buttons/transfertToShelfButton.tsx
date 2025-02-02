import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';

interface TransferButtonProps {
  productId: number;
  productName: string;
  stockShelfBottom: number;
  stockWarehouse: number;
}

const TransfertToShelfButton: React.FC<TransferButtonProps> = ({
  productId,
  productName,
  stockShelfBottom,
  stockWarehouse,
}) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number | string>('');
  const router = useRouter();

  const handleTransfer = async () => {
    const transferQuantity = parseInt(quantity as string, 10);

    if (!transferQuantity || transferQuantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    if (transferQuantity > stockWarehouse) {
      alert(`La quantité ne peut pas dépasser le stock en entrepôt (${stockWarehouse}).`);
      return;
    }

    if (
      !window.confirm(
        `Voulez-vous transférer ${transferQuantity} unités de ${productName} vers le rayon ?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        stock_shelf_bottom: stockShelfBottom + transferQuantity,
        stock_warehouse: stockWarehouse - transferQuantity,
      });

      if (response) {
        alert('Transfert effectué avec succès !');
        setQuantity('');
      } else {
        throw new Error('Le transfert a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors du transfert du stock', error);
      alert('Erreur lors du transfert du stock.');
    } finally {
      setLoading(false);
      RedirectBack(productId);
    }
  };

  const RedirectBack = (id: number) => {
    setTimeout(() => {
      router.push(`/produit/${productId}`);
    }, 1000);
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
      <Box display="flex" alignItems="center" justifyContent="space-between" padding={1}>
        <Typography fontWeight="bold">Transférer</Typography>

        <TextField
          type="number"
          variant="standard"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{
            width: 80,
            mx: 2,
            '& .MuiInputBase-root': { textAlign: 'center' },
            '& .MuiInputBase-input': { WebkitTextFillColor: 'black', textAlign: 'center' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'black' },
            },
          }}
        />

        <Typography fontWeight="bold">vers le rayon</Typography>
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
        {loading ? 'Transfert...' : 'TRANSFÉRER'}
      </Button>
    </Box>
  );
};

export default TransfertToShelfButton;
