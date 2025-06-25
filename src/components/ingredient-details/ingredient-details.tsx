import { useParams } from 'react-router-dom';
import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  return ingredientData ? <IngredientDetailsUI ingredientData={ingredientData} /> : <Preloader />;
};