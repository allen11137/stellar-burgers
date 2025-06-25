import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '../../utils/types';

type TIngredientStoreType = {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
};

const initialState: TIngredientStoreType = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/request',
  getIngredientsApi
);

const ingredientsData = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectAllIngredients: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, { payload }) => {
        state.ingredients = payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Произошла ошибка при загрузке ингредиентов';
      });
  }
});

export const { selectAllIngredients, selectIngredientsLoading, selectIngredientsError } = ingredientsData.selectors;
export default ingredientsData.reducer;