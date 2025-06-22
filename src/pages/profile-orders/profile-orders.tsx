import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { selectAllOrders, getOrders } from '../../slices/ordersHistory';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector((state) => state.orders.isLoading);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};