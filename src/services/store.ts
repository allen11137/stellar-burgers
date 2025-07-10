import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook as StateHookType,
  useDispatch as reduxDispatch,
  useSelector as reduxSelector
} from 'react-redux';

import {ingredientsReducer} from '../slices/ingredients';
import {feedReducer} from '../slices/orderFeedSlice';
import {ordersReducer} from '../slices/ordersHistory';
import {userReducer} from '../slices/userProfileSlice';
import {creatorReducer} from '../slices/burgerConstructor';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feeds: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  creator: creatorReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => reduxDispatch<AppDispatch>();
export const useSelector: StateHookType<RootState> = reduxSelector;

export default store;