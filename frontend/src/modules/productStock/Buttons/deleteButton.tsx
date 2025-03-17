import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';
import { useRouter } from 'next/router';
import { useConfirmDialog } from '@common/components/ConfirmDialogProvider';

interface DeleteButtonProps {
  productId: number;
  productName: string;
  currentStock: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ productId, productName, currentStock }) => {
  const { showConfirmDialog } = useConfirmDialog();

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const router = useRouter();

  const handleDelete = async () => {
    const deleteQuantity = Number(quantity);

    if (!deleteQuantity || deleteQuantity <= 0) {
      await showConfirmDialog({
        title: 'Erreur',
        message: 'Veuillez entrer une quantité valide.',
        confirmText: 'OK',
        cancelText: '',
      });

      return;
    }

    if (deleteQuantity > currentStock) {
      await showConfirmDialog({
        title: 'Erreur',
        message: `La quantité ne peut pas dépasser le stock actuel (${currentStock}).`,
        confirmText: 'OK',
        cancelText: '',
      });
      return;
    }

    const isConfirmed = await showConfirmDialog({
      title: 'Confirmation',
      message: `Voulez-vous vraiment supprimer ${deleteQuantity} ${productName} ?`,
      confirmText: 'Oui',
      cancelText: 'Non',
    });

    if (!isConfirmed) {
      return;
    }

    setLoading(true);
    try {
      const response = await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        stock_warehouse: currentStock - deleteQuantity,
      });

      if (response) {
        await showConfirmDialog({
          title: 'Succès',
          message: 'Produit supprimé avec succès !',
          confirmText: 'OK',
          cancelText: '',
        });
        setQuantity('');
      } else {
        throw new Error('Échec de la mise à jour.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      await showConfirmDialog({
        title: 'Erreur',
        message: 'Erreur lors de la suppression du produit.',
        confirmText: 'OK',
        cancelText: '',
      });
    } finally {
      setLoading(false);
      RedirectBack(productId);
    }
  };

  const RedirectBack = (id: number) => {
    setTimeout(() => {
      router.push(`/produit/${id}`);
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
