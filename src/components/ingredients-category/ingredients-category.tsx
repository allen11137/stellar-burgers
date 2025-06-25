import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';

export const IngredientsCategory = forwardRef<HTMLUListElement, TIngredientsCategoryProps>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(state => state.creator);
  
  const ingredientsCounters = useMemo(() => {
    const baseCounters = burgerConstructor.ingredients.reduce<Record<string, number>>(
      (acc, i) => ({ ...acc, [i._id]: (acc[i._id] || 0) + 1 }),
      {}
    );
    
    return burgerConstructor.bun 
      ? { ...baseCounters, [burgerConstructor.bun._id]: 2 } 
      : baseCounters;
  }, [burgerConstructor]);

  return <IngredientsCategoryUI {...{ title, titleRef, ingredients, ingredientsCounters, ref }} />;
});