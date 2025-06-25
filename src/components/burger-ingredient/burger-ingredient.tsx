import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '../../services/store';
import { addIngredient  } from '../../slices/burgerConstructor';
import { BurgerIngredientUI } from '@ui';

import { TBurgerIngredientProps } from './type';


export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(function BurgerIngredient({
  ingredient, 
  count 
}) {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleAdd = () => dispatch(addIngredient (ingredient));

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});