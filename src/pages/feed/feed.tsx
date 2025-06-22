import { useDispatch, useSelector } from '../../services/store';
import { FC, useEffect, useCallback } from 'react';
import { FeedUI } from '@ui-pages';
import { selectAllFeeds, getFeeds, selectIsLoading } from '../../slices/orderFeedSlice';
import { Preloader } from '@ui';
import type { TOrder } from '@utils-types';

export const Feed: FC = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectAllFeeds);
    const isLoading = useSelector(selectIsLoading);

    const fetchFeeds = useCallback(() => dispatch(getFeeds()), [dispatch]);

    useEffect(() => {
        fetchFeeds();
    }, [fetchFeeds]);

    if (isLoading) {
        return <Preloader />;
    }

    return <FeedUI orders={orders} handleGetFeeds={fetchFeeds} />;
};