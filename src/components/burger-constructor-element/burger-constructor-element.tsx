import { FC, memo } from 'react'
import { useDispatch } from '../../services/store'
import { deleteIngredient, moveIngredient } from '../../slices/burgerConstructor'
import { BurgerConstructorElementUI } from '@ui'
import type { BurgerConstructorElementProps } from './type'

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  function BurgerConstructorElement({ ingredient, index, totalItems }) {
    const dispatch = useDispatch()

    function handleClose() {
      dispatch(deleteIngredient(ingredient.id))
    }

    function handleMoveUp() {
      dispatch(moveIngredient({ from: index, to: index - 1 }))
    }

    function handleMoveDown() {
      dispatch(moveIngredient({ from: index, to: index + 1 }))
    }

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    )
  }
)