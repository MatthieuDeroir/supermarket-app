import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import apiRoutes, { makeApiRequest } from '@common/defs/routes/apiRoutes';

interface PrixComponentProps {
  productId: number;
}

interface ProductData {
  price: string;
  category_id: number;
}

interface CategoryData {
  id: number;
  name: string;
  tax_value: string;
}

const PrixComponent: React.FC<PrixComponentProps> = ({ productId }) => {
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedTax, setSelectedTax] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        console.log(` Fetching product details for ID: ${productId}`);
        const response = await makeApiRequest(apiRoutes.Products.GetById(productId));

        if (response) {
          console.log(' Product API Response:', response);
          setProductData({
            price: response.price,
            category_id: response.category_id,
          });

          //  Set the selected category ID
          setSelectedCategoryId(response.category_id);
        } else {
          throw new Error('No product data available.');
        }
      } catch (error) {
        console.error(' Error fetching product details:', error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  //  Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log(' Fetching categories');
        const response = await makeApiRequest(apiRoutes.Categories.GetAll);

        if (response) {
          console.log(' Categories API Response:', response);
          setCategories(response); //  Store all categories

          //  Set selected tax based on product's category_id
          const foundCategory = response.find((cat: CategoryData) => cat.id === selectedCategoryId);
          if (foundCategory) {
            setSelectedTax(foundCategory.tax_value);
          }
        } else {
          throw new Error('No categories available.');
        }
      } catch (error) {
        console.error(' Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [selectedCategoryId]);

  //  Handle category change
  const handleTaxChange = async (event: SelectChangeEvent<string>) => {
    const selectedTaxValue = event.target.value;
    setSelectedTax(selectedTaxValue);

    const newCategory = categories.find((cat) => cat.tax_value === selectedTaxValue);

    if (newCategory && newCategory.id !== selectedCategoryId) {
      console.log(`🟡 Updating category to ${newCategory.id} with tax ${selectedTaxValue}`);
      setSelectedCategoryId(newCategory.id);

      await updateProductCategory(newCategory.id);
    }
  };

  //  Update product category in the database
  const updateProductCategory = async (categoryId: number) => {
    try {
      console.log(` Updating product ${productId} category to ID: ${categoryId}`);

      const response = await makeApiRequest(apiRoutes.Products.Update(productId), 'PUT', {
        category_id: categoryId,
      });

      if (response) {
        console.log(' Category updated successfully:', response);

        //  Re-fetch product data to update UI
        const updatedProductResponse = await makeApiRequest(apiRoutes.Products.GetById(productId));

        if (updatedProductResponse) {
          console.log(' Fetched updated product data:', updatedProductResponse);
          setProductData({
            price: updatedProductResponse.price,
            category_id: updatedProductResponse.category_id,
          });

          //  Update selected category ID
          setSelectedCategoryId(updatedProductResponse.category_id);
        }
      } else {
        throw new Error('Failed to update category.');
      }
    } catch (error) {
      console.error(' Error updating category:', error);
    }
  };

  const parsedPrice = parseFloat(productData?.price || '0') || 0;
  const parsedTax = selectedTax ? parseFloat(selectedTax) : 0;
  const priceHT = parsedTax ? (parsedPrice / (1 + parsedTax / 100)).toFixed(2) : '-';

  return (
    <Box>
      <Box display="flex" gap={2} justifyContent="center">
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
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
          }}
          disabled
        />

        {/*  Display all categories in dropdown */}
        <FormControl sx={{ width: 150 }}>
          <InputLabel id="tva-select-label">TVA</InputLabel>
          <Select
            labelId="tva-select-label"
            id="tva-select"
            value={selectedTax}
            label="TVA"
            onChange={(event) => handleTaxChange(event)}
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.tax_value}>
                  {cat.tax_value}% - {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">-</MenuItem>
            )}
          </Select>
        </FormControl>

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
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">€</InputAdornment>,
            },
          }}
          disabled
        />
      </Box>
    </Box>
  );
};

export default PrixComponent;
