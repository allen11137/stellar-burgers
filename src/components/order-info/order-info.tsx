import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { TIngredient } from '@utils-types';
import {
    useDispatch,
    useSelector
} from '../../services/store';
import {
    getOrderByNumber,
    selectSelectedFeed 
} from '../../slices/orderFeedSlice';
import { selectAllIngredients } from '../../slices/ingredients';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';


type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;


export const OrderInfo: FC = () => {
    const { number } = useParams();
    const dispatch = useDispatch();

    const { orderData, ingredients } = useSelector(state => ({
        orderData: selectSelectedFeed (state),
        ingredients: selectAllIngredients(state)
    }));


    useEffect(() => {
        number && dispatch(getOrderByNumber(Number(number)));
    }, [dispatch, number]);


    const orderInfo = useMemo(() => {
        if (!orderData || !ingredients.length) return null;

        const ingredientsMap = orderData.ingredients
            .reduce<TIngredientsWithCount>(
                (acc, id) => {
                    const existing = acc[id];
                    const ingredient = ingredients.find(i => i._id === id);

                    return ingredient ? {
                        ...acc,
                        [id]: {
                            ...ingredient,
                            count: existing ? existing.count + 1 : 1
                        }
                    } : acc;
                },
                {}
            );

        const total = (Object.values(ingredientsMap) as Array<TIngredient & { count: number }>)
            .reduce(
                (sum, { price, count }) => sum + price * count,
                0
            );

        return {
            ...orderData,
            ingredientsInfo: ingredientsMap,
            date: new Date(orderData.createdAt),
            total
        };
    }, [orderData, ingredients]);


    if (!orderInfo) return <Preloader />;


    return (
        <OrderInfoUI
            orderInfo={orderInfo}
        />
    );
};