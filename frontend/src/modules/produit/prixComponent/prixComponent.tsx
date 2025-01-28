import React, { useEffect, useState } from 'react';
import { Box, TextField, InputAdornment, MenuItem } from '@mui/material';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface PrixComponentProps {
  price: string;
  category: number;
}

interface CategoryData {
  id: number;
  name: string;
  tva: number;
}

const PrixComponent: React.FC<PrixComponentProps> = ({ price, category }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedTva, setSelectedTva] = useState<number | '-'>('-'); // Valeur par défaut

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await makeApiRequest(apiRoutes.Categories.GetAll);
        if (response.status === 200) {
          const data = await response.json();
          setCategories(data);

          // Trouver la TVA associée à la catégorie du produit
          const foundCategory = data.find((cat: CategoryData) => cat.id === category);
          setSelectedTva(foundCategory ? foundCategory.tva : '-');
        } else {
          throw new Error('API non disponible');
        }
      } catch (error) {
        console.error('Erreur API, utilisation des données locales', error);

        /* eslint-disable @typescript-eslint/no-explicit-any */
        try {
          const localData = await import('./tvaMocked/tvaMocked.json');
          const transformedCategories = localData.default.map((mockedCategory: any) => ({
            id: mockedCategory.taxCategoryId,
            name: mockedCategory.description,
            tva: mockedCategory.value * 100,
          }));
          setCategories(transformedCategories);

          // Trouver la TVA associée à la catégorie du produit
          const foundCategory = transformedCategories.find(
            (cat: CategoryData) => cat.id === category,
          );
          setSelectedTva(foundCategory ? foundCategory.tva : '-');
        } catch (localError) {
          console.error('Erreur lors du chargement des données locales', localError);
        }
      }
    };

    fetchCategories();
  }, [category]);

  // ✅ Conversion sécurisée du prix
  const parsedPrice = parseFloat(price) || 0;
  const parsedTva = selectedTva !== '-' ? selectedTva : 0;
  const priceHT = parsedTva ? (parsedPrice / (1 + parsedTva / 100)).toFixed(2) : '-';

  return (
    <Box>
      <Box display="flex" gap={2} justifyContent="center">
        {/* Prix TTC */}
        <TextField
          label="Prix TTC"
          variant="outlined"
          type="number"
          value={parsedPrice.toFixed(2)}
          sx={{
            width: 90,
            borderRadius: 1,
            '& .MuiOutlinedInput-root.Mui-disabled': { '& fieldset': { borderColor: 'black' } },
            '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'black' },
            '& .MuiInputLabel-root.Mui-disabled': { color: 'black' },
          }}
          InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
          disabled
        />

        {/* Sélection de la TVA */}
        <TextField
          label="TVA"
          variant="outlined"
          select
          value={selectedTva}
          onChange={(e) => setSelectedTva(parseFloat(e.target.value))}
          sx={{
            width: 90,
            borderRadius: 1,
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' } },
            '& .MuiInputBase-input': { WebkitTextFillColor: 'black' },
            '& .MuiInputLabel-root': { color: 'black' },
          }}
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.tva}>
                {cat.tva}%
              </MenuItem>
            ))
          ) : (
            <MenuItem value="-">-</MenuItem>
          )}
        </TextField>

        {/* Prix HT */}
        <TextField
          label="Prix HT"
          variant="outlined"
          type="text"
          value={priceHT}
          sx={{
            width: 90,
            borderRadius: 1,
            '& .MuiOutlinedInput-root.Mui-disabled': { '& fieldset': { borderColor: 'black' } },
            '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'black' },
            '& .MuiInputLabel-root.Mui-disabled': { color: 'black' },
          }}
          InputProps={{ endAdornment: <InputAdornment position="end">€</InputAdornment> }}
          disabled
        />
      </Box>
    </Box>
  );
};

export default PrixComponent;
