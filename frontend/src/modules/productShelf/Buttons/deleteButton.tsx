import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';

interface DeleteButtonProps {
  productId: number;
  productName: string;
  currentStock: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ productId, productName, currentStock }) => {
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const router = useRouter();

  const handleDelete = async () => {
    const deleteQuantity = Number(quantity);

    if (!deleteQuantity || deleteQuantity <= 0) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }

    if (deleteQuantity > currentStock) {
      alert(`La quantité ne peut pas dépasser le stock actuel (${currentStock}).`);
      return;
    }

    if (!window.confirm(`Voulez-vous vraiment supprimer ${deleteQuantity} ${productName} ?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        stock_shelf_bottom: currentStock - deleteQuantity,
      });

      if (response) {
        alert('Produit supprimé avec succès !');
        setQuantity('');
      } else {
        throw new Error('Échec de la mise à jour.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      alert('Erreur lors de la suppression du produit.');
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
          onChange={(e) => setQuantity(Number(e.target.value) || '')}
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

        <Typography fontWeight="bold">à la poubelle</Typography>
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: '#D32F2F',
          color: 'white',
          mt: 1,
          '&:hover': { backgroundColor: '#B71C1C' },
        }}
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Suppression...' : 'SUPPRIMER'}
      </Button>
    </Box>
  );
};

export default DeleteButton;