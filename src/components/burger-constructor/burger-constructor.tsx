import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI, Preloader } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { clearAllIngredients  } from '../../slices/burgerConstructor';
import { createOrder, selectOrderModalData, selectOrderRequest, resetOrderModelData } from '../../slices/ordersHistory';
import { selectAuthenticated } from '../../slices/userProfileSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.creator);
  const userIsAuthenticated = useSelector(selectAuthenticated);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const totalPrice = useMemo(() => (
    (bun ? bun.price * 2 : 0) + ingredients.reduce((sum, item) => sum + item.price, 0)
  ), [bun, ingredients]);

  const handleModalClose = () => dispatch(resetOrderModelData());

  const handleOrderClick = () => {
    if (!bun || orderRequest) return;
    if (!userIsAuthenticated) return nav('/login');
    if (orderRequest) return <Preloader />;

    dispatch(createOrder([bun._id, ...ingredients.map(i => i._id), bun._id]));
    dispatch(clearAllIngredients ());
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleModalClose}
    />
  );
};