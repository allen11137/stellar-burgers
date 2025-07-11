import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';
import { clearAllIngredients } from '../burgerConstructor'; 

export type TBurgerOrderState = {
  isLoading: boolean;
  orderModalData: TOrder | null;
  orderRequest: boolean;
  data: TOrder[];
};

export const initialState: TBurgerOrderState = {
  isLoading: false,
  orderModalData: null,
  orderRequest: false,
  data: []
};

export const getOrders = createAsyncThunk('orders/getOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getOrder = createAsyncThunk('orders/getOrder', async (id: number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(id);
    return res.orders[0];
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createOrder = createAsyncThunk('orders/createOrder', async (ingredients: string[], { rejectWithValue, dispatch }) => {
  try {
    const res = await orderBurgerApi(ingredients);
    dispatch(clearAllIngredients());
    return { order: res.order, name: res.name };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderModelData: (state) => { state.orderModalData = null; }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectAllOrders: (state) => state.data,
    selectIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => { state.isLoading = true; })
      .addCase(getOrders.fulfilled, (state, action) => { state.isLoading = false; state.data = action.payload; })
      .addCase(getOrders.rejected, (state) => { state.isLoading = false; })
      .addCase(getOrder.pending, (state) => { state.isLoading = true; })
      .addCase(getOrder.fulfilled, (state, action) => { state.isLoading = false; state.data = [action.payload]; })
      .addCase(getOrder.rejected, (state) => { state.isLoading = false; })
      .addCase(createOrder.pending, (state) => { state.isLoading = true; state.orderRequest = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
        state.data.push(action.payload.order);
        state.orderRequest = false;
      })
      .addCase(createOrder.rejected, (state) => { state.isLoading = false; state.orderRequest = false; });
  }
});

export const { selectOrderModalData, selectOrderRequest, selectAllOrders, selectIsLoading } = slice.selectors;
export const { resetOrderModelData } = slice.actions;
export const ordersReducer = slice.reducer;