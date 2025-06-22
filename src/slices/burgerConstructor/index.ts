import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TConstructorIngredient, TIngredient } from '../../utils/types';

type BurgerConstructorState = {
  ingredients: TConstructorIngredient[];
  bun: TIngredient | null;
};

const initialState: BurgerConstructorState = {
  ingredients: [],
  bun: null,
};

export const slice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() },
      }),
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        payload.type === 'bun'
          ? (state.bun = payload)
          : state.ingredients.push(payload);
      },
    },
    deleteIngredient: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    moveIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const ingredients = [...state.ingredients];
      const [moved] = ingredients.splice(payload.from, 1);
      ingredients.splice(payload.to, 0, moved);
      state.ingredients = ingredients;
    },
    clearAllIngredients: () => initialState,
  },
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearAllIngredients,
} = slice.actions;

export default slice.reducer;