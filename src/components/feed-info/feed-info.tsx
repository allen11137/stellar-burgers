import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectIsLoading } from '../../slices/ordersHistory';
import { selectAllFeeds , selectTotal , selectTotalToday  } from '../../slices/orderFeedSlice';
import { Preloader } from '../ui/preloader';

const selectFeedData = () => ({
  orders: useSelector(selectAllFeeds ),
  feed: {
    total: useSelector(selectTotal ),
    totalToday: useSelector(selectTotalToday )
  },
  isLoading: useSelector(selectIsLoading)
});

const getOrderNumbers = (orders: TOrder[], status: string) => 
  orders
    .filter(order => order.status === status)
    .map(order => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, feed, isLoading } = selectFeedData();

  if (isLoading) return <Preloader />;

  return (
    <FeedInfoUI
      readyOrders={getOrderNumbers(orders, 'done')}
      pendingOrders={getOrderNumbers(orders, 'pending')}
      feed={feed}
    />
  );
};